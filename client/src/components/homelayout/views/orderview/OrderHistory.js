import React, { useState, useEffect, useContext } from 'react';
import { CoreContext } from '../../../../store/providers/CoreProvider';
import { Timeline, Select } from 'antd'

function OrderHistory() {
    const { user } = useContext(CoreContext)
    const [orders, setOrders] = useState([])
    const [filters, setFilters] = useState([])

    useEffect(() => {
        if(user.data) {
            let transactions = [...user.data.user.accounts[0].transactions].reverse();

            transactions = transactions.filter(t => !filters.includes(t.action))

            setOrders(transactions);
        }
    }, [user, filters])

    const renderOrder = (order, index) => {
        const colors = {withdraw: 'gray', deposit: '#40A9FF', buy: 'green', sell: 'red'}

        return (
            <Timeline.Item key={`transaction-${index}`} color={colors[order.action]} id={index}>
                {order.info}
            </Timeline.Item>
        )
    }

    const onFilterChange = (value) => {
        setFilters(value)
    }
    
    return (
        <>
            <Select
                className="order-history-filter"
                mode="multiple"
                allowClear
                placeholder="Hide actions"
                onChange={onFilterChange}
            >
                <Select.Option key='buy'>Buy</Select.Option>
                <Select.Option key='sell'>Sell</Select.Option>
                <Select.Option key='withdraw'>Withdraw</Select.Option>
                <Select.Option key='deposit'>Deposit</Select.Option>
            </Select>

            <Timeline className="order-history-timeline">
                {orders.map((order, index) => renderOrder(order, index))}
            </Timeline>
        </>
    );
}

export default OrderHistory;