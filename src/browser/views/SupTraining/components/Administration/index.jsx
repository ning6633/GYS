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

@inject('toggleStore')
@observer
class Administration extends Component {
    state={
        pageNum:1,
        rowNum:20,
        queryName:'',
        suplier:{
            list:[],
            recordsTotal:0
        },
        loading:true
    }


    // signUp=(record)=>{
    //     //报名
    //     let {toggleStore} = this.props
    //     toggleStore.setToggle(SHOW_NoticeSignUp_MODEL)
    // }
    // details=()=>{
    //     //展示培训通知详情
    //     let {toggleStore} = this.props
    //     toggleStore.setToggle(SHOW_NoticeDetails_MODEL)
    // }
    async loaddata(){
        let {pageNum,rowNum,queryName} = this.state
        this.setState({
            loading:true
        })
        let res = await supplierTrain.trainAccessApplyHasPage({pageNum,rowNum,queryName})
        if(res.code == 200 ){
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
    pageChange=(pageNum,rowNum)=>{
        this.setState({
            pageNum,
            rowNum
        },()=>{
            this.loaddata()
        })
    }
    onSearchValue=(e)=>{
        this.setState({
            pageNum:1,
            queryName:e
        },()=>{
            this.loaddata()
        })
    }
    componentDidMount=()=>{
        this.loaddata()
    }
    render() {
       let {rowNum,pageNum,suplier,loading,queryName} = this.state
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '申请单位',
                dataIndex: 'gysName',
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
                // render:(text,record)=>{
                //     return (
                //     <span style={{ cursor: "pointer", 'color': '#3383da' }} onClick={()=>{this.details()}}>{text}</span>
                //     )
                // }
            },
            {
                title: '拟准入等级',
                dataIndex: 'admittanceGrade',
                width: 100,
                align: "center",
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
                width: 150,
                align: "center",
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                align: "center",
                render:(text,record)=>{
                    switch(text){
                        case "0":
                            return (<span style={{color:"#fe1e1e"}}>待通知</span>)
                            break ;
                        case "1":
                            return (<span style={{color:"#fe1e1e"}}>待通知</span>)
                            break ;
                        case "2":
                            return (<span style={{color:"#27a527"}}>待报名</span>)
                            break ;
                        case "3":
                            return (<span style={{color:"#d7a91f"}}>实施中</span>)
                            break ;
                        case "4":
                            return (<span style={{color:"#8d8d8d"}}>已完成</span>)
                            break ;
                        default:
                            break;
                    }
                }
            },
        ];
        const SearchValue = ()=>{
            return (
                <Search placeholder="请输入搜索内容" defaultValue = {queryName} onSearch={(e) => { this.onSearchValue(e) }} enterButton  />
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
                        scroll={{ x: 695 }} 
                        columns={columns} 
                        pagination={{
                            showTotal: () => `共${suplier.recordsTotal}条`, 
                            current: pageNum,
                             onChange: (page, num) => { this.pageChange(page, num) }, 
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
                        
                        </Card>
            </Layout>
        )
    }
}

export default Administration;