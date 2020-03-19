import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SuprkglList from "./components/SuprkglList"
class Suprkgl extends Component {
    loaddata() {

    }
    render() {
        return (
            <Layout title={"新增供应商管理"}>
                <SuprkglList />
            </Layout>
        )
    }
}

Suprkgl.propTypes = {
}
export default Suprkgl;