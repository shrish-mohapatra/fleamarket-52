const graphql = require('graphql')

// MongoDB Models
const User = require('../models/user.model')
const Account = require('../models/account.model')

// GraphQL Types
const types = require('./types')

// Resolvers
const authResolver = require('../resolvers/auth.resolve')

const {
    GraphQLObjectType,
    GraphQLString,
} = graphql;

module.exports = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // Auth Mutations
        signup: {
            type: types.AuthDataType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parent, args) {
                return authResolver.signup(args)
            }
        },
    }
})