const fs = require("fs");
const SYMBOLS_FILE = "symbols.txt";

const setup = async () => {
    console.log("Initalizing stock data...\n")
    let symbols = await parseSymbols();
    await createStocks(symbols);
}

/*
    @desc    Grab stock symbols from file
    @notes   file currently stored in root directory
    @return  array of symbols (strings)
*/
const parseSymbols = async()  => {
    let results = []

    try {
        let data = await fs.readFileSync(SYMBOLS_FILE, 'utf8');
        data = data.split("\n")
        
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
    @params  symbols: [] of tickers
*/
const createStocks = async (symbols) => {}

setup();