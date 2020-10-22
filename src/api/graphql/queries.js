const graphql = require('graphql')

// MongoDB Models
const User = require('../models/user.model')
const Account = require('../models/account.model')

// GraphQL Types
const types = require('./types')

// Resolvers
const authResolver = require('../resolvers/auth.resolve')
const stockResolver = require('../resolvers/stock.resolve')

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLList,
} = graphql;

module.exports = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // Auth Queries
        signin: {
            type: types.AuthDataType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parent, args) {
                return authResolver.signin(args)
            }
        },

        // Stock Queries
        stocks: {
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
            args: { id: { type: GraphQLID } },
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
    }
})