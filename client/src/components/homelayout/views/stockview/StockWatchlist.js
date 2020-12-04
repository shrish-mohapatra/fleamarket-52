import React, { useContext, useEffect, useState } from 'react';
import { CoreContext } from '../../../../store/providers/CoreProvider';
import { AuthContext } from '../../../../store/providers/AuthProvider';
import { Row, Col, Select, Button, Typography, Popconfirm, Input } from 'antd';

const { Option } = Select;
const { Text } = Typography;

function StockWatchlist({stock}) {
    const { user, updateWatchlist, createWatchlist } = useContext(CoreContext);
    const { userID } = useContext(AuthContext);

    const [options, setOptions] = useState([])
    const [selected, setSelected] = useState("create");
    const [watchlistName, setWatchlistName] = useState("");

    useEffect(() => {
        if(user.data) {
            let options = [...user.data.user.watchlists]
            setWatchlistName(`New Watchlist ${options.length+1}`)

            options = options.filter(option => !option.tickers.includes(stock.ticker))
            setOptions(options)            
        }
    }, [user, stock])

    const addToWatchlist = () => {
        if(selected === "create") return

        let tickers = [...options[selected].tickers]
        tickers.push(stock.ticker)

        updateWatchlist({
            watchlistID: options[selected].id,
            tickers
        })

        setSelected("create")
    }

    const onConfirm = () => {
        let tickers = []
        tickers.push(stock.ticker)

        createWatchlist({
            userID,
            name: watchlistName,
            tickers
        })
    }

    const renderPopconfirm = () => (
        <>
            <p className="new-watchlist-title">Create new watchlist</p>
            <Input className="new-watchlist-input" value={watchlistName} onChange={e => setWatchlistName(e.target.value)}/>
        </>
    )

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
                <Popconfirm
                    title={renderPopconfirm()}
                    onConfirm={onConfirm}
                    okText="Confirm"
                    cancelText="Cancel"
                    disabled={!(selected === "create")}
                    icon={<></>}
                >
                    <Button type="primary" onClick={addToWatchlist}>Add</Button>
                </Popconfirm>
            </Col>
        </Row>
    );
}

export default StockWatchlist;