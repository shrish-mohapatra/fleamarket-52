import React from 'react'
import {Route, Switch} from 'react-router-dom'

import HomeLayout from '../components/homelayout/HomeLayout'
import AuthLayout from '../components/authlayout/AuthLayout'

const AppRouter = (props) => (
    <Switch>
        <Route exact path="/" component={HomeLayout}/>
        <Route exact path="/auth" component={AuthLayout}/>
        <Route path="/home" component={HomeLayout}/>
    </Switch>
)

export default AppRouter