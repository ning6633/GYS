import React, { Component } from 'react';
import Intro from "../../components/Demo/Intro";
import Article from "../../components/Demo/Article";
class Home extends Component {
    render() {
        return (
            <div>
                <Intro title={"当前是父组件传入参数"} anthor={"aaaa"} />
                <p>此页面演示了react的基本使用介绍</p>
                <Article/>
                <pre>
                    {`
1. react 中 this 指向问题 （箭头函数的使用）
2. react 组件 生命周期示例
3. state 与 setState （如何使用组件状态）
4. class 名称 （原因）
5. 行间样式写法 （原因）
6. 组件如何绑定事件
7. 如何实现兄弟组件 参数传递 （组件通讯）
8. 如何实现兄弟组件 参数传递 （MOBX）* 
9. props 校验
10. ajax 请求 （axios）
11. 获取当前路由 path
12. 路由嵌套 
13. 路由传参
14. 通过 JS 做路由跳转 （react-route4.0）
15. 父子组件传参
16. 无关联组件传参（可以以跟路由做区别）
`}
                </pre>
               
            </div>
        )
    }
}

export default Home;