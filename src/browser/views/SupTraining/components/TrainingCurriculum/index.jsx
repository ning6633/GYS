import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import { observer, inject, } from 'mobx-react';
import { Row, Col, message } from "antd"
import Layout from "../../../../components/Layouts";
import SupCurrManager from "./components/SupCurrManager";
import SupCurrInfo from "./components/SupCurrInfo"
import { supplierTrain } from '../../../../actions'
import { trainStore } from '../../../../stores';


@inject('toggleStore','trainStore')
@observer
class SupplierCurriculum extends Component {
    constructor(props) {
        super(props)
        this.state = {
            managerTree: [],// 目录树
            pageNum: 1,
            rowNum: 10
        }
    }
    async getSubCoursetype() {
        // 获取目录树
        let ret = await supplierTrain.getSubCoursetype()
        if (ret.code == 200) {
            this.setState({
                managerTree: ret.data
            })
            if (ret.data.length == 0) {
                message.warning(ret.message)
            }
        } else {
            message.error(ret.message)
        }
    }
    onSelectManager = (data) => {
        // console.log(JSON.stringify(data))
        trainStore.setOneInfo(data)
        this.getcourselist(data)
    }
    async getcourselist(data) {
        let { pageNum, rowNum } = this.state
        let {trainStore} = this.props
        if (data && data.selected) {
            let res = await supplierTrain.getcourselist({ pageNum:trainStore.pageNum,coursename:trainStore.coursename, rowNum, coursetypeid: data.selectedNodes[0].props.dataRef.id })
            if (res.code == 200) {
                trainStore.setAllInfo(res.data)
            }
        }

    }
    loadInfo=(data)=>{
        this.getcourselist(data)
    }
    componentDidMount = () => {
        this.getSubCoursetype() // 获取课程目录树
    }
    render() {
        let { managerTree, oneInfo, supInfo } = this.state
        return (
            <Layout title={"供应商培训管理"}>
                <Row gutter={24}>
                    <Col className="gutter-row" span={5}>
                        <div className="gutter-box">
                            <SupCurrManager
                                managerTree={managerTree}
                                getSubCoursetype={this.getSubCoursetype.bind(this)}
                                onSelectManager={this.onSelectManager}
                            />
                        </div>
                    </Col>
                    <Col className="gutter-row" span={19}>
                        <div className="gutter-box">
                            <SupCurrInfo  loadInfo={this.loadInfo}/>
                        </div>
                    </Col>
                </Row>
            </Layout>
        )
    }
}

SupplierCurriculum.propTypes = {
}
export default SupplierCurriculum;