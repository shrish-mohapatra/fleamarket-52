const moment = require("moment");

const Order = require("../models/order.model");

const { getDayOffset } = require("./admin.resolve");

module.exports = {

    /*
        @desc    Create stock order
        @param   args: {accountID, stockID, action, quantity, price*, expiry*}
        @return  order MongoDB instance
    */
    createOrder: async(args) => {
        let {accountID, stockID, action, quantity, price, expiry} = args;                      
        let dayOffset = await getDayOffset();

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