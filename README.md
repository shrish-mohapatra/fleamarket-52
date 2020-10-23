# COMP 2406: Fleamarket 52
> A stock web portfolio application where users can view stocks, place buy/sell orders, and be notified of changes.
> Developed by Shrish Mohapatra.

## Running application
1. After cloning the repo, run the following commands
```
    cd ~/fleamarket52
    npm i
    npm run dev
```
2. Visit (http://localhost:8000) to view application.


## Check-In #2 Breakdown

### New Features
- Node.js server now renders the frontend React app made in the last check-in

- Majority of backend functions and logic have been completed
    - ex. login, signup, stocks, createOrder, etc.
    - (please see `Server Structure` section for more info)

- Initial integration with MongoDB database
    - currently using MongoDB Atlas for testing, will use local version in next check-in
    - created MongoDB data models (users, stocks, orders, etc.)
    - general implementation of relational data (see `Data_Planning.pdf` for visual schematic)

- Fully implemented login and signup functionality (both client and server)
    1. Visit (http://localhost:8000/).

    2. Select *Logout*. This will take you to login page.

    3. Choose between `Login` and `Signup`.

    4. Try to login with a random email and password.
        - should recieve *Authentication Error: User with that email does not exist.*

    5. Try to login with `john@gmail.com` and a random password.
        - should recieve *Authentication Error: Incorrect password.*
        
    6. Try to login with `john@gmail.com` and `password`.
        - should take you to home page

    7. Signup will always be succesful, as long as a user's email does not already exist.

    TODO: Secure password checks (uppercsae, special char, etc) and proper email validation.

- Created REST API endpoint routes (ex "/stocks", "/signup", etc.)
    - routes point to business logic defined in `/src/api/resolvers`

- Created GraphQL types, queries, and mutations
    - Visit (http://localhost:8000/api/graph) for GraphQL testing interface
    - Try the following query:
    ```
    {
        users{
            email
            accounts{
            balance
            portfolio{
                ticker
                shares
            }
            orders{
                action
                quantity
                stock{
                ticker
                price
                }
            }
            }
        }
    }
    ```

### Server Structure
The general process for the server is as follows:

1. The server listens for requests on port 8000 (`index.js`)
    - Express is used to configure URLs, parse requests as JSON, and serve React
    - Custom `/src/utilities/logging.js` middleware is used to console.log requests.

2. Server recieves client requests from 2 main endpoints
    - URL REST routes, specified in the `/src/api/routes` folder
    - GraphQL queries/mutations specified in the `/src/api/graphql` folder

3. Server processes user requests from scripts in the `/src/api/resolvers`
    - This is where the "business logic" of the application is stored
    - Each "resolver" has a series of functions which take arguments, perform an action, and return data
    - Both GraphQL and REST routes point to the same resolver functions

This is a hierachal representation of the key components for the Node.js server.
(Note, please fullscreen so the diagram does not clip)

```
.
├── client ---------------------------------- (See "Client Structure" in Check-In 1 breakdown)
|
├── config
│   ├── database.js ------------------------- (Script to connect to MongoDB server)
│   └── keys.js ----------------------------- (API keys and database credentials)
|
├── src
│   ├── api
│   │   ├── graphql
│   │   │   ├── mutations.js ---------------- (Functions to modify data using GraphQL approach)
│   │   │   ├── queries.js ------------------ (Functions to query data using GraphQL approach)
│   │   │   ├── schema.js ------------------- (Combines queries and mutations, used in `index.js`)
│   │   │   └── types.js -------------------- (Functions to define GraphQL models and relationships)
|   |   |
│   │   ├── models -------------------------- (Folder with MongoDB schemas for data types)
│   │   │   ├── account.model.js
│   │   │   ├── order.model.js
│   │   │   ├── stock.model.js
│   │   │   ├── stockData.model.js
│   │   │   └── user.model.js
|   |   |
│   │   ├── resolvers ----------------------- (Core business logic)
│   │   │   ├── wrappers
│   │   │   │   └── restWrapper.js ---------- (Connect express routes to resolver functions)
|   |   |   |
│   │   │   ├── account.resolve.js ---------- (Logic for creating accounts, getting stocks in portfolio)
│   │   │   ├── auth.resolve.js ------------- (Logic for logging in, signing up)
│   │   │   ├── order.resolve.js ------------ (Logic for creating, retieving, and cancelling orders)
│   │   │   └── stock.resolve.js ------------ (Logic for creating, retieving stocks and stockData)
|   |   |
│   │   └── routes -------------------------- (Express REST API routes)
│   │       ├── auth.routes.js -------------- (Login and signup routes)
│   │       ├── order.routes.js ------------- (Create and get orders routes)
│   │       └── stock.routes.js ------------- (Login and signup routes)
|   |
│   └── utilities
│       ├── logging.js ---------------------- (Middleware function to log server requests)
│       ├── setup.js ------------------------ (npm script used to generate initial stock data, WIP)
│       ├── simulate.js --------------------- (Function used to process orders, generate new stock data, WIP)
│       └── token.js ------------------------ (Create tokens, will use to check auth status, WIP)
|
├── index.js -------------------------------- (Root server script)
└── package.json
```


## Check-In #1 Breakdown

### Features
- Stylized dashboard style home page (http://localhost:3000/home)
- Login & Signup tabs in register page (http://localhost:3000/auth)
- Scrollable stock cards highlighting key data regarding various stocks in user's profile

- Stock Detail View (http://localhost:3000/home/stock) or select *Portfolio* in sidebar.
    - Current stock price and price changes
    - Graph of past stock prices over 2 week period
    - Table of stock data
    - Quick order form
    - News module regarding company
    - All information changes based on stock selected from the stock card bar (try selecting Tesla)

- Order Detail View (http://localhost:3000/home/order) or select *Orders* in sidebar.
    - Order forms for buying/selling shares
    - Fund transaction forms for withdrawing/depositing
    - History of past transactions

- More coming soon


### Client Structure
This is a hierachal representation of the application and various components.
The JSX components mentioned can be found in the ``/client/src/`` directory.
(Note, please fullscreen so the diagram does not clip)

```
.
├── App.js ------------------------------------ (root JSX component)
└── App.less ---------------------------------- (stylesheet, CSS but with access to defined variables)
    |
    ├── components/
    |   |
    │   ├── authlayout/
    │   │   ├── AuthLayout.js ----------------- (login & signup layout page)
    │   │   └── AuthForm.js ------------------- (login & signup forms)
    |   |
    │   └── homelayout/
    │       ├── HomeLayout.js ----------------- (main page layout for app)
    |       |
    │       ├── sidebar/
    │       │   ├── Sidebar.js ---------------- (sidebar with app title)
    │       │   ├── Links.js ------------------ (navigation links for app)
    │       │   └── Profile.js ---------------- (avatar and user details)
    |       |
    │       ├── stockbar/
    │       │   ├── Stockbar.js --------------- (scrollable view with array of stocks from portfolio)
    │       │   └── Stockcard.js -------------- (individual stock card with details regarding share price and change %)
    |       |
    │       └── views/
    │           ├── orderview/
    │           │   ├── OrderView.js ---------- (layout for stock order & fund management)
    │           │   ├── OrderForm.js ---------- (form for buying/selling stocks)
    │           │   ├── OrderFunds.js --------- (form for withdraw/deposit funds)
    │           │   └── OrderHistory.js ------- (timeline of transactions)
    |           |
    │           └── stockview/
    │               ├── StockView.js ---------- (layout for selected stock details)
    │               ├── StockHeader.js -------- (stock ticker, price, price change, % change details)
    │               ├── StockGraph.js --------- (graph of past 2 weeks share price)
    │               ├── StockStats.js --------- (table of data regarding stock open, ask, bid, volume, etc)
    │               ├── StockOrder.js --------- (simple form for quick stock orders)
    │               └── StockNews.js ---------- (list view of news headlines related to company)
    |    
    ├── routers/
    │   ├── AppRouter.js ---------------------- (URLs mapped to root layouts, either Home or Auth layout)
    │   └── ViewRouter.js --------------------- (URLS mapped to home views, either stock or order views)
    |    
    └── store/providers/
        ├── CoreProvider.js ------------------- (used for state regarding stocks, ex. selected stock index, stock array data)
        └── Provider.js ----------------------- (used for global state managment)
```