import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SupCleanupsManager from "./components/SupCleanupsManager"
class SupCleanups extends Component {
    
    render() {
        return (
            <Layout title={"供应商清退记录"}>
                <SupCleanupsManager />
            </Layout>
        )
    }
}

SupCleanups.propTypes = {
}
export default SupCleanups;