import React, { useContext } from 'react';
import { Row, Col, Form, Select, Radio, InputNumber, DatePicker, Divider, Button } from 'antd'
import { CoreContext } from '../../../../store/providers/CoreProvider';

const { Option } = Select

function OrderForm() {
    const {stocks} = useContext(CoreContext);   

    return (
        <Form layout='vertical'>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        label="Symbol"
                        name="symbol"
                    >
                        <Select
                            id="symbol"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => option['children'].toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {stocks.map((stock, index) => (
                                <Option id={index} value={index}>
                                    {stock.ticker}
                                </Option>
                            ))}
                        </Select>                        
                    </Form.Item>                    
                </Col>

                <Col span={12}>
                    <Form.Item
                        label="Price Type"
                        name="priceType"
                    >
                        <Select id="priceType">
                            <Option value="market">Market</Option>
                            <Option value="limit">Limit</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={16}>
                    <Form.Item
                        label="Action"
                        name="action"
                    >
                        <Radio.Group id="action" defaultValue="buy" className="order-action-group">
                            <Radio.Button className="order-action-btn" value="buy">Buy</Radio.Button>
                            <Radio.Button className="order-action-btn" value="sell">Sell</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item
                        label="Quantity"
                        name="quantity"
                    >
                        <InputNumber id="quantity" className="order-action-group" min={0}/>
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                label="Good 'til"
                name="goodTill"
            >
                <DatePicker id='goodTill' className="order-action-group"/>
            </Form.Item>

            <Divider className="stockorder-divider"/>

            <div className="stockorder-form-item">
                <p>Total Cost</p>
                <p>$0.00</p>
            </div>

            <Button type="primary" htmlType="submit">Confirm Order</Button>
        </Form>
    );
}

export default OrderForm;