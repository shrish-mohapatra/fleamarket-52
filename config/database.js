const mongoose = require('mongoose');
const keys = require('./keys');

module.exports = {
    /*
        @desc    Connect to cloud MongoDB Atlas database.
        @note    Testing purposes only, will switch to local database in next check in
    */
    connectAtlas: () => {
        mongoose.connect(keys.database.uri, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
            .then(() => console.log("Connected to MongoDB Atlas."))
            .catch((error) => console.log(error))
    },

    /*
        @desc    Connect to lcaol MongoDB database server.
    */
    connectLocal: () => {}
}