import React from 'react';
import { Row, Col, Form, Radio, InputNumber, Button } from 'antd'

function OrderFunds() {
    return (
        <Form layout='vertical'>
            <Row gutter={16}>
                <Col span={16}>
                    <Form.Item
                        label="Action"
                        name="action"
                    >
                        <Radio.Group id="action" defaultValue="deposit" className="order-action-group">
                            <Radio.Button className="order-action-btn" value="deposit">Deposit</Radio.Button>
                            <Radio.Button className="order-action-btn" value="withdraw">Withdraw</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item
                        label="Amount"
                        name="amount"
                    >
                        <InputNumber id="amount" className="order-action-group" min={0}/>
                    </Form.Item>
                </Col>
            </Row>

            <Button type="primary" htmlType="submit">Confirm Transaction</Button>
        </Form>
    );
}

export default OrderFunds;