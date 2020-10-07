import React from 'react';
import { Row, Col, Card } from 'antd'
import OrderHistory from './OrderHistory';
import OrderForm from './OrderForm';
import OrderFunds from './OrderFunds';


function OrderView() {
    return (
        <div>
            <Row gutter={16}>
                <Col xs={24} lg={18}>                   
                    <Card className="stockview-card" title="Order">
                        <OrderForm/>
                    </Card>
                    
                    <Card className="stockview-card" title="Manage Funds">
                        <OrderFunds/>
                    </Card>
                </Col>

                <Col xs={24} lg={6}>
                    <Card className="stockview-card" title="History">
                        <OrderHistory/>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default OrderView;