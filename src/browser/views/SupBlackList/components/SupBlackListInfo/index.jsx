import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Input, Tooltip, message, Select , Popconfirm } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import { SHOW_AddBlackList_MODEL, SHOW_ModifyBlackList_MODEL, SHOW_SupInfoManager_MODEL, SHOW_Process_MODEL } from "../../../../constants/toggleTypes";
import { supplierAction, supplierApproval, supBlackList } from "../../../../actions"
import AddBlackList from "../AddBlackList";
import ModifyBlackList from "../ModifyBlackList/index";
import ShowProcessModel from '../../../../components/ShowProcessModel'
import "./index.less";
const { Option } = Select;
const { Search } = Input;

@inject('toggleStore', 'supplierStore')
@observer
class SupBlackListInfo extends Component {
    state = {
        flowStartData: '',
        flowURL: "",
        supplierList: {
            list: [],
            recordsTotal: 0
        },
        searchValue: '',
        pageNum: 1,
        rowNum: 20,
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        status: 0,
        info: {},
        supBlackType: [],
        judge: false

    };
    onSelectChange = selectedRowKeys => {
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
        toggleStore.setToggle(SHOW_AddBlackList_MODEL);
    }
    async loaddata(searchValue, pageNum, rowNum) {
        this.setState({ loading: true });
        if (pageNum == undefined) {
            pageNum = 1
        }
        if (rowNum == undefined) {
            rowNum = 20
        }
        let supplierList = await supBlackList.getSupplierBlackList(pageNum, rowNum, searchValue);
        // console.log(supplierList)
        this.setState({
            supplierList: supplierList,
            loading: false
        })
    }
    async approvalSupplierinfo(redord) {
        // 黑名单详情修改
        this.setState({ info: redord })
        const { toggleStore } = this.props;
        if (redord.status == 0) {
            toggleStore.setToggle(SHOW_ModifyBlackList_MODEL)
        } else if (redord.status == 1) {
            toggleStore.setToggle(SHOW_ModifyBlackList_MODEL)
        } else if (redord.status == 2) {
            toggleStore.setToggle(SHOW_ModifyBlackList_MODEL)
        } else {
            message.info("当前信息已提交")
        }
    }
    //搜索查询
    search = (e) => {
        this.loaddata(e)
    }
    againLoaddata = () => {
        this.loaddata()
    }
    //分页查询
    async pageChange(page, num) {
        this.loaddata('', page, num)
    }
    async delete(data) {
        //根据ID删除供应商
        // console.log(data)
        let res = await supBlackList.deleteGysBlackList(data.id)
        // console.log(res)
        if (res.code == 200) {
            message.success(res.message)
            this.loaddata()
        } else {
            message.error('删除失败')
        }
    }
    modify = (data) => {
        const { toggleStore } = this.props;
        let instanceId = data.id
        const { userId } = supBlackList.pageInfo
        let openurl = supBlackList.newInfoUrl + `&businessInstId=${instanceId}&userId=${userId}`
        //信息注入
        toggleStore.setModelOptions({
            modelOptions: {
                detail: '',
                title: '黑名单申请',
                url: openurl
            },
            model: SHOW_Process_MODEL
        })
        toggleStore.setToggle(SHOW_Process_MODEL)
    }
    async approveRole() {
        let res = await supBlackList.getApproveRole()
        let { roleNameKey } = supBlackList.pageInfo
        let ret = roleNameKey.split(',')
        for (let i = 0; i < ret.length; i++) {
            for (let n = 0; n < res.data.length; n++) {
                if (ret[i] == res.data[n]) {
                    this.setState({ judge: true })
                    return
                }
                if (this.state.judge) return
            }
        }
    }
    approval = (data) => {
        const { toggleStore } = this.props;
        let instanceId = data.id
        let processInstanceId = data.processInstId
        const { userId } = supBlackList.pageInfo
        let openurl = supBlackList.approvalInfoUrl + `processInstanceId=${processInstanceId}&businessid=984700239917142019&processDefinitionKey=gysblacklist&businessInstId=${instanceId}&userId=${userId}`
        //信息注入
        toggleStore.setModelOptions({
            modelOptions: {
                detail: '',
                title: '审核',
                url: openurl
            },
            model: SHOW_Process_MODEL
        })
        toggleStore.setToggle(SHOW_Process_MODEL)
    }

    async componentDidMount() {
        this.approveRole()

        const { toggleStore } = this.props;
        window.closeModel = (modelname) => {
            toggleStore.setToggle(modelname)
            this.loaddata()
        }
        let supplierBlack = await supBlackList.getDic("BLACKLISTTYPE")
        this.setState({
            supBlackType: supplierBlack.data
        })
        this.loaddata()
    }

