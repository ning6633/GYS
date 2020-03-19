import React, { Component } from 'react';
import { Row,Col,Form, Icon, Input, Button, Checkbox } from 'antd';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import './index.less'

class Login extends Component{
    constructor(props){
        super(props)

    }
    handleSubmit = e => {
        e.preventDefault();
        const { history } = this.props;
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            history.push('/supplier')
          }
        });
      };
    render(){
        const { getFieldDecorator } = this.props.form;
        return(
            <div className="login_layout">
               <div className="dialog">
               </div>
             
               <Row>
               <Col span={12} className="intro_container"> 
                    <div className="content">
                        <div className="intro-title">
                               供应商管理系统
                        </div>
                        <div className="intro-description">
                        运营与管控一体化的整合式服务平台

                  
                        </div>
                    </div>
               </Col>
               <Col span={12} className="login_zone">
                     <div className="login_box">
                     <h4 className="login_title">
                               登录
                     </h4>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入用户名' }],
                            })(
                                <Input
                                size="large"
                                prefix={<Icon type="user"  style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="用户名"
                                />,
                            )}
                            </Form.Item>
                            <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码' }],
                            })(
                                <Input
                                size="large"
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                                />,
                            )}
                            </Form.Item>
                            <Form.Item>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(<Checkbox>记住账号</Checkbox>)}
                            <Button type="primary" block  htmlType="submit" className="login-form-button login-button">
                               登录
                            </Button>
                         
                            </Form.Item>
                        </Form>
                      </div>
                </Col>
               </Row>
              
            </div>
        )
    }

}
const LoginForm = Form.create({ name: 'normal_login' })(Login);
export default LoginForm