import React from 'react';

function StockHeader({stock}) {

    const renderChange = ({change, price}) => {
        const color = (change > 0) ? 'green' : 'red';
        const prefix = (change > 0) ? '+' : '-';        
        const labelPercent = Math.abs(change);
        const labelPrice = prefix + '$' + (labelPercent * price * 0.01).toFixed(2)

        return (
            <p
                className="stockview-change"
                style={{color: color, textAlign: 'right'}}
            >
                {labelPrice} ({labelPercent}%)
            </p>
        )
    }

    return (
        <div className="stockview-header">
            <div>
                <p className="stockview-title">{stock.name}</p>
                <p className="stockview-shares">You own {stock.shares} shares of {stock.ticker}.</p>
            </div>

            <div>
                <p className="stockview-price">${stock.price}</p>
                {renderChange(stock)}
            </div>
        </div>
    );
}

export default StockHeader;