const mongoose = require('mongoose');

/*
    @desc    Article MongoDB model for storing news data
    @param   fields: {stockID, title, url, author, date}
*/
const articleSchema = mongoose.Schema({    
    title: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    stockID: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('article', articleSchema);