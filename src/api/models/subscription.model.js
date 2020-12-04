const mongoose = require('mongoose');

/*
    @desc    Subscription MongoDB model for registering users for future notifications regarding stock activity
    @param   fields: {userID, stockID, rule, active, lastNotified}
*/
const subscriptionSchema = mongoose.Schema({    
    rule: {
        type: Number,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
    },
    lastNotified: {
        type: String,
        required: false
    },
    userID: {
        type: String,
        required: true
    },
    stockID: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('subscription', subscriptionSchema);