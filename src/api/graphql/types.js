const graphql = require('graphql');

// MongoDB Models
const User = require("../models/user.model");
const Account = require("../models/account.model");
const Stock = require("../models/stock.model");
const Order = require("../models/order.model");

// Resolvers
const stockResolver = require('../resolvers/stock.resolve')
const { getPortfolio } = require('../resolvers/account.resolve')

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
        }
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
        balance: { type: GraphQLString },
        type: { type: GraphQLString },

        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userID)
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
                return getPortfolio({ accountID: parent.id })
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
        shares: { type: GraphQLString },

        price: {
            type: GraphQLString,
            resolve(parent, args) {
                return stockResolver.getStockPrice({
                    stockID: parent._id
                })
            }
        },

        ask: {
            type: GraphQLString,
            resolve(parent, args) {
                return stockResolver.getStockAsk({
                    stockID: parent._id
                })
            }
        },

        bid: {
            type: GraphQLString,
            resolve(parent, args) {
                return stockResolver.getStockBid({
                    stockID: parent._id
                })
            }
        },
    })
})


const OrderType = new GraphQLObjectType({
    name: 'Order',
    fields: () => ({
        id: { type: GraphQLID },
        action: { type: GraphQLString },
        quantity: { type: GraphQLInt },
        price: { type: GraphQLString },
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


module.exports = {
    UserType,
    AuthDataType,

    AccountType,
    StockType,
    OrderType,
}