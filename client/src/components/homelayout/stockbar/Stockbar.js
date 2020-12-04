import React, { useContext } from 'react';
import { CoreContext } from '../../../store/providers/CoreProvider';

import { Layout, Skeleton } from 'antd';
import { useLocation } from 'react-router-dom';

import Stockcard from './Stockcard';
import Ordercard from "./Ordercard";

const { Sider } = Layout;

function Stockbar() {
    const { stocks, user, stockFilters } = useContext(CoreContext);
    const location = useLocation();

    const shouldRenderStock = (stock) => {
        if(stockFilters[0] === -1) return true
        return stockFilters.includes(stock.ticker)
    }

    const renderStocks = () => {
        if(stocks.data && user.data) {
            return (
                <>
                    { stocks.data.stocks.map((stock, index) => {
                        if(shouldRenderStock(stock)) {
                            return(<Stockcard key={`stockcard-${index}`} props={{stock, index}}/>)
                        }
                        return <div key={index}/>
                    })}
                </>
            )
        }
    }

    const renderOrders = () => {
        if(user.data) {
            const orders = [...user.data.user.accounts[0].orders].reverse()
            return (
                <>
                    { orders.map((order, index) => (
                        <Ordercard key={`ordercard-${index}`} props={{order, index}}/>
                    ))}
                </>
            )
        }
    }

    const renderCards = () => {
        const { pathname } = location
        if(pathname === "/home" || pathname === "/home/stock") return renderStocks()
        return renderOrders()
    }

    return (
        <Sider
            className="stockbar"
            theme="light"
            trigger={null}
        >
            <div className="stockbar-menu">
                <Skeleton loading={stocks.loading} active>
                    {renderCards()}
                </Skeleton>
            </div>
        </Sider>
    );
}

export default Stockbar;