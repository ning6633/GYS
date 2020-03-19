import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SupplierInfoVerify from "./components/SupplierInfoVerify";

class supplierVerify extends Component {
    loaddata() {

    }
    render() {
        return (
            <Layout title={"供应商产品核对"}>
                <SupplierInfoVerify />
            </Layout>
        )
    }
}

supplierVerify.propTypes = {
}
export default supplierVerify;