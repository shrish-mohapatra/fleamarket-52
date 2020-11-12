import React, { useContext } from 'react';
import { CoreContext } from '../../../store/providers/CoreProvider';
import { Layout, Skeleton } from 'antd';
import Stockcard from './Stockcard';

const { Sider } = Layout;

function Stockbar() {
    const { stocks, user, showPortfolio } = useContext(CoreContext);

    const inPortfolio = (stock) => {
        if(!showPortfolio) return true
        const {portfolio} = user.data.user.accounts[0]

        for(let i=0; i<portfolio.length; i++) {
            if(portfolio[i].id === stock.id) return true
        }

        return false
    }

    const renderCards = () => {
        if(stocks.data && user.data) {
            return (
                <>
                    { stocks.data.stocks.map((stock, index) => {
                        if(inPortfolio(stock)) return(<Stockcard key={`stockcard-${index}`} props={{stock, index}}/>)
                    })}
                </>
            )
        }
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