import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Input, Tooltip, message, Select } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import { SHOW_EditSupBaseInfo_MODEL, SHOW_Flow_MODEL, SHOW_SupInfoManager_MODEL } from "../../../../constants/toggleTypes";
import { supplierAction, supplierApproval } from "../../../../actions"
import EditSupBaseInfo from "../EditSupBaseInfo";
import ApprovalFlowModel from "../ApprovalFlow";
import "./index.less";
const { Option } = Select;
const { Search } = Input;

@inject('toggleStore', 'supplierStore')
@observer
class SupplierInfoApproval extends Component {
    state = {
        flowURL: "",
        flowStartData: "",
        supplierList: {
            list: [],
            recordsTotal: 0
        },
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        display: 'block',
        searchInfo: ''
    };
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    async submitSupplierInfo(redord) {
        const { toggleStore, supplierStore } = this.props;
        if (redord.is_diff != 0) {
            toggleStore.setToggle(SHOW_SupInfoManager_MODEL)
        } else {
            let supplierList = await supplierAction.submitSupplierInfo([redord.id]);
            message.success("提交成功")
            this.loaddata()
        }
    }
    async submitSupplierInfopl() {
        let supplierList = await supplierAction.submitSupplierInfo(this.state.selectedRowKeys);
        message.success("提交成功")
        this.loaddata()
    }
    async editorSupplierInfo() {
        const { toggleStore } = this.props;
        // let processDefId = supplierApproval.infoProcessDefId;
        // let flowStartData = await supplierApproval.getnewprocessurl(processDefId);
        // this.setState({
        //     flowStartData
        // })
        let isEdit = await supplierApproval.isEdit();
        if (isEdit) {
            message.success("不可进行编辑!")
        } else {
            toggleStore.setToggle(SHOW_EditSupBaseInfo_MODEL);
        }
    }
    //删除操作
    async deleteSupplierInfo(redord) {
        let res = await supplierApproval.deleteSupplierInfo(redord.id)
        if (res.code == 200) {
            this.loaddata()
        }
    }
    async searchSupplierInfo(info, pageNum = 1, rowNum = 20) {
        let res = await supplierApproval.searchSupplierInfo(info, pageNum, rowNum)
        if (res.code == 200) {
            message.success('搜索成功')
            this.setState({
                supplierList: res.data
            })
        }
    }
    async loaddata(pageNum = 1, rowNum = 20) {
        this.setState({ loading: true });
        let supplierList = await supplierApproval.getgysupdall(pageNum, rowNum);
        console.log(supplierList)
        this.setState({
            supplierList: supplierList,
            loading: false
        })
    }
    // 申请编辑供应商信息流程
    async approvalSupplierinfo(redord) {
        const { toggleStore } = this.props;

        let flowURL = redord
        this.setState({
            flowURL
        })
        toggleStore.setToggle(SHOW_Flow_MODEL)


    }
    // 提交
    async directHandleTask(record){
        let res = await supplierApproval.directHandleTask(record.id);
        if(res.code == 200){
            message.success("提交成功")
            this.loaddata()
        }
    }
    async getCharacter() {
        let characters = await supplierApproval.getCharacter();
        console.log(characters)
        const { roleNameKey } = supplierApproval.pageInfo
        console.log(roleNameKey)
        //判断是否是审批角色 - lzy
        let roles = roleNameKey.split(',')
        for (let roleName of roles) {
            let flag = characters.some(item => item == roleName)
            if (flag) {
                this.setState({
                    display: 'none'
                })
                break
            }
        }


    }
    //分页查询
    async pageChange(page, num) {
        this.loaddata(page, num)
    }
    componentDidMount() {
        const { toggleStore } = this.props;
        window.closeModel = (modelname) => {
            toggleStore.setToggle(modelname)
            this.loaddata()
        }
        this.loaddata()
        this.getCharacter()
    }
    render() {
        const { toggleStore, supplierStore } = this.props;
        const { loading, selectedRowKeys, flowStartData } = this.state;
        const rowSelection = {
            columnWidth: 30,
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const that = this;
        const hasSelected = selectedRowKeys.length > 0;
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                // fixed: "left",
                render: (text, index, key) => key + 1
            },
            {
                title: '供应商名称',
                dataIndex: 'name',
                width: 200,
                align: "center",
                // fixed: "left",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.approvalSupplierinfo(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },

            {
                title: '统一社会信用代码',
                dataIndex: 'code',
                width: 230,
                align: "center",
            },
            {
                title: '企业性质',
                dataIndex: 'property',
                width: 150,
                align: "center",
            },
            {
                title: '简称',
                dataIndex: 'shortname',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '别称',
                dataIndex: 'anothername',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '供应商编号',
                dataIndex: 'number',
                width: 200,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '注册地',
                dataIndex: 'registrationplace',
                width: 150,
                align: "center",
                sorter: (a, b) => (moment(a.update_time).valueOf() - moment(b.update_time).valueOf()),
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '联系方式',
                dataIndex: 'telphone',
                width: 150,
                align: "center",
                sorter: (a, b) => (moment(a.update_time).valueOf() - moment(b.update_time).valueOf()),
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 120,
                align: "center",
                fixed: "right",
                // render: (text) => text == 1 ? '待审批' : 2 ? '已通过': '未提交'
                render: (text) => {
                    if (text == 1) {
                        return '待审批'
                    } else if (text == 2) {
                        return '已通过'
                    } else {
                        return '未提交'
                    }
                }
            },
            {
                title: '操作',
                dataIndex: 'modify',
                align: "center",
                width: 150,
                fixed: "right",
                render: (text, redord) => {
                    return (<div>
                        {redord.status == 0 ?
                            <div>
                                <Button type='primary' disabled={redord.status != 0} onClick={() => { this.directHandleTask(redord) }} style={{ marginRight: 5 }} size={'small'}>提交</Button>
                                <Button type='danger' disabled={redord.status != 0} onClick={() => { this.deleteSupplierInfo(redord) }} style={{ marginRight: 5 }} size={'small'}>删除</Button>
                            </div>
                            :null
                        }
                    </div>)
                }
            }
        ];
        let TableOpterta = () => (
            <div className="table-operations">
                <Button icon="edit" type="primary" onClick={() => { this.editorSupplierInfo() }} style={{ display: this.state.display }}>修改基本信息</Button>
            </div>
        )
        let TableFilterBtn = () => (
            <div className="table-fileter">
                <Search placeholder="搜索供应商名称" onSearch={value => {
                    this.searchSupplierInfo(value)
                }} enterButton />
            </div>
        )

        return (
            <Card title={<TableOpterta />} extra={<TableFilterBtn />}>
                {toggleStore.toggles.get(SHOW_EditSupBaseInfo_MODEL) && <EditSupBaseInfo flowStartData={flowStartData} />}
                <ApprovalFlowModel flowURL={this.state.flowURL} />
                <Table size='middle' loading={loading} rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''} bordered={true} rowKey={(text) => text.id} rowSelection={rowSelection} scroll={{ x: 1600 }} columns={columns} pagination={{ onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: true, total: this.state.supplierList.recordsTotal, pageSize: 20 }} dataSource={this.state.supplierList.list} />
            </Card>
        )
    }
}

SupplierInfoApproval.propTypes = {
}
export default SupplierInfoApproval;