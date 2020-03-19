import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SupZrrdList from "./components/SupZrrdList"
class SupZrrd extends Component {
    loaddata() {

    }
    render() {
        return (
            <Layout title={"供应商准入认定"}>
                <SupZrrdList />
            </Layout>
        )
    }
}

SupZrrd.propTypes = {
}
export default SupZrrd;