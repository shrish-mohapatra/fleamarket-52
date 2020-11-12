import React, { useContext } from 'react';
import { CoreContext } from '../../../../store/providers/CoreProvider';

function StockHeader({stock}) {
    const { user } = useContext(CoreContext);

    const renderChange = ({change, price}) => {
        change = change/100;
        price = price/100;

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

    const renderSharesOwned = () => {
        if(user.loading) return
        const {portfolio} = user.data.user.accounts[0]

        for(let i=0; i<portfolio.length; i++) {
            if(portfolio[i].id === stock.id) return `You own ${portfolio[i].shares} shares of ${stock.ticker}`
        }

        return `You do not own any shares of ${stock.ticker}`
    }

    return (
        <div className="stockview-header">
            <div>
                <p className="stockview-title">{stock.name}</p>
                <p className="stockview-shares">{renderSharesOwned()}</p>
            </div>

            <div>
                <p className="stockview-price">${stock.price/100}</p>
                {renderChange(stock)}
            </div>
        </div>
    );
}

export default StockHeader;