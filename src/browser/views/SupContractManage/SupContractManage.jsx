import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SupContractManageList from "./components/SupContractManageList"
class SupContractManage extends Component {
    loaddata() {

    }
    render() {
        return (
            <Layout title={"供应商合同管理"}>
                <SupContractManageList />
            </Layout>
        )
    }
}

SupContractManage.propTypes = {
}
export default SupContractManage;