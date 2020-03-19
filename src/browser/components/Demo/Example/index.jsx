import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import { number, bool, string, array, object } from 'prop-types';
import { Button, Card, Divider } from 'antd';
// 自定义滚动条模块
import { Scrollbars } from 'react-custom-scrollbars';
import theme from "../../theme";
import LoginModel from "../LoginModel"
import './index.less';
class Example extends Component {
    state = {
        val: "1",
        param: "aaa"
    }

    render() {
        // 通过JS使路由发生跳转，需要在props上导出 history 对象
        let { name, changeun, history } = this.props;
        return (
            <div className="userinfo">
                <Card type="inner" className="example_card" title="切换主题">
                    <Button onClick={() => { theme.changeTheme("root-dark") }}>暗黑</Button><Divider type="vertical" />
                    <Button onClick={() => { theme.changeTheme("root-light") }}>亮白</Button>
                </Card>
                <Card type="inner" className="example_card" title="模态框显示隐藏">
                    <LoginModel />
                </Card>
                <Card type="inner" className="example_card" title="子组件使用父组件函数修改父组件参数">
                    <p>姓名：{name}</p>
                    <Button onClick={changeun}>改名名称</Button>
                </Card>
                <Card type="inner" className="example_card" title="实时修改页面数据示例">
                    <input type="text" onChange={(ev) => { this.setState({ val: ev.target.value }) }} />
                    <span>{this.state.val}</span>
                </Card>
                <Card type="inner" className="example_card" title="展示嵌套路由及路由跳转">
                    <p>请输入向子路由传递的参数：</p>
                    <input type="text" value={this.state.param} onChange={(ev) => { this.setState({ param: ev.target.value }) }} />
                    <br />
                    <Link to={"/demo/comp/" + this.state.param}>跳转至子路由,参数为: {this.state.param}</Link>
                </Card>
                <Card type="inner" className="example_card" title="展示通过JS控制路由跳转">
                    <Button onClick={() => { history.push('/') }}>返回主页</Button>
                    <Button onClick={() => { history.goBack() }}>后退</Button>
                    <Button onClick={() => { history.goForward() }}>前进</Button>
                    {/* <Button onClick={() => { history.go("/") }}>跳转至历史路由</Button> */}
                </Card>
                <Card type="inner" className="example_card " title="自定义滚动条">
                    <div className="custom_bar">
                        <Scrollbars
                            autoHide
                            autoHideTimeout={1000}
                            autoHideDuration={200}>
                            <ul>
                                <li>1</li>
                                <li>2</li>
                                <li>3</li>
                                <li>4</li>
                                <li>5</li>
                            </ul>
                        </Scrollbars>
                    </div>
                </Card>
                {/* <Card></Card> */}
            </div>
        )
    }
}
Example.propTypes = {
    name: string
}
export default withRouter(Example);