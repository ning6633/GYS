import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Upload, Icon, Tooltip, message, Popconfirm, Input , } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import _ from "lodash";
import { SHOW_ProductVerify_MODEL ,SHOW_RecommendApply_MODEL,SHOW_ModelDetail_MODEL ,SHOW_Process_MODEL,SHOW_ShowSupApply_MODEL,SHOW_SsDetail_MODEL} from "../../../../constants/toggleTypes";
import { supplierApproval,supplierEvalution ,supplierTrain} from "../../../../actions"
import  SupZzApply from '../../components/SupZzApply'
import  ShowSupApply from '../../components/ShowSupZzApply'
import ShowSupApplyDetail from '../../components/ShowSupApplyDetail'
import ShowProcessModel from '../../../../components/ShowProcessModel'
import "./index.less";
const { Search } = Input;

@inject('toggleStore', 'verifyStore','evaluationStore')
@observer
class SupEvaluationImplement extends Component {
    state = {
        sqList: {
            list: [],
            recordsTotal: 0
        },
        ssdetail:{},
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        userTypeVerty:'sup'
    };
    //分页查询
    async pageChange(page, num) {
        this.loaddata(page, num)
    }
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    editorSupplierProductInfo(redord) {
        const { toggleStore, verifyStore } = this.props;
        let redordData;
        if (!redord) {
            let { supplierList, selectedRowKeys } = this.state;
            redordData = _.find(supplierList.listGysProducts, { id: selectedRowKeys[0] })
        } else {
            redordData = redord;
        }
        verifyStore.setverifyEditProduct(redordData);
        toggleStore.setToggle(SHOW_ProductVerify_MODEL);
    }
   async deleteApply(id){
    let applyResult = await supplierEvalution.deleteApply(id)
    console.log(applyResult)
    if(applyResult.code==200){
        this.loaddata()
        message.success(applyResult.message)
    }else{
        message.danger(applyResult.message)
    }
   
    
   }
//    //资质申请
//     async ZzApply(id){
//         const  {userId} = supplierEvalution.pageInfo
//       let openurl = supplierEvalution.ZJSQUrl+`&businessInstId=${id}&userId=${userId}`
//        console.log(openurl)
//         window.open(openurl)
//        // this.loaddata()
//      }
    

//      //获取资质评价申请详情
//      async getSsInfo(record){
//         const { toggleStore } = this.props;
//        let result = await supplierEvalution.getZzpjApplyDetail(record.id)
//        console.log(result)
//        if(result.code==200){
//             this.setState({
//                 detail:result.data
//             })
//             toggleStore.setToggle(SHOW_SsDetail_MODEL)
//        }else{

//        }
      
//     }

       //资质申请
       async ZzApply(id,record){
      
        console.log(id)
        let result = await supplierEvalution.directHandleTask(id,supplierEvalution.DefinitionKey)
        console.log(result)
        if(result.code==200){
            message.success('资质申请成功！')
            this.loaddata()
        }else{
            message.error('资质申请失败！')
        }

      

     }
    
 //资质审批
 async Zzsp(record){
    console.log(record)
   const  {userId} = supplierEvalution.pageInfo
   const { toggleStore } = this.props;
   let openurl = supplierEvalution.ZJSQUrl+ `&businessInstId=${record.id}&processInstanceId=${record.processinstid}&status=${record.status}&userId=${userId}`
    console.log(openurl)
     toggleStore.setModelOptions({
        detail:record,
        modelOptions:{
            title:'资质审批',
            url:openurl
        },
        model:SHOW_Process_MODEL
      })
  
      toggleStore.setToggle(SHOW_Process_MODEL)
}
  
