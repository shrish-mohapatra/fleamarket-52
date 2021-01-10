# Fleamarket 52
![Node.js](https://img.shields.io/badge/-Node.js-000?style=flat&logo=node.js)
![React](https://img.shields.io/badge/-React-000?style=flat&logo=React)
![GraphQL](https://img.shields.io/badge/-GraphQL-000?style=flat&logo=graphql)
![MongoDB](https://img.shields.io/badge/-MongoDB-000?style=flat&logo=mongodb)
![Express](https://img.shields.io/badge/-Express-000?style=flat&logo=Express)

<img src="https://i.imgur.com/WM8dyfs.png" alt="fleamarket-52-home">

> A stock web portfolio application where users can view stocks, place buy/sell orders, and be notified of changes.
> Developed by Shrish Mohapatra for *COMP 2406: Fundamentals of Web Applications* final project.


## Features

<img src="https://media.giphy.com/media/LYX9ogKRUOd1U5tPvd/giphy.gif">

### Signup/Login
- Create an account or login with existing email and password
- Recieve notifcations for invalid credentials

### Withdraw/Deposit funds
- Before you can buy stocks you will need funds
- Select *Orders* from sidebar and navigate to *Manage Funds*
- Withdraw/deposit funds, will recieve notification regarding status

### View Stocks
- Select *Dashboard/All Stocks* from sidebar to start viewing stocks
- Select stocks from scrollable stockbar
- View dynamic stock price graphs for past 2 weeks
- Stock stats such as ask, bid, open, high, low, volume
- Quick order (buy/sell) stocks
- View latest news articles regarding company
- Subscribe to stock price changes

### Create Orders
- Select *Orders* from sidebar and navigate to *Order Form*
- Select symbol/ticker from available options
- Select price type (market or limit)        
- Change price if limit order
- Select action (buy or sell)
- Select quantity
- Select expiry date
- Confirm order
- Will recieve notifcations regarding order status

### View Orders
- Select *Orders* from sidebar
- Created buy/sell orders will appear in the stockbar
- Can cancel pending orders by right-clicking card

### Market Simulation
- Select the calendar from the sidebar
- Choose dates to simulate market over a period of time
- Useful for testing limit orders

## Running application
### Minimum Requirements
- [Node.js](https://nodejs.org/en/) version 12 or higher
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
    - Be sure to run `mongod.exe` before running application

### Running server
1. Clone repository: `git clone https://github.com/shrish-mohapatra/fleamarket-52.git`
2. Create the following file in `/config/keys.js`:
    ```js
    module.exports = {
        database: {
            local: "mongodb://127.0.0.1:27017/<YOUR_DB_NAME>"
        },

        key: "<YOUR_RANDOM_KEY>",        // Hash key, used for tokens
        newsKey: "<YOUR_NEWS_API_KEY>"   // News API key (https://newsapi.org)
    }
    ```
2. Run the following commands:
    ```bash
    cd fleamarket-52
    npm i                    # Install neccesary modules
    npm run cleanup          # Deletes all collections
    npm run setup            # Create stocks & initial data from symbols.txt
    npm start                # Runs server on port 8000
    ```
3. Visit (http://localhost:8000) to view application.

For more information regarding the application feel free to read the [project report](https://github.com/shrish-mohapatra/fleamarket-52/blob/master/COMP%202406%20Project%20Report%20-%20Shrish%20Mohapatra.pdf).
