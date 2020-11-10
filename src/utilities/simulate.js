/*
    @TODO
        - socket notification to client informing of order status
        - incorporate expiry date
*/

const moment = require("moment");

const Order = require("../api/models/order.model");
const Account = require("../api/models/account.model");

const { getStockPrice } = require("../api/resolvers/stock.resolve");
const { getPortfolio } = require("../api/resolvers/account.resolve");

const REFRESH = 10; // in seconds


/*
    @desc    Core simulation process for stock market simulation
    @notes   Uses 'setInterval()' to repeat process every X seconds
*/
module.exports = () => {
    setInterval(simulateOrders, REFRESH * 1000);
};


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