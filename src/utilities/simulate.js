const moment = require("moment");

const Order = require("../api/models/order.model");
const Account = require("../api/models/account.model");
const Stock = require("../api/models/stock.model");
const Transaction = require("../api/models/transaction.model");
const User = require("../api/models/user.model");
const Subscription = require("../api/models/subscription.model");

const { createStockData, getStockPrice, getStockChange, getStocks } = require("../api/resolvers/stock.resolve");
const { getPortfolio } = require("../api/resolvers/account.resolve");
const { getDayOffset } = require("../api/resolvers/admin.resolve");
const { createNotification } = require("../api/resolvers/notification.resolve");
const { updateSubscription } = require("../api/resolvers/subscription.resolve");

const REFRESH = 10; // in seconds

/* Stock Data simulation parameters -------- */
const RANDOM_FACTOR = 0.001     // price % change between refresh iterations

let curDayOffset = 0;

/*
    @desc    Core simulation process for stock market simulation
    @notes   Uses 'setInterval()' to repeat process every X seconds
*/
const simulateCore = async () => {
    curDayOffset = await getDayOffset();
    setInterval(simulateMarket, REFRESH * 1000);  
}


/*
    @desc    Create certain amount of time worth of stockData
    @params  (stockID, timeAmount, timeUnit, startPrice, startDate*) *optional
    @usage   ex. simulateStockData(<STOCKID>, 7, "days", 12345) => simulate a week's worth of stockdata
*/
const simulateStockDataOverTime = async (stockID, timeAmount, timeUnit, startPrice, startDate = moment()) => {
    let ask = parseInt(startPrice);
    let date = startDate;

    for(let i=0; i<timeAmount; i++) {
        ask = await simulateStockData(stockID, 0.1, ask, date);
        date = date.add(1, timeUnit);
    }
}


/*
    @desc    Create stockData, simulating ask and bid prices
    @params  (stockID, factor*: price % change, startPrice*, date*) *optional
    @return  new ask price
*/
const simulateStockData = async (stockID, factor = RANDOM_FACTOR, ask = null, date = moment()) => {
    ask = generateNextAsk(ask || await getStockPrice({stockID}), factor)

    await createStockData({
        stockID,
        ask,
        bid: ask - Math.floor((Math.random() * 2)),
        date: date.add(curDayOffset, "days").format(),
        volume: 1,
    })

    return ask
}


/*
    @desc    Generate new stock price data
*/
const simulateMarket = async () => {
    let stocks = await getStocks({});
    let dayOffset = await getDayOffset();

    const iterations = (dayOffset-curDayOffset) + 1;
    let factor = (iterations > 1)? 0.1 : RANDOM_FACTOR;

    for(let i=0; i<iterations; i++) {
        for(let j=0; j<stocks.length; j++) {
            await simulateStockData(stocks[j].id, factor)
        }

        await processSubscriptions()
        await simulateOrders()

        if(dayOffset != curDayOffset) {
            curDayOffset += 1;
        }
    }    
}

/*
    @desc    Process all event subscriptions
*/
const processSubscriptions = async () => {
    let users = await User.find({});

    for(let i=0; i<users.length; i++) {
        let subscriptions = await Subscription.find({userID: users[i].id})

        for(let j=0; j<subscriptions.length; j++) {
            let sub = subscriptions[j];
            
            // check active
            if(!sub.active) continue;
            
            // check last notified
            if(sub.lastNotified) {
                let lastNotifiedDay = moment(sub.lastNotified).startOf("day")
                let today = moment().add(curDayOffset, "days").startOf("day")
                if(today.diff(lastNotifiedDay) == 0) continue;
            }

            // check rule
            let change = await getStockChange({stockID: sub.stockID})
            let rule = sub.rule * 100;
            
            if(Math.abs(change) > rule) {
                let stock = await Stock.findById(sub.stockID);
                
                createNotification({
                    title: "Event Subscription",
                    tag: "info",
                    message: `${stock.ticker} has had notable price change of ${(change/100).toFixed(2)}%.`,
                    userID: users[i].id
                })

                await updateSubscription({
                    subscriptionID: sub.id,
                    lastNotified: moment().add(curDayOffset, "days").format()
                })
            }
        }
    }
}


