const moment = require("moment");
const axios = require('axios');

const Article = require("../models/article.model");
const Stock = require("../models/stock.model");

const { newsKey } = require("../../../config/keys");

const MAX_ARTICLES = 5; // Max # of articles for each stock

module.exports = {

    /*
        @desc    Use News API to search for articles based on stock name
        @params  args: {name: <string>, stockID* no spaces}
        @return  array of article objects
    */
    searchArticles: async(args) => {
        let { name, stockID } = args;

        // Get stock id from name
        if(!stockID) {
            const stockRegex = new RegExp(name);
            const stocks = await Stock.find({"name": {$regex: stockRegex, $options: 'i'}})
            if(!stocks || stocks.length === 0) throw Error("Invalid stock name.");
            stockID = stocks[0].id;
        }

        // Create News API endpoint url
        const startDate = moment().format("YYYY-MM-DD")
        const keyword = name.split(' ').join('+');
        const endpoint = `http://newsapi.org/v2/everything?q=${keyword}&from=${startDate}&sortBy=popularity&apiKey=${newsKey}`        

        let articles = [];

        // Clear previous articles
        await Article.deleteMany({stockID});

        try {
            let result = await axios.get(endpoint);
            
            // Create article objects
            for(let i=0; i<Math.min(MAX_ARTICLES, result.data.articles.length); i++) {
                let data = result.data.articles[i];

                let article = new Article({
                    title: data.title,
                    url: data.url,
                    author: data.source.name,
                    date: moment().format(),
                    stockID,
                })

                articles.push(await article.save());
            }

            return articles;
        } catch(error) {
            console.log(error);
            throw Error("Unable to search for articles.");
        }
    },

}