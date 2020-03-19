import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SupArchives from "./components/ShowArchives";

class SupplierProfile extends Component {
    render() {
        return (
            <Layout title={"供应商档案信息"}>
                <SupArchives></SupArchives>
            </Layout>
        )
    }
}

SupplierProfile.propTypes = {
}
export default SupplierProfile;