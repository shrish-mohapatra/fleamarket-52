const fs = require("fs");
const moment = require("moment");

const database = require("../../config/database");
const { simulateStockData } = require("./simulate");
const { createStock, createStockData } = require("../api/resolvers/stock.resolve");

const SYMBOLS_FILE = "symbols.txt";
const WEEKS_TO_SIM = 2


/*
    @desc    Core setup process for inital data generation
*/
const setup = async () => {    
    let symbols = await parseSymbols();
    if(!symbols) return;

    await database.connectLocal();
    await populateStocks(symbols);
    database.disconnect();
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

        await simulateStockData(
            stock.id,
            WEEKS_TO_SIM * 7,
            "days",
            data[2],
            moment().subtract(WEEKS_TO_SIM * 7, 'days')
        );
    }
}

setup();