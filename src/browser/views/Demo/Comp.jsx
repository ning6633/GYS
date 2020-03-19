import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {todoListAction} from "../../actions"
@inject("todoStore")
@observer
class Home extends Component {
    render() {
        let {todoStore,match} = this.props;
        return (
            <div>
                <p>当前页面的path为：{match.path}</p>
                <p>当前页面的参数为：{match.params.id}</p>
                <p>此页面为嵌套路由界面  点击下面按钮可以获取后台数据</p>
                <button onClick={()=>{
                    todoListAction.addtodoList();
                }}>点击获取数据</button>
                <ul>
                    {todoStore.todoList.map((val,idx)=>{
                        return (
                            <li key={idx}>{val}</li>
                        )
                    })}
                </ul>
                <button onClick={()=>{
                    todoListAction.addCount();
                }}>点击每秒加一{todoStore.count}</button>
            </div>
        )
    }
}

export default  Home ;