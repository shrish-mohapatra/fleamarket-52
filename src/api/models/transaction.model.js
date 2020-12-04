const mongoose = require('mongoose');

/*
    @desc    Transaction MongoDB model for buy, sell, wuthdraw, deposit transactions
    @param   fields: {stockID, title, url, author, date}
*/
const transactionSchema = mongoose.Schema({    
    action: {
        type: String,
        required: true,
    },
    info: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    accountID: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('transaction', transactionSchema);