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
    const { userID, logout } = useContext(AuthContext);
    
    const user = useQuery(actions.getUser, {variables: { userID }, pollInterval: 0})
    const stocks = useQuery(actions.getStocks, {pollInterval: 0})
    const [createOrder] = useMutation(actions.createOrder)

    useEffect(() => {
        if(stocks.error && userID) {
            notification['error']({
                message: 'Authentication Error',
                description: "Your session has expired, please sign in again."
            })

            logout()
        }
    }, [stocks.error])

    const [stockRef, setstockRef] = useState(0);
    const [showPortfolio, setShowPortfolio] = useState(true);

    return (
        <CoreContext.Provider
            value={{
                user,
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

                setShowPortfolio,
            }}
        >
            {children}
        </CoreContext.Provider>
    );
}