
import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import SupBlackListInfo from "./components/SupBlackListInfo";

class SupBlackList extends Component {
    render() {
        return (
            <Layout title={"供应商黑名单"}>
                <SupBlackListInfo />
            </Layout>
        )
    }
}

SupBlackList.propTypes = {
}
export default SupBlackList;