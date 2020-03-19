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
import { SHOW_TrainApplyDetail_MODEL, SHOW_CheckAttachedFiles_MODEL, SHOW_Process_MODEL } from "../../../../constants/toggleTypes";
import TrainApplyDetail from "./components/TrainApplyDetail";
import CheckAttachedFiles from "../../../../components/CheckAttachedFiles";
import ShowProcessModel from "../../../../components/ShowProcessModel";
@inject('toggleStore')
@observer
class TrainApplication extends Component {
    state = {
        trainApplyList: {
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
        userTypeVerty: "sup"
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
        const { userTypeVerty } = this.state;
        this.setState({
            curPage: pageNum,
            loading: true
        })
        let searchValue = this.state.searchValue;
        const { userId } = supplierTrain.pageInfo
        let trainApplyList = userTypeVerty == "approve" ? await supplierTrain.getTrainApplyOfApprover(userId, pageNum, rowNum, searchValue) : await supplierTrain.getTrainApplyOfGys(userId, pageNum, rowNum, searchValue);
        console.log(trainApplyList)
        this.setState({
            trainApplyList: trainApplyList,
            loading: false
        })
    }
    async componentDidMount() {
        const { roleNameKey } = supplierTrain.pageInfo;
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
        this.loaddata()
    }
    //分页查询
    async pageChange(page, num) {
        this.setState({
            curPage: page,
            selectedRowKeys: []
        })
        this.loaddata(page, num)
    }
    //编辑培训计划
    async editTrainPlan(record) {
        const { toggleStore } = this.props;
        this.setState({
            editrecord: record,
        })
        toggleStore.setToggle(SHOW_EditTrainPlan_MODEL)
    }
    //查看培训申请详情
    checkApplyDetail(record) {
        const { toggleStore } = this.props;
        this.setState({
            editrecord: record,
        })
        toggleStore.setToggle(SHOW_TrainApplyDetail_MODEL)
    }
    //查看附件详情
    checkfile(record) {
        const { toggleStore } = this.props;
        this.setState({
            editrecord: record,
        })
        toggleStore.setToggle(SHOW_CheckAttachedFiles_MODEL)
    }
    //流程
    async approveApply(record) {
        const { toggleStore } = this.props;
        let { processinstid, id } = record;
        let { userId } = supplierTrain.pageInfo;
        let openurl = supplierTrain.approveUrl + `&processInstanceId=${processinstid}&businessInstId=${id}&userId=${userId}`
        toggleStore.setModelOptions({
            detail: record,
            modelOptions: {
                title: '培训申请审批',
                url: openurl
            },
            model: SHOW_Process_MODEL
        })
        toggleStore.setToggle(SHOW_Process_MODEL)
        this.loaddata()
    }
    //供应商申请——选择审批人
    applyTrain(record) {
        let { userId } = supplierTrain.pageInfo;
        //此处调用流程申请页面
        this.chooseTrainApprover(record, record.id, userId);
    }
    //流程
    chooseTrainApprover(record, trainApplyId, userId) {
        const { toggleStore } = this.props;
        let openurl = supplierTrain.processUrl + `&businessInstId=${trainApplyId}&userId=${userId}`
        console.log(openurl)
        toggleStore.setModelOptions({
            detail: record,
            modelOptions: {
                title: '申请培训',
                url: openurl
            },
            model: SHOW_Process_MODEL
        })
        toggleStore.setToggle(SHOW_Process_MODEL)
    }
    render() {
        const { toggleStore } = this.props;
        const { userTypeVerty, loading, selectedRowKeys, curPage, editrecord } = this.state;
        const columns_supplier = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                fixed:"left",
                render: (text, index, key) => key + 1
            },
            {
                title: '培训计划名称',
                dataIndex: 'trainplanname',
                width: 250,
                align: "center",
                fixed:"left",
                render: (text, record) => <Tooltip title={text}><span onClick={() => this.checkApplyDetail(record)} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '发布人',
                dataIndex: 'createuser',
                width: 150,
                align: "center",
            },
            {
                title: '发布时间',
                dataIndex: 'trainplancreatetime',
                width: 150,
                align: "center",
                sorter: (a, b) => (moment(a.trainplancreatetime).valueOf() - moment(b.trainplancreatetime).valueOf()),
                render: (text) => <Tooltip title={text && text.substr(0, 10)}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '培训类型',
                dataIndex: 'traintypename',
                width: 200,
                align: "center",
            },
            {
                title: '培训班次',
                dataIndex: 'trainshift',
                width: 150,
                align: "center",
                sorter: (a, b) => (moment(a.trainshift).valueOf() - moment(b.trainshift).valueOf()),
                render: (text) => <Tooltip title={text && text.substr(0, 10)}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '培训主题',
                dataIndex: 'trainTheme',
                width: 200,
                align: "center",
            },
            /* {
                title: '培训地点',
                dataIndex: 'trainPlace',
                width: 200,
                align: "center",
            }, */
            {
                title: '申请时间',
                dataIndex: 'createtime',
                width: 150,
                align: "center",
                sorter: (a, b) => (moment(a.createtime).valueOf() - moment(b.createtime).valueOf()),
                render: (text) => <Tooltip title={text && text.substr(0, 10)}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                align: "center",
                sorter: (a, b) => (Number(a.status) - Number(b.status)),
                render: (text,record) => { return text == 0 ? '未提交' : (text == 1 ? "待审批" : (text == 2 ? "实施中" : (text == 3 ?(record.score?"已完成":"待评价"):""))) }
            },
            {
                title: '附件',
                dataIndex: 'trainPlanFileList',
                width: 150,
                align: "center",
                render: (text, record) => <span onClick={() => this.checkfile(record)} style={{ cursor: "pointer", 'color': '#3383da' }}>查看附件</span>
            },
            {
                title: '操作',
                dataIndex: 'modify',
                align: "center",
                fixed: "right",
                width: 100,
                render: (text, record) => {
                    return (record.status == 0 ? (<Button type="primary"
                        onClick={() => { this.applyTrain(record) }}
                        style={{ marginRight: 5 }} size={'small'}>申请</Button>) : (record.status == 3 &&  record.score=='' ?  <Button type="primary"
                        onClick={() => { this.checkApplyDetail(record) }}
                        style={{ marginRight: 5 }} size={'small'}>评价</Button>:""))
                }
            }
        ];
        const columns_manager = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '培训计划名称',
                dataIndex: 'trainplanname',
                width: 200,
                align: "center",
                render: (text, record) => <Tooltip title={text}><span onClick={() => this.checkApplyDetail(record)} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '申请人',
                dataIndex: 'applyusername',
                width: 100,
                align: "center",
            },
            {
                title: '申请时间',
                dataIndex: 'applytime',
                width: 150,
                align: "center",
            },
            {
                title: '培训类型',
                dataIndex: 'traintypename',
                width: 200,
                align: "center",
            },
            {
                title: '培训班次',
                dataIndex: 'trainshift',
                width: 150,
                align: "center",
                sorter: (a, b) => (moment(a.createTime).valueOf() - moment(b.createTime).valueOf()),
                render: (text) => <Tooltip title={text && text.substr(0, 10)}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '培训主题',
                dataIndex: 'traintheme',
                width: 200,
                align: "center",
            },
            /* {
                title: '培训地点',
                dataIndex: 'trainPlace',
                width: 200,
                align: "center",
            }, */
            /* {
                title: '发布时间',
                dataIndex: 'createTime',
                width: 200,
                align: "center",
                sorter: (a, b) => (moment(a.createTime).valueOf() - moment(b.createTime).valueOf()),
                render: (text) => <Tooltip title={text && text.substr(0, 10)}><span>{text && text.substr(0, 10)}</span></Tooltip>
            }, */
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                align: "center",
                sorter: (a, b) => (Number(a.status) - Number(b.status)),
                render: (text) => { return text == 0 ? '未申请' : (text == 1 ? "待审批" : "已审批") }
            },
            {
                title: '附件',
                dataIndex: 'trainPlanFileList',
                width: 100,
                align: "center",
                render: (text, record) => <span onClick={() => this.checkfile(record)} style={{ cursor: "pointer", 'color': '#3383da' }}>查看附件</span>
            },
            {
                title: '操作',
                dataIndex: 'modify',
                align: "center",
                width: 100,
                fixed: "right",
                render: (text, record) => {
                    return record.status == 2||record.status == 3 ? "" : (<div>
                        <Button type="primary" disabled={record.status == 2||record.status == 3}
                            onClick={() => { this.approveApply(record) }}
                            style={{ marginRight: 5 }} size={'small'}>审批</Button>
                    </div>)
                }


            }
        ];
        return (
            <Layout title={"供应商培训管理"}>
                <Card title={""} extra={<Search placeholder="搜索培训计划名称" onSearch={value => { this.handleSearch(value) }} enterButton />}>
                    {
                        toggleStore.toggles.get(SHOW_TrainApplyDetail_MODEL) && <TrainApplyDetail editrecord={editrecord} userTypeVerty={userTypeVerty} />
                    }
                    {
                        toggleStore.toggles.get(SHOW_CheckAttachedFiles_MODEL) && <CheckAttachedFiles editrecord={editrecord} />
                    }
                    {toggleStore.toggles.get(SHOW_Process_MODEL) && <ShowProcessModel />}
                    <Table
                        size='middle'
                        loading={loading}
                        className={'gys_table_height'}
                        bordered={true} rowKey={(text) => text.id} scroll={{ x: userTypeVerty == 'approve' ? 1200 : 1200 }} columns={userTypeVerty == 'approve' ? columns_manager : columns_supplier} pagination={{
                            showTotal: () => `共${this.state.trainApplyList.recordsTotal}条`, current: curPage, onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: {
                                goButton: <Button type="link" size={'small'}>
                                    跳转
                            </Button>
                            }, total: this.state.trainApplyList.recordsTotal, pageSize: 20
                        }} dataSource={this.state.trainApplyList.list} />
                </Card>
            </Layout>
        )
    }
}
TrainApplication.propTypes = {
}
export default Form.create({ name: 'TrainApplication' })(TrainApplication);