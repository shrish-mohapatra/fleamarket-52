const moment = require("moment");

const Order = require("../models/order.model");
const Account = require("../models/account.model");

const { getStockPrice } = require("./stock.resolve");

module.exports = {

    /*
        @desc    Create stock order
        @param   args: {accountID, stockID, action, quantity, price*, expiry*}
        @return  order MongoDB instance
    */
    createOrder: async(args) => {
        let {accountID, stockID, action, quantity, price, expiry} = args;                      

        let order = await new Order({
            accountID,
            stockID,
            action,
            quantity,
            price: price || "",
            expiry: expiry || "",
            completed: "",
            date: moment().format(),
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
        order.failed = true;
        order.completed = moment().format();
        
        return order.save();
    }

}