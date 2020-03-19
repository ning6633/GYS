import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Upload, Input, Tooltip, message, Popconfirm } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import _ from "lodash";
import { SHOW_LOGIN_MODEL, SHOW_FeedBack_MODEL, SHOW_SupInfoManager_MODEL } from "../../../../constants/toggleTypes";
import { SHOW_NewSupPJrd_MODEL, SHOW_Process_MODEL,SHOW_ShowSupPJrd_MODEL,SHOW_ShowSupApply_MODEL } from "../../../../constants/toggleTypes";
import ShowSupPJrd from '../ShowSupPJrd'
import ShowSupZRApply from '../ShowSupZRApply'
import ShowProcessModel from '../../../../components/ShowProcessModel'
import NewZrrd from '../NewZrrd'
import { supplierAccepted ,supplierEvalution,supplierApproval} from "../../../../actions"
import "./index.less";
const { Search } = Input;

@inject('toggleStore', 'supplierStore','evaluationStore')
@observer
class SupZrrdList extends Component {
    state = {
        supplierList: {
            list: [],
            recordsTotal: 0
        },
        applydetail:{},
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        userTypeVerty:'sup'
    };

    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    async submitSupplierInfo(redord) {
        const { toggleStore, supplierStore } = this.props;
        if (redord.is_diff != 0) {
            toggleStore.setToggle(SHOW_SupInfoManager_MODEL)
        } else {
            let supplierList = await supplierAccepted.submitSupplierInfo([redord.id]);
            message.success("提交成功")
            this.loaddata()
        }
    }
    async submitSupplierInfopl() {
        let supplierList = await supplierAccepted.submitSupplierInfo(this.state.selectedRowKeys);
        message.success("提交成功")
        this.loaddata()
    }
    //删除准入认定
    async deleteZrrd(record) {
        let ret = await supplierAccepted.deleteZRRD(record.id);
        if (ret.code==200) {
            message.success(ret.message)
            this.loaddata()
        }
    }
    //提交供应商准入
    async zrrdSubmit(record){

        let result = await supplierAccepted.directHandleTask(record.id,supplierAccepted.DefinitionKey)
        console.log(result)
        if(result.code==200){
            message.success('准入提交成功！')
            this.loaddata()
        }else{
            message.error('准入提交失败！')
        }


      
    }
    //准入认定审核
    zrrdApprovel(record){
        console.log(record)
        const  {userId} = supplierAccepted.pageInfo
        const { toggleStore } = this.props;
        let openurl = supplierAccepted.ApprovalUrl+ `&businessInstId=${record.id}&processInstanceId=${record.processInstId}&status=${record.status}&userId=${userId}`
         console.log(openurl)
       //   window.open(openurl)
          toggleStore.setModelOptions({
             detail:record,
             modelOptions:{
                 title:'准入认定审核',
                 url:openurl
             },
             model:SHOW_Process_MODEL
           })
       
           toggleStore.setToggle(SHOW_Process_MODEL)
    }
    //获取评价认定详情
    async getZRDetail(record){
        const { toggleStore } = this.props;
        let result = await supplierAccepted.getZrApplyDetail(record.id)
        console.log(result)
        if(result.code==200 && result.data!=null){
             this.setState({
                 applydetail:result.data
             })
             toggleStore.setToggle(SHOW_ShowSupPJrd_MODEL)
        }else{
           message.error(result.message)
        }
    
    }
     //获取评价认定实施记录详情
     async getZRSSDetail(record){
        const { toggleStore } = this.props;
        let result = await supplierAccepted.getZRSSDetail(record.id)
        console.log(result)
        if(result.code==200 && result.data!=null){
             this.setState({
                 applydetail:result.data
             })
             toggleStore.setToggle(SHOW_ShowSupApply_MODEL)
        }else{
           message.error(result.message)
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
                str = '已完成'
                break;
            default:
                break;
        }
        return str
  }


    async loaddata(pageNum = 1, rowNum = 20) {
        const { userTypeVerty} = this.state
        this.setState({ loading: true });
        console.log(userTypeVerty)
        let supplierList = await (userTypeVerty=='sup'?supplierAccepted.getsupplierAcceptedList(pageNum, rowNum):supplierAccepted.getsupplierAcceptedListByManager(pageNum, rowNum)) ;
        console.log(supplierList)
        this.setState({
            supplierList: supplierList,
            loading: false,
            selectedRowKeys: []
        })
    }
    //分页查询
    async pageChange(page, num) {
        this.loaddata(page, num)
    }
  
