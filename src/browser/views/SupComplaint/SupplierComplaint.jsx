import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SupfkList from "./components/SupEnquiry"
class Supruku extends Component {
    render() {
        return (
            <Layout title={"供应商反馈管理"}>
                
            </Layout>
        )
    }
}

Supruku.propTypes = {
}
export default Supruku;