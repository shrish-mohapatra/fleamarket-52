import React, {useState, useEffect} from 'react';
import {
    ResponsiveContainer, XAxis, YAxis, CartesianGrid,
    Tooltip, AreaChart, Area
} from 'recharts';

function StockGraph({stock}) {
    const [data, setData] = useState([]);

    useEffect(() => {
        let testData = [];
        for(let i=0; i<13; i++) {
            const randomChange = (Math.random() * (stock.price * 10) * 0.01)

            testData.push({
                name: `Oct ${i+1}`,
                price: (randomChange + stock.price).toFixed(2)
            })
        }

        testData.push({name: "Oct 14", price: stock.price})

        setData(testData);
    }, [stock])

    return (
        <ResponsiveContainer height={300} width="99%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#BA9781" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#BA9781" stopOpacity={0}/>
                    </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="name"/>
                <YAxis type="number" domain={['dataMin - 10', 'dataMax + 10']}/>
                <Tooltip/>
                <Area
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