const graphql = require('graphql')
const queries = require('./queries')
const mutations = require('./mutations')

module.exports = new graphql.GraphQLSchema({
    query: queries,
    mutation: mutations,
})