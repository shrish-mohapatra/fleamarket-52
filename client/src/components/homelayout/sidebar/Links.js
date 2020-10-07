import React from 'react';
import { NavLink } from 'react-router-dom'
import { Menu } from "antd"

import {
    DashboardOutlined,
    AreaChartOutlined,
    LogoutOutlined
} from '@ant-design/icons';

function Links() {
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

            <Menu.Item key='orders' icon={<AreaChartOutlined/>}>
                Orders
                <NavLink to='/home/order'/>
            </Menu.Item>

            <Menu.Item key='logout' icon={<LogoutOutlined/>}>
                Logout
                <NavLink to='/auth'/>
            </Menu.Item>
        </Menu>
    );
}

export default Links;