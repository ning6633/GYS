import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SupRecommendManager from "./components/SupRecommendManager";

class SupRecommend extends Component {
    loaddata() {

    }
    render() {
        return (
            <Layout title={"供应商推荐管理"}>
                <SupRecommendManager />
            </Layout>
        )
    }
}

SupRecommend.propTypes = {
}
export default SupRecommend;