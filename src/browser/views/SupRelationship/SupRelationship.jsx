import React, { Component  } from 'react';
import { observer, inject, } from 'mobx-react';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import { Card, Button, Table, Row, Col, Upload, Input, Tooltip, message, Select , Icon} from 'antd';
import { SHOW_Exposure_MODEL, SHOW_AddList_MODEL , SHOW_ShowPJZJ_MODEL } from "../../constants/toggleTypes";
import SupAdd from '../SupCommunication/components/AddList'
import SupQuery  from '../SupExposureStage/components/SupQuery'
import ShowDisciplinaryDetail  from '../SupDisciplinary/components/ShowDisciplinaryDetail'
import Layout from "../../components/Layouts";
import { specialExposure,SupPa } from "../../actions"
import "./index.less"








@inject('toggleStore', 'supplierStore')
@observer
class SupRelationship extends Component {
    state = {
        pageNum:1,
        rowNum:10,

        //交流大会
        comminicationList:[],
        communicationLoading:false,
        CommunicationStatus:'',
        CommunicationSelectedRows:[],


        //曝光信息
        //优质供应商
        exposureList:{},
        exposureLoading:false,
        exposureInfo:{},

        //劣质供应商
        inferiorList:{},
        inferiorLoading:false,


        //惩奖记录
        supdisciplinaryList:[],
        supdisciplinaryLoading:false,
        currentRecord:{}
    }
    //交流大会
    async comminicationloaddata({pageNum = 1,rowNum = 10,limitCount = 10}) {
        this.setState({ CommunicationLoading: true })
        let res = await specialExposure.getComminicationTopTen({pageNum,rowNum,limitCount})
        if (res.code == 200) {
            this.setState({
                comminicationList: res.data.list,
                communicationLoading: false
            })
        }
    }
    CommunicationShow=(redord)=>{
        let _arr = []
        _arr.push(redord)
        this.setState({ CommunicationStatus: 12, CommunicationSelectedRows: _arr })
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_AddList_MODEL);
    }




    //曝光台
    //优质供应商
    async exposureloaddata({isManage=false,rowNum=10,pageNum = 1,providerName = null,isExcellent = ''}) {
        this.setState({ exposureLoading: true ,inferiorLoading:true})
        let res = await specialExposure.getExposure({isManage,rowNum,pageNum,providerName,isExcellent})
        if (res.code == 200) {
            console.log(res.data)
            if(isExcellent == 1){
                this.setState({
                    exposureList: res.data,
                    exposureLoading: false,
                })
            }else if(isExcellent == 2){
                this.setState({
                    inferiorList:res.data,
                    inferiorLoading:false
                })
            }
        }

    }
    showDetails=(redord)=>{
        this.setState({exposureInfo:redord})
        let {toggleStore} = this.props
        toggleStore.setToggle(SHOW_Exposure_MODEL);
    }

    //惩奖记录
    async supdisciplinaryData(pageNum,rowNum) {
        this.setState({
            supdisciplinaryLoading:true
        })
        let options = {
            gysName:'',
            rewardType:''
        }
        this.setState({ exposureLoading: true ,inferiorLoading:true})
        let res =  await SupPa.getRewardsTop(pageNum, rowNum) ;
        if (res.code == 200) {
           console.log(res)
           this.setState({
            supdisciplinaryList:res.data,
            supdisciplinaryLoading:false
           })
        }

    }
    editRecord(record){
        const {toggleStore}  = this.props
        this.setState({
            currentRecord:record
        })
        toggleStore.setToggle(SHOW_ShowPJZJ_MODEL)
    }


    
    
    //转跳
    jump=(hash,state)=>{
        this.props.history.push({pathname:hash,state})
    }
    componentDidMount = () => {
        let {pageNum,rowNum} = this.state
        this.comminicationloaddata({pageNum,rowNum,limitCount:10})
        this.exposureloaddata({pageNum,rowNum,isExcellent:1})
        this.exposureloaddata({pageNum,rowNum,isExcellent:2})
        this.supdisciplinaryData(pageNum,rowNum)
    }
    render() {
        
        let {
            comminicationList,communicationLoading,CommunicationStatus,CommunicationSelectedRows,
            exposureInfo,
            exposureList,exposureLoading,
            inferiorList,inferiorLoading,
            supdisciplinaryList,supdisciplinaryLoading,currentRecord
        } = this.state
        let {toggleStore} = this.props
        //交流大会
        const Communication = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 50,
                align: 'center',
                fixed: 'left',
                render: (text, index, key) => key + 1
            },
            {
                title: '主题',
                dataIndex: 'title',
                align: 'center',
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 200,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
                render: (text, redord) => <Tooltip title={text}><span onClick = {()=>{this.CommunicationShow(redord)}} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '地点',
                dataIndex: 'address',
                width: 150,
                align: 'center',
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 150,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
            },
            {
                title: '内容',
                dataIndex: 'content',
                width: 150,
                align: 'center',
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 150,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
            },
            {
                title: '时间',
                dataIndex: 'start_TIME',
                width: 200,
                align: 'center',
                fixed: 'right',
                render:(text)=>{
                    return (
                    <span>{text && text.substr(0,text.length-2)}</span>
                    )
                }
            },
        ]
        //优劣供应商
        const Exposure = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 50,
                align: 'center',
                fixed: 'left',
                render: (text, index, key) => key + 1
            },
            {
                title: '供应商名称',
                dataIndex: 'name',
                align: 'center',
                render: (text, redord) => <Tooltip title={text}><span onClick={()=>{this.showDetails(redord)}} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '原因',
                dataIndex: 'content',
                align: 'center',
                width: 200,
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 200,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
            },
            {
                title: '曝光时间',
                dataIndex: 'create_time',
                width: 200,
                align: 'center',
                fixed: 'right',
                render:(text)=>{
                    return (
                    <span>{text && text.substring(0,text.length-2)}</span>
                    )
                }
            },
        ]
        //惩奖记录
        const supdisciplinarycolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 50,
                align: 'center',
                fixed: 'left',
                render: (text, index, key) => key + 1
            },
            {
                title: '供应商名称',
                dataIndex: 'gys_NAME',
                align: 'center',
                render: (text, redord) => <Tooltip title={text}><span onClick={()=>{this.editRecord(redord)}} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '类型',
                dataIndex: 'reward_TYPE',
                align: 'center',
                width: 150,
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 100,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
            },
            {
                title: '原因',
                dataIndex: 'reasion',
                align: 'center',
                width: 100,
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 100,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
            },
            {
                title: '惩奖类型',
                dataIndex: 'reward_TIME',
                width: 200,
                align: 'center',
                fixed: 'right',
            },
        ]
        
        return (
            <Layout title={"供应商关系管理"}>
                { 
                //供应商交流大会
                    toggleStore.toggles.get(SHOW_AddList_MODEL) && <SupAdd loaddata={() => { this.loaddata({}) }} statuss={CommunicationStatus} uploadInfo={CommunicationSelectedRows[0]}></SupAdd>
                }
                {
                    //优质、劣质供应商
                    toggleStore.toggles.get(SHOW_Exposure_MODEL) && <SupQuery info = {exposureInfo}></SupQuery>
                }
                {
                    //惩奖记录
                    toggleStore.toggles.get(SHOW_ShowPJZJ_MODEL) && <ShowDisciplinaryDetail  detail={currentRecord} NewPa={(data)=>this.newPafn(data)} refreshData={() => this.loaddata()} />
                }
                
                <Row gutter={24}>
                    <Col span={12}>
                        <Table
                            title={()=>{ return (<div className='GYS_title'><b>供应商交流大会</b><span onClick={()=>{
                                this.jump('Supshowcommunication')
                            }} style={{ cursor: "pointer", 'color': '#3383da' }}>更多<Icon type="unordered-list" /></span></div>)}}
                            size='middle'
                            columns={Communication}
                            dataSource={comminicationList}
                            rowKey={(text) => text.id}
                            bordered={true}
                            loading={communicationLoading}
                            pagination={false}
                            scroll={{x:450}}
                        />
                    </Col>
                    <Col span={12}>
                    <Table
                            title={()=>{ return (<div className='GYS_title'><b>优质供应商</b><span onClick={()=>{
                                this.jump('supexposureplatformquery',1)
                            }} style={{ cursor: "pointer", 'color': '#3383da' }}>更多<Icon type="unordered-list" /></span></div>)}}
                            size='middle'
                            columns={Exposure}
                            dataSource={exposureList.list}
                            rowKey={(text) => text.id}
                            bordered={true}
                            loading={exposureLoading}
                            pagination={false}
                            scroll={{x:450}}
                        />
                    </Col>
                </Row>
                <Row gutter={24} className = 'GYS_List'>
                    <Col span={12}>
                    <Table
                            title={()=>{ return (<div className='GYS_title'><b>劣质供应商</b><span onClick={()=>{
                                this.jump('supexposureplatformquery',2)
                            }} style={{ cursor: "pointer", 'color': '#3383da' }}>更多<Icon type="unordered-list" /></span></div>)}}
                            size='middle'
                            size='middle'
                            columns={Exposure}
                            dataSource={inferiorList.list}
                            rowKey={(text) => text.id}
                            bordered={true}
                            loading={inferiorLoading}
                            pagination={false}
                            scroll={{x:450}}
                        />
                    </Col>
                    <Col span={12}>
                    <Table
                            title={()=>{ return (<div className='GYS_title'><b>奖惩记录</b><span onClick={()=>{
                                this.jump('supdisciplinary')
                            }} style={{ cursor: "pointer", 'color': '#3383da' }}>更多<Icon type="unordered-list" /></span></div>)}}
                            size='middle'
                            size='middle'
                            columns={supdisciplinarycolumns}
                            dataSource={supdisciplinaryList.list}
                            rowKey={(text) => text.id}
                            bordered={true}
                            loading={supdisciplinaryLoading}
                            pagination={false}
                            scroll={{x:450}}
                        />
                    </Col>
                </Row>
            </Layout>
        )
    }
}

SupRelationship.propTypes = {
}
export default SupRelationship;