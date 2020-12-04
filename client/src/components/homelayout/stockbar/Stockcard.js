import React, { useContext } from 'react';
import { CoreContext } from '../../../store/providers/CoreProvider';
import { Menu, Dropdown } from 'antd';

function Stockcard({props: {stock, index}}) {
    const {watchlistID, user, updateWatchlist, selectStock, stockRef} = useContext(CoreContext);

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

    const renderMenu = () => (
        <Menu>
            <Menu.ItemGroup title="Watchlist Stock Options">                
                <Menu.Item
                    onClick={removeFromWatchlist}
                >
                    Remove from Watchlist
                </Menu.Item>
            </Menu.ItemGroup>
        </Menu>
    )

    const removeFromWatchlist = () => {
        if(user.data) {
            let watchlists = [...user.data.user.watchlists]
            let tickers;

            for(let i=0; i<watchlists.length; i++) {
                if(watchlists[i].id == watchlistID) {
                    tickers = [...watchlists[i].tickers]
                    break;
                }
            }

            if(!tickers) return;

            let removeIndex = tickers.indexOf(stock.ticker)
            if(removeIndex < -1) return;
            
            tickers.splice(removeIndex, 1);

            updateWatchlist({
                watchlistID,
                tickers
            })
        }
    }

    return (
        <Dropdown
            arrow
            disabled={!watchlistID}
            trigger={['contextMenu']}
            overlay={renderMenu()}
        >
            <div className={getCardClass()} onClick={() => selectStock(index)}>
                <p className="stockcard-ticker">{stock.ticker}</p>
                {renderChange(stock.change)}
                <p className="stockcard-price">${stock.price/100}{stock.shares? `x ${stock.shares}` : ''}</p>
            </div>
        </Dropdown>
    );
}

export default Stockcard;