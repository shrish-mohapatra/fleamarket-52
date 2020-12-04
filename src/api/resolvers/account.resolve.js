const moment = require("moment");

const Account = require("../models/account.model");
const Order = require("../models/order.model");
const Stock = require("../models/stock.model");
const Transaction = require("../models/transaction.model");

const { getDayOffset } = require("./admin.resolve");

module.exports = {

    /*
        @desc    Create portfolio account with zero balance
        @param   args: {userID, type, balance*} *optional
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
        @desc    Withdraw/deposit to account
        @param   args: {accountID, amount}
        @return  updated account MongoDB instance
    */
    changeBalance: async(args) => {
        let {accountID, amount} = args;
        let dayOffset = await getDayOffset();

        let account = await Account.findById(accountID);
        if(!account) throw Error("Account does not exist.");

        account.balance += amount;
        if(account.balance < 0) throw Error("Insufficient funds.");

        // create transaction
        let fAmount = (Math.abs(amount)/100).toFixed(2);
        let transaction = new Transaction({
            action: (amount > 0) ? 'deposit' : 'withdraw',
            date: moment().add(dayOffset, "days").format(),
            info: (amount > 0) ? `Deposited $${fAmount}` : `Withdrew $${fAmount}`,
            accountID
        });

        transaction.save();
        return account.save()
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