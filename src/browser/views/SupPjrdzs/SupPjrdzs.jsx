import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SupPjrdzsList from "./components/SupPjrdzsList"
class SupPjss extends Component {
    loaddata() {

    }
    render() {
        return (
            <Layout title={"准入认定证书"}>
                <SupPjrdzsList />
            </Layout>
        )
    }
}

SupPjss.propTypes = {
}
export default SupPjss;