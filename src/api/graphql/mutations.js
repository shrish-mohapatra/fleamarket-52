const graphql = require('graphql')

// GraphQL Types
const types = require('./types')

// Resolvers
const { login, signup } = require('../resolvers/auth.resolve')
const { createOrder, cancelOrder } = require('../resolvers/order.resolve')
const { createAccount, changeBalance } = require('../resolvers/account.resolve')
const { createStockData } = require('../resolvers/stock.resolve')
const { editDayOffset } = require('../resolvers/admin.resolve')
const { searchArticles } = require('../resolvers/news.resolve')
const { createWatchlist, deleteWatchlist, updateWatchlist } = require('../resolvers/watchlist.resolve')
const { deleteNotification } = require('../resolvers/notification.resolve')
const { createSubscription, updateSubscription, deleteSubscription } = require('../resolvers/subscription.resolve')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean
} = graphql;

module.exports = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // Auth Mutations
        login: {
            description: "Check if user exists in db and return auth token",
            type: types.AuthDataType,            
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parent, args) {
                return login(args)
            }
        },

        signup: {
            description: "Create new user, save to DB, and return auth token",
            type: types.AuthDataType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parent, args) {
                return signup(args)
            }
        },


        // Account Mutations
        createAccount: {
            description: "Create portfolio account",
            type: types.AccountType,
            args: {
                userID: { type: GraphQLString },
                type: { type: GraphQLString },
                balance: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return createAccount(args)
            }
        },

        changeBalance: {
            description: "Withdraw/deposit to account balance",
            type: types.AccountType,
            args: {
                accountID: { type: GraphQLString },
                amount: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return changeBalance(args)
            }
        },


        // Order Mutations
        createOrder: {
            description: "Create stock buy/sell order",
            type: types.OrderType,
            args: {
                accountID: { type: GraphQLString },
                stockID: { type: GraphQLString },
                action: { type: GraphQLString },
                quantity: { type: GraphQLInt },
                price: { type: GraphQLInt },
                expiry: { type: GraphQLString },
            },
            resolve(parent, args) {
                return createOrder(args)
            }
        },

        cancelOrder: {
            description: "Cancel stock buy/sell order",
            type: types.OrderType,
            args: { orderID: { type: GraphQLString } },
            resolve(parent, args) {
                return cancelOrder(args)
            }
        },


        // Watchlist Mutations
        createWatchlist: {
            description: "Create stock watchlist.",
            type: types.WatchlistType,
            args: {
                userID: { type: GraphQLString },
                name: { type: GraphQLString },
                tickers: { type: new GraphQLList(GraphQLString)}
            },
            resolve(parent, args) {
                return createWatchlist(args)
            }
        },

        deleteWatchlist: {
            description: "Delete stock watchlist.",
            type: GraphQLString,
            args: {
                watchlistID: { type: GraphQLString },
            },
            resolve(parent, args) {
                return deleteWatchlist(args)
            }
        },

        updateWatchlist: {
            description: "Update stock watchlist tickers.",
            type: types.WatchlistType,
            args: {
                watchlistID: { type: GraphQLString },
                tickers: { type: new GraphQLList(GraphQLString) },
            },
            resolve(parent, args) {
                return updateWatchlist(args)
            }
        },


        // Stock Data Mutations
        createStockData: {
            description: "Create stock data.",
            type: types.StockDataType,
            args: {
                stockID: { type: GraphQLString },
                ask: { type: GraphQLInt },
                bid: { type: GraphQLInt },
                date: { type: GraphQLString },
            },
            resolve(parent, args) {
                return createStockData(args)
            }
        },

        
        // News Mutations
        searchArticles: {
            description: "Search for news articles based on stock name.",
            type: new GraphQLList(types.ArticleType),
            args: {
                name: { type: GraphQLString },
            },
            resolve(parent, args) {
                return searchArticles(args);
            }
        },


        // Admin Mutations
        editDayOffset: {
            description: "Edit server date.",
            type: GraphQLString,
            args: {
                days: { type: GraphQLInt },
            },
            resolve(parent, args) {
                editDayOffset(args);
                return "Success";
            }
        },

        deleteNotification: {
            description: "Delete notification instance.",
            type: GraphQLString,
            args: {
                notificationID: { type: GraphQLString },
            },
            resolve(parent, args) {
                return deleteNotification(args);
            }
        },


        // Subscription mutations
        createSubscription: {
            description: "Create event subscription.",
            type: types.SubscriptionType,
            args: {
                userID: { type: GraphQLString },
                stockID: { type: GraphQLString },
                rule: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return createSubscription(args)
            }
        },

        deleteSubscription: {
            description: "Delete event subscription.",
            type: GraphQLString,
            args: {
                subscriptionID: { type: GraphQLString },
            },
            resolve(parent, args) {
                return deleteSubscription(args)
            }
        },

        updateSubscription: {
            description: "Update event subscription",
            type: types.SubscriptionType,
            args: {
                subscriptionID: { type: GraphQLString },
                active: { type: GraphQLBoolean },
                rule: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return updateSubscription(args)
            }
        },
    }
})