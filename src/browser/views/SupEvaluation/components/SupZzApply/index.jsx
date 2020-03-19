import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { toJS } from "mobx"
import _ from "lodash";
import { Modal, Form, Row, Col, Input, Button, Card, Select, message,Table ,Tooltip} from 'antd';
import { SHOW_RecommendApply_MODEL,SHOW_ChooseListModel_MODEL,SHOW_Process_MODEL } from "../../../../constants/toggleTypes"
import Choosepsupplier from '../../../SupManager/components/Choosepsupplier'
import { supplierAction, supplierEvalution,supplierTrain } from "../../../../actions"
import ChooseListModel from '../../../../components/ChooseListModel'
import ChooseTBSupplier from '../../../../components/ChooseTBSupplier'

// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Option } = Select;
const { TextArea } = Input;
 


let options={
    title:'选择培训证书',
    columns:[
        {
            title: '序号',
            dataIndex: 'key',
            width: 60,
            align: "center",
            render: (text, index, key) => key + 1
        },
        {
            title: '证书名称',
            dataIndex: 'name',
            render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
        },
        {
            title: '证书编号',
            dataIndex: 'number',
        },
        {
            title: '发证机构',
            dataIndex: 'authoritied_orgname',
        },
        {
            title: '有效期(月)',
            dataIndex: 'expiry_months',
        },
       
    ]
}

