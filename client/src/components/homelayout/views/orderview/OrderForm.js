import React, { useContext, useRef, useState } from 'react';
import { Row, Col, Form, Select, Radio, InputNumber, DatePicker, Divider, Button } from 'antd'
import { CoreContext } from '../../../../store/providers/CoreProvider';

const { Option } = Select

function OrderForm() {
    const {stocks, user, createOrder} = useContext(CoreContext);
    const formRef = useRef();

    const [quantity, setQuantity] = useState(null)
    const [price, setPrice] = useState(null)
    const [editPrice, setEditPrice] = useState(false)
    
    const onFinish = () => {
        const formData = formRef.current.getFieldsValue()

        let order = {
            accountID: user.data.user.accounts[0].id,
            stockID: stocks.data.stocks[formData.symbol].id,
            action: formData.action || 'buy',
            quantity,
        }

        if(formData.priceType === 'limit') order.price = price * 100
        if(formData.goodTill) order.expiry = formData.goodTill.format()

        createOrder(order)

        formRef.current.resetFields()
        setPrice(null)
        setQuantity(null)
        setEditPrice(false)
    }

    const updatePrice = (e) => {
        const formData = formRef.current.getFieldsValue()

        if((!formData.priceType || formData.priceType === 'market')) {
            setEditPrice(false)

            const stock = stocks.data.stocks[formData.symbol]
            if(!stock) return

            const newPrice = stock.price/100
            formRef.current.setFieldsValue({
                price: newPrice
            })

            setPrice(newPrice)            
        } else if(formData.priceType === 'limit') {
            setEditPrice(true)
        }
    }

    const estimateTotal = () => {
        if(!price || !quantity) return "0.00"
        return (price * quantity).toFixed(2)
    }
    
    const renderSelect = () => {
        if(stocks.data) {
            return(
                <Select
                    id="symbol"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option['children'].toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    onChange={updatePrice}
                >
                    {stocks.data.stocks.map((stock, index) => (
                        <Option key={`symbol-option-${index}`} id={index} value={index}>
                            {stock.ticker}
                        </Option>
                    ))}
                </Select>
            )
        }
    }

    return (
        <Form layout='vertical' onFinish={onFinish} ref={formRef}>
            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item
                        label="Symbol"
                        name="symbol"
                        rules={[{ required: true, message: "Please select a symbol." }]}
                    >
                        {renderSelect()}                   
                    </Form.Item>                    
                </Col>

                <Col span={8}>
                    <Form.Item
                        label="Price Type"
                        name="priceType"
                        rules={[{ required: true, message: "Please select a price type." }]}
                    >
                        <Select id="priceType" onChange={updatePrice}>
                            <Option value="market">Market</Option>
                            <Option value="limit">Limit</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: "Please select a price." }]}
                    >
                        <InputNumber
                            id="price"
                            min={0}
                            className="order-action-group"
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            onChange={setPrice}
                            disabled={!editPrice}
                        />
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
                        rules={[{ required: true }]}
                    >
                        <InputNumber
                            id="quantity"
                            min={0}
                            className="order-action-group"
                            onChange={setQuantity}                           
                        />
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
                <p>Estimated Total</p>
                <p>${estimateTotal()}</p>
            </div>

            <Button type="primary" htmlType="submit">Confirm Order</Button>
        </Form>
    );
}

export default OrderForm;