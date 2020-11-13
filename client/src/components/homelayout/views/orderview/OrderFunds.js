import React, { useContext, useRef } from 'react';
import { Row, Col, Form, Radio, InputNumber, Button } from 'antd'
import { CoreContext } from '../../../../store/providers/CoreProvider';

function OrderFunds() {
    const {changeBalance} = useContext(CoreContext);
    const formRef = useRef();

    const onFinish = (values) => {
        const mult = (!values.action || values.action === 'deposit') ? 1 : -1    
        changeBalance((mult * values.amount * 100).toFixed(0))
        formRef.current.resetFields()
    }
    
    return (
        <Form layout='vertical' onFinish={onFinish} ref={formRef}>
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
                        <InputNumber
                            id="amount"
                            className="order-action-group"
                            min={0}
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Button type="primary" htmlType="submit">Confirm Transaction</Button>
        </Form>
    );
}

export default OrderFunds;