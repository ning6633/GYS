import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Upload, Icon, Tooltip, message, Select, Form, Row, Col, Input, Popconfirm } from 'antd';
import './index.less';
import Layout from "../../../../components/Layouts";
const ButtonGroup = Button.Group;
const { Option } = Select;
const { Search } = Input;
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import _ from "lodash";
import { supplierTrain, supplierApproval } from "../../../../actions"
import { SHOW_NewTrainPlan_MODEL, SHOW_EditTrainPlan_MODEL, SHOW_CheckAttachedFiles_MODEL, SHOW_ApplyTrain_MODEL } from "../../../../constants/toggleTypes";
import NewTrainScheme from "./components/NewTrainScheme";
import EditTrainPlan from "./components/EditTrainPlan";
import CheckAttachedFiles from "../../../../components/CheckAttachedFiles";
import ApplyTrain from "./components/ApplyTrain";
import SchemeTypesTree from './components/SchemeTypesTree'
@inject('toggleStore')
@observer
class TrainingSchemeTypes extends Component {
    state = {
        trainPlanList: {
            list: [],
            recordsTotal: 1
        },
        curPage: 1,
        searchValue: {
            trainPlanName: ""
        },
        selectedrecords: [],
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        editrecord: "",
        userTypeVerty: ""
    };
    isSearch = false;
    onSelectChange = (selectedRowKeys, selectedrecords) => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ selectedRowKeys, selectedrecords });
    };
    handleReset = () => {
        this.setState({
            curPage: 1
        })
        this.props.form.resetFields();
        this.loaddata()
        this.setState({
            searchValue: {}
        })
    };
    // handleSearch = e => {
    //     e.preventDefault();
    //     this.props.form.validateFields((err, values) => {
    //         console.log(values)
    //         if (!err) {
    //             this.setState({
    //                 searchValue: values,
    //                 curPage: 1
    //             }, () => {
    //                 this.loaddata();
    //             })
    //         }
    //     });
    // };
    //搜索
    handleSearch(value) {
        console.log(value)
        this.setState({
            searchValue: {
                trainPlanName: value
            },
            curPage: 1
        }, () => {
            this.loaddata();
        })
    }
    async loaddata(pageNum = 1, rowNum = 20) {
        console.log(this.state.userTypeVerty)
        const { userTypeVerty } = this.state;
        this.setState({
            curPage: pageNum,
            loading: true
        })
        let searchValue = this.state.searchValue;
        let userId = supplierTrain.pageInfo.userId;
        let trainPlanList =  await supplierTrain.getTrainSchmeType()
        console.log(trainPlanList)
        this.setState({
            trainPlanList: trainPlanList,
            loading: false
        })
    }
    async componentDidMount() {
        const { roleNameKey } = supplierTrain.pageInfo
        const { toggleStore } = this.props;
        //获取所有审核角色名单
        let ApproveroleLists = await supplierApproval.getCharacter()
        //获取自身角色信息
        let roles = roleNameKey.split(',')
        //判断是否是审核角色
        for (let roleName of roles) {
            let userVerty = ApproveroleLists.some(item => item == roleName)
            if (userVerty) {
                this.setState({
                    userTypeVerty: 'approve'
                })
                break
            }
        }
        //监听流程窗口关闭
        window.closeModel = (modelname) => {
            toggleStore.setToggle(modelname)
            this.loaddata()
        }
        // this.loaddata()
    }
    //分页查询
    async pageChange(page, num) {
        this.setState({
            curPage: page,
            selectedRowKeys: []
        })
        this.loaddata(page, num)
    }
    //删除培训计划
    async deleteTrainPlan() {
        await supplierTrain.deleteTrainPlan(this.state.selectedRowKeys);
        this.loaddata()
        this.setState({ selectedRowKeys: [] })
    }
    //编辑培训计划
    async editTrainPlan(record) {
        const { toggleStore } = this.props;
        this.setState({
            editrecord: record,
        })
        toggleStore.setToggle(SHOW_EditTrainPlan_MODEL)
    }
    //查看附件详情
    checkfile(record) {
        const { toggleStore } = this.props;
        this.setState({
            editrecord: record,
        })
        toggleStore.setToggle(SHOW_CheckAttachedFiles_MODEL)
    }
    //申请培训
    applyTrain(record) {
        const { toggleStore } = this.props;
        this.setState({
            editrecord: record,
        })
        toggleStore.setToggle(SHOW_ApplyTrain_MODEL)
    }
    render() {
        const { toggleStore } = this.props;
        const { userTypeVerty, loading, selectedRowKeys, curPage, editrecord } = this.state;
        const rowSelection = {
            columnWidth: 30,
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        let TableOpterta = () => (
            <div className="table-operations">
                <Button icon="plus" type="primary" onClick={() => { console.log("新建"); toggleStore.setToggle(SHOW_NewTrainPlan_MODEL) }}>新建</Button>
                {/* <Button type="primary" disabled={!hasSelected} onClick={() => { console.log("修改") }}>修改</Button> */}
                <Popconfirm className="confirm_del" placement="bottom" title={'确认要删除吗？'} onConfirm={() => { console.log("删除"); this.deleteTrainPlan() }}>
                    <Button type="danger" disabled={!hasSelected} >删除</Button>
                </Popconfirm>
            </div>
        )
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                fixed: "left",
                render: (text, index, key) => key + 1
            },
            {
                title: '培训计划名称',
                dataIndex: 'trainPlanName',
                width: 250,
                align: "center",
                fixed: "left",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => console.log("查看详情")}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '培训类型',
                dataIndex: 'trainTypeName',
                width: 200,
                align: "center",
            },
            {
                title: '培训主题',
                dataIndex: 'trainTheme',
                width: 239,
                align: "center",
            },
            {
                title: '培训班次',
                dataIndex: 'trainShift',
                width: 120,
                align: "center",
                sorter: (a, b) => (moment(a.trainShift).valueOf() - moment(b.trainShift).valueOf()),
                render: (text) => <Tooltip title={text && text.substr(0, 10)}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '培训地点',
                dataIndex: 'trainPlace',
                width: 120,
                align: "center",
            },
            {
                title: '具体地点',
                dataIndex: 'jtdd',
                width: 200,
                align: "center",
            },
            {
                title: '出行建议',
                dataIndex: 'cxjy',
                width: 150,
                align: "center",
            },
            {
                title: '发布时间',
                dataIndex: 'createTime',
                width: 150,
                align: "center",
                sorter: (a, b) => (moment(a.createTime).valueOf() - moment(b.createTime).valueOf()),
                render: (text) => <Tooltip title={text && text.substr(0, 10)}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '更新时间',
                dataIndex: 'updateTime',
                width: 200,
                align: "center",
                sorter: (a, b) => (moment(a.updateTime).valueOf() - moment(b.updateTime).valueOf()),
                render: (text) => <span>{text && text.replace(/\.0$/, '')}</span>
            },
            {
                title: '附件',
                dataIndex: 'trainPlanFileList',
                width: 120,
                align: "center",
                render: (text, record) => <span onClick={() => this.checkfile(record)} style={{ cursor: "pointer", 'color': '#3383da' }}>查看附件</span>
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                align: "center",
                sorter: (a, b) => (Number(a.status) - Number(b.status)),
                render: (text,record) => { return userTypeVerty == 'approve' ?(text == 3 ? '已完成' : "未完成"):(text == null ? '未申请':(text == 0 ? '未提交' : (text == 1 ||text == 2 ? "已申请" : (text == 3 ?"已完成":""))))  }
            },
            {
                title: '操作',
                dataIndex: 'modify',
                align: "center",
                fixed: "right",
                width: 100,
                render: (text, record) => {
                    return (userTypeVerty == 'approve' ? (record.status==3?"":<div>
                    <Button type="primary" disabled={record.status == 20}
                        onClick={() => { this.editTrainPlan(record) }}
                        style={{ marginRight: 5 }} size={'small'}>编辑</Button>
                </div>) :(record.status == null?(<Button type="primary"
                        onClick={() => { this.applyTrain(record) }}
                        style={{ marginRight: 5 }} size={'small'}>申请</Button>):"") )
                }
            }
        ];
        return (
            <Layout title={"供应商培训策划类型管理"}>

                <SchemeTypesTree />
                {/* <Card title={userTypeVerty == 'approve' ? <TableOpterta /> : ""} extra={<Search placeholder="搜索培训策划类型名称" onSearch={value => { this.handleSearch(value) }} enterButton />}>
                    {
                        toggleStore.toggles.get(SHOW_NewTrainPlan_MODEL) && <NewTrainScheme refreshData={() => this.loaddata()} />
                    }
                    {
                        toggleStore.toggles.get(SHOW_EditTrainPlan_MODEL) && <EditTrainPlan editrecord={editrecord} refreshData={() => this.loaddata()} />
                    }
                    {
                        toggleStore.toggles.get(SHOW_CheckAttachedFiles_MODEL) && <CheckAttachedFiles editrecord={editrecord} />
                    }
                    {
                        toggleStore.toggles.get(SHOW_ApplyTrain_MODEL) && <ApplyTrain editrecord={editrecord} refreshData={() => this.loaddata()} />
                    }
                    <Table
                        size='middle'
                        loading={loading}
                        className={'gys_table_height'}
                        bordered={true} rowKey={(text) => text.id} rowSelection={userTypeVerty == 'approve' ? rowSelection : null} scroll={{ x: 1980 }} columns={columns} pagination={{
                            showTotal: () => `共${this.state.trainPlanList.recordsTotal}条`, current: curPage, onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: {
                                goButton: <Button type="link" size={'small'}>
                                    跳转
                            </Button>
                            }, total: this.state.trainPlanList.recordsTotal, pageSize: 20
                        }} dataSource={this.state.trainPlanList.list} />
                </Card> */}



            </Layout>
        )
    }
}
TrainingSchemeTypes.propTypes = {
}
export default Form.create({ name: 'TrainingSchemeTypes' })(TrainingSchemeTypes);