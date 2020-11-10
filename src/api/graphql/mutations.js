const graphql = require('graphql')

// GraphQL Types
const types = require('./types')

// Resolvers
const { signup } = require('../resolvers/auth.resolve')
const { createOrder, cancelOrder } = require('../resolvers/order.resolve')
const { createAccount } = require('../resolvers/account.resolve')
const { createStockData } = require('../resolvers/stock.resolve')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt
} = graphql;

module.exports = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // Auth Mutations
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
            type: types.OrderType,
            args: { orderID: { type: GraphQLString } },
            resolve(parent, args) {
                return cancelOrder(args)
            }
        },

        // Stock Data Mutations
        createStockData: {
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
    }
})