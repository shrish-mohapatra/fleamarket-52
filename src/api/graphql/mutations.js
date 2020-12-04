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

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList
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
    }
})