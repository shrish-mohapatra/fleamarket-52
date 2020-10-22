const Order = require("../models/order.model");

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
            price: "",
            expiry: "",
            completed: "",
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

}