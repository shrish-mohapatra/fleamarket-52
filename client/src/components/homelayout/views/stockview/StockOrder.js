import React, {useContext, useState} from 'react';
import { Divider, Button, InputNumber } from 'antd';
import { CoreContext } from '../../../../store/providers/CoreProvider';

function StockOrder({stock}) {
    const { createOrder, user } = useContext(CoreContext);
    const [shares, setShares] = useState(0);

    const submitOrder = (action) => {
        if(shares === 0) return;
        
        createOrder({
            accountID: user.data.user.accounts[0].id,
            stockID: stock.id,
            action,
            quantity: shares,         
        })

        setShares(0)
    }

    return (
        <div className="stockview-order-form">
            <div className="stockorder-form-item">
                <p>Shares</p>
                <InputNumber
                    className="stockorder-input"
                    value={shares}                 
                    onChange={(e) => setShares(e)}
                    size="small"
                    min={0}
                    max={99}
                />
            </div>

            <div className="stockorder-form-item">
                <p>Market Price</p>
                <p>${stock.price/100}</p>
            </div>

            <Divider className="stockorder-divider"/>

            <div className="stockorder-form-item">
                <p>Estimated Total</p>
                <p>${(shares * stock.price/100).toFixed(2)}</p>
            </div>

            <div className="stockorder-btn-group">
                <Button className="stockorder-btn" type="primary" onClick={() => submitOrder('buy')}>Confirm Buy</Button>
                <Button className="stockorder-btn" onClick={() => submitOrder('sell')}>Confirm Sell</Button>
            </div>
        </div>
    );
}

export default StockOrder;