    render() {
        const { toggleStore, supplierStore } = this.props;
        const { loading, selectedRowKeys, judge, flowStartData, supBlackType } = this.state;
        // const rowSelection = {
        //     selectedRowKeys,
        //     onChange: this.onSelectChange,
        //     type:'radio'
        // };
        const that = this;
        const hasSelected = selectedRowKeys.length > 0;
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 50,
                align: "center",
                fixed: "left",
                render: (text, index, key) => key + 1
            },

            {
                title: '供应商名称',
                dataIndex: 'name',
                width: 150,
                align: "center",
                fixed: "left",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.approvalSupplierinfo(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '供应商编号',
                dataIndex: 'number',
                width: 150,
                align: "center",
            },
            {
                title: '企业性质',
                dataIndex: 'property_key',
                width: 100,
                align: "center",
            },
            {
                title: '注册地',
                dataIndex: 'registrationplace',
                width: 200,
                align: "center",
            },
            {
                title: '状态',
                dataIndex: 'statusV',
                width: 100,
                align: "center",
                sorter: (a, b) => (moment(a.status).valueOf() - moment(b.status).valueOf()),
                render: (e) => {
                    if (e == '待审核') { return (<span className='intro_p'>待审核</span>) } else { return (<span >{e}</span>) }
                }

            },
            {
                title: '黑名单类别',
                dataIndex: 'type',
                width: 100,
                align: "center",
                sorter: (a, b) => (moment(a.type).valueOf() - moment(b.type).valueOf()),
                render: (text, record) => {
                    return supBlackType.map((item, index) => {
                        if (item.code == text) {
                            return <span key={index}>{item.name}</span>
                        }
                    })
                }
            },
            {
                title: '加入黑名单时间',
                dataIndex: 'create_date',
                width: 150,
                align: "center",
                sorter: (a, b) => (moment(a.create_date).valueOf() - moment(b.create_date).valueOf())
            },
            {
                title: '原因',
                dataIndex: 'reason',
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '操作',
                dataIndex: 'status',
                width: 120,
                align: 'center',
                fixed: 'right',
                render: (e, key) => {
                    return (
                        judge ? <div>
                            {e == 2 || e == 0 ? '' : <Button size={'small'} type='danger' disabled={e == 2 || e == 0} onClick={this.approval.bind(this, key)}>审批</Button>}
                        </div> : (<div>
                            <Popconfirm placement="topLeft" disabled={e == 1 || e == 2} disabled={!hasSelected} title='确定要删除吗？' onConfirm={() => { this.delete(key) }} okText="是" cancelText="否">
                                <Button size={'small'} type='danger' disabled={e == 1 || e == 2} >删除</Button>
                            </Popconfirm>
                            <Button type='primary' disabled={e == 1 || e == 2} style={{ marginLeft: 10 }} size={'small'} onClick={this.modify.bind(this, key)}>提交</Button>
                        </div>)
                    )
                }
            },
        ];
        let TableOpterta = () => (
            judge ? "" : (<div className="table-operations">
                <Button icon="plus" type="primary" onClick={() => { this.editorSupplierInfo(); }}>申请添加</Button>
            </div>)
        )
        let TableFilterBtn = () => (
            <div className="table-fileter">
                <Search placeholder="搜索供应商名称" onSearch={this.search} enterButton />
            </div>
        )

        return (
            <Card title={<TableOpterta />} extra={<TableFilterBtn />}>
                {
                    toggleStore.toggles.get(SHOW_ModifyBlackList_MODEL) && <ModifyBlackList info={this.state.info} loaddata={this.againLoaddata} />
                }
                {
                    toggleStore.toggles.get(SHOW_AddBlackList_MODEL) && <AddBlackList loaddata={this.againLoaddata} />
                }
                {toggleStore.toggles.get(SHOW_Process_MODEL) && <ShowProcessModel />}
                <Table
                    size='middle'
                    loading={loading}
                    rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''}
                    bordered={true} rowKey={(text) => text.id}
                    // rowSelection={rowSelection} 
                    scroll={{ x: 1270 }}
                    columns={columns}

                    pagination={{
                        showTotal: () => `共${this.state.supplierList.recordsTotal}条`,
                        onChange: (page, num) => {
                            this.pageChange(page, num)
                        },
                        showQuickJumper: {
                            goButton: <Button type="link" size={'small'}>
                                跳转
                                    </Button>
                        },
                        total: this.state.supplierList.recordsTotal,
                        pageSize: 20
                    }}
                    dataSource={this.state.supplierList.list} />
            </Card>
        )
    }
}

SupBlackListInfo.propTypes = {
}
export default SupBlackListInfo;