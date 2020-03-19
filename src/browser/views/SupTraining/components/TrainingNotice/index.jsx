import React, { Component } from 'react';
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
import { SHOW_NoticeDetails_MODEL,SHOW_NoticeSignUp_MODEL,SHOW_ManualInput_MODEL} from "../../../../constants/toggleTypes";
import NoticeDetails from './components/NoticeDetails/index'
import SignUp from './components/SignUp/index'

@inject('toggleStore')
@observer
class TrainingNotice extends Component {
    state={
        pageNum:1,
        rowNum:20,
        loading:true,
        suplier:{
            list:[],
            recordsTotal:0
        },
        name:'',
        trainplotId:'',
        loading:true
    }


    signUp=(record)=>{
        //报名
        console.log(record)
        this.setState({
            trainplotId:record.id
        })
        let {toggleStore} = this.props
        toggleStore.setToggle(SHOW_NoticeSignUp_MODEL)
    }
    details=(record)=>{
        //展示培训通知详情
        this.setState({
            trainplotId:record.id, // 找出培训计划ID
        })
        let {toggleStore} = this.props
        toggleStore.setToggle(SHOW_NoticeDetails_MODEL)
    }
    async loaddata(){
        let {pageNum,rowNum,name} = this.state
        let res = await supplierTrain.newTrainPlanGys({pageNum,rowNum,name,status:1})
        console.log(res.data)
        if(res.code == 200){
            this.setState({
                suplier:res.data,
                loading:false
            })
        }else{
            this.setState({
                suplier:{
                    list:[],
                    recordsTotal:0
                },
                loading:false
            })
        }
    }
    onSearchValue=(e)=>{
        // 搜索
        this.setState({
            name:e,
            pageNum:1,
            loaddata:true
        },()=>{
            this.loaddata()
        })
    }
    
    pageChange=(pageNum,rowNum)=>{
        // 分页
        this.setState({
            pageNum,
            rowNum
        },()=>{
            this.loaddata()
        })
    }
    componentDidMount=()=>{
        this.loaddata()
    }
    render() {
       let {toggleStore} = this.props
       let {suplier,name,pageNum,trainplotId,loading} = this.state
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '培训通知名称',
                dataIndex: 'name',
                width: 150,
                align: "center",
                render:(text,record)=>{
                    return (
                    <span style={{ cursor: "pointer", 'color': '#3383da' }} onClick={()=>{this.details(record)}}>{text}</span>
                    )
                }
            },
            {
                title: '培训类型',
                dataIndex: 'trainplotName',
                width: 150,
                align: "center",
            },
            {
                title: '时间',
                dataIndex: 'time',
                width: 200,
                align: "center",
            },
            {
                title: '地点',
                dataIndex: 'pxdd1',
                width: 200,
                align: "center",
            },
            {
                title: '费用',
                dataIndex: 'pxfy',
                width: 100,
                align: "center",
            },
            {
                title: '培训对象',
                dataIndex: 'pxdx',
                width: 100,
                align: "center",
                // sorter: (a, b) => (moment(a.trainShift).valueOf() - moment(b.trainShift).valueOf()),
                // render: (text) => <Tooltip title={text && text.substr(0, 10)}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '培训主题',
                dataIndex: 'zt',
                width: 100,
                align: "center",
            },
            {
                title: '操作',
                dataIndex: 'caozuo',
                width: 50,
                align: "center",
                render:(text,record)=>{
                    return (
                       ( record.applystatus == '0') &&
                        <Button type = "primary" size="small" onClick={()=>{this.signUp(record)}}>报名</Button>
                    )
                }
               
            }
        ];
        const SearchValue = ()=>{
            return (
                <Search placeholder="请输入搜索内容" defaultValue={name} onSearch={(e) => { this.onSearchValue(e) }} enterButton  />
            )
        }
        return (
            <Layout title={"供应商培训管理"}>
               <Card extra={<SearchValue />}>
                
                    <Table
                        size='middle'
                        loading={loading}
                        className={'gys_table_height'}
                        bordered={true}
                        rowKey={(text) => text.id} 
                        // rowSelection={userTypeVerty == 'approve' ? rowSelection : null} 
                        scroll={{ x: 1095 }} 
                        columns={columns} 
                        pagination={{
                            showTotal: () => `共${suplier.recordsTotal}条`,
                             current: pageNum, 
                             onChange: (page, num) => {
                                  this.pageChange(page, num) 
                                }, 
                                showQuickJumper: {
                                goButton: <Button type="link" size={'small'}>
                                    跳转
                            </Button>
                            }, 
                            total: suplier.recordsTotal,
                             pageSize: 20
                        }} 
                        dataSource={suplier.list} 
                        />
                        
                        {
                            toggleStore.toggles.get(SHOW_NoticeDetails_MODEL) && <NoticeDetails id={trainplotId} />
                        }
                       
                        {
                            toggleStore.toggles.get(SHOW_NoticeSignUp_MODEL) && <SignUp id={trainplotId} loaddata={this.loaddata.bind(this)}/>
                        }
                        </Card>
            </Layout>
        )
    }
}

export default TrainingNotice;