   async componentDidMount() {
        const { evaluationStore ,toggleStore } =this.props
        const { userId,roleNameKey}=supplierEvalution.pageInfo
        let result = await supplierEvalution.getSelectOptions()
        if(result.code=200){
            evaluationStore.setproductComboBox(result.data)
        }
      //获取所有审核角色名单
    let ApproveroleLists = await supplierApproval.getCharacter()
      //获取自身角色信息
      let roles= roleNameKey.split(',')
       //判断是否是审核角色
       for(let roleName of roles){
        let userVerty = ApproveroleLists.some(item=>item==roleName)
           if(userVerty){
            this.setState({
                userTypeVerty:'approve'
              })
              break
           }
       }
     
      this.loaddata()
    
     
      
          //监听流程窗口关闭
          window.closeModel = (modelname) => {
           
            this.loaddata()
            toggleStore.setToggle(modelname)
        }
    }
    render() {
        const { toggleStore, supplierStore } = this.props;
        const { loading, selectedRowKeys,applydetail,userTypeVerty } = this.state;
        const rowSelection = {
            columnWidth: 30,
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: 'radio'
        };
        const that = this;
        const hasSelected = selectedRowKeys.length > 0;

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
                title: '默认名称',
                dataIndex: 'applyName',
                width: 150,
                align: "center",
                fixed: "left",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.getZRDetail(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '供应商名称',
                dataIndex: 'gysName',
                width: 150,
                align: "center",
                // render: (text) => text == 20 ? '已提交' : '未提交'
            },
            {
                title: '供应商编号',
                dataIndex: 'gysId',
                width: 230,
                align: "center",
            },
            {
                title: '产品范围',
                dataIndex: 'productScope',
                width: 120,
                align: "center",
                // render: (text) => text == 20 ? '已提交' : '未提交'
            },
            {
                title: '产品类别',
                dataIndex: 'productType',
                width: 200,
                align: "center",
            },
            {
                title: '重要程度',
                dataIndex: 'importLevel',
                width: 150,
                align: "center",
            },
            {
                title: '申请时间',
                dataIndex: 'createDate',
                width: 170,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                align: "center",
                fixed:'right',
                render: (text) => <Tooltip title={this.converStatus(text)}><span style={text=='1'?{color:'red'}:null}>{this.converStatus(text)}</span></Tooltip>,
                sorter: (a, b) => (a.status - b.status),
                
            },
            {
                title: '操作',
                dataIndex: 'modify',
                align: "center",
                fixed:'right',
                width: 150,
                render: (text, record) => {
                    return (
                    <div>
                        {
                            userTypeVerty=='sup'? 
                               record.status=='0'? <div> <Button  style={{ marginRight: 5 }} onClick={ev=>{this.zrrdSubmit(record)}} type="primary" size={'small'}>提交</Button> <Button  style={{ marginRight: 5 }} type="danger" onClick={ev=>{this.deleteZrrd(record)}} size={'small'}>删除</Button></div>  : <Button  style={{ marginRight: 5 }} onClick={ev=>{this.getZRSSDetail(record)}} type="primary" size={'small'}>实施详情</Button> 
                               :
                               record.status=='1'? <Button onClick={ev=>{this.zrrdApprovel(record)}}  style={{ marginRight: 5 }} type="primary" size={'small'}>审批</Button> :null
                        }
                           
                        
                        </div>)
                }
            },
        ];

      
        let TableOpterta = () => (
            <div className="table-operations">
            {userTypeVerty=='sup' &&  <Button icon="edit" type="primary" onClick={() => { toggleStore.setToggle(SHOW_NewSupPJrd_MODEL); supplierStore.iseditor = false; }}>新建</Button>}
                {/* <Button type="danger" disabled={!hasSelected} onClick={() => { this.deleteZrrd() }} >删除 </Button> */}
            </div>
        )
        let TableFilterBtn = () => (
            <div className="table-fileter">
                <Search placeholder="搜索准入认定申请名称" onSearch={value => console.log(value+'1')} enterButton />


            </div>
        )

        return (
            <Card title={<TableOpterta />} extra={<TableFilterBtn />}>
            {
                    toggleStore.toggles.get(SHOW_NewSupPJrd_MODEL) && <NewZrrd refreshData={ev=>{this.loaddata()}} />
                }
                {toggleStore.toggles.get(SHOW_ShowSupPJrd_MODEL) && <ShowSupPJrd 
                detail = {applydetail} refreshData={() => this.loaddata()} />}

                {
                    toggleStore.toggles.get(SHOW_ShowSupApply_MODEL) && <ShowSupZRApply    detail = {applydetail} />
                }
                    { toggleStore.toggles.get(SHOW_Process_MODEL) && <ShowProcessModel />}
                <Table size='middle' loading={loading} rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''} bordered={true} rowKey={(text) => text.id} rowSelection={rowSelection} scroll={{ x: 1300 }} columns={columns} pagination={{ onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: true, total: this.state.supplierList.recordsTotal, pageSize: 20 }} dataSource={this.state.supplierList.applyVOs} />
            </Card>
        )
    }
}

SupZrrdList.propTypes = {
}
export default SupZrrdList;