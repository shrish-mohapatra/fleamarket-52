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
        const label = prefix + Math.abs(change/100);

        return (
            <p
                className="stockcard-change"
                style={{color: color}}
                key={`stockchange-${index}`}
            >
                {label}%
            </p>
        )
    }

    return (
        <div className={getCardClass()} onClick={() => selectStock(index)}>
            <p className="stockcard-ticker">{stock.ticker}</p>
            {renderChange(stock.change)}
            <p className="stockcard-price">${stock.price/100}</p>
        </div>
    );
}

export default Stockcard;