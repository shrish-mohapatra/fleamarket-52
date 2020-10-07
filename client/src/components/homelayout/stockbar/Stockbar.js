import React, { useContext } from 'react';
import { CoreContext } from '../../../store/providers/CoreProvider';
import { Layout } from 'antd';
import Stockcard from './Stockcard';

const { Sider } = Layout;

function Stockbar() {
    const {stocks} = useContext(CoreContext);

    return (
        <Sider
            className="stockbar"
            theme="light"
            trigger={null}
        >
            <div className="stockbar-menu">
                {
                    stocks.map((stock, index) => <Stockcard props={{stock, index}}/>)
                }
            </div>
        </Sider>
    );
}

export default Stockbar;