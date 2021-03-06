const graphql = require('graphql');

// MongoDB Models
const User = require("../models/user.model");
const Account = require("../models/account.model");
const Stock = require("../models/stock.model");
const Order = require("../models/order.model");
const Article = require("../models/article.model");
const Transaction = require("../models/transaction.model");
const Watchlist = require("../models/watchlist.model");
const Notification = require("../models/notification.model");
const Subscription = require("../models/subscription.model");

// Resolvers
const stockResolver = require('../resolvers/stock.resolve')
const accountResolver = require('../resolvers/account.resolve')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLList,
    GraphQLBoolean
} = graphql;


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        email: { type: GraphQLString },
        password: { type: GraphQLString },

        accounts: {
            type: new GraphQLList(AccountType),
            resolve(parent, args) {
                return Account.find({ userID: parent.id })
            }
        },

        watchlists: {
            type: new GraphQLList(WatchlistType),
            resolve(parent, args) {
                return Watchlist.find({ userID: parent.id })
            }
        },

        notifications: {
            type: new GraphQLList(NotificationType),
            resolve(parent, args) {
                return Notification.find({ userID: parent.id })
            }
        },

        subscriptions: {
            type: new GraphQLList(SubscriptionType),
            resolve(parent, args) {
                return Subscription.find({ userID: parent.id })
            }
        },
    })
})


const AuthDataType = new GraphQLObjectType({
    name: 'AuthData',
    fields: () => ({
        token: { type: GraphQLString },
        userID: { type: GraphQLString },
        message: { type: GraphQLString },
    })
})


const AccountType = new GraphQLObjectType({
    name: 'Account',
    fields: () => ({
        id: { type: GraphQLID },
        balance: { type: GraphQLInt },
        type: { type: GraphQLString },

        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userID)
            }
        },
        
        transactions: {
            type: new GraphQLList(TransactionType),
            resolve(parent, args) {
                return Transaction.find({ accountID: parent.id })
            }
        },

        orders: {
            type: new GraphQLList(OrderType),
            resolve(parent, args) {
                return Order.find({ accountID: parent.id })
            }
        },

        portfolio: {
            type: new GraphQLList(StockType),
            resolve(parent, args) {
                return accountResolver.getPortfolio({ accountID: parent.id })
            }
        },

        value: {
            type: GraphQLInt,
            resolve(parent, args) {
                return accountResolver.getPortfolioValue({ accountID: parent.id })
            }
        }
    })
})


const StockType = new GraphQLObjectType({
    name: 'Stock',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        ticker: { type: GraphQLString },
        market: { type: GraphQLString },    
        shares: { type: GraphQLInt },
        avgPrice: { type: GraphQLInt },

        data: {
            type: new GraphQLList(StockDataType),
            args: {filter: { type: GraphQLString },},
            resolve(parent, args) {
                return stockResolver.getStockData({ stockID: parent.id, filter: args.filter })
            }
        },

        price: {
            type: GraphQLInt,
            resolve(parent, args) {
                return stockResolver.getStockPrice({
                    stockID: parent._id
                })
            }
        },

        change: {
            type: GraphQLInt,
            resolve(parent, args) {
                return stockResolver.getStockChange({
                    stockID: parent._id
                })
            }
        },

        open: {
            type: GraphQLInt,
            resolve(parent, args) {
                return stockResolver.getStockOpen({
                    stockID: parent._id
                })
            }
        },

        ask: {
            type: GraphQLInt,
            resolve(parent, args) {
                return stockResolver.getStockAsk({
                    stockID: parent._id
                })
            }
        },

        bid: {
            type: GraphQLInt,
            resolve(parent, args) {
                return stockResolver.getStockBid({
                    stockID: parent._id
                })
            }
        },

        high: {
            type: GraphQLInt,
            resolve(parent, args) {
                return stockResolver.getStockHigh({
                    stockID: parent._id
                })
            }
        },

        low: {
            type: GraphQLInt,
            resolve(parent, args) {
                return stockResolver.getStockLow({
                    stockID: parent._id
                })
            }
        },

        volume: {
            type: GraphQLInt,
            resolve(parent, args) {
                return stockResolver.getStockVolume({
                    stockID: parent._id
                })
            }
        },

        articles: {
            type: new GraphQLList(ArticleType),
            resolve(parent, args) {
                return Article.find({stockID: parent.id})
            }
        },
    })
})


const StockDataType = new GraphQLObjectType({
    name: 'StockData',
    fields: () => ({
        id: { type: GraphQLID },
        date: { type: GraphQLString },
        ask: { type: GraphQLInt },
        bid: {type: GraphQLInt},
        high: {type: GraphQLInt},
        low: {type: GraphQLInt},
        volume: {type: GraphQLInt},

        stock: {
            type: StockType,
            resolve(parent, args) {
                return Stock.findById(parent.stockID);
            }
        }
    })
})


const OrderType = new GraphQLObjectType({
    name: 'Order',
    fields: () => ({
        id: { type: GraphQLID },
        action: { type: GraphQLString },
        quantity: { type: GraphQLInt },
        price: { type: GraphQLInt },
        date: { type: GraphQLString },
        expiry: { type: GraphQLString },
        completed: { type: GraphQLString },
        failed: { type: GraphQLBoolean },

        account: {
            type: AccountType,
            resolve(parent, args) {
                return Account.findById(parent.accountID)
            }
        },

        stock: {
            type: StockType,
            resolve(parent, args) {
                return Stock.findById(parent.stockID)
            }
        },
    })
})


const ArticleType = new GraphQLObjectType({
    name: 'Article',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        url: { type: GraphQLString },
        author: { type: GraphQLString },
        date: { type: GraphQLString },

        stock: {
            type: StockType,
            resolve(parent, args) {
                return Stock.findById(parent.stockID)
            }
        }
    })
})


const TransactionType = new GraphQLObjectType({
    name: 'Transaction',
    fields: () => ({
        id: { type: GraphQLID },
        action: { type: GraphQLString },
        info: { type: GraphQLString },
        date: { type: GraphQLString },

        account: {
            type: AccountType,
            resolve(parent, args) {
                return Account.findById(parent.accountID)
            }
        }
    })
})


const WatchlistType = new GraphQLObjectType({
    name: 'Watchlist',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        tickers: { type: new GraphQLList(GraphQLString) },

        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userID)
            }
        }
    })
})


const NotificationType = new GraphQLObjectType({
    name: 'Notification',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        message: { type: GraphQLString },
        tag: { type: GraphQLString },

        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userID)
            }
        }
    })
})


const SubscriptionType = new GraphQLObjectType({
    name: 'Subscription',
    fields: () => ({
        id: { type: GraphQLID },
        rule: { type: GraphQLInt },
        active: { type: GraphQLBoolean },
        lastNotified: { type: GraphQLString },

        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userID)
            }
        },

        stock: {
            type: StockType,
            resolve(parent, args) {
                return Stock.findById(parent.stockID)
            }
        }
    })
})


module.exports = {
    UserType,
    AuthDataType,
    WatchlistType,

    NotificationType,
    SubscriptionType,

    AccountType,
    TransactionType,
    OrderType,    

    StockType,
    StockDataType,

    ArticleType
}