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
class SupplierDirectorySee extends Component {
    state = {
        producttype: '',
        upload: true,
        treeData: [],
        selectNode: [],
        pageNum: 1,
        rowNum: 20,
        tableData: {
            list: [],
            recordsTotal: 0
        },//表格数据
        onSelectInfo: '',
        loading: true,
        selectedRowKeys: [],
        selectedRows: [],
        point: false,
        directoriesId: '',
        directoryId: '',
        yuansuo: [],
        orgID: '全部',
    }

    /*****************************************************SupDirectManager********************************************************** */
    // 获取目录树
    getSubCategories = (type = '', categoryId = '') => {
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
                    point: true,
                    loading: false,
                    yuansuo:[{
                        orgid: '全部',
                        orgname: '全部'
                    }],
                    orgID: '全部'
                })
            } else {
                this.setState({
                    upload: true,
                    treeData: [],
                    tableData: {
                        list: [],
                        recordsTotal: 0
                    },
                    point: true,
                    loading: false,
                    yuansuo:[{
                        orgid: '全部',
                        orgname: '全部'
                    }],
                    orgID: '全部'
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
                directoriesId: res.data[0].id,
                directoryId: res.data[0].id,
            }, () => {
                this.getproviderbyproducttype()
                this.getaAllSubOrgdepartment()
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
                    selectNode: ["集团", "院", "厂所"],
                    onSelectInfo: "院",
                }, () => {
                    this.getSubCategories("院")
                })
                break;
            default:
                console.log("厂所")
                this.setState({
                    selectNode: ["集团", "院", "厂所"],
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
            loading: true,
            onSelectInfo: e
        })
        this.getSubCategories(e)
    }



    /********************************************************SupplierDirectoryInfo**************************************************/
    // 按名录ID获取供应商
    async getproviderbyproducttype() {
        let { directoryId, orgID, pageNum, rowNum } = this.state
        let _tmp = ''
        if (orgID == '全部') {
            _tmp = ''
        } else {
            _tmp = orgID
        }
        let res = await supplierDirectory.categoryupdhistories({ directoryId, _tmp, pageNum, rowNum })
        if (res.code == 200) {
            let flag = 0;
            res.data.list.forEach(element => {
                element.flag = flag
                flag++
            });
            this.setState({
                tableData: res.data,//表格数据
                loading: false,
                point: true
            })
        } else {
            this.setState({
                loading: false,
                tableData: {
                    list: [],
                    recordsTotal: 0
                },//表格数据
                point: true
            })
        }
    }

    // 表格数据翻页
    pageChange = (pageNum, rowNum) => {
        this.setState({
            pageNum,
            rowNum,
            loading: true,
        }, () => {
            this.getproviderbyproducttype()
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
                directoriesId: e.selectedNodes[0].props.dataRef.id,
                directoryId: e.selectedNodes[0].props.dataRef.id,
                orgID: '全部'
            }, () => {
                this.getproviderbyproducttype()
                this.getaAllSubOrgdepartment()
            })
        }

    }
    // 选中的供应商
    onSelectedRowKeys = (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, selectedRows)
    }

    //重新刷新供应商列表
    againGetproviderbyproducttype = () => {
        let { directoryId } = this.state
        this.setState({
            loading: true,
            point: true,
        }, () => {
            this.getproviderbyproducttype()
            this.getaAllSubOrgdepartment()
        })

    }
    // 获取登录用户下属企业
    async getaAllSubOrgdepartment() {
        let { directoryId } = this.state
        let res = await supplierDirectory.getDirectoryAuthorizedInfo(directoryId)
        let _arr = []
        _arr = res.data.list
        _arr.unshift({
            orgid: '全部',
            orgname: '全部'
        })
        // console.log(directoryId)
        if (res.code == 200) {
            this.setState({
                yuansuo: _arr,
                orgID: _arr[0].orgid
            })
        }
    }

    下拉选择
    selectSearchValue = (orgID) => {
        this.setState({
            orgID,
            loading:true
        }, () => {
            this.getproviderbyproducttype()

        })
    }

    componentDidMount = () => {
        this.findLevel()
    }
    render() {
        let { producttype, upload, treeData, selectNode, onSelectInfo, tableData, pageNum, rowNum, loading, directoriesId, directoryId, yuansuo, orgID } = this.state
        let { history } = this.props
        return (
            <Layout title={"供应商名录管理"}>
                <Row gutter={24}>
                    <Col className="gutter-row" span={5}>
                        <div className="gutter-box">
                            <SupDirectManager getProducttype={this.getProducttype} getSubCategories={this.getSubCategories} upload={upload} treeData={treeData} selectNode={selectNode} onSelectTree={this.onSelectTree} onSelect={this.onSelect} onSelectInfo={onSelectInfo} />
                        </div>
                    </Col>
                    <Col className="gutter-row" span={19}>
                        <div className="gutter-box">
                            <SupplierDirectoryInfo producttype={producttype} tableData={tableData} pageNum={pageNum} rowNum={rowNum}
                                pageChange={this.pageChange} loading={loading} selectNode={selectNode} onSelectInfo={onSelectInfo} directoriesId={directoriesId}
                                directoryId={directoryId} againGetproviderbyproducttype={this.againGetproviderbyproducttype} selectSearchValue={this.selectSearchValue} history={history} yuansuo={yuansuo} orgid={orgID}
                            />
                        </div>
                    </Col>
                </Row>
            </Layout>
        )
    }
}

SupplierDirectorySee.propTypes = {
}
export default SupplierDirectorySee;