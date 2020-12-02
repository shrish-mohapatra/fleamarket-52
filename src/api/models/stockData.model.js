const mongoose = require('mongoose');

/*
    @desc    StockData MongoDB model for stock price data
    @param   fields: {stockID, ask, bid, date}
    @note    all prices have scale factor of 100
                ex. ask = 12345 => $123.45
*/
const stockDataSchema = mongoose.Schema({
    stockID: {
        type: String,
        required: true
    },
    ask: {
        type: Number,
        required: true
    },
    bid: {
        type: Number,
        required: true
    },
    high: {
        type: Number,
        required: true
    },
    low: {
        type: Number,
        required: true
    },
    volume: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('stockData', stockDataSchema);