import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SupReviewCertificateList from "./components/SupReviewCertificateList"
class SupReviewCertificate extends Component {
    loaddata() {

    }
    render() {
        return (
            <Layout title={"评价中心复审证书"}>
                <SupReviewCertificateList />
            </Layout>
        )
    }
}

SupReviewCertificate.propTypes = {
}
export default SupReviewCertificate;