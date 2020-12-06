import React, { useState, createContext, useContext, useEffect } from 'react';
import { AuthContext } from './AuthProvider';
import { useQuery, useMutation } from '@apollo/client';
import actions from '../actions/CoreActions'

import {notification} from 'antd'

export const CoreContext = createContext({
    user: null,
    stockFilters: [-1],
    watchlistID: null,
    stockRef: 0,
    stocks: [],
    stockData: [],
})

export const CoreProvider = ({children}) => {
    const { userID, logout } = useContext(AuthContext);
     
    // Queries
    const user = useQuery(actions.getUser, {variables: { userID }})
    const stocks = useQuery(actions.getStocks)
    const dayOffset = useQuery(actions.getDayOffset)

    // Mutations
    const [createOrder] = useMutation(actions.createOrder)
    const [cancelOrder] = useMutation(actions.cancelOrder)

    const [changeBalance] = useMutation(actions.changeBalance)
    const [editDayOffset] = useMutation(actions.editDayOffset)

    const [createWatchlist] = useMutation(actions.createWatchlist)
    const [deleteWatchlist] = useMutation(actions.deleteWatchlist)
    const [updateWatchlist] = useMutation(actions.updateWatchlist)

    const [createSubscription] = useMutation(actions.createSubscription)
    const [deleteSubscription] = useMutation(actions.deleteSubscription)
    const [updateSubscription] = useMutation(actions.updateSubscription)

    const [deleteNotification] = useMutation(actions.deleteNotification)

    // Context state
    const [stockRef, setstockRef] = useState(0);
    const [stockFilters, setStockFilters] = useState([-1]);
    const [watchlistID, setWatchlistID] = useState(null);

    // Session expiry
    useEffect(() => {
        if(stocks.error && userID) {
            notification['error']({
                message: 'Authentication Error',
                description: "Your session has expired, please sign in again."
            })
            //logout()
        }
    }, [stocks.error, userID])


    // User polling
    useEffect(() => {
        if(userID !== "") {
            user.startPolling(2000)
        } else {
            user.stopPolling()
        }
    }, [userID, user])

    // Stocks polling
    useEffect(() => {
        if(userID !== "") {
            stocks.startPolling(1000)
        } else {
            stocks.stopPolling()
        }
    }, [userID, stocks])

    // Dayoffset polling
    useEffect(() => {
        if(userID !== "") {
            dayOffset.startPolling(1000)
        } else {
            dayOffset.stopPolling()
        }
    }, [userID, dayOffset])

    return (
        <CoreContext.Provider
            value={{
                user,
                dayOffset,
                stockRef,
                stocks,

                stockFilters,
                setStockFilters,

                watchlistID,
                setWatchlistID,

                selectStock: (index) => {
                    setstockRef(index);
                },


                // order
                createOrder: async (args) => {                   
                    try {
                        const result = await createOrder({variables: args})

                        notification['info']({
                            message: 'Order Status',
                            description: `Your order for ${result.data.createOrder.stock.ticker} has been created.`
                        })
                    } catch(error) {
                        console.log(error.message)

                        notification['error']({
                            message: 'Order Status',
                            description: `Your order has been cancelled due to ${error.message}.`
                        })
                    }
                },

                cancelOrder: async (args) => {                   
                    try {
                        await cancelOrder({variables: args})

                        notification['info']({
                            message: 'Order Status',
                            description: `Your order has been cancelled.`
                        })
                    } catch(error) {
                        console.log(error.message)

                        notification['error']({
                            message: 'Order Status',
                            description: 'Something went wrong, order could not be cancelled.'
                        })
                    }
                },


                changeBalance: async (amount) => {
                    const args = {
                        accountID: user?.data.user.accounts[0].id,
                        amount: parseInt(amount),                        
                    }

                    try {
                        await changeBalance({variables: args})
                        notification['success']({
                            message: 'Transaction Status',
                            description: `Succesfully ${(amount<0)? "withdrew" : "deposited"} $${Math.abs(args.amount/100)}`
                        })
                    } catch(error) {
                        console.log(error.message)

                        notification['error']({
                            message: 'Transaction Status',
                            description: 'Insufficient funds.'
                        })
                    }
                },

                editDayOffset: async (days) => {
                    try {
                        await editDayOffset({variables: { days }})
                        notification['success']({
                            message: 'Changed server date.'
                        })
                    } catch(error) {
                        console.log(error.message)

                        notification['error']({
                            message: 'Unable to change server date.',
                        })
                    }
                },

                // watchlist
                createWatchlist: async (args) => {
                    try {
                        await createWatchlist({variables: args})
                        notification['success']({
                            message: 'Created watchlist.'
                        })
                    } catch(error) {
                        console.log(error.message)

                        notification['error']({
                            message: 'Unable to create watchlist.',
                        })
                    }
                },

                deleteWatchlist: async (args) => {
                    try {
                        await deleteWatchlist({variables: args})
                        notification['success']({
                            message: 'Deleted watchlist.'
                        })
                    } catch(error) {
                        console.log(error.message)

                        notification['error']({
                            message: 'Unable to delete watchlist.',
                        })
                    }
                },

                updateWatchlist: async (args) => {
                    try {
                        await updateWatchlist({variables: args})
                        notification['success']({
                            message: 'Updated watchlist.'
                        })
                    } catch(error) {
                        console.log(error.message)

                        notification['error']({
                            message: 'Unable to update watchlist.',
                        })
                    }
                },


                // subscription
                createSubscription: async (args) => {
                    try {
                        await createSubscription({variables: args})
                        notification['success']({
                            message: 'Created subscription.'
                        })
                    } catch(error) {
                        notification['error']({
                            message: error.message,
                        })
                    }
                },

                deleteSubscription: async (args, ticker) => {
                    try {
                        await deleteSubscription({variables: args})
                        notification['success']({
                            message: `Deleted ${ticker} event subscription.`
                        })
                    } catch(error) {
                        console.log(error.message)

                        notification['error']({
                            message: `Unable to delete ${ticker} event subscription.`,
                        })
                    }
                },

                updateSubscription: async (args, ticker) => {
                    try {
                        await updateSubscription({variables: args})
                        notification['success']({
                            message: `Updated ${ticker} event subscription.`
                        })
                    } catch(error) {
                        console.log(error.message)

                        notification['error']({
                            message: `Unable to update ${ticker} event subscription.`,
                        })
                    }
                },

                deleteNotification: async (args) => {
                    try {
                        await deleteNotification({variables: args})
                    } catch(error) {
                        console.log(error.message)
                        notification['error']({
                            message: 'Unable to delete notification.',
                        })
                    }
                },
            }}
        >
            {children}
        </CoreContext.Provider>
    );
}