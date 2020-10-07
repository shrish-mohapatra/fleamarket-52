import React from 'react';
import { Descriptions } from 'antd';

const { Item } = Descriptions;

const stats = ['open', 'ask', 'bid', 'high', 'low', 'volume']

function StockStats({stock}) {

    return (
        <Descriptions className="stockview-stats" layout="vertical" bordered>
            {stats.map(stat => (
                <Item
                    label={stat.charAt(0).toUpperCase() + stat.slice(1)}
                >
                    {stock[stat] ? stock[stat] : 'N/A'}
                </Item>
            ))}
        </Descriptions>
    );
}

export default StockStats;