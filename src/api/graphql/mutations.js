const graphql = require('graphql')

// GraphQL Types
const types = require('./types')

// Resolvers
const { signup } = require('../resolvers/auth.resolve')
const { createOrder, cancelOrder } = require('../resolvers/order.resolve')

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

        // Order Mutations
        createOrder: {
            description: "Create stock buy/sell order",
            type: types.OrderType,
            args: {
                accountID: { type: GraphQLString },
                stockID: { type: GraphQLString },
                action: { type: GraphQLString },
                quantity: { type: GraphQLInt },
                price: { type: GraphQLString },
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
    }
})