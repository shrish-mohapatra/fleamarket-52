const mongoose = require('mongoose');

/*
    @desc    User MongoDB model for authentication
    @param   fields: {email, password}
*/
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('user', userSchema);