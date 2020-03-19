import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SupPaInfo from "./components/supPaInfo"
class SupPa extends Component {
    
    render() {
        return (
            <Layout title={"一年一评"}>
                <SupPaInfo />
            </Layout>
        )
    }
}

SupPa.propTypes = {
}
export default SupPa;