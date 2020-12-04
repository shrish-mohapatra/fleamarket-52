const Watchlist = require("../models/watchlist.model");

module.exports = {

    /*
        @desc    Create watchlist for user
        @param   args: {userID, name}
        @return  mongoDB watchlist instance
    */
    createWatchlist: async(args) => {
        const {name, userID} = args;
        let watchlist = new Watchlist({name, userID});
        return watchlist.save();
    },

    /*
        @desc    Delete watchlist from id
        @param   args: {watchlistID}
    */
    deleteWatchlist: async(args) => {
        const {watchlistID} = args;
        await Watchlist.findByIdAndDelete(watchlistID);
        return "Deleted watchlist."
    },

    /*
        @desc    Update watchlist tickers
        @param   args: {watchlistID, tickers: [<string>]}
        @return  updated mongoDB watchlist instance
    */
    updateWatchlist: async(args) => {
        const {watchlistID, tickers} = args;
        let watchlist = await Watchlist.findById(watchlistID);
        watchlist.tickers = tickers;
        return watchlist.save()
    },

}