import React, { useContext, useEffect } from 'react';
import { Layout } from 'antd'

import Sidebar from './sidebar/Sidebar';
import Stockbar from './stockbar/Stockbar';
import ViewRouter from '../../routers/ViewRouter'

import { AuthContext } from '../../store/providers/AuthProvider';
import { Redirect } from 'react-router-dom';

function HomeLayout() {
    const { token, local_auth } = useContext(AuthContext);

    useEffect(() => {
        local_auth()
    }, [])

    const renderLayout = () => (
        <Layout className="home-layout">
            <Sidebar/>
            <Stockbar/>

            <Layout className="view-layout">
                <ViewRouter/>
            </Layout>
        </Layout>
    )

    return (
        <div>
            {token ? renderLayout() : <Redirect to="/auth"/>}
        </div>
    );
}

export default HomeLayout;