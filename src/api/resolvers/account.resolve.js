const Account = require("../models/account.model");
const Order = require("../models/order.model");
const Stock = require("../models/stock.model");

module.exports = {

    /*
        @desc    Create portfolio account with zero balance
        @param   args: {userID, type}
        @return  account MongoDB instance
    */
    createAccount: async(args) => {
        let {userID, type, balance} = args;

        let account = await new Account({
            type,
            userID,
            balance: balance | 0,
        });

        return account.save();
    },


    /*
        @desc    Retrieve currently owned stocks
        @param   args: {accountID}
        @return  array of stocks with shares field (# shares owned)
    */
    getPortfolio: async(args) => {
        let resultsMap = {}

        // Fetch completed, non-failed buy orders
        let buyOrders = await Order.find({
            accountID: args.accountID,
            action: "buy",
            completed: {$ne: ""},
            failed: null
        })

        // Add stocks and purchased # of shares to resultsMap
        for(let i=0; i<buyOrders.length; i++) {
            let order = buyOrders[i];            

            if(resultsMap[order.stockID]) {
                resultsMap[order.stockID].shares += order.quantity;
            } else {
                let stock = await Stock.findById(order.stockID);
                resultsMap[order.stockID] = {
                    ...stock._doc,
                    id: stock._doc._id,
                    shares: order.quantity
                };
            }
        }

        // Fetch completed, non-failed sell orders
        let sellOrders = await Order.find({
            accountID: args.accountID,
            action: "sell",
            completed: {$ne: ""},
            failed: null
        })

        // Subtract sold quantities from # of shares
        for(let i=0; i<sellOrders.length; i++) {
            let order = sellOrders[i];

            resultsMap[order.stockID].shares -= order.quantity;

            if(resultsMap[order.stockID].shares == 0) {
                delete resultsMap[order.stockID];
            }
        }

        if(args.returnMap) return resultsMap
        return Object.values(resultsMap);
    }

}