const mongoose = require('mongoose');

/*
    @desc    Account MongoDB model for stock portoflio data
    @param   fields: {balance, type, userID}
*/
const accountSchema = mongoose.Schema({
    userID: {
        type: String,
        required: true
    },
    balance: {
        // scale factor of 100
        // ex. balance = 12345 => $123.45
        type: Number,
        required: true
    },
    type: {
        // ex. "TFSA", "Non-Registered"
        type: String,
        required: true
    },    
})

module.exports = mongoose.model('account', accountSchema);