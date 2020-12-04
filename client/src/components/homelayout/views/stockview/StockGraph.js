import React, {useState, useEffect} from 'react';
import {
    ResponsiveContainer, XAxis, YAxis, CartesianGrid,
    Tooltip, AreaChart, Area
} from 'recharts';

const moment = require('moment')

function StockGraph({stock}) {
    const [data, setData] = useState([]);

    useEffect(() => {
        const rawData = stock.data
        const result = []

        const start = Math.min(rawData.length-1, 13)

        for(let i=start; i>=1; i--) {
            result.push({
                name: moment(rawData[i].date).format('MMM Do'),
                price: rawData[i].ask/100
            })
        }

        setData(result)
    }, [stock])

    return (
        <ResponsiveContainer height={500} width="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#BA9781" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#BA9781" stopOpacity={0}/>
                    </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name" interval={1}/>
                <YAxis type="number" domain={['dataMin - 10', 'dataMax + 10']}/>
                <Tooltip/>
                <Area
                    isAnimationActive={true}
                    type="monotone"
                    dataKey="price"
                    stroke="#BA9781"
                    fillOpacity={1}
                    fill="url(#colorStock)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export default StockGraph;