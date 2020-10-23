import React, { useState, createContext, useContext } from 'react';
import { AuthContext } from './AuthProvider';
import actions from '../actions/CoreActions'

export const CoreContext = createContext({
    user: null,
    stockRef: 0,
    stocks: [],

    selectStock: (index) => {},
    getStocks: () => new Promise((resolve) => {}),
})

export const CoreProvider = ({children}) => {
    const { token, userID } = useContext(AuthContext);

    const [stockRef, setstockRef] = useState(0);
    const [user, setUser] = useState(null);
    const [stocks, setStocks] = useState([
        {
            ticker: 'AAPL',
            name: 'Apple Inc.',
            change: -3.34,
            price: 113.16,
            shares: 15 ,
            open: 115.75,
            ask: 113.16,
            bid: 113.12,
            high: 115.94,
            low: 108.66,
            volume: '7.8 M',
        },
        {
            ticker: 'TSLA',
            name: 'Tesla Inc.',
            change: 2.75,
            price: 413.98,
            shares: 4,
            open: 410.44,
            ask: 413.96,
            bid: 413.12,
            high: 425.94,
            low: 397.66,
            volume: '2.8 M',
        },
        {
            ticker: 'MSFT',
            name: 'Microsoft',
            change: -2.12,
            price: 205.91,
            shares: 7,
            open: 207.75,
            ask: 205.16,
            bid: 205.12,
            high: 212.94,
            low: 192.66,
            volume: '9.4 M',
        },
        {
            ticker: 'GOOGL',
            name: 'Google',
            change: +2.15,
            price: 1451.02,
            shares: 2,
            open: 1475.50,
            ask: 14751.02,
            bid: 1475.98,
            high: 1474.94,
            low: 1460.66,
            volume: '1.7 M',
        },
    ])

    return (
        <CoreContext.Provider
            value={{
                user,
                stockRef,
                stocks,

                getUser: async() => {                    
                    let result = await actions.getUser({userID});
                    if(result.message) return false                    
                    
                    setUser(result);
                },

                selectStock: (index) => {
                    setstockRef(index);
                },

                getStocks: async() => {
                    // fetch stock data from REST API server
                    setStocks([]);
                },
            }}
        >
            {children}
        </CoreContext.Provider>
    );
}