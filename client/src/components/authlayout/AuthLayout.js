import React from 'react'
import {Row, Col, Tabs} from 'antd'
import AuthForm from './AuthForm'
// import RegisterForm from './RegisterForm'

const { TabPane } = Tabs

function RegisterLayout() {
    return (
        <div>
            <div className="register-bg"/>
            <Row
                className="register-page"
                align="middle"
                justify="center"
            >
                <Col md={12} xs={24}>
                    <div className="register-card">
                        <div style={{width: '100%'}}>
                            <h1 className="register-title">fleamarket 52</h1>

                            <Tabs>
                                <TabPane tab="Login" key="login">
                                    <AuthForm formType="login"/>
                                </TabPane>
                                <TabPane tab="Signup" key="signup">
                                    <AuthForm formType="signup"/>
                                </TabPane>
                            </Tabs>

                            <p className="register-footer">
                                Developed by Shrish Mohapatra for COMP 2406
                            </p>
                        </div>
                    </div>
                </Col>

                <Col md={12} xs={0}/>
                
            </Row>
        </div>
    )
}

export default RegisterLayout