import React, { useState } from 'react';
import { Timeline } from 'antd'

function OrderHistory() {
    const [orders] = useState([
        {
            action: 'deposit',
            description: 'Deposited $2500.00'
        },
        {
            action: 'buy',
            description: 'Bought 4 shares of TSLA @ $410.31 each'
        },
        {
            action: 'buy',
            description: 'Bought 3 shares of AAPL @ $119.41 each'
        },
        {
            action: 'withdraw',
            description: 'Withdrew $2000.00'
        },        
        {
            action: 'sell',
            description: 'Sold 2 shares of GOOGL @ $1190.41 each'
        },
        {
            action: 'deposit',
            description: 'Deposited $2500.00'
        },
        {
            action: 'buy',
            description: 'Bought 4 shares of TSLA @ $410.31 each'
        },
        {
            action: 'buy',
            description: 'Bought 3 shares of AAPL @ $119.41 each'
        },
        {
            action: 'withdraw',
            description: 'Withdrew $2000.00'
        },        
        {
            action: 'sell',
            description: 'Sold 2 shares of GOOGL @ $1190.41 each'
        },
        {
            action: 'deposit',
            description: 'Deposited $2500.00'
        },
        {
            action: 'buy',
            description: 'Bought 4 shares of TSLA @ $410.31 each'
        },
        {
            action: 'buy',
            description: 'Bought 3 shares of AAPL @ $119.41 each'
        },
    ])

    const renderOrder = (order, index) => {
        const colors = {withdraw: 'gray', deposit: '#40A9FF', buy: 'green', sell: 'red'}

        return (
            <Timeline.Item key={`transaction-${index}`} color={colors[order.action]} id={index}>
                {order.description}
            </Timeline.Item>
        )
    }
    
    return (
        <Timeline>
            {orders.map((order, index) => renderOrder(order, index))}
        </Timeline>
    );
}

export default OrderHistory;