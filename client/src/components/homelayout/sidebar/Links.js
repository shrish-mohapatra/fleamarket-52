import React, {useContext} from 'react';
import { useHistory, useLocation, NavLink } from 'react-router-dom'
import { Menu } from "antd"

import {
    DashboardOutlined,
    AreaChartOutlined,
    LogoutOutlined
} from '@ant-design/icons';

import { AuthContext } from '../../../store/providers/AuthProvider';
import { CoreContext } from '../../../store/providers/CoreProvider';

function Links() {
    const history = useHistory();
    const location = useLocation();

    const { logout } = useContext(AuthContext); 
    const { setShowPortfolio } = useContext(CoreContext);

    const navToDash = () => {
        const { pathname } = location
        if(pathname === "/home" || pathname === "/home/stock") return
        history.push('/home/stock')
    }

    const renderSubmenu = () => (
        <Menu.SubMenu key='dashboard' title='Dashboard' icon={<DashboardOutlined/>} onClick={navToDash}>
            <Menu.Item key='dash-portfolio' onClick={() => setShowPortfolio(true)}>
                My Portfolio
            </Menu.Item>
            <Menu.Item key='dash-all' onClick={() => setShowPortfolio(false)}>
                All Stocks
            </Menu.Item>
        </Menu.SubMenu>
    )

    return (
        <Menu
            className="sidebar-menu"
            mode="inline"
            defaultSelectedKeys={['dash-portfolio']}
            defaultOpenKeys={['dashboard']}
        >
            {renderSubmenu()}

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