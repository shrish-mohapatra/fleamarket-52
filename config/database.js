const mongoose = require('mongoose');
const keys = require('./keys');

module.exports = {
    /*
        @desc    Connect to cloud MongoDB Atlas database.
        @note    Testing purposes only, will switch to local database in next check in
    */
    connectAtlas: () => {
        mongoose.connect(keys.database.atlas, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
            .then(() => console.log("Connected to MongoDB Atlas."))
            .catch((error) => console.log(error))
    },

    /*
        @desc    Connect to local MongoDB database server.
    */
    connectLocal: async () => {
        try {
            await mongoose.connect(keys.database.local, {
                useUnifiedTopology: true,
                useNewUrlParser: true
            })

            console.log("Connected to MongoDB local server.")
        } catch(error) {
            console.log("Could not connect to MongoDB local server:", error.message)
        }
    },

    /*
        @desc    Close MongoDB connections.
    */
    disconnect: () => { 
        mongoose.connection.close()
    }
}