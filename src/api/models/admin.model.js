const mongoose = require('mongoose');

/*
    @desc    Admin MongoDB model for controlling core functionality
    @param   fields: {dayOffset,}
*/
const adminSchema = mongoose.Schema({
    dayOffset: {
        type: Number,
        default: 0,
    },
})

module.exports = mongoose.model('admin', adminSchema);