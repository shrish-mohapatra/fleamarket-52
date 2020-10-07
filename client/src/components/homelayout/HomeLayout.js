import React from 'react';
import { Layout } from 'antd'

import Sidebar from './sidebar/Sidebar';
import Stockbar from './stockbar/Stockbar';
import ViewRouter from '../../routers/ViewRouter'

function HomeLayout() {
    return (
        <Layout className="home-layout">
            <Sidebar/>
            <Stockbar/>

            <Layout className="view-layout">
                <ViewRouter/>
            </Layout>
        </Layout>
    );
}

export default HomeLayout;