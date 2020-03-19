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
import { SHOW_NewTrainPlan_MODEL, SHOW_ChooseListModel_MODEL, SHOW_CheckAttachedFiles_MODEL, SHOW_ApplyTrain_MODEL } from "../../../../constants/toggleTypes";
import ApplyTrain from "./components/ApplyTrain";
import ChooseListModel from "../../../../components/ChooseListModel";
@inject('toggleStore')
@observer
class TrainingApplySpecial extends Component {
    state = {
        trainPlanList: {
            list: [],
            recordsTotal: 0
        },
        gyslist: {
            list: [],
            recordsTotal: 0
        },
        curPage: 1,
        searchValue: {
            trainPlanName: ""
        },
        listModelOption:{},
        selectedrecords: [],
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        editrecord: "",
        userTypeVerty: "",
        modelType: 0,
        name: "",
        pxnrfs: "",
        time: "",
        pxfy: "",
        pxdd1: "",
        zbdw: "",
        listTrainCertificate: [],
        listTrainApplyNewUserVO: [],
      
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
        const { userTypeVerty, searchValue } = this.state;
        this.setState({
            curPage: pageNum,
            loading: true
        })
        let params = {
            // ...searchValue,
            pageNum,
            rowNum
        }
        let userId = supplierTrain.pageInfo.userId;
        console.log(userTypeVerty)
        let trainPlanList = userTypeVerty == "approve" ? await supplierTrain.getTrainApplyNew4PJZX(params) :null
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
        console.log(ApproveroleLists)
        //获取自身角色信息
        let roles = roleNameKey.split(',')
        let leaderRole = 'ld2053'
        let isPrincipal = roles.some(role => {
            role == leaderRole
        })
        //判断是否是领导角色
        if (isPrincipal) {
            this.setState({
                userTypeVerty: 'principal'
            })
        } else {
            //判断是否是审核角色
            for (let roleName of roles) {
                let userVerty = ApproveroleLists.some(item => item == roleName)

                if (userVerty) {
                  
                    this.setState({
                        userTypeVerty: 'approve'
                    },()=>{
                        this.loaddata()
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
    //编辑培训计划
    async editTrainPlan(record) {
        const { toggleStore } = this.props;
        this.setState({
            editrecord: record,
            modelType: 2
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
        const { toggleStore } = this.props;
        this.setState({
            editrecord: record,
        })
        toggleStore.setToggle(SHOW_ApplyTrain_MODEL)
    }
    covertype(arr) {
        let strarr = []
        arr.forEach(item => {
            strarr.push(item)
        })
        return strarr.join('，')
    }

   async chooseGysApplyInfo(type,record) {
    const { toggleStore } = this.props;
        let title = ''
        let result 
        switch (type) {
            case 'applyed':
                title = '已申请供应商'
                
                result = await supplierTrain.getTrainApplyGysApplyed(record.trainid)
                break;
            case 'waited':
                title = '待审批供应商'
                result = await supplierTrain.getTrainApplyGysWaited(record.trainid)

                break;
            case 'unApply':
                title = '未申请供应商'
                result = await supplierTrain.getTrainApplyGysNoApplyedNum(record.trainid)
                
                break;
                case 'userApplyed':
                title = '已申请总人数'
                result = await supplierTrain.getTrainUserApplyedNum(record.trainid)
                
                break;
                
            default:
                break;
        }
        console.log(result)
        if(result.code==200){
            console.log(result.data)
            const listModelOption = {
                model: SHOW_ChooseListModel_MODEL,
                title: title,
                columns:type!='userApplyed'
                ?
                [
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
                    },
                    {
                        title: '社会信用代码',
                        dataIndex: 'code',
                        width: 250,
                        align: "center",
                       
                    },
                    {
                        title: '法人代表',
                        dataIndex: 'contacts',
                        width: 100,
                        align: "center",
                      
                    },
                    {
                        title: '供应商联系方式',
                        dataIndex: 'contacts_tel',
                        width: 150,
                        align: "center",
                      
                    },
                    {
                        title: '供应商邮箱',
                        dataIndex: 'e_mail',
                        width: 150,
                        align: "center",
                      
                    },
                    
                 
                ]
                :
                [
                    {
                        title: '序号',
                        dataIndex: 'key',
                        width: 45,
                        align: "center",
                        // fixed: "left",
                        render: (text, index, key) => key + 1
                    },
                    {
                        title: '姓名',
                        dataIndex: 'username',
                        width: 100,
                        align: "center",
                    },
                    {
                        title: '性别',
                        dataIndex: 'gender',
                        width: 80,
                        align: "center",
                       
                    },
                    {
                        title: '所属供应商',
                        dataIndex: 'gysname',
                        width: 100,
                        align: "center",
                      
                    },
                    {
                        title: '所属组织',
                        dataIndex: 'userorg',
                        width: 100,
                        align: "center",
                      
                    },
                    {
                        title: '现任职务',
                        dataIndex: 'title',
                        width: 100,
                        align: "center",
                      
                    },
                    {
                        title: '联系方式',
                        dataIndex: 'tel',
                        width: 150,
                        align: "center",
                      
                    },
                 
                 
                ]
            }
            this.setState({
                gyslist:{
                    list:result.data,
                    recordsTotal:result.data.length
                },
                listModelOption
            })
    toggleStore.setToggle(SHOW_ChooseListModel_MODEL);
      
        }
      
    }

    coverStatus(status, userType) {
        let str = ''
        // 状态：0未审批，1已审批，2报名中，3已完成，4已截止
        switch (status) {
            case null:
                if (userType == 'approve') {
                    str = '未提交'
                }
                break;
            case '0':
                if (userType == 'approve') {
                    str = '已提交'
                } else {
                    str = '待审批'
                }
                break;
            case '1':
                if (userType == 'approve') {
                    str = '已审批'
                }
                break;
            case '2':
                if (userType == 'approve') {
                    str = '报名中'
                }
                break;
            case '3':
                if (userType == 'approve') {
                    str = '已完成'
                }
                break;
            case '4':
                if (userType == 'approve') {
                    str = '已截止'
                }
                break;
            default:
                break;
        }
        return str
    }
    newTrainEvent() {
        const { toggleStore } = this.props
        this.setState({ modelType: 0 })
        toggleStore.setToggle(SHOW_NewTrainPlan_MODEL);
    }
    render() {
        const { toggleStore } = this.props;
        const { userTypeVerty, loading, selectedRowKeys, curPage, editrecord, modelType,listModelOption,gyslist } = this.state;
        const rowSelection = {
            columnWidth: 30,
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        let {
            name,
            pxnrfs,
            time,
            pxfy,
            pxdd1,
            zbdw,
            listTrainCertificate, // 培训证书
            listTrainApplyNewUserVO, // 参训人员

        } = this.state
        const hasSelected = selectedRowKeys.length > 0;
        let TableOpterta = () => (
            <div className="table-operations">
                <Button icon="plus" type="primary" onClick={() => {
                    this.newTrainEvent()
                }}>新建</Button>
                {/* <Button type="primary" disabled={!hasSelected} onClick={() => { console.log("修改") }}>修改</Button> */}
                <Popconfirm className="confirm_del" placement="bottom" title={'确认要删除吗？'} onConfirm={() => { this.deleteTrainPlan() }}>
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
                // fixed:'left',
                render: (text, index, key) => key + 1
            },
            {
                title: '培训计划名称',
                dataIndex: 'name',
                width: 150,
                align: "center",
                // fixed:'left',
                render: (text, record) => <Tooltip title={text}><span onClick={() => this.applyTrain(record)} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 20)}</span></Tooltip>
            },

            {
                title: '培训类型',
                dataIndex: 'traintypename',
                width: 200,
                align: "center",
                // render: (text, record) => <span >{text && this.covertype(text)}</span>
                render:(text,record)=>record.type && `${record.type=="zx"?'专项->':'准入->'} ${this.covertype(text)}` 
            },
            {
                title: '培训主题',
                dataIndex: 'zt',
                width: 150,
                align: "center",
            },

            {
                title: '培训日期',
                dataIndex: 'time',
                width: 150,
                align: "center",
                // sorter: (a, b) => (moment(a.trainShift).valueOf() - moment(b.trainShift).valueOf()),
                // render: (text) => <Tooltip title={text && text.substr(0, 10)}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '培训地点',
                dataIndex: 'trainPlace',
                width: 120,
                align: "center",
                render: (text, record) => <span>{record && `${record.pxdd1} ${record.pxdd2}`}</span>
            },
            {
                title: '培训对象',
                dataIndex: 'pxdx',
                width: 120,
                align: "center",
            },
            {
                title: '人员规模',
                dataIndex: 'rygm',
                width: 80,
                align: "center",
            },
            {
                title: '已申请供应商/家',
                dataIndex: 'gysApplyNewedNum',
                width: 100,
                align: "center",
                render: (text, record) => <span style={{ cursor: "pointer", 'color': '#3283fd', 'textDecoration': 'underline' }} onClick={()=>this.chooseGysApplyInfo('applyed',record)}>{text}</span>
            },
            {
                title: '已申请总人数/人',
                dataIndex: 'userApplyNewedNum',
                width: 100,
                align: "center",
                render: (text, record) => <span style={{ cursor: "pointer", 'color': '#3283fd', 'textDecoration': 'underline' }} onClick={()=>this.chooseGysApplyInfo('userApplyed',record)} >{text}</span>
            },
            {
                title: '待审批供应商/家',
                dataIndex: 'gysWaitedNum',
                width: 100,
                align: "center",
                render: (text, record) => <span style={{ cursor: "pointer", 'color': '#3283fd', 'textDecoration': 'underline' }} onClick={()=>this.chooseGysApplyInfo('waited',record)} >{text}</span>
            },
            {
                title: '未申请供应商/家',
                dataIndex: 'gysNoApplyNewedNum',
                width: 100,
                align: "center",
                render: (text, record) => <span style={{ cursor: "pointer", 'color': '#3283fd', 'textDecoration': 'underline' }} onClick={()=>this.chooseGysApplyInfo('unApply',record)} >{text}</span>
            },
        

            {
                title: '状态',
                dataIndex: 'status',
                width: 80,
                align: "center",
                // fixed:'right',
                sorter: (a, b) => (Number(a.status) - Number(b.status)),
                render: (text, record) => this.coverStatus(text, userTypeVerty)
            },
            // {
            //     title: '操作',
            //     dataIndex: 'modify',
            //     align: "center",
            //     // fixed: "right",
            //     width: 100,
            //     render: (text, record) => {
            //         return (userTypeVerty == 'approve' ? (record.status==3?"":<div>
            //         <Button type="primary" disabled={record.status == 20}
            //             onClick={() => { this.editTrainPlan(record) }}
            //             style={{ marginRight: 5 }} size={'small'}>编辑</Button>
            //     </div>) : ( userTypeVerty == 'principal'?(<Button type="primary"
            //             onClick={() => { this.applyTrain(record) }}
            //             style={{ marginRight: 5 }} size={'small'}>审批</Button>):"") )
            //     }
            // }
        ];
        return (
            <Layout title={"供应商专项培训报名"}>
                <Card extra={<Search placeholder="搜索培训名称" onSearch={value => { this.handleSearch(value) }} enterButton />}>
                    {
                        toggleStore.toggles.get(SHOW_ApplyTrain_MODEL) && <ApplyTrain modelType={modelType} editrecord={editrecord} refreshData={() => this.loaddata()} />
                    }
                    {
                        toggleStore.toggles.get(SHOW_ChooseListModel_MODEL) && <ChooseListModel list={gyslist}  options={listModelOption} pagination={{}}chooseFinishFn={(val) => { }} />
                    }
                  
                    <Table
                        size='middle'
                        loading={loading}
                        className={'gys_table_height'}
                        bordered={true} rowKey={(text) => text.trainid}  columns={columns} pagination={{
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
TrainingApplySpecial.propTypes = {
}
export default Form.create({ name: 'TrainingApplySpecial' })(TrainingApplySpecial);