import React, {useEffect, useState} from 'react';
import { Button } from 'antd';

function StockNews({stock}) {
    const [news, setNews] = useState([]);

    useEffect(() => {
        let testNews = [
            {
                headline: `${stock.name} declares 4:1 stock split...`,
                author: 'The Verge',
                date: 'Oct 1'
            },
            {
                headline: `${stock.name} slumps at keynote event...`,
                author: 'Wall Street Journal',
                date: 'Oct 3'
            },
            {
                headline: `Big investor sells ${stock.name} shares...`,
                author: 'The Verge',
                date: 'Oct 3'
            },
            {
                headline: `${stock.name} announces new CEO amid...`,
                author: 'New York Times',
                date: 'Oct 4'
            },
            {
                headline: `${stock.name} underfire for insider trading...`,
                author: 'The Verge',
                date: 'Oct 5'
            },
            {
                headline: `${stock.name} bounces back from slump...`,
                author: 'The Verge',
                date: 'Oct 5'
            },
            {
                headline: `${stock.name} announces new device...`,
                author: 'The Verge',
                date: 'Oct 7'
            },
        ]

        setNews(testNews);
    }, [stock])

    return (
        <div className="stockview-news">
            {news.reverse().map((news, index) => (
                <div className="news-card" key={`stockview-${index}`}>
                    <p>{news.headline}</p>

                    <div className="news-meta">
                        <p>{news.author}</p>
                        <p>{news.date}</p>
                    </div>
                </div>
            ))}

            <Button style={{width: '100%'}}>View More</Button>
        </div>
    );
}

export default StockNews;