    //获取申请实施记录详情
    async getZzssApplyDetail(record){
        const { toggleStore } = this.props;
        let result = await supplierEvalution.getZzpjssApply(record.id)
        console.log(result)
        if(result.data==null){
             
            message.error(result.message)
            return
        }
        if(result.code==200){
             this.setState({
                 ssdetail:result.data
             })
             toggleStore.setToggle(SHOW_ShowSupApply_MODEL)
        }else{
 
        }
    }
    //获取申请详情
    async getApplyDetail(record){
        const { toggleStore } = this.props;
        let result = await supplierEvalution.getZzpjApplyDetail(record.id)
        console.log(result)
        if(result.data==null){
            message.error(result.message)
            return
        }
        if(result.code==200){
             this.setState({
                 applydetail:result.data
             })
             toggleStore.setToggle(SHOW_ModelDetail_MODEL)
        }else{
 
        }
    }
    converStatus(record){
             let str = ''
          switch (record.status) {
                  case '0':
                  str = '未申请'
                  break;
                  case '1':
                  str = '待审批'
                  break;
                  case '2':
                  str = '已审批'
                  break;
                  case '3':
                  str = record.evaluate_satisfaction==null?`已完成 / 待评价` : `已完成`
                  break;
              default:
                  break;
          }
          return str
    }
    async loaddata(pageNum = 1, rowNum = 15,keyword) {
        this.setState({ loading: true });
        let ret =  await supplierEvalution.getZzpjApply(pageNum, rowNum,'',{keyword})
        console.log(ret)
        if(ret.code==200){
            this.setState({
                sqList:ret.data,
                loading: false
            })
        }
       
    }
    //分页查询
    async pageChange(page, num) {
        this.loaddata(page, num)
    }
    async componentDidMount() {
        const { evaluationStore,toggleStore  } =this.props
        const { roleNameKey}=supplierEvalution.pageInfo
        let result = await supplierEvalution.getSelectOptions()
        if(result.code=200){
            evaluationStore.setproductComboBox(result.data)
        }
             //获取所有审核角色名单
    let ApproveroleLists = await supplierApproval.getCharacter()
    console.log(ApproveroleLists)
    //获取自身角色信息
    let roles= roleNameKey.split(',')
    console.log(roles)
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
            toggleStore.setToggle(modelname)
            this.loaddata()
        }
    }
    render() {
        const { toggleStore,  } = this.props;
        const { loading, selectedRowKeys ,ssdetail,userTypeVerty,applydetail} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: 'radio',
        };

        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '申请信息',
                dataIndex: 'apply',
                width: 200,
                align: "center",
                render: (text, redord) => <Tooltip title={`航天资质申请-${redord.admittance_grade}`}><span onClick={() => {  this.getApplyDetail(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{`航天资质申请-${redord.admittance_grade}` }</span></Tooltip>
            },
            {
                title: '供应商名称',
                dataIndex: 'gys_name',
                width: 200,
                align: "center",
              //  render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.getZzssApplyDetail(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 20)}</span></Tooltip>
            },
            {
                title: '产品范围',
                dataIndex: 'product_scope',
                width: 250,
                align: "center",
            },
            {
                title: '产品类别',
                dataIndex: 'product_category',
                width: 150,
                align: "center",
            },
            {
                title: '资质等级',
                dataIndex: 'admittance_grade',
                width: 150,
                align: "center",
                render: (text) =><span>{text && text.substr(0, 10)}</span>
            },
            {
                title: '更新时间',
                dataIndex: 'updatedate',
                width: 150,
                align: "center",
                sorter: (a, b) => (moment(a.updatedate).valueOf() - moment(b.updatedate).valueOf()),
                render: (text) => <Tooltip title={text && text.replace(/\.0$/, '')}><span>{text && text.replace(/\.0$/, '')}</span></Tooltip>
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 150,
                align: "center",
                render: (text,record) => <Tooltip title={this.converStatus(record)}><span style={text=='1'?{color:'red'}:null}>{this.converStatus(record)}</span></Tooltip>,
                sorter: (a, b) => (a.status - b.status),
            },
            {
                title: '操作',
                dataIndex: 'modify',
                align: "center",
                width: 200,
                render: (text, record) => {
                    return (
                    
                    <div> 
                    {
                        userTypeVerty=='sup'
                        ?
                        record.status=='0'?  <div>  
                    <Popconfirm
                        title="确定要删除此申请吗？"
                        onConfirm={ev=>this.deleteApply(record.id)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button   style={{ marginRight: 5 }} type="danger" size={'small'}>删除</Button>
                    </Popconfirm> 
                    <Button   style={{ marginRight: 5 }} type="primary" onClick={()=>{this.ZzApply(record.id,record)}} size={'small'}>提交</Button>
                     </div> 
                    :
                    ( ( record.status=='3' )&& <Button   style={{ marginRight: 5 }} type="primary" onClick={()=>{this.getZzssApplyDetail(record)}} size={'small'}>查看实施记录</Button>)
                     
                    :
                    (
                        record.status=='1' && <Button   style={{ marginRight: 5 }} type="primary" onClick={()=>this.Zzsp(record)} size={'small'}>审核</Button>
                    )
                      
                    } </div>)
                }
            },
        ];

        
        //供应商身份看到的按钮
        let TableOptertaWithSup = () => (
            <div className="table-operations">
                   {userTypeVerty =='sup' &&  <Button  icon="edit" type="primary" onClick={() => {  toggleStore.setToggle(SHOW_RecommendApply_MODEL);}} >新建</Button>} 
                
               
            </div>
        )
    
        let TableFilterBtn = () => (
            <div className="table-fileter">
                <Search placeholder="搜索申请信息" onSearch={value =>{this.loaddata(1,20,value)}} enterButton />
               
            </div>
        )
        return (
            <Card title={<TableOptertaWithSup />} extra={<TableFilterBtn />}>
                   {toggleStore.toggles.get(SHOW_RecommendApply_MODEL) && <SupZzApply refreshData={() => this.loaddata()} />}
                   {toggleStore.toggles.get(SHOW_ShowSupApply_MODEL) && <ShowSupApply detail = {ssdetail} refreshData={() => this.loaddata()} />}
                   {toggleStore.toggles.get(SHOW_ModelDetail_MODEL) && <ShowSupApplyDetail detail = {applydetail} refreshData={() => this.loaddata()} />}
                   
                   { toggleStore.toggles.get(SHOW_Process_MODEL) && <ShowProcessModel />}
                <Table size='middle' loading={loading} rowClassName={(text) => text.is_right == 1 ? 'is_diff' : ''} bordered={true} rowKey={(text) => text.id} rowSelection={rowSelection}  columns={columns } pagination={{showTotal:()=>`共${this.state.sqList.recordsTotal}条`, onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: true, total: this.state.sqList.recordsTotal, pageSize: 15 }} dataSource={this.state.sqList.list} />
            </Card>
        )
    }
}

SupEvaluationImplement.propTypes = {
}
export default SupEvaluationImplement;