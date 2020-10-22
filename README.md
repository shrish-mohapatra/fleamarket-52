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


## Project Breakdown

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


### App Structure
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