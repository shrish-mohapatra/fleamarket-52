const graphql = require('graphql')

// MongoDB Models
const User = require('../models/user.model')
const Account = require('../models/account.model')
const Stock = require('../models/stock.model')

// GraphQL Types
const types = require('./types')

// Resolvers
const stockResolver = require('../resolvers/stock.resolve')
const adminResolver = require('../resolvers/admin.resolve')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
    GraphQLInt
} = graphql;

module.exports = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // Stock Queries
        stock: {
            description: "Retrieve stock from id",
            type: types.StockType,
            args: {id: { type: GraphQLID },},
            resolve(parent, args) {
                return Stock.findById(args.id)
            }
        },

        stocks: {
            description: "Retrieve stocks based on query params",
            type: new GraphQLList(types.StockType),
            args: {
                id: { type: GraphQLString },
                ticker: { type: GraphQLString },
                market: { type: GraphQLString },
            },
            resolve(parent, args) {
                return stockResolver.getStocks(args)
            }
        },

        // Test Queries
        user: {
            type: types.UserType,
            args: {id: { type: GraphQLID },},
            resolve(parent, args) {
                return User.findById(args.id)
            }
        },

        users: {
            type: new GraphQLList(types.UserType),
            resolve(parent, args) {
                return User.find({})
            }
        },

        accounts: {
            type: types.AccountType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Account.find({})
            }
        },

        // Admin queries
        getDayOffset: {
            type: GraphQLInt,
            resolve(parent, args) {
                return adminResolver.getDayOffset()
            }
        },

    }
})