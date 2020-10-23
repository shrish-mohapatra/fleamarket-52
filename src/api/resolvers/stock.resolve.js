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
        return fetchData(args);
    },


    /*
        @desc    Retrieve latest stock price
        @param   args: {stockID}
        @return  price rounded to 2 decimal places
    */
    getStockPrice: async(args) => {
        let stockData = await fetchData(args);
        if(!stockData) return "N/A";

        return calculatePrice(stockData[0]);
    },


    /*
        @desc    Retrieve latest stock ask price
        @param   args: {stockID}
        @return  price
    */
    getStockAsk: async(args) => {
        let stockData = await fetchData(args);
        if(!stockData) return "N/A";

        return stockData[0].ask;
    },


    /*
        @desc    Retrieve latest stock bid price
        @param   args: {stockID}
        @return  price
    */
    getStockBid: async(args) => {
        let stockData = await fetchData(args);
        if(!stockData) return "N/A";

        return stockData[0].bid;
    },


    /*
        @desc    Retrieve highest stock price
        @param   args: {stockID}
        @return  price
    */
    getStockHigh: async(args) => {
        let stockData = await fetchData({...args, filter: '-ask'});
        if(!stockData) return "N/A";

        return calculatePrice(stockData[0]);
    },

    /*
        @desc    Retrieve lowest stock price
        @param   args: {stockID}
        @return  price
    */
    getStockLow: async(args) => {
        let stockData = await fetchData({...args, filter: 'bid'});
        if(!stockData) return "N/A";

        return calculatePrice(stockData[0]);
    },

    /*
        @desc    Retrieve stock price change
        @param   args: {stockID}
        @return  price change (percentage %)
    */
    getStockChange: async(args) => {
        let stockData = await fetchData(args);
        if(!stockData) return "N/A";

        const curPrice = calculatePrice(stockData[0]);
        const prevClose = await getPrevClose(args);

        if(!prevClose) return "N/A";

        let change = ((parseFloat(curPrice) - parseFloat(prevClose))/parseFloat(prevClose)) * 100;

        return change.toFixed(2);
    }, 

    /*
    */
   getStockOpen: async(args) => {
       let prevClose = await getPrevClose(args);
       if(!prevClose) return "N/A";
       return prevClose;
   }
}


/*
    @desc    Retrieve stock data
    @param   args: {stockID, filter*}  *optional, default='-date'
    @return  array of stock data mongo instances
*/
const fetchData = async (args) => {
    let {stockID, filter} = args;
    if(!filter) filter = '-date';

    let result = await StockData.find({stockID}).sort(filter);

    if(result.length == 0) return null

    return result;
}

/*
    @desc    Calculate stock price from ask & bid
    @param   stockData: mongo DB instance
    @return  price
*/
const calculatePrice = (stockData) => {
    let price = (parseFloat(stockData.ask) + parseFloat(stockData.bid))/2;
    return price.toFixed(2);   
}

/*
    @desc    Get previous day's closing price
    @param   args: {stockID}
    @return  price
*/
const getPrevClose = async (args) => {
    let stockData = await fetchData(args);
    if(!stockData) return null;

    let ref;
    const compDay = moment(stockData[0].date).format("YYYYMMDD");

    for(let i=1; i<stockData.length; i++) {
        if(moment(stockData[i].date).format("YYYYMMDD") < compDay) {
            ref = i;
            break;            
        }
    }

    if(!ref) return null;

    return calculatePrice(stockData[ref]);
}