@inject('toggleStore', 'evaluationStore','supplierStore')
@observer
class SupZzApply extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            productid: "",
            supplierId: "",
            verifyEditProduct:{},
            PXZSData:[],
            ZSList:[],
            gysInfo:{},
            refervalidateStatus:"success",
            referCode:"",
            Pxzspaginations:{}
            
        }
        this.inputChangeHandle=  _.debounce(this.inputChangeHandle, 1000)
    }
  
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_RecommendApply_MODEL)
    };
    deleteZs(key){
        const {PXZSData } = this.state 
        PXZSData.splice(key,1)
        this.setState({
            PXZSData
            })
    }
   async handleSubmit(type){
      //  e.preventDefault();
        const { toggleStore,refreshData } = this.props;
        const { PXZSData,gysInfo} = this.state
        console.log(PXZSData)
        this.props.form.validateFields(async (err, values) => {
            console.log(values)
            if(!err){
                let postData = {
                    ...values,
                    product_category:values.product_category,
                    gysid:gysInfo.gysId,
                    gysTrainCertificateVOs:PXZSData|| []
                }
               console.log(postData) 
               let ret = await supplierEvalution.newZzpjApply(postData)
               console.log(ret)
               if(ret.code==200){
                   //刷新列表
             
                   if(type=='submit'){
                    let instanceId = ret.data.id
                    let result = await supplierEvalution.directHandleTask(instanceId,supplierEvalution.DefinitionKey)
                    console.log(result)
                    if(result.code==200){
                        message.success('资质申请成功！')
                        refreshData()
                        toggleStore.setToggle(SHOW_RecommendApply_MODEL)
                       return
                    }else{
                        message.error('资质申请失败！')
                    }

                   }
                  
              
                   refreshData()
                   toggleStore.setToggle(SHOW_RecommendApply_MODEL)
               }
            }
         
        });
    };
    
    converIds(arr){
        let _arr = []
        arr.forEach(item=>{
            _arr.push(item.id)
        })
          return _arr.join(',')
    }
   async inputChangeHandle(value){
       console.log(value)
       const { setFieldsValue } = this.props.form;
       if(value==undefined|| value==''){
        return
    }
      let result = await supplierEvalution.tjRecommendInfo(value)
      console.log(result)
    
      
      if(result!=undefined && result.data!=null  ){
          if(result.data.isAvaliable=='1'){
            message.error('推荐码已失效')
             return
          }
      
        setFieldsValue({
            product_scope:result.data.productScope ||'',
           product_category:result.data.productCategory||'',
           admittance_grade:result.data.admittanceGrade||'',
        })
      }else{
        message.error('请输入正确的推荐码')
        setFieldsValue({
            product_scope:'',
           product_category:'',
           admittance_grade:'',
        })
      }
      
    }
    
    handelValuesadddunhao(waitvalue,isarr){
        if(isarr){
            waitvalue.is_sky = waitvalue.is_sky.join(',');
            waitvalue.category = waitvalue.category.join(',');
            waitvalue.model_area = waitvalue.model_area.join(',');
            waitvalue.importance_name = waitvalue.importance_name.join(',');
            waitvalue.match_mode = waitvalue.match_mode.join(',');
        }else{
            waitvalue.is_sky = waitvalue.is_sky.split(',');
            waitvalue.category = waitvalue.category.split(',');
            waitvalue.model_area = waitvalue.model_area.split(',');
            waitvalue.importance_name = waitvalue.importance_name.split(',');
            waitvalue.match_mode = waitvalue.match_mode.split(',');
        }
        return waitvalue;
    }

     handleChange(value) {
        console.log(`Selected: ${value}`);
      }
      
    choosecertificateFn(data){
        const {PXZSData } = this.state
        data.forEach(item=>{
            item['expiry_date'] = item.expiry_months
            PXZSData.push(item)
        })
      
        this.setState({
            PXZSData
            })
      }
    // chooseTBsupplierFn(data) {
    //     console.log(data)
    //     const { supplierStore } = this.props;
    //     const { setFieldsValue } = this.props.form;
    //     if (!supplierStore.iseditor) {
    //         // 当不是编辑状态时才会 ，修改供应商名称
    //         this.setState({
    //             supplierId: data.id,
    //             supplierInfo: data
    //         })
    //     }
    //     setFieldsValue({
    //         gys_name:data.name,
    //         gys_number:data.number
    //     })
    // }
    //资质证书load分页查询
    async PxzspageChange(page, num) {
        this.loadPxzs(page, num)
    }
    //资质证书搜索
    async PxzsSearch(value){
        this.loadPxzs(1, 10,value)
    }
    //加载资质证书
    async loadPxzs(pageNum = 1, rowNum = 10,name=''){
        const { gysInfo} = this.state
        let params={
            name,
            gysId:gysInfo.gysId
        }
        let certificateRet = await supplierEvalution.getTrainCertificatesByGys(1,20,params) 
        console.log(certificateRet)
        // let PxzsList = await supplierEvalution.getZzpjCertificateAll(pageNum,rowNum,params)
        // console.log(PxzsList)
        if(certificateRet.code==200){
            this.setState({
                PxzsList:certificateRet.data,
                Pxzspaginations: {search:(value)=>{this.PxzsSearch(value)}, showTotal:()=>`共${certificateRet.data.recordsTotal}条`, onChange: (page, num) => { this.PxzspageChange(page, num) }, showQuickJumper: true, total: certificateRet.data.recordsTotal, pageSize: 10 }

            })
        }
        
    }
    async componentDidMount() {
    
        const { setFieldsValue } = this.props.form;
        let gysResult = await supplierEvalution.getGYSInfoById()
        console.log(gysResult)
       if(gysResult.data==null){
           message.error('该用户不属于供应商')
           const { toggleStore } = this.props;
           toggleStore.setToggle(SHOW_RecommendApply_MODEL)
           return
       }
        setFieldsValue({ 
            gys_name:gysResult.data.name ||'',
            gys_number:gysResult.data.code ||'',
         //   product_scope:gysResult.data.product_scope ||'',
           // product_category:gysResult.data.product_category||''
         })
      
         this.setState({
            // ZSList:certificateRet.data,
            gysInfo:gysResult.data,
        },()=>{
            this.loadPxzs(1,10)
        })
        // 获取 下拉框字段
        // let ret = await supplierAction.getSupplierPuductSelect();
        // let verifyEditProduct = toJS(verifyStore.verifyEditProduct)
        // verifyEditProduct = this.handelValuesadddunhao(verifyEditProduct)
        // this.setState({
        //     selectField: ret
        // })
        // this.setState({
        //     productid: verifyEditProduct.id,
        //     supplierId: verifyEditProduct.gysid,
        //     verifyEditProduct
        // })
        // setFieldsValue({ ...verifyEditProduct })

    }
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const { getFieldDecorator } = this.props.form;
        const { toggleStore,evaluationStore  } = this.props;
        const { PxzsList,PXZSData,refervalidateStatus,referCode } = this.state
        let SelectOptions = evaluationStore.getproductComboBox()
        const ZYCDoptions = ()=>{
          return SelectOptions.zycd? SelectOptions.zycd.map(item=><Option key={item}>{item}</Option>):null
        }
       const children = [ZYCDoptions()]
         //选择资质证书model
    let cerlistModelOption={
        model:SHOW_ChooseListModel_MODEL,
        title:'选择培训证书',
        type:'radio',
        columns:[
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '证书名称',
                dataIndex: 'name',
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '证书编号',
                dataIndex: 'no',
            },
            {
                title: '发证机构',
                dataIndex: 'authoritied_orgname',
            },
            {
                title: '有效期(月)',
                dataIndex: 'expiry_months',
            },
           
        ]
    }
        const PXZScolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '证书名称',
                dataIndex: 'name',
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '证书编号',
                dataIndex: 'no',
            },
            {
                title: '发证机构',
                dataIndex: 'authoritied_orgname',
            },
            {
                    title: '有效日期',
                    dataIndex: 'expiry_months',
             },
            {
                title: '操作',
                dataIndex: 'cz',
                render: (text, redord, key) => {
                    return (<div> <Button type="danger" onClick={() => { this.deleteZs(key) }} size={'small'}>删除</Button></div>)
                }
            },
        ]
        return (
            <div>
                {
                    toggleStore.toggles.get(SHOW_RecommendApply_MODEL) && <Modal
                        title={`新建资质申请`}
                        visible={toggleStore.toggles.get(SHOW_RecommendApply_MODEL)}
                        width={960}
                        centered
                        footer={null}
                        okText="确认"
                        cancelText="取消"
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >
                        <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>
                            <Card  bordered={null}>
                             <Button.Group  style={{float:'right',marginBottom:'20px'}} size={'default'}>
                                <Button type="primary" onClick={()=>{this.handleSubmit('submit') }}>保存并提交</Button>
                                <Button type="primary"  onClick={()=>{this.handleSubmit('save')}}>保存</Button>
                              </Button.Group>
                            </Card>
                            <Card  bordered={false}>
                                <Row gutter={24}>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'供应商名称'}>
                                                {getFieldDecorator(`gys_name`, {
                                                    initValue: "供应商名称",
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: '供应商名称',
                                                        },
                                                    ],
                                                })(<Input disabled  />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'供应商社会信用代码'}>
                                                {getFieldDecorator(`gys_number`)(<Input  disabled />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'产品范围'}>
                                                {getFieldDecorator(`product_scope`,{
                                                      rules: [{ required: true, message: '请选择产品范围' }],
                                                })(<Input disabled  />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'产品类别'}>
                                                {getFieldDecorator(`product_category`,{
                                                       rules: [{ required: true, message: '请选择产品类别' }],
                                                })(<Input disabled  />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'拟准入等级'}>
                                                {getFieldDecorator(`admittance_grade`,{
                                                       rules: [{ required: true, message: '请选择拟准入等级' }],
                                                })(
                                                    <Input disabled  />
                                                )}
                                            </Form.Item>
                                        </Col>
                                      
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'推荐码'} >
                                                {getFieldDecorator(`referral_code`,{
                                                       rules: [{ required: true, message: '请输入推荐码' },
                                                    //   {
                                                    //     validator:function(rule, value, callback){
                                                    //         console.log(refervalidateStatus)
                                                    //         if(refervalidateStatus!='success'){
                                                    //          callback('推荐码无效')
                                                    //         }
                                                    //     }
                                                    //   }
                                                    ],
                                                })( <Input onChange={(ev)=>this.inputChangeHandle(ev.target.value )}  />)}
                                            </Form.Item>
                                        </Col>
                                </Row>
                            </Card>
                         
                          
                            <Card bordered={false} title={<b>培训证书</b>} extra={
                                    <Button type="primary" onClick={() => {
                                        toggleStore.setToggle(SHOW_ChooseListModel_MODEL)
                                    }}>
                                        新增
                                    </Button>
                                } className="new_supplier_producelist">
                                    <Row>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => key} columns={PXZScolumns} dataSource={PXZSData} />
                                        </Col>
                                    </Row>
                                </Card>
                        </Form>
                     
                    </Modal>
                }
                   {
                    toggleStore.toggles.get(SHOW_ChooseListModel_MODEL)&&<ChooseListModel list={PxzsList} options={cerlistModelOption} comparedList={PXZSData}  chooseFinishFn={(val)=>{this.choosecertificateFn(val)}} />
                }
                
            </div>
        );
    }
}

export default Form.create({ name: 'NewsupZzApply' })(SupZzApply);