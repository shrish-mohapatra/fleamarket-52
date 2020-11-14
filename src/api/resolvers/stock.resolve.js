const moment = require("moment");

const Stock = require("../models/stock.model");
const StockData = require("../models/stockData.model");

const { getOrders } = require("./order.resolve");

// Note that all numerical data has scale factor of 100
// ex. price = 12345 => $123.45

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

        // Check and delete latest stock data if its new data since today's open
        let pastData = await fetchData({stockID})
        if(pastData) {
            const lastUpdated = moment(pastData[0].date)
            const lastDay = moment(pastData[0].date).startOf('day')

            if(lastUpdated > lastDay) await StockData.findByIdAndDelete(pastData[0].id)
        }

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
        @param   args: {id*, ticker/symbol*, market*, minprice*, maxprice*}  (* optional fields)
        @return  array of stock MongoDB instances
    */
    getStocks: async(args) => {
        // Query by ticker
        if(args.symbol) {
            args.ticker = args.symbol
            delete args.symbol
        }

        // Extract price queries
        let {minprice, maxprice} = args
        if(minprice) {
            minprice *= 100
            delete args.minprice
        } else if(maxprice) {
            maxprice *= 100
            delete args.maxprice
        }

        let result = await Stock.find(args)
        if(!minprice && !maxprice) return result;

        // Filter by price
        let newResult = []
        
        for(let i=0; i<result.length; i++) {
            let stock = result[i]
            let stockData = await fetchData({stockID: stock.id});
            if(!stockData) continue;

            let price = calculatePrice(stockData[0]);
            if(!price) continue;

            if(maxprice && price <= maxprice) newResult.push(stock)
            if(minprice && price >= minprice) newResult.push(stock)
        }

        return newResult;
    },


    /*
        @desc    Retreive stockData for specific stock (sorted reverse chronologically)
        @param   args: {stockID, filter*: 'days', null}
        @return  array stockData MongoDB instances
    */
    getStockData: async(args) => {
        if(args.symbol) {
            args.stockID = (await Stock.findOne({ticker: args.symbol})).id
        }

        let result = await fetchData(args);
        if(!args.filter || !result) return result

        // Filter stock data by 'days', 'weeks', etc..
        let newResult = []
        newResult.push(result[0])

        let compDate = moment(result[0].date)

        for(let i=1; i<result.length; i++) {
            compDate = compDate.add(1, args.filter)
            if(moment(result[i].date) >= compDate) newResult.push(result[i])
        }

        return newResult.reverse().slice(1)
    },

    /*
        @desc    Retrieve latest stock orders
        @param   args: {symbol}
        @return  array of order MongoDB instances
    */
    getStockHistory: async(args) => {
        if(args.symbol) {
            args.stockID = (await Stock.findOne({ticker: args.symbol})).id
        }

        let orders = await getOrders({
            stockID: args.stockID,
            completed: { $ne: "" },
            failed: { $ne: true }
        })
        return orders
    },


    /*
        @desc    Retrieve latest stock price
        @param   args: {stockID}
        @return  price rounded to 2 decimal places
    */
    getStockPrice: async(args) => {
        let stockData = await fetchData(args);
        if(!stockData) return null;

        return calculatePrice(stockData[0]);
    },


    /*
        @desc    Retrieve latest stock ask price
        @param   args: {stockID}
        @return  price
    */
    getStockAsk: async(args) => {
        let stockData = await fetchData(args);
        if(!stockData) return null;

        return stockData[0].ask;
    },


    /*
        @desc    Retrieve latest stock bid price
        @param   args: {stockID}
        @return  price
    */
    getStockBid: async(args) => {
        let stockData = await fetchData(args);
        if(!stockData) return null;

        return stockData[0].bid;
    },


    /*
        @desc    Retrieve highest stock price
        @param   args: {stockID}
        @return  price
    */
    getStockHigh: async(args) => {
        let stockData = await fetchData({...args, filter: '-ask'});
        if(!stockData) return null;

        return stockData[0].ask;
    },

    /*
        @desc    Retrieve lowest stock price
        @param   args: {stockID}
        @return  price
    */
    getStockLow: async(args) => {
        let stockData = await fetchData({...args, filter: 'bid'});
        if(!stockData) return null;

        return stockData[0].bid;
    },

    /*
        @desc    Retrieve stock price change
        @param   args: {stockID}
        @return  price change (percentage %, scale factor of 100)
    */
    getStockChange: async(args) => {
        let stockData = await fetchData(args);
        if(!stockData) return null;

        const curPrice = calculatePrice(stockData[0]);
        const prevClose = await getPrevClose(args);

        if(!prevClose) return null;

        return Math.floor(((curPrice - prevClose)/prevClose) * 10000);
    }, 

    /*
    */
   getStockOpen: async(args) => {
       let prevClose = await getPrevClose(args);
       if(!prevClose) return null;
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
    return Math.floor((stockData.ask + stockData.bid)/2);
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