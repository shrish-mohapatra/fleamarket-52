# COMP 2406: Fleamarket 52
> A stock web portfolio application where users can view stocks, place buy/sell orders, and be notified of changes.
> Developed by Shrish Mohapatra.

## Running application
1. Connect to instance with: `ssh student@134.117.133.178`
    - Password is `Fle@@20!?`
2. Run the following commands:
    ```
    cd src
    npm run cleanup          \\ Deletes all collections
    npm run setup            \\ Create stocks & initial data from symbols.txt
    npm start                \\ Runs server on port 8000
    ```
3. In another terminal create a tunnel with:
    `ssh -L 9999:localhost:8000 student@134.117.133.178`
4. Visit (http://localhost:9999) to view application.


## Features
- Signup/Login
    - Create an account or login with existing email and password
    - Recieve notifcations for invalid credentials
    - Try logging in with: {email: `test@gmail.com`, password:`password`}

- Withdraw/Deposit funds
    - Before you can buy stocks you will need funds
    - Select *Orders* from sidebar and navigate to *Manage Funds*
    - Withdraw/deposit funds, will recieve notification regarding status

- View Stocks
    - Select *Dashboard/All Stocks* from sidebar to start viewing stocks
    - Select stocks from scrollable stockbar
    - View dynamic stock price graphs for past 2 weeks
    - Stock stats such as ask, bid, open, high, low, volume~
    - Quick order (buy/sell) stocks
    - View latest news updates regarding company~

- Create Orders
    - Select *Orders* from sidebar and navigate to *Order Form*
    - Select symbol/ticker from available options
    - Select price type (market or limit)        
    - Change price if limit order
    - Select action (buy or sell)
    - Select quantity
    - Select expiry date~
    - Confirm order
    - Will recieve notifcations regarding order status~

~ features are still in progress

---

## Check-In #3 Breakdown

### Extensions
- Connected to MongoDB database
    - Created `setup` script to initalize database
    - Created `cleanup` script to delete all collections from database
    - Used *mongoose* to define schemas for various data models (ex. users, stocks)

- Used React as a frontend framework
    - Node.js server configured to render the client app
    - Use JWT for authentication (server creates token, client app stores token locally)
    - Please refer to `Client Structure` section for more information regarding React setup

- Implemented GraphQL API
    - Defined data relationships between models such as stocks and stockData
    - Linked GraphQL queries and mutations to resolver functions which manage business logic (ex. login, createOrder)
    - Used ApolloClient for React to connect to GraphQL server
    - Use "polling" to retrieve data from server every X seconds

### Design Decisions
The application has been structured in a modular manner, encouraging reusability and clear organization.

I have defined the REST API endpoints in the `/api/routes` directory which map URL paths to logic functions. This allows for a clear understanding of the interface for the REST API, and leaves out the details of the implementation.

Similarily, I have implemented GraphQL types, queries, and mutations (found in the `/api/graphql` directory) which once again only contain details of the interface and not the implementation. GraphQL also allows for a dynamic API docs which can be seen here: (http://localhost:9999/api/graph).

While the REST routes and GraphQL methods represent the API's interface, I have created *resolver* functions which include details of the implementation (can be found in the `/api/resolvers/` directory). These functions aim resolve client requests by performing the actions neccesary and returning the required data. They have been further organized based on the general features (ex. `auth.resolve.js` handles authentication logic, `order.resolve.js` handles stock order logic). Certain resolver functions could be used in other programs (ex. authentication), making this system useful.

By distinguishing between interface and implementation, I'm able to configure both REST routes and GraphQL to use the same business logic found in the resolvers.


---

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


---

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