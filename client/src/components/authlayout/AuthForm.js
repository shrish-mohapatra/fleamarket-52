import React, {useState} from 'react'
import { Redirect } from 'react-router-dom'

import {Form, Input, Checkbox, Button} from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';

function AuthForm({ formType }) {
    const [isAuth, setIsAuth] = useState(false);

    const onFinish = () => {
        setIsAuth(true);
    }

    const renderLogin = () => (
        <Form onFinish={onFinish}>
            <Form.Item name="email">
                <Input id='email' prefix={<UserOutlined/>} placeholder="Email"/>
            </Form.Item>

            <Form.Item name="password">
                <Input id='password' prefix={<LockOutlined/>} placeholder="Password" type="password"/>
            </Form.Item>

            <Form.Item>
                <Form.Item style={{float: 'left'}} noStyle>
                    <Checkbox id='remember'>Remember me</Checkbox>
                </Form.Item>

                <a href="/" style={{float: 'right'}}>Forgot Password?</a>
            </Form.Item>

            <Button
                type="primary"
                htmlType="submit"
                className="register-button"
            >
                Log In
            </Button>
        </Form>
    )

    const renderSignup = () => (
        <Form onFinish={onFinish}>
            <Form.Item name="email">
                <Input id='email' prefix={<UserOutlined/>} placeholder="Email"/>
            </Form.Item>

            <Form.Item name="password">
                <Input id='password' prefix={<LockOutlined/>} placeholder="Password" type="password"/>
            </Form.Item>

            <Form.Item name="confirm_password">
                <Input id='confirm_password' prefix={<LockOutlined/>} placeholder="Confirm Password" type="password"/>
            </Form.Item>

            <Button
                type="primary"
                htmlType="submit"
                className="register-button"
            >
                Sign Up
            </Button>
        </Form>
    )

    if(isAuth) {
        return <Redirect to='/home'/>
    }

    return (
        <div>
            {(formType === 'login') ? renderLogin() : renderSignup()}
        </div>
    )
}

export default AuthForm