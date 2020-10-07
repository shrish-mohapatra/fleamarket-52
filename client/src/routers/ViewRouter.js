import React from 'react'
import {Route, Switch} from 'react-router-dom'

import StockView from '../components/homelayout/views/stockview/StockView'
import OrderView from '../components/homelayout/views/orderview/OrderView'

const ViewRouter = (props) => (
    <Switch>
        <Route exact path="/" component={StockView}/>
        <Route exact path="/home" component={StockView}/>
        <Route path="/home/stock" component={StockView}/>
        <Route path="/home/order" component={OrderView}/>
    </Switch>
)

export default ViewRouter