import { gql } from '@apollo/client';

export default {
    getUser: gql`
        query user($userID: ID!) {
            user(id: $userID) {
                email            
                accounts{
                    id
                    balance
                    portfolio{
                        id
                        shares
                    }
                }
            }
        }`
    ,
    getStocks: gql`
        query stocks {
            stocks {
                id
                ticker
                name
                price
                change
                open
                high
                low
                ask
                bid
                data(filter: "days") {
                    date
                    ask
                    bid
                }
            }
        }`
    ,
    getStock: gql`
        query stock($stockID: ID!) {
            stock(id: $stockID) {
                data {
                    date
                    ask
                    bid
                }
            }
        }`
    ,
    createOrder: gql`
        mutation createOrder(
            $accountID: String!,
            $stockID: String!,
            $action: String!,
            $quantity: Int!,
            $price: Int,
            $expiry: String
        ) {
            createOrder(
                accountID: $accountID,
                stockID: $stockID,
                action: $action,
                quantity: $quantity,
                price: $price,
                expiry: $expiry
            ) {
                stock{
                    ticker
                }
            }
        }`
    ,
    changeBalance: gql`
        mutation changeBalance(
            $accountID: String!,
            $amount: Int!,
        ) {
            changeBalance(
                accountID: $accountID,
                amount: $amount,
            ) {
                balance
            }
        }`
    ,
}