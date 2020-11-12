import React, {useState, useContext, useRef } from 'react'
import { Redirect } from 'react-router-dom'

import {Form, Input, Checkbox, Button, notification} from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { AuthContext } from '../../store/providers/AuthProvider';


function AuthForm({ formType }) {
    const { login, signup, token } = useContext(AuthContext);
    const formRef = useRef();

    const onFinish = async () => {
        const formData = formRef.current.getFieldsValue()

        let result = await {'login': login, 'signup': signup}[formType](formData)

        if(result) {
            notification['error']({
                message: 'Authentication Error',
                description: result
            })
        }
    }

    const renderLogin = () => (
        <Form onFinish={onFinish} ref={formRef}>
            <Form.Item name="email" rules={[{ required: true, message: 'Please input email.'}]}>
                <Input id='email' prefix={<UserOutlined/>} placeholder="Email"/>
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: 'Please input password.'}]}>
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
        <Form onFinish={onFinish} ref={formRef}>
            <Form.Item name="email" rules={[{ required: true, message: 'Please input email.'}]}>
                <Input id='email' prefix={<UserOutlined/>} placeholder="Email"/>
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: 'Please input password.'}]}>
                <Input id='password' prefix={<LockOutlined/>} placeholder="Password" type="password"/>
            </Form.Item>

            <Form.Item name="confirm_password" rules={[{ required: true, message: 'Please confirm password.'}]}>
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

    if(token != "") {
        return <Redirect to='/home'/>
    }

    return (
        <div>
            {(formType === 'login') ? renderLogin() : renderSignup()}
        </div>
    )
}

export default AuthForm