import React, { useContext } from 'react';
import { CoreContext } from '../../../store/providers/CoreProvider';

import { Tag, Dropdown, Menu } from 'antd';

function Ordercard({props: {order, index}}) {
    const { cancelOrder } = useContext(CoreContext)

    const renderStatus = () => {
        if(order.failed) return <Tag color="red">Failed</Tag>
        if(order.completed) return <Tag color="green">Completed</Tag>        
        return <Tag color="blue">Processing</Tag>
    }

    const renderMenu = () => (
        <Menu>
            <Menu.ItemGroup title="Order Options">                
                <Menu.Item
                    onClick={() => cancelOrder({orderID: order.id})}
                >
                    Cancel Order
                </Menu.Item>
            </Menu.ItemGroup>
        </Menu>
    )

    return (
        <Dropdown
            arrow
            disabled={order.completed}
            trigger={['contextMenu']}
            overlay={renderMenu()}
        >
            <div className="stockcard">            
                <p className=""><b>{order.stock.ticker}</b> x {order.quantity}</p>
                <p>{order.action === 'buy'? "Buy" : "Sell"} @ {order.price ? '$' + order.price/100 : "market"}</p>
                {renderStatus()}
            </div>
        </Dropdown>
    );
}

export default Ordercard;