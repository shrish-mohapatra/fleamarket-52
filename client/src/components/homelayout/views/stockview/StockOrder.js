import React, {useState} from 'react';
import { Divider, Button, InputNumber } from 'antd';

function StockOrder({stock}) {
    const [shares, setShares] = useState(0);

    return (
        <div className="stockview-order-form">
            <div className="stockorder-form-item">
                <p>Shares</p>
                <InputNumber
                    className="stockorder-input"                    
                    onChange={(e) => setShares(e)}
                    size="small"
                    min={0}
                    max={99}
                />
            </div>

            <div className="stockorder-form-item">
                <p>Market Price</p>
                <p>${stock.price}</p>
            </div>

            <Divider className="stockorder-divider"/>

            <div className="stockorder-form-item">
                <p>Total Cost</p>
                <p>${(shares * stock.price).toFixed(2)}</p>
            </div>

            <Button style={{width: '100%'}} type="primary">Confirm Order</Button>
        </div>
    );
}

export default StockOrder;