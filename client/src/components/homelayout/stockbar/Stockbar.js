import React, { useContext, useState } from 'react';
import { CoreContext } from '../../../store/providers/CoreProvider';

import { Layout, Skeleton, Input } from 'antd';
import { useLocation } from 'react-router-dom';

import Stockcard from './Stockcard';
import Ordercard from "./Ordercard";

const { Sider } = Layout;
const { Search } = Input;

function Stockbar() {
    const { stocks, user, stockFilters } = useContext(CoreContext);
    const [search, setSearch] = useState("");
    const location = useLocation();

    const shouldRenderStock = (stock) => {
        if(search != "" && !stock.ticker.toLowerCase().includes(search.toLowerCase())) return false;

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
            <div className="stockbar-search-div">
                <Search
                    className="stockbar-search"
                    placeholder="Search stocks"
                    allowClear
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />    
            </div>

            <div className="stockbar-menu">
                <Skeleton loading={stocks.loading} active>
                    {renderCards()}
                </Skeleton>
            </div>

            
        </Sider>
    );
}

export default Stockbar;