/*
    @desc    Process all incomplete orders
*/
const simulateOrders = async () => {
    let orders = await Order.find({completed: ""});

    for(let i=0; i<orders.length; i++) {
        await processAction(orders[i]);
    }
}


/*
    @desc    Process a specific buy/sell order
    @params  order: MongoDB instance
*/
const processAction = async (order) => {
    const actions = {
        'buy': processBuy,
        'sell': processSell
    }

    let account = await Account.findById(order.accountID);
    let marketPrice = await getStockPrice({stockID: order.stockID});

    if(moment(order.expiry) < moment().add(curDayOffset)) {
        failOrder(order, marketPrice, "expiry date");
        return;
    }
    
    let result = await actions[order.action](order, account, marketPrice);
    if(!result) return;

    // Complete order
    order.completed = moment().add(curDayOffset, "days").format();
    order.price = marketPrice;
    order.save();

    // Create transaction
    let fPrice = (order.price/100).toFixed(2);
    let prefix = (order.action === 'buy') ? `Bought` : `Sold`;
    let stock = await Stock.findById(order.stockID);
    let ticker = stock.ticker;

    let transaction = new Transaction({
        action: order.action,
        date: order.completed,
        info: `${prefix} ${order.quantity} share${(order.quantity > 1)? 's ' : ' '}of ${ticker} @ $${fPrice} each`,
        accountID: order.accountID
    });

    transaction.save();

    createNotification({
        title: "Order Status",
        tag: "success",
        message: `Your ${order.action} order for ${stock.ticker} has been completed.`,
        userID: account.userID
    })
}


/*
    @desc    Process a buy order
    @params  order, account, marketPrice
    @return  boolean: status of order
*/
const processBuy = async (order, account, marketPrice) => {
    let total, price;

    // Get market price or use limit price
    price = order.price ? order.price : marketPrice

    total = price * order.quantity;

    // Check if account has enough funds for order
    if(total > account.balance) {
        failOrder(order, marketPrice, "insufficent funds");
        return false;
    }

    if(marketPrice > price) return false

    account.balance = account.balance - total;
    account.save();

    return true
}


/*
    @desc    Process a sell order
    @params  order, account, marketPrice
    @return  boolean: status of order
*/
const processSell = async (order, account, marketPrice) => {
    let total, price;    
    let stocks = await getPortfolio({accountID: order.accountID, returnMap: true})

    // Check if there are enough shares to sell
    if(!stocks[order.stockID] || stocks[order.stockID].shares < order.quantity) {
        failOrder(order, marketPrice, "insufficent funds");
        return false;
    }

    // Get market price or use limit price
    price = order.price ? order.price : marketPrice

    if(marketPrice < price) return false

    total = price * order.quantity;

    account.balance = account.balance + total;
    account.save();

    return true
}


/*
    @desc    Fail and complete a order
    @params  order, marketPrice, reason
*/
const failOrder = async (order, marketPrice, reason) => {
    order.completed = moment().add(curDayOffset, "days").format();
    order.failed = true;
    order.price = marketPrice;
    order.save();

    let account = await Account.findById(order.accountID);
    let stock = await Stock.findById(order.stockID);

    createNotification({
        title: "Order Status",
        tag: "error",
        message: `Your ${order.action} order for ${stock.ticker} has been cancelled due to ${reason}.`,
        userID: account.userID
    })
}


/*
    @desc    Randomly generate next stock ask price
    @params  (ask, factor*: amount of change in %)
    @return  int: new ask price
*/
const generateNextAsk = (ask, factor=RANDOM_FACTOR) => {
    const changeValue = Math.floor(Math.random() * ask * factor)
    const changeDir = (Math.round(Math.random()) * 2) - 1;

    return ask + (changeValue * changeDir);
}


module.exports = {
    simulateCore,
    simulateStockDataOverTime
};