import React, { useState, createContext, useContext, useEffect } from 'react';
import { AuthContext } from './AuthProvider';
import { useQuery, useMutation } from '@apollo/client';
import actions from '../actions/CoreActions'

import {notification} from 'antd'

export const CoreContext = createContext({
    user: null,
    showPortfolio: true,
    stockRef: 0,
    stocks: [],
    stockData: [],
})

export const CoreProvider = ({children}) => {
    const { userID } = useContext(AuthContext);
     
    const user = useQuery(actions.getUser, {variables: { userID }})
    const stocks = useQuery(actions.getStocks)
    const dayOffset = useQuery(actions.getDayOffset)

    const [createOrder] = useMutation(actions.createOrder)
    const [cancelOrder] = useMutation(actions.cancelOrder)
    const [changeBalance] = useMutation(actions.changeBalance)
    const [editDayOffset] = useMutation(actions.editDayOffset)

    useEffect(() => {
        if(stocks.error && userID) {
            notification['error']({
                message: 'Authentication Error',
                description: "Your session has expired, please sign in again."
            })
        }
    }, [stocks.error, userID])

    useEffect(() => {
        if(userID !== "") {
            user.startPolling(2000)
        } else {
            user.stopPolling()
        }
    }, [userID, user])

    useEffect(() => {
        if(userID !== "") {
            stocks.startPolling(1000)
        } else {
            stocks.stopPolling()
        }
    }, [userID, stocks])

    useEffect(() => {
        if(userID !== "") {
            dayOffset.startPolling(1000)
        } else {
            dayOffset.stopPolling()
        }
    }, [userID, dayOffset])

    const [stockRef, setstockRef] = useState(0);
    const [showPortfolio, setShowPortfolio] = useState(true);

    return (
        <CoreContext.Provider
            value={{
                user,
                dayOffset,
                stockRef,
                stocks,
                showPortfolio,

                selectStock: (index) => {
                    setstockRef(index);
                },

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
                            description: 'Something went wrong, order could not be created.'
                        })
                    }
                },

                cancelOrder: async (args) => {                   
                    try {
                        await cancelOrder({variables: args})

                        notification['info']({
                            message: 'Order Status',
                            description: `Your order for has been cancelled.`
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

                setShowPortfolio,
            }}
        >
            {children}
        </CoreContext.Provider>
    );
}