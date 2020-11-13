const fs = require("fs");
const moment = require("moment");

const database = require("../../config/database");
const { simulateStockDataOverTime } = require("./simulate");
const { createStock } = require("../api/resolvers/stock.resolve");

const SYMBOLS_FILE = "symbols.txt";
const WEEKS_TO_SIM = 2


/*
    @desc    Core setup process for inital data generation
*/
const setup = async () => {
    console.log("Setting up fleaDB.\n")

    console.log("Parsing symbols...")
    let symbols = await parseSymbols();
    if(!symbols) {
        console.log("Could not parse symbols file.")
        return;
    }

    await database.connectLocal();

    console.log("Populating stock data...")
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
        return null;
    }
}


/*
    @desc    Create MongoDB instances of stocks from symbols
    @params  symbols: ["<TICKER>:<NAME>:<START_PRICE>"]
*/
const populateStocks = async (symbols) => {
    for(let i=0; i < symbols.length; i++) {
        data = symbols[i].split(':');

        const stock = await createStock({
            name: data[1],
            ticker: data[0],
            market: 'NASDAQ'
        });

        const startDate = moment().startOf('day').subtract(WEEKS_TO_SIM * 7, 'days')

        await simulateStockDataOverTime(
            stock.id,          // stockID
            WEEKS_TO_SIM * 7,  // timeAmount
            "days",            // timeUnit
            data[2],           // startPrice
            startDate,         // startDate
        );
    }
}

setup();