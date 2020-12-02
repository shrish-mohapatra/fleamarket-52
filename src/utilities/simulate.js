/*
    @TODO
        - incorporate expiry date
*/

const moment = require("moment");

const Order = require("../api/models/order.model");
const Account = require("../api/models/account.model");

const { createStockData, getStockPrice, getStocks } = require("../api/resolvers/stock.resolve");
const { getPortfolio } = require("../api/resolvers/account.resolve");

const REFRESH = 10; // in seconds

/* Stock Data simulation parameters -------- */
const RANDOM_FACTOR = 0.001     // price % change between refresh iterations


/*
    @desc    Core simulation process for stock market simulation
    @notes   Uses 'setInterval()' to repeat process every X seconds
*/
const simulateCore = async () => {
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
        date: date.format(),
        volume: 1,
    })

    return ask
}


/*
    @desc    Generate new stock price data
*/
const simulateMarket = async () => {
    let stocks = await getStocks({});
    
    for(let i=0; i<stocks.length; i++) {
        await simulateStockData(stocks[i].id)
    }

    await simulateOrders()
}


/*
    @desc    Process all incomplete orders
*/
const simulateOrders = async () => {
    let orders = await Order.find({completed: ""});

    for(let i=0; i<orders.length; i++) {
        console.log("Processing order #" + i)
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
    
    let result = await actions[order.action](order, account, marketPrice);
    if(!result) return;

    console.log("Succesful order")

    // Complete order
    order.completed = moment().format();
    order.price = marketPrice;
    order.save();
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
        failOrder(order, marketPrice);
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
        failOrder(order, marketPrice);
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
    @params  order, marketPrice
*/
const failOrder = (order, marketPrice) => {
    order.completed = moment().format();
    order.failed = true;
    order.price = marketPrice;
    order.save();
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