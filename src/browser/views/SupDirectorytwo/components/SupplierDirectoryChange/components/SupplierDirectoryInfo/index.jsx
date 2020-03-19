import React, { Component, Fragment } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Icon, Tooltip, message, Select, Typography, Popconfirm, Input } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import { SHOW_GYSInformation_MODEL, SHOW_GYSDirectories_MODEL, SHOW_GYSHistory_MODEL, SHOW_Notice_MODEL } from "../../../../../../constants/toggleTypes";
import { supplierAction, supplierDirectory } from "../../../../../../actions"
import GYSInformation from '../GYSInformation'
import GYSDirectories from '../GYSDirectories'
import GYSHistory from '../GYSHistory'
import Notice from '../Notice'
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
        status: '',
        checked: true,
        info:{}
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


    // 弹出modal框
    showModal = (modal) => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(modal)
    }


    // 是否通知
    async getgysupdmessageto(gysId) {
        const { toggleStore } = this.props;
        // 接口返回参数为数组格式，并且有多条。在这儿只取第一条
        let res = await supplierDirectory.getgysupdmessageto(gysId)
        // console.log(res)
        if (res.code == 200) {
            if (res.data.list.length > 0) {
                if(res.data.list[0].isread == '否'){
                    this.setState({
                        info:res.data.list[0]
                    },()=>{
                        toggleStore.setToggle(SHOW_Notice_MODEL)
                    })
                }
            }
        }
    }
    

    // 获取gysid
    async comfgysInfo() {
        let res = await supplierDirectory.comfgysInfo()
        // 如果接口返回的data不为null ，请求通知列表
        if (res.data != null) {
            this.getgysupdmessageto(res.data.gysId)
        } else {

        }
        // this.getgysupdmessageto('1')
    }

    componentDidMount = () => {
        this.comfgysInfo()
    }
    
    render() {
        let { infoSelectedRowKeys, status, checked ,info} = this.state
        let { pageNum, rowNum, tableData, history, loading, selectNode, toggleStore, producttype, directoryId, selectSearchValue , yuansuo, orgid,onSelectInfo} = this.props
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
                dataIndex: 'GYSNAME',
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
                title: '变更原因',
                dataIndex: 'OPERATEEVENT',
                align: "center",
                width: 270,
            }
        ];
        const TitleBtn = () => {
            return (
                <div className="titleBtn">
                    <Button type="primary" disabled={orgid=='全部' || checked} onClick={() => { this.showModal('SHOW_GYSDirectories_MODEL') }}>供应商名录修改记录</Button>
                    <Button type="primary" disabled={orgid=='全部' || checked} onClick={() => { this.showModal('SHOW_GYSInformation_MODEL') }}>供应商基础信息修改记录</Button>
                    <Button type="primary" disabled={orgid=='全部' || checked} onClick={() => { this.showModal('SHOW_GYSHistory_MODEL') }}>历史版本查询</Button>
                    < div className="search_value">
                        院所：<Select style={{ width: "200px" }} value={orgid} onSelect={
                            (e) => {
                                this.setState({
                                    checked: e == '全部',
                                })
                                selectSearchValue(e)

                            }
                        }>
                            {yuansuo.map((item) => {
                                return (
                                    <Option key={item.orgid} value={item.orgid}>{item.orgname}</Option>
                                )
                            })}
                        </Select>
                    </div>

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
                {/* 弹出供应商基础信息修改记录modal框 */}
                {
                    toggleStore.toggles.get(SHOW_GYSInformation_MODEL) && <GYSInformation directoryId={directoryId}  orgId={orgid}/>
                }
                {/* 弹出供应商名录修改记录modal框 */}
                {
                    toggleStore.toggles.get(SHOW_GYSDirectories_MODEL) && <GYSDirectories directoryId={directoryId} orgId={orgid} />
                }
                {/* 弹出历史modal框 */}
                {
                    toggleStore.toggles.get(SHOW_GYSHistory_MODEL) && <GYSHistory selectNode={selectNode} onSelectInfo={onSelectInfo}  orgId={orgid} />
                }
                {/* 弹出通知modal框 */}
                {
                    toggleStore.toggles.get(SHOW_Notice_MODEL) && <Notice history={history} info={info}/>
                }
            </Fragment>
        )
    }
}

SupplierDirectoryInfo.propTypes = {
}
export default SupplierDirectoryInfo;