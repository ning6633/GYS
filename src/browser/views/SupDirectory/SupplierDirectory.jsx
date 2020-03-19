import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import {Row,Col} from "antd"
import Layout from "../../components/Layouts";
import SupplierDirectoryInfo from "./components/SupplierDirectoryInfo";
import SupDirectManager from "./components/SupDirectManager"
import { supplierDirectory } from "../../actions"

class SupplierDirectory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentDirectory: null,
            directList: [],
            categoryId:''
        }
        this.clickDirectory = this.clickDirectory.bind(this)
    }
    //通过分类Id获取名录
    async getDirectByCategoryId(categoryId) {
        if (categoryId) {
            console.log(categoryId)
            let parms = {
                categoryId: categoryId,
                pageNum: 1,
                rowNum: 20,
            }
            let result = await supplierDirectory.getDirectByCategory(parms)
            let categoryDetail = await supplierDirectory.getCategoryDetail(categoryId)
            console.log(categoryDetail)
            if (result.code == 200 && categoryDetail!=undefined) {
                this.setState({
                    directList: result.data,
                    currentDirectory: categoryDetail[0]
                })

            }
        }
    }

    async clickDirectory(data, pageNum = 1, rowNum = 20, keyword = '') {
        this.setState({
            directList: [],
        })
        console.log(data)
        if (data) {
            let parms = {
                categoryId: typeof(data)=='string'?data: data.id,
                pageNum: pageNum,
                rowNum: rowNum,
                keyword
            }
            this.setState({
                categoryId: typeof(data)=='string'?data: data.id,
            })
            console.log(parms)
            let result = await supplierDirectory.getDirectByCategory(parms)
            if (result.code == 200) {
                this.setState({
                    directList: result.data,
                    currentDirectory: data
                })

            }
        }

    }
    //upgradeDirectory 升版
     upgradeDirectory(){
        let {categoryId} = this.state
        return categoryId
    }

    //重新加载数据
    async refetchData(id) {
        if (id) {
            let parms = {
                categoryId: id,
                pageNum: 1,
                rowNum: 20,
            }
            let result = await supplierDirectory.getDirectByCategory(parms)
            if (result.code == 200) {
                this.setState({
                    directList: result.data
                })

            }
        }
    }
    clearCurrDir() {
        this.setState({ currentDirectory: null })
    }
    render() {
        let { currentDirectory, directList ,categoryId} = this.state
        return (
            <Layout title={"供应商名录管理"}>
                <Row gutter={24}>
                    <Col className="gutter-row" span={5}>
                        <div className="gutter-box">
                            <SupDirectManager currentDirectory={currentDirectory} getDirectByCategoryId={this.getDirectByCategoryId.bind(this)} clickDirectory={this.clickDirectory} clearCurrDir={this.clearCurrDir.bind(this)} />
                        </div>
                    </Col>
                    <Col className="gutter-row" span={19}>
                        <div className="gutter-box">
                            <SupplierDirectoryInfo currentDirectory={currentDirectory} upgradeDirectory={this.upgradeDirectory.bind(this)} directList={directList} clickDirectory={this.clickDirectory} refetchData={this.refetchData.bind(this)} />
                        </div>
                    </Col>
                </Row>
            </Layout>
        )
    }
}

SupplierDirectory.propTypes = {
}
export default SupplierDirectory;