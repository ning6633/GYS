import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import Layout from "../../components/Layouts";
import { Card, Icon, Select } from 'antd';
import SupEvaluationManager from "./components/SupEvaluationManager";
import SupZzssList from "./components/SupZzssList";
import SupEvaLicence from './components/SupZzpjzsList'
import SupZzpjzjList from './components/SupZzpjzjList'

const { Option } = Select
class SupEvaluation extends Component {
    state = {
        defaultValue: 'SupZzApply'
    }
    loaddata() {

    }
    handleChange(value) {
        this.setState({
            defaultValue: value
        })
    }
    render() {
        const { defaultValue } = this.state

        let EvaluationChangeRouter = () => (
            <div className="table-operations">
                <Select defaultValue={this.state.defaultValue} onChange={this.handleChange.bind(this)} style={{ width: 150, marginLeft: 20 }}>
                    <Option value="SupZzApply">资质申请</Option>
                    <Option value="SupZzssList">资质实施记录</Option>
                    <Option value="SupEvaLicence">资质评价证书</Option>
                    <Option value="SupZzpjzjList">资质评价专家管理</Option>
                </Select>
            </div>
        )
        return (
            <Layout title={"供应商评价管理"}>
               <SupEvaluationManager /> 
                {/* }
                    defaultValue == 'SupZzssList' ? <SupZzssList /> : null
                }
                {
                    defaultValue == 'SupEvaLicence' ? <SupEvaLicence /> : null
                }
                {
                    defaultValue == 'SupZzpjzjList' ? <SupZzpjzjList /> : null

                } */}
            </Layout>
        )
    }
}

SupEvaluation.propTypes = {
}
export default SupEvaluation;