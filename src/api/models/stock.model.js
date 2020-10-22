const mongoose = require('mongoose');

/*
    @desc    Stock MongoDB model for general stock meta data
    @param   fields: {name, ticker, market}
*/
const stockSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ticker: {
        type: String,
        required: true
    },
    market: {
        type: String,
        required: true
    }, 
})

module.exports = mongoose.model('stock', stockSchema);