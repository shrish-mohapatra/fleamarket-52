const mongoose = require("mongoose");
const database = require("../../config/database");

const COLLECTIONS_TO_REMOVE = [
    'accounts',
    'orders',
    'stockdatas',
    'stocks',
    'users',
    'admins',
    'articles'
]

/*
    @desc    Core setup process for inital data generation
*/
const cleanup = async () => {
    console.log("Cleaning up fleaDB.\n")

    await database.connectLocal();
    
    console.log("Deleting collections...")
    await deleteCollections();
    
    database.disconnect();
    console.log("\nCleanup completed.")
}

const deleteCollections = async() => {
    for(let i=0; i<COLLECTIONS_TO_REMOVE.length; i++) {
        let collection = COLLECTIONS_TO_REMOVE[i]

        await new Promise(resolve => {
            mongoose.connection.db.dropCollection(collection, (err, result) => {
                if(!err) console.log(`\t Deleted ${collection} collection`)                
                resolve()
            })
        })
    }
}

cleanup();