import React, { useContext } from 'react';
import { CoreContext } from '../../../../store/providers/CoreProvider';
import { Row, Col, Card } from 'antd'

import StockHeader from './StockHeader';
import StockGraph from './StockGraph';
import StockStats from './StockStats';
import StockOrder from './StockOrder';
import StockNews from './StockNews';

function StockView() {
    const {stockRef, stocks} = useContext(CoreContext)

    return (
        <div>
            <Row gutter={16}>
                <Col xs={24} lg={18}>                   
                    <Card className="stockview-card">
                        <StockHeader stock={stocks[stockRef]}/>
                        <StockGraph stock={stocks[stockRef]}/>
                    </Card>
                    
                    <StockStats stock={stocks[stockRef]}/>
                </Col>

                <Col xs={24} lg={6}>
                    <Card className="stockview-card" title="Order">
                        <StockOrder stock={stocks[stockRef]}/>
                    </Card>

                    <Card className="stockview-card" title="News">
                        <StockNews stock={stocks[stockRef]}/>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default StockView;