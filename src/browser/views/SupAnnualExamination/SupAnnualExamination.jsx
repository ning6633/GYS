
import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SupAnnualExaminationInfo from "./components/SupAnnualExaminationInfo"
class SupAnnualExamination extends Component {
    render() {
        return (
            <Layout title={"评价中心复审计划编制"}>
                <SupAnnualExaminationInfo />
            </Layout>
        )
    }
}

SupAnnualExamination.propTypes = {
}
export default SupAnnualExamination;