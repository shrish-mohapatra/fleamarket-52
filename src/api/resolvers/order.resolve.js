const moment = require("moment");

const Order = require("../models/order.model");
const Account = require("../models/account.model");

const { getDayOffset } = require("./admin.resolve");
const { getStockPrice } = require("./stock.resolve");
const { getPortfolio } = require("./account.resolve");

module.exports = {

    /*
        @desc    Create stock order
        @param   args: {accountID, stockID, action, quantity, price*, expiry*}
        @return  order MongoDB instance
    */
    createOrder: async(args) => {
        let {accountID, stockID, action, quantity, price, expiry} = args;                      
        let dayOffset = await getDayOffset();

        console.log("creating order")

        // check for invalid expiry
        if(expiry) {
            if(moment(expiry).startOf("day") < moment().add(dayOffset, "days").startOf("day")) throw Error("invalid expiry date");
        }
                     
        // check insufficent funds for buy order
        if(action === "buy") {
            let account = await Account.findById(accountID);
            let stockPrice = await getStockPrice({stockID});

            if(account.balance < (price || stockPrice) * quantity) throw Error("insufficent funds");
        } else {
            // check if user owns share
            let portfolio = await getPortfolio({accountID});
            let userStock;

            for(let i=0; i<portfolio.length; i++) {
                if(portfolio[i].id == stockID) {
                    userStock = portfolio[i];
                    break;
                }
            }

            if(!userStock) throw Error("lack of shares to sell");
            if(userStock.shares < quantity) throw Error("lack of shares to sell");            
        }

        let order = await new Order({
            accountID,
            stockID,
            action,
            quantity,
            price: price || null,
            expiry: expiry || "",
            completed: "",
            date: moment().add(dayOffset, "days").format(),
        });

        return order.save();
    },


    /*
        @desc    Get stock orders based on query params
        @param   args: {accountID, stockID, action, quantity, price, expiry, completed}
        @return  array of order MongoDB instances
    */
    getOrders: async(args) => {
        let results = await Order.find(args);
        return results;
    },


    /*
        @desc    Cancel stock order
        @param   args: {orderID}
        @return  order MongoDB instance
    */
    cancelOrder: async(args) => {
        let order = await Order.findById(args.orderID)
        let dayOffset = await getDayOffset();
        
        order.failed = true;
        order.completed = moment().add(dayOffset, "days").format();
        
        return order.save();
    }

}