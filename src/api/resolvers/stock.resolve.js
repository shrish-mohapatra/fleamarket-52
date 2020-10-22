const moment = require("moment");

const Stock = require("../models/stock.model");
const StockData = require("../models/stockData.model");

module.exports = {

    /*
        @desc    Create stock instance with meta data
        @param   args: {name, ticker, market}
        @return  stock MongoDB instance
    */
    createStock: async(args) => {
        let {name, ticker, market} = args;

        let stock = await new Stock({
            name,
            ticker,
            market
        });

        return stock.save();
    },


    /*
        @desc    Create stockData instance with price data
        @param   args: {stockID, ask, bid, date*}  (* optional fields)
        @return  stockData MongoDB instance
    */
    createStockData: async(args) => {
        let {stockID, ask, bid, date} = args;

        let stockData = await new StockData({
            stockID,
            ask,
            bid,
            date: date || moment().format()
        });

        return stockData.save();
    },


    /*
        @desc    Retrieve stocks based on query params
        @param   args: {id*, ticker*, market*}  (* optional fields)
        @return  array of stock MongoDB instances
    */
    getStocks: async(args) => {
        let result = await Stock.find(args);
        return result;
    },


    /*
        @desc    Retreive stockData for specific stock (sorted reverse chronologically)
        @param   args: {stockID}
        @return  array stockData MongoDB instances
    */
    getStockData: async(args) => {
        let {stockID} = args;
        let result = await StockData.find({stockID}).sort('-date');
        return result;
    },


    /*
        @desc    Retrieve latest stock price
        @param   args: {stockID}
        @return  array stock price of most recent data
    */
    getStockPrice: async(args) => {
        let {stockID} = args;
        let stockData = await StockData.find({stockID}).sort('-date').limit(1);

        if(stockData.length == 0) {
            return "N/A";
        }

        let price = (parseFloat(stockData[0].ask) + parseFloat(stockData[0].bid))/2
        return price.toFixed(2);
    },
    
}