import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SupRuKuList from "./components/SupRuKuList"
class Supruku extends Component {
    loaddata() {

    }
    render() {
        return (
            <Layout title={"供应商入库管理"}>
                <SupRuKuList />
            </Layout>
        )
    }
}

Supruku.propTypes = {
}
export default Supruku;