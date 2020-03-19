import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import SupplierInfo from "./components/SupplierInfo";
import Layout from "../../components/Layouts";

class SupplierManager extends Component {
    loaddata() {

    }
    render() {
        return (
            <Layout title={"供应商填报管理"}>
                <SupplierInfo />
            </Layout>
        )
    }
}

SupplierManager.propTypes = {
}
export default SupplierManager;