import React, { Component } from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import { Drawer, Button } from 'antd'
import './index.less'

import ChangeRouter from '../changeRouter/index'
import Home from '../../view/Home/index'
import My from '../../view/My/index'
import TestOne from '../../view/TestOne/index'
import TestTwo from '../../view/TestTwo/index'
import Release from '../../view/Release/index'
import TestRedux from '../../view/TestRedux/index'


class RouterBase extends Component {
    state = {
        visible: false
    }
    config = {
        "/fe/home": "首页",
        "/fe/my": "我的",
        "/fe/test1": "Test1",
        "/fe/test2": "Test2",
        "/fe/release": "发布",
        "/fe/testredux": "redux测试",
    }
    routes = [
        {
            path: `/fe/home`,
            component: Home,
            exact: true
        },
        {
            path: `/fe/my`,
            component: My,
            exact: true
        },
        {
            path: `/fe/test1`,
            component: TestOne,
            exact: true
        },
        {
            path: `/fe/test2`,
            component: TestTwo,
            exact: true
        },
        {
            path: `/fe/release`,
            component: Release,
            exact: true
        },
        {
            path: `/fe/testredux`,
            component: TestRedux,
            exact: true
        },
    ]

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    render() {
        return (
            <div className="tab_bottom">
                <HashRouter>

                    <div className='antd_Drawer'>
                        <Button type="primary" shape="round" onClick={this.showDrawer}>
                            menu
                        </Button>
                        <Drawer
                            title="请选择"
                            placement="right"
                            closable={false}
                            onClose={this.onClose}
                            visible={this.state.visible}
                        >
                            <ChangeRouter config={this.config} onClose={this.onClose} />
                        </Drawer>
                    </div>
                    <div className='antd_container'>
                    <Switch>
                        {this.routes.map((item, index) => {
                            return <Route path={item.path} exact={item.exact} component={item.component} key={index}></Route>
                        })}
                        <Redirect path="/" to={`/fe/home`} />
                    </Switch>
                    </div>
                </HashRouter>
            </div>
        )
    }
}

export default RouterBase