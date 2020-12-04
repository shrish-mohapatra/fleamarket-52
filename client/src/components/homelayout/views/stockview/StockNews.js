import React from 'react';
import { Button } from 'antd';

const moment = require("moment");

function StockNews({stock}) {

    return (
        <div className="stockview-news">
            {stock.articles.map((article, index) => (
                <div className="news-card" key={`stockview-${index}`}>
                    <p>{article.title.slice(0, Math.min(article.title.length, 85))}</p>

                    <div className="news-meta">
                        <p>{article.author}</p>
                        <p>{moment(article.date).format("MMM Do YYYY")}</p>
                    </div>
                </div>
            ))}

            <Button style={{width: '100%'}}>Search Again</Button>
        </div>
    );
}

export default StockNews;