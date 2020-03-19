import React, { Component, Fragment } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Icon, Tooltip, message, Select, Typography, Popconfirm, Input } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import { SHOW_Authorization_MODEL } from "../../../../../../constants/toggleTypes";
import { supplierAction, supplierDirectory } from "../../../../../../actions"
import Authorization from '../Authorization'
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
        status: ''
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

    // 授权
    authorization = () => {
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_Authorization_MODEL)
    }

    // 添加授权数据
    addAuthorizationInfo = (data) => {
        this.addAuthorizationInfoRequest(data)
    }
    async addAuthorizationInfoRequest(data) {
        let { directoriesId, againGetproviderbyproducttype } = this.props
        let res = await supplierDirectory.authorizeToChildren({ directoryid: directoriesId, orgs: data })
        if (res.code == 200) {
            message.success(res.message)
            againGetproviderbyproducttype()
        }
    }

    // 取消授权
    async deleteDirectoryAuthorizedInfo(relId){
        let {againGetproviderbyproducttype} = this.props
        let res = await supplierDirectory.deleteDirectoryAuthorizedInfo(relId)
        if(res.code == 200){
            message.success("取消授权成功!")
            againGetproviderbyproducttype()
        }
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
        let { infoSelectedRowKeys, infoSelectedRows, status } = this.state
        let { pageNum, rowNum, tableData, loading, selectNode, toggleStore ,treeData,onSelectInfo} = this.props
        let isOk 
        // 判断是否是越级授权，如果是则不允许
         treeData.length>0 ? !(isOk=treeData[0].name == onSelectInfo) : isOk =true
        let sign = !(treeData.length > 0)
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
                title: '单位名称',
                dataIndex: 'orgname',
                width: 300,
                align: "center"
            },
            {
                title: '授权角色',
                dataIndex: 'roledesc',
                width: 405,
                align: "center"
            },
            {
                title: '所属名录',
                dataIndex: 'relId',
                align: "center",
                width: 100,
                render:(text,record)=>{
                    return (
                        <Button type = "primary" size="small" onClick={()=>{this.deleteDirectoryAuthorizedInfo(text)}}>取消授权</Button>
                    )
                }
            }
        ];
        const TitleBtn = () => {
            return (
                selectNode.length <=1 ? <span></span> :
                    <div className="titleBtn">
                        <Button type="primary"  disabled = {isOk} onClick={this.authorization}>授权</Button>
                    </div>

            )
        }
        return (
            <Fragment>


                <Card title={<TitleBtn />} >
                    <Table
                        size='middle'
                        loading={loading}
                        rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''}
                        bordered={true}
                        rowKey={(text) => text.flag}
                        // rowSelection={rowSelection}
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
                {/* 弹出授权modal框 */}
                {
                    toggleStore.toggles.get(SHOW_Authorization_MODEL) && <Authorization addAuthorizationInfo={this.addAuthorizationInfo} selectNode={selectNode}/>
                }
            </Fragment>
        )
    }
}

SupplierDirectoryInfo.propTypes = {
}
export default SupplierDirectoryInfo;