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
                        ticker
                    }
                    transactions{
                        action
                        info
                        date
                    }
                    orders{
                        id
                        stock{
                            ticker
                        }
                        action
                        quantity
                        price
                        completed
                        failed
                    }
                }
                watchlists{
                    id
                    name
                    tickers
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
                data {
                    date
                    ask
                    bid
                }
                articles {
                    title
                    url
                    author
                    date
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
    cancelOrder: gql`
        mutation cancelOrder(
            $orderID: String!,
        ) {
            cancelOrder(orderID: $orderID){
                failed
            }
        }`
    ,

    getDayOffset: gql`
        query getDayOffset {
            getDayOffset
        }`
    ,

    editDayOffset: gql`
        mutation editDayOffset(
            $days: Int!,
        ) {
            editDayOffset(days: $days)
        }`
    ,

    createWatchlist: gql`
        mutation createWatchlist(
            $userID: String!,
            $name: String!,
            $tickers: [String],
        ) {
            createWatchlist(userID: $userID, name: $name, tickers: $tickers) {
                id
            }
        }`
    ,

    deleteWatchlist: gql`
        mutation deleteWatchlist(
            $watchlistID: String!,
        ) {
            deleteWatchlist(watchlistID: $watchlistID)
        }`
    ,

    updateWatchlist: gql`
        mutation updateWatchlist(
            $watchlistID: String!,
            $tickers: [String],
        ) {
            updateWatchlist(watchlistID: $watchlistID, tickers: $tickers) {
                id
            }
        }`
    ,
}