import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SupDisciplinaryManager from "./components/SupDisciplinaryManager"
class SupDisciplinary extends Component {
    
    render() {
        return (
            <Layout title={"奖惩记录"}>
                <SupDisciplinaryManager />
            </Layout>
        )
    }
}

SupDisciplinary.propTypes = {
}
export default SupDisciplinary;