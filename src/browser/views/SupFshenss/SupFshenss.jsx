import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SupFshenssList from "./components/SupFshenssList"
class SupFshenss extends Component {
    render() {
        return (
            <Layout title={"评价中心复审实施"}>
                <SupFshenssList />
            </Layout>
        )
    }
}

SupFshenss.propTypes = {
}
export default SupFshenss;