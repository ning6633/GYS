import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SupAccessList from "./components/SupAccessList"
class SupAccess extends Component {
    loaddata() {

    }
    render() {
        return (
            <Layout title={"供应商准入认定"}>
                <SupAccessList />
            </Layout>
        )
    }
}

SupAccess.propTypes = {
}
export default SupAccess;