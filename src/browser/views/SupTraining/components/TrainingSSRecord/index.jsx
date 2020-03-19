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
import NewTrainSS from "./components/NewTrainSS";
import EditTrainPlan from "./components/EditTrainPlan";
import CheckAttachedFiles from "../../../../components/CheckAttachedFiles";
import ApplyTrain from "./components/ApplyTrain";
@inject('toggleStore')
@observer
class TrainingSSRecord extends Component {
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
        userTypeVerty: "",
        modelType:0
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
        const { userTypeVerty ,searchValue} = this.state;
        this.setState({
            curPage: pageNum,
            loading: true
        })
        let params = {
            ...searchValue,
            pageNum,
            rowNum
        }
        let userId = supplierTrain.pageInfo.userId;
        let trainPlanList = userTypeVerty == "approve" ? await supplierTrain.getTrainSSRecord(params) :null
        console.log(trainPlanList)
        if(trainPlanList==null) return
        this.setState({
            trainPlanList: trainPlanList.data,
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
        let leaderRole = 'ld2053'
        let isPrincipal = roles.some(role=>{
            role==leaderRole
        })
        //判断是否是领导角色
        if(isPrincipal){
            this.setState({
                userTypeVerty: 'principal'
            })
        }else{
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
    //删除培训计划
    async removeTrainSSRecord() {
        await supplierTrain.removeTrainSSRecord(this.state.selectedRowKeys);
        this.loaddata()
        this.setState({ selectedRowKeys: [] })
    }
    //查看培训计划详情
    async getTrainPlanDetail(record) {
        const { toggleStore } = this.props;
        this.setState({
            editrecord: record,
            modelType:1
        })
        toggleStore.setToggle(SHOW_NewTrainPlan_MODEL)
    }
    //查看附件详情
    checkfile(record) {
        const { toggleStore } = this.props;
        this.setState({
            editrecord: record,
        })
        toggleStore.setToggle(SHOW_CheckAttachedFiles_MODEL)
    }
    //修改实施记录
    editSSRecord(record) {
        const { toggleStore } = this.props;
        this.setState({
            editrecord: record,
            modelType:2
        })
        toggleStore.setToggle(SHOW_NewTrainPlan_MODEL)
    }
    covertype(arr) {

        if(arr==null) return
        let strarr = []
        arr.forEach(item => {
            strarr.push(item.name)
        })
        return strarr.join('，')
    }
   newTrainEvent(){
       const { toggleStore}=this.props
       this.setState({modelType:0})
       toggleStore.setToggle(SHOW_NewTrainPlan_MODEL); 
   }
    render() {
        const { toggleStore } = this.props;
        const { userTypeVerty, loading, selectedRowKeys, curPage, editrecord ,modelType ,trainPlanList} = this.state;
        const rowSelection = {
            columnWidth: 30,
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        let TableOpterta = () => (
            <div className="table-operations">
                <Button icon="plus" type="primary" onClick={() => {
                    this.newTrainEvent()
                      }}>新建</Button>
                {/* <Button type="primary" disabled={!hasSelected} onClick={() => { console.log("修改") }}>修改</Button> */}
                <Popconfirm className="confirm_del" placement="bottom" title={'确认要删除吗？'} onConfirm={() => { this.removeTrainSSRecord() }}>
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
                render: (text, index, key) => key + 1
            },
            {
                title: '培训名称',
                dataIndex: 'name',
                width: 150,
                align: "center",
                render: (text, record) => <Tooltip title={text}><span  style={{ cursor: "pointer", 'color': '#3383da'}} onClick={() => this.getTrainPlanDetail(record)}>{text && text.substr(0, 15)}</span></Tooltip>
            },
            {
                title: '培训类型',
                dataIndex: 'traintypename',
                width: 150,
                align: "center",
            //  render: (text, record) => <span >{text && this.covertype(text)}</span>
            },
            {
                title: '人员规模 / 人',
                dataIndex: 'rygm',
                width: 80,
                align: "center",
            },
        
            {
                title: '培训日期',
                dataIndex: 'time',
                width: 120,
                align: "center",
                // sorter: (a, b) => (moment(a.trainShift).valueOf() - moment(b.trainShift).valueOf()),
                // render: (text) => <Tooltip title={text && text.substr(0, 10)}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '培训地点',
                dataIndex: 'trainPlace',
                width: 120,
                align: "center",
                render: (text,record) => <span>{record && `${record.pxdd1} ${record.pxdd2}`}</span>
            },
         
            {
                title: '培训主题',
                dataIndex: 'zt',
                width: 150,
                align: "center",
            },
            
            {
                title: '培训对象',
                dataIndex: 'pxdx',
                width: 150,
                align: "center",
            },
            {
                title: '费用（元/人）',
                dataIndex: 'pxfy',
                width: 100,
                align: "center",
            },
            {
                title: '实际参加人数',
                dataIndex: 'realTrainImplementUserNewNum',
                width: 100,
                align: "center",
            },
            {
                title: '未通过人数',
                dataIndex: 'noPassTrainImplementUserNewNum',
                width: 100,
                align: "center",
            },
            // {
            //     title: '更新时间',
            //     dataIndex: 'updateTime',
            //     width: 130,
            //     align: "center",
            //     sorter: (a, b) => (moment(a.updateTime).valueOf() - moment(b.updateTime).valueOf()),
            //     render: (text) => <span>{text && text.replace(/\.0$/, '')}</span>
            // },
          
            // {
            //     title: '状态',
            //     dataIndex: 'status',
            //     width: 80,
            //     align: "center",
            //     sorter: (a, b) => (Number(a.status) - Number(b.status)),
            //     render: (text,record) => { return userTypeVerty == 'approve' ?(text == 3 ? '已完成' : "未完成"):(text == null ? '未申请':(text == 0 ? '未提交' : (text == 1 ||text == 2 ? "已申请" : (text == 3 ?"已完成":""))))  }
            // },
            {
                title: '操作',
                dataIndex: 'modify',
                align: "center",
                fixed: "right",
                width: 100,
                render: (text, record) => {
                    return ( <Button type="primary"
                    onClick={() => { this.editSSRecord(record) }}
                    style={{ marginRight: 5 }} size={'small'}>编辑</Button>)
                }
            }
        ];
        return (
            <Layout title={"供应商实施管理"}>
                <Card title={userTypeVerty == 'approve' ? <TableOpterta /> : ""} extra={<Search placeholder="搜索培训计划名称" onSearch={value => { this.handleSearch(value) }} enterButton />}>
                    {
                        toggleStore.toggles.get(SHOW_NewTrainPlan_MODEL) && <NewTrainSS modelType={modelType} info={editrecord} refreshData={() => this.loaddata()} />
                    }
                   
                    {/* {
                        toggleStore.toggles.get(SHOW_EditTrainPlan_MODEL) && <EditTrainPlan editrecord={editrecord} refreshData={() => this.loaddata()} />
                    } */}
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
                            showTotal: () => `共${trainPlanList.recordsTotal}条`, current: curPage, onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: {
                                goButton: <Button type="link" size={'small'}>
                                    跳转
                            </Button>
                            }, total: trainPlanList.recordsTotal, pageSize: 20
                        }} dataSource={trainPlanList.list} />
                </Card>
            </Layout>
        )
    }
}
TrainingSSRecord.propTypes = {
}
export default Form.create({ name: 'TrainingSSRecord' })(TrainingSSRecord);