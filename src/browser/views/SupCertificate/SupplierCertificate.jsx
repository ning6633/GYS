import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SupplierInfoCertificate from "./components/SupplierInfoCertificate";

class SupplierCertificate extends Component {
    render() {
        return (
            <Layout title={"供应商资质信息"}>
                <SupplierInfoCertificate />
            </Layout>
        )
    }
}

SupplierCertificate.propTypes = {
}
export default SupplierCertificate;