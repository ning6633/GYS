import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SupBzkuList from "./components/SupBzkuList"
class SupBzku extends Component {
    loaddata() {

    }
    render() {
        return (
            <Layout title={"供应商标准库管理"}>
                <SupBzkuList />
            </Layout>
        )
    }
}

SupBzku.propTypes = {
}
export default SupBzku;