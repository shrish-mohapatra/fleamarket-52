import React, { useContext } from 'react';
import { CoreContext } from '../../../store/providers/CoreProvider';

function Stockcard({props: {stock, index}}) {
    const {selectStock, stockRef} = useContext(CoreContext);

    const getCardClass = () => {
        if(index === stockRef) {
            return 'stockcard-selected'
        } else {
            return 'stockcard'
        }
    }

    const renderChange = (change) => {
        const color = (change > 0) ? 'green' : 'red';
        const prefix = (change > 0) ? '+' : '-';
        const label = prefix + Math.abs(change);

        return (
            <p
                className="stockcard-change"
                style={{color: color}}
            >
                {label}%
            </p>
        )
    }

    return (
        <div className={getCardClass()} id={index} onClick={() => selectStock(index)}>
            <p className="stockcard-ticker">{stock.ticker}</p>
            {renderChange(stock.change)}
            <p className="stockcard-price">${stock.price} x {stock.shares}</p>
        </div>
    );
}

export default Stockcard;