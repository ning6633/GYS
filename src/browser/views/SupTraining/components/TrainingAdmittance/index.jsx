import React, { Component, Fragment } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Upload, Icon, Tooltip, message, Select, Form, Row, Col, Input, Popconfirm } from 'antd';
import Layout from "../../../../components/Layouts";
const ButtonGroup = Button.Group;
const { Option } = Select;
const { Search } = Input;
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import _ from "lodash";
import { supplierTrain, supplierApproval } from "../../../../actions"
import { SHOW_AddAdmittance_MODEL, SHOW_NoticeDetails_MODEL ,SHOW_NoticeSignUp_MODEL} from "../../../../constants/toggleTypes";
import AddAdmittance from './components/AddAdmittance/index'
import NoticeDetails from '../TrainingNotice/components/NoticeDetails/index'
import SignUp from './components/SignUp'
@inject('toggleStore')
@observer
class TrainingAdmittance extends Component {
    state = {
        pageNum: 1,
        rowNum: 20,
        selectedRowKeys: [],
        selectedRows: [],
        loading: true,
        queryName: '',
        list: [],
        id: '',
        isDelete:true,
        important:[],
        attribute:[]

    }

    async delete() {
        let { selectedRowKeys, selectedRows } = this.state
        let {isDelete} = this.state
        if (isDelete) {
            let res = await supplierTrain.deleteTrainAccessApply(selectedRowKeys)
            if (res.code == 200) {
                this.setState({
                    selectedRowKeys: [],
                    selectedRows: [],

                })
                message.success("删除成功!")
            } else {
                message.error("删除失败!")
            }
            this.loaddata()
        } else{
            message.error("只可以删除未提交项!")
        }
    }
    async submit(record){
        // 提交
        let res = await supplierTrain.uploadTrainAccessApply([record.id])
        console.log(res)
        if(res.code == 200 ){
            message.success('准入培训申请提交成功')
            this.loaddata()
        }

    }
    details = (record) => {
        //展示培训通知详情
        this.setState({
            id: record.trainPlanId
        })
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_NoticeDetails_MODEL)
    }
    onSelectInfo = (selectedRowKeys, selectedRows) => {
        // 手动选择单项信息
        console.log(selectedRows)
        selectedRows.forEach((item) => {
            if (item.status !== "0") {
                this.setState({
                    isDelete:false
                })
            }
        })
        this.setState({
            selectedRowKeys, selectedRows
        })
    }
    onSearchValue = (e) => {
        this.setState({
            queryName: e
        }, () => {
            this.loaddata()
        })
    }
    async loaddata() {
        let { queryName } = this.state
        this.setState({
            loading:true
        })
        let res = await supplierTrain.trainAccessApplyNoPage(queryName)
        console.log(res.data)
        if (res.code == 200) {
            this.setState({
                list: res.data,
                loading: false
            })
        }
    }
    again = () => {
        this.setState({
            loading:false
        },()=>{
            this.loaddata()
        })
        
    }
    async signUp(record){
           // 报名
        //    let res = await supplierTrain.gysZRApplysignUp(record.id)
        //    console.log(res)
        //    if(res.code == 200 ){
        //        message.success('准入培训申请报名成功')
        //        this.loaddata()
        //    }

           this.setState({
            trainpApplyId:record.id,
            info:record
        })
        let {toggleStore} = this.props
        toggleStore.setToggle(SHOW_NoticeSignUp_MODEL)
    }
    async important() {
        // 获取拟准入等级的数据字典
        let res = await supplierTrain.getDic("IMPORTANT")
        if (res.code == 200) {
            this.setState({
                important: res.data
            })
            console.log(res.data)
        } else {
            return
        }
    }
    
    async attribute(){
        // 获取产品分类的数据字典
        let res = await supplierTrain.getDic("ATTRIBUTE")
        if (res.code == 200) {
            this.setState({
                attribute: res.data
            })
            console.log(res.data)
        } else {
            return
        }
    }
    coverAttribute(code){
        const {attribute} =this.state
        let str = ''
        attribute.forEach(item=>{
            if(item.code==code){
                str = item.name
            }
        })
      return str
    }
    coverImportant(code){
        const {important} =this.state
        let str = ''
        important.forEach(item=>{
            if(item.code==code){
                str = item.name
            }
        })
      return str
    }
    componentDidMount = () => {
        this.loaddata()
        this.important()
        this.attribute()
    }
    render() {
        let { toggleStore } = this.props
        let { selectedRowKeys, selectedRows, pageNum, rowNum, list, loading, queryName, id ,trainpApplyId ,info} = this.state
        const rowSelection = {
            columnWidth: "45",
            selectedRowKeys,
            onChange: this.onSelectInfo
        }
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 50,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '拟准入等级',
                dataIndex: 'admittanceGrade',
                width: 150,
                align: "center",
                render:(text)=>  text 
            },
            {
                title: '产品范围',
                dataIndex: 'productScope',
                width: 100,
                align: "center",
            },
            {
                title: '产品类别',
                dataIndex: 'productCategory',
                width: 100,
                align: "center",
                render:(text)=> text 
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                align: "center",
                render: (text, record) => {
                    switch (text) {
                        case "0": return <span style={{ color: "#ff4d4d" }}>未提交</span>
                            break;
                        case "1": return <span style={{ color: "#ff2e2e" }}>待通知</span>
                            break;
                        case "2": return <span style={{ color: "#fdbf81" }}>待报名</span>
                            break;
                        case "3": return <span style={{ color: "#bebebe" }}>已报名</span>
                            break;
                        case "4": return <span style={{ color: "#000" }}>已完成</span>
                            break;
                        default:
                            break;
                    }
                }
            },
            {
                title: '培训通知',
                dataIndex: 'name',
                width: 100,
                align: "center",
                render: (text, record) => {
                    return (
                        <span style={{ cursor: "pointer", 'color': '#3383da' }} onClick={() => { this.details(record) }}>{text}</span>
                    )
                }
            },
            {
                title: '培训类型',
                dataIndex: 'type',
                width: 100,
                align: "center",
                render: (text, record) => {
                    return record.productCategory
                }
            },
            {
                title: '时间',
                dataIndex: 'createTime',
                width: 150,
                align: "center",
                // onCell: () => {
                //     return {
                //         style: {
                //             maxWidth: 200,
                //             overflow: 'hidden',
                //             whiteSpace: 'nowrap',
                //             textOverflow: 'ellipsis',
                //             // cursor:'pointer'
                //         }
                //     }
                // },
                render: (text, record) => {
                    return <span>{text}</span>
                }
            },
            {
                title: '地点',
                dataIndex: 'pxdd1',
                width: 200,
                align: "center",
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 200,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            // cursor:'pointer'
                        }
                    }
                },
                render: (text, record) => {
                    return <Tooltip title={text}><span>{text}</span></Tooltip>
                }
            },
            {
                title: '主题',
                dataIndex: 'zt',
                width: 100,
                align: "center",
            },
            {
                title: '操作',
                dataIndex: 'caozuo',
                width: 50,
                align: "center",
                fixed: "right",
                render: (text, record) => {
                    return (
                        <div>
                            {
                                record.status == 0 ? <Button type="primary" size="small" onClick={() => { this.submit(record) }}>提交</Button>
                                :( record.status == 2 ?<Button type="primary"size="small" onClick={() => { this.signUp(record) }}>报名</Button>
                                :null)
                            }
                        </div>
                       
                    )
                }

            }
        ];
        const SearchValue = () => {
            return (
                <Search placeholder="请输入搜索内容" defaultValue={queryName} onSearch={(e) => { this.onSearchValue(e) }} enterButton />
            )
        }
        const TitleButton = () => {
            return (
                <Fragment>
                    <Button type="primary" onClick={() => {
                        let { toggleStore } = this.props
                        toggleStore.setToggle(SHOW_AddAdmittance_MODEL)
                    }} icon="plus" style={{ marginRight: 20 }}>新建</Button>
                    <Button type="danger" disabled = {!selectedRows.length > 0} onClick={() => { this.delete() }} style={{ marginRight: 20 }}>删除</Button>
                    {/* <Button type="primary" onClick={() => { }}>提交</Button> */}
                </Fragment>
            )
        }
        return (
            <Layout title={"供应商培训管理"}>
                <Card title={<TitleButton />} extra={<SearchValue />}>

                    <Table
                        size='middle'
                        loading={loading}
                        className={'gys_table_height'}
                        bordered={true}
                        rowKey={(text) => text.id}
                        rowSelection={rowSelection}
                        scroll={{ x: 1350 }}
                        columns={columns}
                        pagination={{
                            showTotal: () => `共${list.length}条`, 
                            //  onChange: (page, num) => { this.pageChange(page, num) },
                              showQuickJumper: {
                                goButton: <Button type="link" size={'small'}>
                                    跳转
                            </Button>
                            }, 
                            total: list.length, 
                            pageSize: 20
                        }} 
                        dataSource={list}
                    />
                    {
                        toggleStore.toggles.get(SHOW_AddAdmittance_MODEL) && <AddAdmittance loaddata={this.again} />
                    }
                    {
                        toggleStore.toggles.get(SHOW_NoticeDetails_MODEL) && <NoticeDetails id={id} />
                    }
                      {
                            toggleStore.toggles.get(SHOW_NoticeSignUp_MODEL) && <SignUp id={trainpApplyId} loaddata={this.again} info={info}/>
                        }
                </Card>
            </Layout>
        )
    }
}

export default TrainingAdmittance;