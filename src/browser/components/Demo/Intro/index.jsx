import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import "./index.less";



class SupDirectManager extends Component {
    render() {
        let {title} = this.props;
        return (
            <div>
                <p>{title}</p>
                <p>当前项目主要依赖的项目框架版本信息为： </p>
                <pre className="intro_p">
                    {`
react : 16.4.2
react-router-dom : 4.3.1
react-router : 4.3.1
ant-design : 3.20.3
mobx : 3.6.2
mobx-react : 4.4.3

注意：以上框架使用不同版本差异很大
node_modules里 内置了 moment.js 和 lodash
`}
                </pre>
            </div>
        )
    }
}

SupDirectManager.propTypes = {
    title:string
}
export default SupDirectManager;