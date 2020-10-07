import React from 'react';
import { Layout } from 'antd';
import Links from './Links';
import Profile from './Profile';

const { Sider } = Layout;

function Sidebar() {
    return (
        <Sider
            className="sidebar"
            theme="light"
            trigger={null}
        >
            <div className="sidebar-header">
                <p>fleamarket 52</p>
            </div>

            <div className="sidebar-content">
                <Links/>
                <Profile/>
            </div>
        </Sider>
    );
}

export default Sidebar;