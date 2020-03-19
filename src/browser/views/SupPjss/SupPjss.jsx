import React, {Component} from 'react';
import {
    Link, withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SupZzssList from "./components/SupZzssList";

class SupPjss extends Component {
    render() {
        return (
            <Layout title={"准入认定实施"}>
                <SupZzssList/>
            </Layout>
        )
    }
}

SupPjss.propTypes = {}
export default SupPjss;