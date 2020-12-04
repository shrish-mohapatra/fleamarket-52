const fs = require("fs");
const moment = require("moment");

const database = require("../../config/database");

const { simulateStockDataOverTime } = require("./simulate");
const { createStock } = require("../api/resolvers/stock.resolve");
const { signup } = require("../api/resolvers/auth.resolve");
const { createAdmin } = require("../api/resolvers/admin.resolve");
const { searchArticles } = require("../api/resolvers/news.resolve");

const SYMBOLS_FILE = "symbols.txt";
const WEEKS_TO_SIM = 2

/*
    @desc    Core setup process for inital data generation
*/
const setup = async () => {
    console.log("Setting up fleaDB.\n")

    let symbols = await parseSymbols();
    if(!symbols) return;

    await database.connectLocal();    

    await createAdmin(moment().startOf('day').subtract(WEEKS_TO_SIM * 7, 'days').format());
    await populateUsers();
    await populateStocks(symbols);    

    database.disconnect();
    console.log("Setup completed.")
}


/*
    @desc    Grab stock symbols from file
    @notes   file currently stored in root directory
    @return  symbols: ["<TICKER>:<NAME>:<START_PRICE>"]
*/
const parseSymbols = async()  => {
    console.log("Parsing symbols...")

    let results = []

    try {
        let data = await new Promise(resolve => {
            fs.readFile(SYMBOLS_FILE, 'utf8', (err, data) => {
                if(err) throw err;
                resolve(data.split("\n"))
            });
        })
        
        for(let i=0; i<data.length; i++) {
            results.push(data[i].trim());
        }

        return results
    } catch(error) {
        console.log(error);
        console.log("Could not parse symbols file.")
        return null;
    }
}


/*
    @desc    Create MongoDB instances of stocks from symbols
    @params  symbols: ["<TICKER>:<NAME>:<START_PRICE>"]
*/
const populateStocks = async (symbols) => {
    console.log("Populating stock data...")

    for(let i=0; i < symbols.length; i++) {
        data = symbols[i].split(':');

        const stock = await createStock({
            name: data[1],
            ticker: data[0],
            market: 'NASDAQ'
        });

        await searchArticles({name: stock.name, stockID: stock.id});

        let startDate = moment().startOf('day').subtract(WEEKS_TO_SIM * 7, 'days');

        await simulateStockDataOverTime(
            stock.id,          // stockID
            WEEKS_TO_SIM * 7,  // timeAmount
            "days",            // timeUnit
            data[2],           // startPrice
            startDate,         // startDate
        );
    }
}


/*
    @desc    Create MongoDB instances of users for testing
    @note    test1 will be a new user, test2 will be a user with some orders
*/
const populateUsers = async() => {
    console.log("Populating user data...")

    const { userID1 } = await signup({
        email: 'test1',
        password: 'password'
    })
}

setup();