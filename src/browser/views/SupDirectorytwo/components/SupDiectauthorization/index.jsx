import React, { Component } from 'react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import { Row, Col } from "antd"
import Layout from "../../../../components/Layouts";
import SupplierDirectoryInfo from "./components/SupplierDirectoryInfo";
import SupDirectManager from "./components/SupDirectManager"
import { supplierDirectory } from "../../../../actions"
import { observer, inject, } from 'mobx-react';


@inject('toggleStore', 'directoryStore')
@observer
class SupDiectauthorization extends Component {
    state = {
        producttype: '',
        upload: true,
        treeData: [],
        selectNode: [],
        pageNum: 1,
        rowNum: 10,
        tableData: {
            list: [],
            recordsTotal: 0
        },//表格数据
        onSelectInfo: '',
        loading: true,
        selectedRowKeys: [],
        selectedRows: [],
        point:false,
        directoriesId:'',
        name:'',
    }
   /*****************************************************SupDirectManager********************************************************** */
    // 获取目录树
    getSubCategories=(type = '', categoryId = '')=>{
        this.getSubCategoriesInfos(type, categoryId)
    }
    async getSubCategoriesInfos(type = '', categoryId = '') {
        let { selectNode } = this.state
        let { directoryStore } = this.props
        let res = await supplierDirectory.getSubCategories({ type, categoryId })
        if (res.data.length == 0) {
            if (selectNode[0] != type) {
                this.setState({
                    upload: false,
                    treeData: [],
                    tableData: {
                        list: [],
                        recordsTotal: 0
                    },
                    point:true,
                    loading:false
                })
            } else {
                this.setState({
                    upload: true,
                    treeData: [],
                    tableData: {
                        list: [],
                        recordsTotal: 0
                    },
                    point:true,
                    loading:false
                })
            }

        } else {
            // 将树存放到directoryStore
            directoryStore.setTreeData(res.data)
            this.setState({
                upload: false,
                treeData: res.data,
                producttype: res.data[0].id,
                pageNum: 1,
                directoriesId:res.data[0].id,
            }, () => {
                this.getproviderbyproducttype(res.data[0].id)
            })
        }
    }
    // 获取当前登录角色的级别
    findLevel = () => {
        let level = supplierDirectory.pageInfo.path
        // let level = '0.orgRootDomain.1.'
        let _tmp = level.replace('0.orgRootDomain.','')
        let _num = 0
        for (let i = 0; i < _tmp.length; i++) {
            if (_tmp[i] == '.') {
                _num++
            }
        }
        switch (_num) {
            case 0:
                console.log("集团")
                this.setState({
                    selectNode: ["集团", "院", "厂所"],
                    onSelectInfo: "集团",
                }, () => {
                    this.getSubCategories("集团")
                })
                break;
            case 1:
                console.log("院")
                this.setState({
                    selectNode: ["院", "厂所"],
                    onSelectInfo: "院",
                }, () => {
                    this.getSubCategories("院")
                })
                break;
            default:
                console.log("厂所")
                this.setState({
                    selectNode: ["厂所"],
                    onSelectInfo: "厂所",
                }, () => {
                    this.getSubCategories("厂所")
                })
                break;
        }
    }

    // 下拉框选择查看的级别
    onSelect = (e) => {
        let { selectNode } = this.state
        this.setState({
            loading: true
        })
        this.getSubCategories(e)
    }



    /********************************************************SupplierDirectoryInfo**************************************************/
    // 按名录ID获取供应商
    async getproviderbyproducttype(categoryId = '', pageNum = 1, rowNum = 20) {
        let res = await supplierDirectory.getDirectoryAuthorizedallInfo({ directoryId:categoryId, pageNum, rowNum })
        console.log(res)
        if (res.code == 200) {
            let flag = 0;
            res.data.list.forEach(element => {
                element.flag = flag
                flag++
            });
            this.setState({
                tableData: res.data,//表格数据
                loading: false,
                point:true
            })
        } else {
            this.setState({
                loading: false,
                tableData: {
                    list: [],
                    recordsTotal: 0
                },//表格数据
                point:true
            })
        }
    }

    // 表格数据翻页
    pageChange = (pageNum, rowNum) => {
        let { producttype } = this.state
        this.setState({
            pageNum,
            rowNum,
            loading: true
        }, () => {
            this.getproviderbyproducttype(producttype, pageNum, rowNum)
        })
    }

    // 点击树节点切换查询条件
    onSelectTree = (selectedKeys, e) => {
        let { rowNum } = this.state
        if(e.selected){
            this.setState({
                producttype: e.selectedNodes[0].props.dataRef.id,
                pageNum: 1,
                loading: true,
                directoriesId:e.selectedNodes[0].props.dataRef.id,
            })
            this.getproviderbyproducttype(e.selectedNodes[0].props.dataRef.id, 1, rowNum)
        }
        
    }

    // 选中的供应商
    onSelectedRowKeys = (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, selectedRows)
    }

    //重新刷新供应商列表
    againGetproviderbyproducttype=()=>{
        let {producttype} = this.state
        this.setState({
            loading: true,
            point:true
        },()=>{
            this.getproviderbyproducttype(producttype)
        })
        
    }
    componentDidMount = () => {
        this.findLevel()
    }
    render() {
        let { producttype, upload, treeData, selectNode, tableData, pageNum, rowNum, loading, directoriesId,point,onSelectInfo } = this.state
        return (
            <Layout title={"供应商名录管理"}>
                <Row gutter={24}>
                    <Col className="gutter-row" span={5}>
                        <div className="gutter-box">
                            <SupDirectManager getProducttype={this.getProducttype} getSubCategories={this.getSubCategories} upload={upload} treeData={treeData} selectNode={selectNode} onSelectTree={this.onSelectTree} onSelect={this.onSelect} onSelectInfo={onSelectInfo}/>
                        </div>
                    </Col>
                    <Col className="gutter-row" span={19}>
                        <div className="gutter-box">
                            <SupplierDirectoryInfo producttype={producttype} tableData={tableData} pageNum={pageNum} rowNum={rowNum}
                                pageChange={this.pageChange} loading={loading} selectNode={selectNode} onSelectedRowKeys={this.onSelectedRowKeys} treeData={treeData} onSelectInfo={onSelectInfo}
                                point={point} directoriesId={directoriesId} againGetproviderbyproducttype={this.againGetproviderbyproducttype}/>
                        </div>
                    </Col>
                </Row>
            </Layout>
        )
    }
}

SupDiectauthorization.propTypes = {
}
export default SupDiectauthorization;