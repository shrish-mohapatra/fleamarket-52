const mongoose = require('mongoose');

/*
    @desc    Watchlist MongoDB model for users to keep track of certain stocks
    @param   fields: {userID, name, tickers}
*/
const watchlistSchema = mongoose.Schema({    
    name: {
        type: String,
        required: true,
    },
    tickers: {
        type: [String],
    },
    userID: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('watchlist', watchlistSchema);