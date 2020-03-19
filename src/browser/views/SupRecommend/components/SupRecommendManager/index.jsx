import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Upload, Icon, Tooltip, message, Select,Popconfirm, Input } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import _ from "lodash";
import { SHOW_RecommendApply_MODEL,ShOW_RecommendDetail_MODEL } from "../../../../constants/toggleTypes";
import { supplierRecommend ,supplierApproval,supplierEvalution } from "../../../../actions"
import SupRecommendApply from "../SupRecommendApply";
import ShowRecommendDetail from '../ShowRecommendDetail'
import "./index.less";
const { Search } = Input;

@inject('toggleStore', 'verifyStore')
@observer
class SupRecommendManager extends Component {
    state = {
        supplierList: {
            list: [],
            recordsTotal: 0
        },
        selectedRowKeys: [], // Check here to configure the default column
        selectObj:{},
        loading: false,
        recomDetail:{},
        modelOptions:{},
        userType:'sup',
        recomAuthor:false
    };
    //分页查询
    async pageChange(page, num) {
        this.loaddata(page, num)
    }
    onSelectChange = (selectedRowKeys,data) => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ 
            selectObj:data ,
            selectedRowKeys
        });
    };
    //推荐提交跳转
    async recommendSubmit(record){

        let result = await supplierRecommend.directHandleTask(record.id,'gysrecommend')
        console.log(result)
        if(result.code==200){
            message.success('推荐提交成功！')
            this.loaddata()
        }else{
            message.error('推荐提交失败！')
        }


    }

     //推荐审批跳转
     approval(record){
        console.log(record)
        let { toggleStore } = this.props;
        const  {userId} = supplierRecommend.pageInfo
        let openUrl =supplierRecommend.ApprovalUrl+ `&usage=view&objId=${record.id}&processInstanceId=${record.processInstId}&status=${record.status}&userId=${userId}&processReceiveId=${record.processReceiveId}&role=readonly`
        console.log(openUrl)
        this.setState({
            recomDetail:record,
            modelOptions:{
                title:'推荐审批',
                url:openUrl
            }
        })
        toggleStore.setToggle(ShOW_RecommendDetail_MODEL);
    }
     
    //查看推荐详情
    getPJInfo(record){
        let { toggleStore } = this.props;
        const  {userId} = supplierRecommend.pageInfo
        let openUrl =supplierRecommend.ApprovalUrl+`&usage=${record.status==0?'edit':'view'}&objId=${record.id}&processInstanceId=${record.processInstId}&status=${record.status}&processReceiveId=${record.processReceiveId}&userId=${userId}&processInstId=${record.processInstId}`
        if((record.status=='2' && record.processReceiveId!=userId) || record.status=='1' || record.status=='3'  ){
            openUrl+='&role=readonly'
        }else if(record.status=='0'){
            openUrl+='&role=init'
        }else{

        }
        console.log(openUrl)
        this.setState({
            recomDetail:record,
            modelOptions:{
                title:'推荐详情',
                url:openUrl
            }
        })
        toggleStore.setToggle(ShOW_RecommendDetail_MODEL);
       
      
        // console.log(openUrl)
        // window.open(openUrl)
    }


    //删除申请
   async deleteApply(){
    let { selectObj } = this.state;
    console.log(selectObj)
    if(selectObj[0].status=='0'){
        let result = await  supplierRecommend.deleteApply(selectObj[0].id)
        console.log(result)
        this.loaddata()
        message.success(result.message)
    }else{
        message.warning('只有未提交的申请才可被删除')
    }
 
   }
   
    converStatus(type){
        let str = ''
        switch (type) {
            case '0':
                str = '未提交'
                break;
                case '1':
                str = '待审批'
                break;
                case '2':
                str = '已通过'
                
                break;
                case '3':
                str = '已退回'
                break;
            default:
                break;
        }
        return str
  }

    async loaddata(pageNum = 1, rowNum = 20,queryName) {
      
        this.setState({ loading: true });
        
        let ret =  await supplierRecommend.getRecommendApply(pageNum, rowNum,{queryName})
        console.log(ret)
        this.setState({
            supplierList:ret.data,
            loading: false
        })
    }
    
    switchRole(type){
        this.setState({
            userType:'',
        })
        
    }
    //分页查询
    async pageChange(page, num) {
        this.loaddata(page, num)
    }
    // componentDidMount() {
        
    //     this.loaddata()
    // }

  async componentDidMount() {
        const { toggleStore } = this.props;
        const { roleNameKey}=supplierRecommend.pageInfo
        const { recomAuthor} = this.state
        console.log(roleNameKey)
    let ApproveroleLists = await supplierApproval.getCharacter()
      console.log(ApproveroleLists)
      let roles = roleNameKey.split(',')
       //判断是否是审核角色
      for(let roleName of roles){
        let userVerty = ApproveroleLists.some(item=>item==roleName)
           if(userVerty){
            this.setState({
                userType:'approve'
              })
              break
           }
       }
       //判断当前供应商是否满足推荐资格，只有以下三类供应商才可以有推荐资格
       let importants = ['核心Ⅰ类','核心Ⅱ类','重要']
       let gysInfo = await  supplierEvalution.getGYSInfoById()
       console.log(gysInfo)
       if(gysInfo.data){
           let gysLevel = gysInfo.data.important
           let flag = importants.some(item=>item==gysLevel)
           if(flag){
               this.setState({
                recomAuthor: true

               })
           }
    
       }
       
     
        window.closeModel = (modelname) => {
            console.log(modelname)
            toggleStore.setToggle(modelname)
            this.loaddata()
        }
        this.loaddata()
    }
    render() {
        const { toggleStore, verifyStore } = this.props;
        const { loading, selectedRowKeys ,userType ,recomDetail,modelOptions,recomAuthor} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: 'radio',
        };
        console.log(userType)
        const that = this;
        const hasSelected = selectedRowKeys.length > 0;

        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '被推荐供应商名称',
                dataIndex: 'recommendedGysName',
                width: 200,
                align: "center",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.getPJInfo(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '供应商社会信用代码',
                dataIndex: 'code',
                width: 250,
                align: "center",
            },
            {
                title: '产品范围',
                dataIndex: 'productScope',
                width: 150,
                align: "center",
            },
            {
                title: '产品类别',
                dataIndex: 'productCategory',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '资质等级',
                dataIndex: 'admittanceGrade',
                width: 200,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '申请时间',
                dataIndex: 'createTime',
                width: 150,
                align: "center",
                sorter: (a, b) => (moment(a.createTime).valueOf() - moment(b.createTime).valueOf()),
                render: (text) => <Tooltip title={text}><span>{text }</span></Tooltip>
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                align: "center",
                render: (text) => <Tooltip title={this.converStatus(text)}><span style={text=='1'?{color:'red'}:null}>{this.converStatus(text)}</span></Tooltip>,
                sorter: (a, b) => (a.status - b.status),
                
            },
            {
                title: '操作',
                dataIndex: 'modify',
                align: "center",
                width: 200,
                render: (text, redord) => {
                    return (<div>
                        {
                            userType=='sup'? 
                            <Popconfirm
                            title="确定要提交此推荐申请吗？"
                            onConfirm={ev=>{this.recommendSubmit(redord)}}
                            okText="确定"
                            cancelText="取消"
                        >
                            {
                               redord.status=='0'?  <Button  style={{ marginRight: 5 }} type="primary" size={'small'}>提交</Button> :null
                            } 
                            </Popconfirm>
                           :
                           
                           redord.status=='1' && userType=='approve' ? <Button onClick={ev=>{this.approval(redord)}}  style={{ marginRight: 5 }} type="primary" size={'small'}>审批</Button> :null
                        }
                           
                        
                        </div>)
                }
            },
        ];
        
      
        let TableOptertaWithSup = () => (
            <div className="table-operations">
                <Button  icon="edit" type="primary" onClick={() => {    toggleStore.setToggle(SHOW_RecommendApply_MODEL); }} >新建</Button>

                   <Popconfirm
                        title="确定要删除此推荐吗？"
                        onConfirm={ev=>this.deleteApply()}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button  disabled={!hasSelected} style={{ marginRight: 5 }} type="danger" >删除</Button>
                    </Popconfirm> 
                {/* <Button  icon="edit" type="danger" onClick={() => {  this.deleteApply()   }} >删除</Button> */}

                {/* <Button  icon="edit" type="primary" onClick={() => { this.switchRole('manager')  }} >切换评价人员角色</Button> */}
                {/* <Button  icon="edit" type="primary" onClick={() => {   }} >修改</Button>
                <Button  icon="edit" type="danger" onClick={() => {    }} >删除</Button>
                <Button  icon="edit" type="primary" onClick={() => {    }} >提交</Button> */}
            </div>
        )
        let TableOptertaWithManager = () => (
            <div className="table-operations">
             {/* <Button  icon="edit" type="primary" onClick={() => { this.switchRole('sup')  }} >切换供应商角色</Button> */}
                {/* <Button  icon="edit" type="primary" onClick={() => {    }} >审批</Button> */}
            </div>
        )
        let TableFilterBtn = () => (
            <div className="table-fileter">
                <Search placeholder="搜索产品名称" onSearch={value =>{this.loaddata(1,20,value)} } enterButton />
               
            </div>
        )
       
        return (
            <Card title={userType=='sup' && recomAuthor==true?<TableOptertaWithSup />:<TableOptertaWithManager />} extra={<TableFilterBtn />}>
                {toggleStore.toggles.get(SHOW_RecommendApply_MODEL) && <SupRecommendApply refreshData={() => this.loaddata()} />}
                {toggleStore.toggles.get(ShOW_RecommendDetail_MODEL) && <ShowRecommendDetail options={ modelOptions} detail={recomDetail} refreshData={() => this.loaddata()} />}
                <Table size='middle' loading={loading} rowClassName={(text) => text.is_right == 1 ? 'is_diff' : ''} bordered={true} rowKey={(text) => text.id} rowSelection={rowSelection}  columns={columns} pagination={{ onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: true, total: this.state.supplierList.recordsTotal, pageSize: 20 }} dataSource={this.state.supplierList.recommands} />
            </Card>
        )
    }
}

SupRecommendManager.propTypes = {
}
export default SupRecommendManager;