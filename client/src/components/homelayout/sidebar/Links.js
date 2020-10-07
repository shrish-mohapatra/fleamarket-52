import React from 'react';
import { NavLink } from 'react-router-dom'
import { Menu } from "antd"

import {
    DashboardOutlined,
    StockOutlined,
    AreaChartOutlined,
    SettingOutlined,
    LogoutOutlined
} from '@ant-design/icons';

const { SubMenu } = Menu;

function Links() {    

    const renderWatchlists = () => (
        <SubMenu title="Watchlists" key="watchlists" icon={<StockOutlined/>}>
            <Menu.Item key='1' disabled>Technology</Menu.Item>
            <Menu.Item key='2' disabled>Energy & Mining</Menu.Item>
            <Menu.Item key='3' disabled>Food & Essentials</Menu.Item>
        </SubMenu>
    )    

    return (
        <Menu
            className="sidebar-menu"
            mode="inline"
            defaultSelectedKeys={['portfolio']}
        >
            <Menu.Item key='portfolio' icon={<DashboardOutlined/>}>
                Portfolio
                <NavLink to='/home/stock'/>
            </Menu.Item>

            {renderWatchlists()}

            <Menu.Item key='orders' icon={<AreaChartOutlined/>}>
                Orders
                <NavLink to='/home/order'/>
            </Menu.Item>

            <Menu.Item key='settings' disabled icon={<SettingOutlined/>}>
                Settings
            </Menu.Item>

            <Menu.Item key='logout' icon={<LogoutOutlined/>}>
                Logout
                <NavLink to='/auth'/>
            </Menu.Item>
        </Menu>
    );
}

export default Links;