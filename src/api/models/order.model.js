const mongoose = require('mongoose');

/*
    @desc    Order MongoDB model for storing stock order data
    @param   fields: {accountID, stockID, action, quantity, price, expiry, completed}
*/
const orderSchema = mongoose.Schema({
    accountID: {
        type: String,
        required: true
    },
    stockID: {
        type: String,
        required: true
    },
    action: {
        // ex. buy or sell
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: String,
        required: false,
    },
    expiry: {
        // Expiry date
        type: String,
        required: false,
    },
    completed: {
        // Completion date
        type: String,
        required: false,
    },
})

module.exports = mongoose.model('order', orderSchema);