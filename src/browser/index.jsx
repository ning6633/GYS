import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
    HashRouter as Router,
} from 'react-router-dom';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/es/locale-provider/zh_CN';
// 引入状态机管理供应商
import { Provider } from 'mobx-react';
// 引入全局样式
import "./index.less"
import * as stores from './stores';
// 引入主视图组件
import { Main } from "./views/Main";

import theme from "./theme";

class App extends Component {
    componentDidMount() {
        theme.loadLocalTheme();
    }
    render() {
        return (
            <Main />
        )
    }
}

// ================================
// 将根组件挂载到 DOM，启动！
// ================================
const MOUNT_NODE = document.getElementById('root');
//渲染组件  
//Provider为了让所有子组件都可以拿到state
ReactDOM.render(
    <LocaleProvider locale={zh_CN}><Provider {...stores}>
        <App />
    </Provider></LocaleProvider>
    ,
    MOUNT_NODE
)  
