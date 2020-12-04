const mongoose = require('mongoose');

/*
    @desc    Admin MongoDB model for controlling core functionality
    @param   fields: {dayOffset, startDate}
*/
const adminSchema = mongoose.Schema({
    dayOffset: {
        type: Number,
        default: 0,
    },
    startDate: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('admin', adminSchema);