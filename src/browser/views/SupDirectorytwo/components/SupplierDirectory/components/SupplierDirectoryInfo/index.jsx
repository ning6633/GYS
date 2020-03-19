import React, { Component, Fragment } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Icon, Tooltip, message, Select, Typography, Popconfirm, Input } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import { SHOW_Initialization_MODEL, SHOW_Restricted_MODEL ,SHOW_Authorization_MODEL } from "../../../../../../constants/toggleTypes";
import { supplierAction, supplierDirectory } from "../../../../../../actions"
import Initialization from '../Initialization'
import Restricted from '../Restricted'
import "./index.less";

const { Option } = Select;
const { Search } = Input;

const { Text } = Typography;
const ButtonGroup = Button.Group;
const calcTime = () => {
    let times = {}
    let t = window.performance.timing
    //重定向时间
    times.redirectTime = t.redirectEnd - t.redirectStart
    return times
}

@inject('toggleStore', 'supplierStore')
@observer
class SupplierDirectoryInfo extends Component {
    state = {
        infoSelectedRowKeys: [],
        infoSelectedRows: [],
        status:''
        // treeData:[]
    }
    pageChange = (pageNum, rowNum) => {
        let { pageChange } = this.props
        pageChange(pageNum, rowNum)
    }


    // 表格复选框
    onSelectChange = (selectedRowKeys, selectedRows) => {
        let { onSelectedRowKeys } = this.props
        onSelectedRowKeys(selectedRowKeys, selectedRows)
        this.setState({
            infoSelectedRowKeys: selectedRowKeys,
            infoSelectedRows: selectedRows
        })
    }

    // 弹出初始化modal框
    initialization = () => {
        const { toggleStore } = this.props;
        this.setState({
            status:0
        },()=>{
            toggleStore.setToggle(SHOW_Initialization_MODEL)
        })
    }

    // 从上级名录授权
    addFromauthorization =()=>{
        const { toggleStore } = this.props;
        this.setState({
            status:1
        },()=>{
            toggleStore.setToggle(SHOW_Initialization_MODEL)
        })
    }

    // 获取添加的供应商
    addInitcategory = (data) => {
        this.setState({
            loading: true
        })
        this.initcategory(data)
    }

    // 向名录中添加供应商
    async initcategory(data) {
        let { directoriesId, againGetproviderbyproducttype } = this.props
        let res = await supplierDirectory.initcategory({ categoryId: directoriesId, gysIds: data })
        if (res.code == 200) {
            message.success("添加成功")
        } else {
            message.error("添加失败")
        }
        this.setState({
            loading: false
        }, () => {
            againGetproviderbyproducttype()
        })
    }

    // 删除名录下的供应商
    async removeGysFromDirectory() {
        let { infoSelectedRows } = this.state
        let { againGetproviderbyproducttype } = this.props
        let _arr = []
        infoSelectedRows.forEach((item) => {
            _arr.push(item.rel_id)
        })
        console.log(_arr)
        let res = await supplierDirectory.removeGysFromDirectory(_arr)
        if (res.code == 200) {
            message.success("删除成功！")
            againGetproviderbyproducttype()
        } else {
            message.error("删除失败！")
        }
    }
    deleteInfo = () => {
        this.removeGysFromDirectory()
    }
    // 限用功能
    restricted = () => {
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_Restricted_MODEL)
    }

    // 获取限用modal里面的数据
    restrictgys = (data) => {
        this.restrictgysInfos(data)
    }

    async restrictgysInfos(data) {
        let { infoSelectedRowKeys, infoSelectedRows } = this.state
        let { againGetproviderbyproducttype } = this.props
        let _arr = []
        if (infoSelectedRows.length > 0) {
            infoSelectedRows.forEach((item) => {
                _arr.push(item.gysid)
            })
        }
        data['gysids'] = _arr
        let res = await supplierDirectory.restrictgys(data)
        if (res.code == 200) {
            message.success("限用成功")
        } else {
            message.error("限用失败")
        }
        againGetproviderbyproducttype()
    }

    componentDidMount = () => {

    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.point) {
            this.setState({
                infoSelectedRowKeys: [],
                infoSelectedRows: []
            })
        }
    }

    render() {
        let { infoSelectedRowKeys, infoSelectedRows , status} = this.state
        let { pageNum, rowNum, tableData, upload, loading, selectNode, toggleStore, producttype, directoriesId } = this.props
        let sign = !(infoSelectedRowKeys.length > 0)
        // 表格复选框配置项
        const rowSelection = {
            columnWidth: 30,
            selectedRowKeys: infoSelectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.onSelectChange(selectedRowKeys, selectedRows)
            }
        };
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",

                render: (text, index, key) => key + 1
            },
            {
                title: '供应商名称',
                dataIndex: 'name',
                width: 150,
                align: "center",

                // render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.getDirectoryDetail(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{this.elipsString(text, 15)}</span></Tooltip>
            },
            {
                title: '统一社会信用代码',
                dataIndex: 'number',
                width: 230,
                align: "center",
            },
            {
                title: '产品范围',
                dataIndex: 'product_scope',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '产品类别',
                dataIndex: 'product_category',
                width: 100,
                align: "center",
            },
            {
                title: '配套领域',
                dataIndex: 'model_area',
                width: 150,
                align: "center",
            },
            {
                title: '所属名录',
                dataIndex: 'from',
                align: "center",
                width: 270,
            }
        ];
        const TitleBtn = () => {
            return (
                selectNode.length > 2 ? <div className="titleBtn">
                    <Button type="primary" onClick={this.initialization}>初始化</Button>
                    <Button type="danger" disabled={sign} onClick={this.deleteInfo}>删除</Button>
                </div> :
                    <div className="titleBtn">
                        <Button type="primary" onClick={this.addFromauthorization}>从授权名录中添加</Button>
                        <Button type="primary" onClick={this.initialization}>初始化</Button>
                        <Button type="danger" disabled={sign} onClick={this.deleteInfo}>删除</Button>
                        <Button type="primary" disabled={sign} onClick={this.restricted}>限用</Button>
                    </div>

            )
        }
        return (
            <Fragment>


                <Card title={<TitleBtn />}>
                    <Table
                        size='middle'
                        loading={loading}
                        rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''}
                        bordered={true}
                        rowKey={(text) => text.flag}
                        rowSelection={rowSelection}
                        scroll={{ x: 900 }}
                        columns={columns}
                        pagination={{
                            showTotal: () => `共${tableData.recordsTotal}条`,
                            onChange: (page, num) => { this.pageChange(page, num) },
                            current: pageNum,
                            showQuickJumper: true,
                            total: tableData.recordsTotal,
                            pageSize: rowNum
                        }}
                        dataSource={tableData.list}
                    />
                </Card>
                {/* 弹出初始化modal框 */}
                {
                    toggleStore.toggles.get(SHOW_Initialization_MODEL) && <Initialization producttype={producttype} addInitcategory={this.addInitcategory} status={status}/>
                }
                {/* 弹出限用modal框 */}
                {
                    toggleStore.toggles.get(SHOW_Restricted_MODEL) && <Restricted restrictgys={this.restrictgys} />
                }
                {/* 弹出授权modal框 */}
                {/* {
                    toggleStore.toggles.get(SHOW_Authorization_MODEL) && <Authorization />
                } */}
            </Fragment>
        )
    }
}

SupplierDirectoryInfo.propTypes = {
}
export default SupplierDirectoryInfo;