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
        type: String,
        required: true
    },
    bid: {
        type: String,
        required: true
    }, 
    date: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('stockData', stockDataSchema);