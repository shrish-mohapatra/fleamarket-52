import React, { useContext, useEffect, useState } from 'react';
import { CoreContext } from '../../../../store/providers/CoreProvider';
import { Row, Col, Select, Button, Typography } from 'antd';

const { Option } = Select;
const { Text } = Typography;

// TODO: create new watchlist by opening drawer/modal or smt

function StockWatchlist({stock}) {
    const { user, updateWatchlist } = useContext(CoreContext);
    const [options, setOptions] = useState([])
    const [selected, setSelected] = useState("create");

    useEffect(() => {
        if(user.data) {
            let options = [...user.data.user.watchlists]
            options = options.filter(option => !option.tickers.includes(stock.ticker))
            setOptions(options)
        }
    }, [user, stock])

    const addToWatchlist = () => {
        if(selected === "create") {
            console.log('create watchlist todo')
            return
        }

        let tickers = [...options[selected].tickers]
        tickers.push(stock.ticker)

        updateWatchlist({
            watchlistID: options[selected].id,
            tickers
        })

        setSelected("create")
    }

    return (
        <Row gutter={16}>
            <Col span={18}>
                <Select style={{width: '100%'}} value={selected} onChange={value => setSelected(value)}>
                    <Option value="create"><Text type="secondary">New Watchlist</Text></Option>
                    {options.map((option, index) => (
                        <Option key={`watchlist-option-${index}`} value={index}>{option.name}</Option>
                    ))}
                </Select>
            </Col>
            <Col span={6}>
                <Button type="primary" onClick={addToWatchlist}>Add</Button>
            </Col>
        </Row>
    );
}

export default StockWatchlist;