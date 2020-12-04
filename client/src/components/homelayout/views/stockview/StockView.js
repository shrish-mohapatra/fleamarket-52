import React, { useContext } from 'react';
import { CoreContext } from '../../../../store/providers/CoreProvider';
import { Row, Col, Card, Skeleton } from 'antd'

import StockHeader from './StockHeader';
import StockGraph from './StockGraph';
import StockStats from './StockStats';
import StockOrder from './StockOrder';
import StockNews from './StockNews';
import StockWatchlist from './StockWatchlist';

function StockView() {
    const {stockRef, stocks} = useContext(CoreContext)

    const renderView = () => {
        if(stocks.data) {
            let data = stocks.data.stocks
            
            return (
                <Row gutter={16}>
                    <Col xs={24} lg={18}>                   
                        <Card className="stockview-card">
                            <StockHeader stock={data[stockRef]}/>
                            <StockGraph stock={data[stockRef]}/>
                        </Card>
                        
                        <StockStats stock={data[stockRef]}/>
                    </Col>

                    <Col xs={24} lg={6}>
                        <Card className="stockview-card" title="Order">
                            <StockOrder stock={data[stockRef]}/>
                        </Card>

                        <Card className="stockview-card" title="Watchlist">
                            <StockWatchlist stock={data[stockRef]}/>
                        </Card>

                        <Card className="stockview-card" title="News">
                            <StockNews stock={data[stockRef]}/>
                        </Card>
                    </Col>
                </Row>
            )
        }
    }

    return (
        <Skeleton loading={stocks.loading} active>
            {renderView()}
        </Skeleton>
    );
}

export default StockView;