
import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SupAnnualAuditList from "./components/SupAnnualAuditList"
class SupAnnualAudit extends Component {
    render() {
        return (
            <Layout title={"供应商年度审核"}>
                <SupAnnualAuditList />
            </Layout>
        )
    }
}

SupAnnualAudit.propTypes = {
}
export default SupAnnualAudit;
