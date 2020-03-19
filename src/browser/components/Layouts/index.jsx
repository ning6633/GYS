import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Icon } from 'antd';
import ChangeRouter from "../ChangeRouter";
import './index.less';
class LayoutSup extends Component {
    state = {
        collapsed: false,
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    render() {
        const { title, children } = this.props
        return (
            <div className="layout-supplier">
                <Card bordered={false} title={<div><Icon type="pic-right" />  <b>{title}</b><ChangeRouter/></div>}>
                    {children}
                </Card>
            </div>
        );
    }
}
LayoutSup.propTypes = {
    title: string
}
export default withRouter(LayoutSup);