import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SupplierInfoApproval from "./components/SupplierInfoApproval";

class SupplierApproval extends Component {
    render() {
        return (
            <Layout title={"供应商基本信息"}>
                <SupplierInfoApproval />
            </Layout>
        )
    }
}

SupplierApproval.propTypes = {
}
export default SupplierApproval;