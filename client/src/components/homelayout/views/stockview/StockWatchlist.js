import React, { useContext, useEffect, useState } from 'react';
import { CoreContext } from '../../../../store/providers/CoreProvider';
import { AuthContext } from '../../../../store/providers/AuthProvider';
import { Select, Button, Typography, Popconfirm, Input, InputNumber, Divider } from 'antd';

const { Option } = Select;
const { Text } = Typography;

function StockWatchlist({stock}) {
    const { user, updateWatchlist, createWatchlist, createSubscription } = useContext(CoreContext);
    const { userID } = useContext(AuthContext);

    const [options, setOptions] = useState([])
    const [selected, setSelected] = useState("create");
    const [watchlistName, setWatchlistName] = useState("");
    const [rule, setRule] = useState(0);

    // Update watchlists dropdown
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
    
    const createSub = () => {
        createSubscription({
            rule,
            userID,
            stockID: stock.id
        })
        setRule(0);
    }


    // render methods
    const renderPopconfirm = () => (
        <>
            <p className="new-watchlist-title">Create new watchlist</p>
            <Input className="new-watchlist-input" value={watchlistName} onChange={e => setWatchlistName(e.target.value)}/>
        </>
    )

    const renderSubscription = () => {
        if(!user.data) return
        let subs = user.data.user.subscriptions;

        let found;
        for(let i=0; i<subs.length; i++) {
            if(subs[i].stock.id == stock.id) {
                found = true;
                break;
            }
        }

        if(found) return;
        
        return(
            <>
                <Divider/>

                <p>Subscribe for updates.</p>
                <div className="watchlist-control-div">
                    <InputNumber 
                        className="watchlist-control-select" 
                        min={0}
                        formatter={value => `${value}%`}
                        parser={value => value.replace('%', '')}
                        value={rule}
                        onChange={(value) => setRule(value)}
                    />
                    <Button type="primary" onClick={createSub}>Confirm</Button>
                </div>
                <p className="watchlist-control-help">Set a price rule ex. 5%</p>
            </>
        )
    }

    return (
        <>
            <p>Add stock to watchlist.</p>
            <div className="watchlist-control-div">
                <Select className="watchlist-control-select" value={selected} onChange={value => setSelected(value)}>
                    <Option value="create"><Text type="secondary">New Watchlist</Text></Option>
                    {options.map((option, index) => (
                        <Option key={`watchlist-option-${index}`} value={index}>{option.name}</Option>
                    ))}
                </Select>
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
            </div>           

            { renderSubscription() }
        </>
    );
}

export default StockWatchlist;