const mongoose = require('mongoose');

/*
    @desc    Notification MongoDB model for notifying users of activity
    @param   fields: {userID, title, message}
*/
const notificationSchema = mongoose.Schema({    
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    userID: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('notification', notificationSchema);