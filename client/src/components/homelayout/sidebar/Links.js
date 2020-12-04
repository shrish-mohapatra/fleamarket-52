import React, {useContext, useEffect, useState} from 'react';
import { useHistory, useLocation, NavLink, } from 'react-router-dom'
import { Menu } from "antd"

import {
    DashboardOutlined,
    WalletOutlined,
    AreaChartOutlined,
    LogoutOutlined,
} from '@ant-design/icons';

import { AuthContext } from '../../../store/providers/AuthProvider';
import { CoreContext } from '../../../store/providers/CoreProvider';

function Links() {
    const history = useHistory();
    const location = useLocation();
    
    const [curSelect, setCurSelect] = useState('dash-all');

    const { logout } = useContext(AuthContext); 
    const { setStockFilters, setWatchlistID, deleteWatchlist, user } = useContext(CoreContext);

    useEffect(() => {
        if(user.data) {
            if(curSelect === 'dash-portfolio') filterByPortfolio();
            if(curSelect.includes('watchlist')) {
                let index = curSelect.split('-')[1]
                if(!user.data.user.watchlists[index]) return;
                let tickers = user.data.user.watchlists[index].tickers
                setStockFilters(tickers)
            }
        }
    }, [user, curSelect, setStockFilters])

    const navToDash = () => {
        const { pathname } = location
        if(pathname === "/home" || pathname === "/home/stock") return
        history.push('/home/stock')
    }

    const removeWatchlist = (watchlistID) => { 
        deleteWatchlist({watchlistID})
    }

    // Stock filters
    const filterByPortfolio = () => {
        setWatchlistID(null);

        if(user.data) {
            const {portfolio} = user.data.user.accounts[0]
            let filters = []

            for(let i=0; i<portfolio.length; i++) {
                filters.push(portfolio[i].ticker);
            }

            setStockFilters(filters)
        }
    }

    const filterByWatchlist = (watchlist) => {
        setStockFilters(watchlist.tickers);
        setWatchlistID(watchlist.id);
    }

    // Render methods
    const renderSubmenu = () => (
        <Menu.SubMenu key='dashboard' title='Dashboard' icon={<DashboardOutlined/>} onClick={navToDash}>
            <Menu.Item key='dash-all' onClick={() => {
                setStockFilters([-1])
                setWatchlistID(null)
            }}>
                All Stocks
            </Menu.Item>
            <Menu.Item key='dash-portfolio' onClick={filterByPortfolio}>
                My Portfolio
            </Menu.Item>            
        </Menu.SubMenu>
    )

    const renderWatchlists = () => {
        if(user.data) return (
            <Menu.SubMenu key='watchlist' title='Watchlists' icon={<WalletOutlined/>} onClick={navToDash}>
                {user.data.user.watchlists.map((watchlist, index) => (
                    <Menu.Item className="watchlist-menu" key={`watchlist-${index}`} onClick={() => filterByWatchlist(watchlist)}>
                        { watchlist.name }
                        <p className="watchlist-delete" onClick={() => removeWatchlist(watchlist.id)}>Delete</p>
                    </Menu.Item>
                ))}     
            </Menu.SubMenu>
        )
    }

    return (
        <Menu
            className="sidebar-menu"
            mode="inline"
            defaultSelectedKeys={['dash-all']}
            defaultOpenKeys={['dashboard']}
            value={curSelect}
            onSelect={(value) => setCurSelect(value.key)}            
        >
            {renderSubmenu()}
            {renderWatchlists()}

            <Menu.Item key='orders' icon={<AreaChartOutlined/>}>
                Orders
                <NavLink to='/home/order'/>
            </Menu.Item>

            <Menu.Item key='logout' icon={<LogoutOutlined/>}>
                Logout
                <NavLink to='/auth' onClick={logout}/>
            </Menu.Item>
        </Menu>
    );
}

export default Links;