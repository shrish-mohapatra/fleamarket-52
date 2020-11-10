const mongoose = require('mongoose');

/*
    @desc    StockData MongoDB model for stock price data
    @param   fields: {stockID, ask, bid, date}
*/
const stockDataSchema = mongoose.Schema({
    stockID: {
        type: String,
        required: true
    },
    ask: {
        // scale factor of 100
        // ex. ask = 12345 => $123.45
        type: Number,
        required: true
    },
    bid: {
        // scale factor of 100
        // ex. bid = 12345 => $123.45
        type: Number,
        required: true
    }, 
    date: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('stockData', stockDataSchema);