import React, { Component } from 'react';
import Example from '../../components/Demo/Example';

import RouteWithSubRoutes from "../../components/RouteWithSubRoutes";
class Demo extends Component {
    state = {
        name:"asp"
    }
    changeusername(){
        this.setState({
            name:"lzy"
        })
    }
    render() {
        let { routes } = this.props;
        return (
            <div>
                <p>react 示例代码</p>
                <Example name={this.state.name} changeun={()=>{this.changeusername()}}/>
                {routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)}
            </div>
        )
    }
}

export default Demo;