import React from 'react';
import { Descriptions } from 'antd';

const { Item } = Descriptions;

const stats = ['open', 'ask', 'bid', 'high', 'low', 'volume']

function StockStats({stock}) {

    return (
        <Descriptions className="stockview-stats" layout="vertical" bordered>
            {stats.map((stat, index) => (
                <Item
                    label={stat.charAt(0).toUpperCase() + stat.slice(1)}
                    key={`desc-item-${index}`}
                >
                    {stock[stat] ? ((stat == "volume") ? stock[stat] : stock[stat]/100) : 'N/A'}
                </Item>
            ))}
        </Descriptions>
    );
}

export default StockStats;