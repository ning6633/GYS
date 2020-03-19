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
import { SHOW_NewTrainPlan_MODEL, SHOW_Process_MODEL, SHOW_CheckAttachedFiles_MODEL, SHOW_ApplyTrain_MODEL } from "../../../../constants/toggleTypes";
import NewTrainPlan from "./components/NewTrainPlan";
import ShowProcessModel from "../../../../components/ShowProcessModel";
import CheckAttachedFiles from "../../../../components/CheckAttachedFiles";
import ApplyTrain from "./components/ApplyTrain";
@inject('toggleStore')
@observer
class TrainingPlan extends Component {
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


     //审批人员审批
     async approveApply(record) {
        const { toggleStore } = this.props;
        let { processinstid, id } = record;
        let { userId } = supplierTrain.pageInfo;
        let openurl = supplierTrain.approvePlanUrl + `&processInstanceId=${processinstid}&businessInstId=${id}&userId=${userId}`
        console.log(openurl)
        toggleStore.setModelOptions({
            detail: record,
            modelOptions: {
                title: '培训计划审批',
                url: openurl
            },
            model: SHOW_Process_MODEL
        })
        toggleStore.setToggle(SHOW_Process_MODEL)
        this.loaddata()
    }

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
        let trainPlanList = userTypeVerty == "approve" ? await supplierTrain.getTrainPlan(params) : await supplierTrain.getTrainPlanByPrincipal(params);
        console.log(trainPlanList)
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
    async deleteTrainPlan() {
        await supplierTrain.deleteTrainPlanNew(this.state.selectedRowKeys);
        this.loaddata()
        this.setState({ selectedRowKeys: [] })
    }
    //查看培训计划详情
    async getTrainPlanDetail(record){
        const { toggleStore } = this.props;
        this.setState({
            editrecord: record,
            modelType:1
        })
        toggleStore.setToggle(SHOW_NewTrainPlan_MODEL)
    }
    //编辑培训计划
    async editTrainPlan(record) {
        const { toggleStore } = this.props;
        this.setState({
            editrecord: record,
            modelType:2
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
    //申请培训
    applyTrain(record) {
        // const { toggleStore } = this.props;
        // this.setState({
        //     editrecord: record,
        // })
        // toggleStore.setToggle(SHOW_ApplyTrain_MODEL)

    }
      // 提交
      async directHandleTask(record){
        let res = await supplierTrain.directHandlePlan(record.id,supplierTrain.PlanDefinitionKey);
        if(res.code == 200){
            message.success("提交成功")
            this.loaddata()
        }
    }
    covertype(arr) {
        let strarr = []
        if(arr==null) return
        arr.forEach(item => {
            strarr.push(item.name)
        })
        return strarr.join('，')
    }
    coverStatus(status,userType,record){
        let str= ''
        // 状态：0未审批，1已审批，2报名中，3已完成，4已截止
        switch (status) {
            case null:
                  if(userType=='approve'){
                      str = '未提交'
                  }
                break;
                case '0':
                if(userType=='approve' && record.processinstid==null){
                    str = '待提交'
                }else if(userType=='approve' && record.processinstid!=null){
                    str = '已提交'
                }else{
                    str = '待审批'
                }
              break;
              case '1':
                  str = '已审批'
           
            break;
            case '2':
            if(userType=='approve'){
                str = '报名中'
            }
          break;
          case '3':
          if(userType=='approve'){
              str = '已完成'
          }
        break;
        case '4':
        if(userType=='approve'){
            str = '已截止'
        }
      break;
            default:
                break;
        }
        return str
    }
   newTrainEvent(){
       const { toggleStore}=this.props
       this.setState({modelType:0})
       toggleStore.setToggle(SHOW_NewTrainPlan_MODEL); 
   }
    render() {
        const { toggleStore } = this.props;
        const { userTypeVerty, loading, selectedRowKeys, curPage, editrecord ,modelType ,info} = this.state;
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
                <Popconfirm className="confirm_del" placement="bottom" title={'确认要删除吗？'} disabled={!hasSelected} onConfirm={() => { this.deleteTrainPlan() }}>
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
                title: '培训计划名称',
                dataIndex: 'name',
                width: 150,
                align: "center",
                render: (text, record) => <Tooltip title={text}><span  style={{ cursor: "pointer", 'color': '#3383da'}} onClick={() => this.getTrainPlanDetail(record)}>{text && text.substr(0, 15)}</span></Tooltip>
            },
            // {
            //     title: '培训策划',
            //     dataIndex: 'trainplotName',
            //     width: 150,
            //     align: "center",
            // },
            {
                title: '培训类型',
                dataIndex: 'trainplottype',
                width: 150,
                align: "center",
               // render: (text, record) => <span >{text && this.covertype(text)}</span>,
                render:(text,record)=>record.type && `${record.type=="zx"?'专项->':'准入->'} ${this.covertype(text)}` 
            },
            {
                title: '人员规模',
                dataIndex: 'rygm',
                width: 60,
                align: "center",
            },
            {
                title: '培训主题',
                dataIndex: 'zt',
                width: 150,
                align: "center",
            },
            {
                title: '培训时间',
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
                title: '创建时间',
                dataIndex: 'createTime',
                width: 130,
                align: "center",
                sorter: (a, b) => (moment(a.updateTime).valueOf() - moment(b.updateTime).valueOf()),
                render: (text) => <span>{text && text.replace(/\.0$/, '')}</span>
            },
          
            {
                title: '状态',
                dataIndex: 'status',
                width: 80,
                align: "center",
                fixed: "right",
                sorter: (a, b) => (Number(a.status) - Number(b.status)),
                render: (text,record) =>  this.coverStatus(text,userTypeVerty,record)
            },
            {
                title: '操作',
                dataIndex: 'modify',
                align: "center",
                fixed: "right",
                width: 150,
                render: (text, record) => {
                    return (
                        userTypeVerty == 'approve'
                        ?
                          (record.status =='0' && record.processinstid==null
                            ?
                            <div>
                          <Button type="primary" 
                        onClick={() => { this.editTrainPlan(record) }}
                        style={{ marginRight: 5 }} size={'small'}>编辑</Button>
                         <Button type="primary"
                                onClick={() => { this.directHandleTask(record) }}
                                style={{ marginRight: 5 }} size={'small'}>提交
                                </Button>
                          </div>
                           :
                           null
                           )

                        :
                        record.status =='0'&&  record.processinstid!=null &&
                        <div>
                              <Button type="primary"
                                onClick={() => { this.approveApply(record) }}
                                style={{ marginRight: 5 }} size={'small'}>审批
                                </Button>
                        </div>
                        )
                }
                // render: (text, record) => {
                //     return (userTypeVerty == 'approve' ? (record.status==3?"":<div>
                //     <Button type="primary" disabled={record.status == 20}
                //         onClick={() => { this.editTrainPlan(record) }}
                //         style={{ marginRight: 5 }} size={'small'}>编辑</Button>
                // </div>) : ( userTypeVerty == 'principal'?(<Button type="primary"
                //         onClick={() => { this.applyTrain(record) }}
                //         style={{ marginRight: 5 }} size={'small'}>审批</Button>):"") )
                // }
            }
        ];
        return (
            <Layout title={"供应商培训管理"}>
                <Card title={userTypeVerty == 'approve' ? <TableOpterta /> : ""} extra={<Search placeholder="搜索培训计划名称" onSearch={value => { this.handleSearch(value) }} enterButton />}>
                    {
                        toggleStore.toggles.get(SHOW_NewTrainPlan_MODEL) && <NewTrainPlan modelType={modelType} info={editrecord} refreshData={() => this.loaddata()} />
                    }
                   
                     {toggleStore.toggles.get(SHOW_Process_MODEL) && <ShowProcessModel />}
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
                </Card>
            </Layout>
        )
    }
}
TrainingPlan.propTypes = {
}
export default Form.create({ name: 'TrainingPlan' })(TrainingPlan);