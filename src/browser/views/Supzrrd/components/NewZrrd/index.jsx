import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { toJS } from "mobx"
import { Modal, Form, Row, Col, Input, Button, Card, Select, message,Table ,Tooltip} from 'antd';
import { SHOW_NewSupPJrd_MODEL,SHOW_ChooseListModel_MODEL,SHOW_Process_MODEL,SHOW_Certificate_MODEL } from "../../../../constants/toggleTypes"
import Choosepsupplier from '../../../SupManager/components/Choosepsupplier'
import { supplierAccepted, supplierEvalution,supplierTrain } from "../../../../actions"
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
class NewZrrd extends React.Component {
    state = {
        productid: "",
        supplierId: "",
        verifyEditProduct:{},
        ZZZSData:[],
        ZSList:[],
        gysInfo:{},
        ZzzsList:[]
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NewSupPJrd_MODEL)
    };
    deleteZs(key){
        const {ZZZSData } = this.state 
        ZZZSData.splice(key,1)
        this.setState({
            ZZZSData
            })
    }
   async handleSubmit(type){
      //  e.preventDefault();
        const { toggleStore,refreshData } = this.props;
        const { ZZZSData,gysInfo} = this.state
        this.props.form.validateFields(async (err, values) => {
            console.log(values)
            if(!err){
                let postData = {
                    ...values,
                    importLevel:values.importLevel,
                    gysId:gysInfo.gysId,
                    certIdList:this.converIdArr(ZZZSData)|| []
                }
               console.log(postData) 
              let ret = await supplierAccepted.newZrrdApply(postData)
             console.log(ret)
               if(ret.code==200){
                
                   if(type=='submit'){
                    let instanceId = ret.data.id
                    let result = await supplierAccepted.directHandleTask(instanceId,supplierAccepted.DefinitionKey)
                    console.log(result)
                    if(result.code==200){
                        message.success('准入申请成功！')
                        refreshData()
                        toggleStore.setToggle(SHOW_NewSupPJrd_MODEL)
                        return
                    }else{
                        message.error('准入申请失败！')
                    }

                   }
                      //刷新列表
                   refreshData()
                   toggleStore.setToggle(SHOW_NewSupPJrd_MODEL)
              }
            }
         
        });
    };
    
    converIdArr(arr){
        let _arr = []
        arr.forEach(item=>{
            _arr.push(item.certificateid)
        })
          return _arr
    }
    saveZzsq(){

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
        const {ZZZSData } = this.state
        data.forEach(item=>{
            ZZZSData.push(item)
            this.setState({
                ZZZSData
                })
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
    //         gysName:data.name,
    //         gysCode:data.number
    //     })
    // }
   //资质证书load分页查询
   async ZzzspageChange(page, num) {
    this.loadZzzs(page, num)
  }
    //资质证书搜索
    async ZzzsSearch(value){
        this.loadZzzs(1, 10,value)
    }
    //加载资质证书
    async loadZzzs(pageNum = 1, rowNum = 10){
        const {gysInfo} = this.state
        console.log(gysInfo)
        let ZzCerts = await supplierAccepted.getZzCerts(pageNum,rowNum,gysInfo.gysId)
        console.log(ZzCerts)
        if(ZzCerts){
            this.setState({
                ZzzsList:ZzCerts.data,
                Zzzspaginations: {search:(value)=>{this.ZzzsSearch(value)}, showTotal:()=>`共${ZzCerts.data.recordsTotal}条`, onChange: (page, num) => { this.ZzzspageChange(page, num) }, showQuickJumper: true, total: ZzCerts.data.recordsTotal, pageSize: 10 }

            })
        }
    }
    async componentDidMount() {
    
        const { setFieldsValue } = this.props.form;
        let gysResult = await supplierEvalution.getGYSInfoById()
        console.log(gysResult)

       if(gysResult.data){
        setFieldsValue({ 
            gysName:gysResult.data.name ||'',
            gysCode:gysResult.data.code ||'',
            productScope:gysResult.data.product_scope ||'',
            productType:gysResult.data.product_category||''
            
         })
        //  let certificateRet = await supplierAccepted.getZzCerts(gysResult.data.id) 
        //  console.log(certificateRet)
         this.setState({
            gysInfo:gysResult.data,
        })
        this.loadZzzs(1,10)
         //选择资质证书model
    let cerlistModelOption={
        model:SHOW_Certificate_MODEL,
        title:'选择资质证书',
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
                dataIndex: 'certificatename',
                align: "center",
            },
            {
                title: '证书类型',
                dataIndex: 'type',
            },
            {
                title: '发证机构',
                dataIndex: 'fromorg',
            },
            {
                title: '有效期限',
                dataIndex: 'totime',
            },
        ],      
    }
    this.setState({
        cerlistModelOption
    })
       }else{
           message.error('该账户不属于供应商账户')
       }
       
     
      
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
        const { ZzzsList,ZZZSData,Zzzspaginations,cerlistModelOption } = this.state
        let SelectOptions = evaluationStore.getproductComboBox()
        const ZYCDoptions = ()=>{
          return SelectOptions? SelectOptions.zycd.map(item=><Option key={item}>{item}</Option>):null
        }
       const children = [ZYCDoptions()]
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
                dataIndex: 'certificatename',
                align: "center",
            },
            {
                title: '证书类型',
                dataIndex: 'type',
            },
            {
                title: '发证机构',
                dataIndex: 'fromorg',
            },
            {
                title: '有效期限',
                dataIndex: 'totime',
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
                    toggleStore.toggles.get(SHOW_NewSupPJrd_MODEL) && <Modal
                        title={`新建准入认定申请`}
                        visible={toggleStore.toggles.get(SHOW_NewSupPJrd_MODEL)}
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
                                                {getFieldDecorator(`gysName`, {
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
                                            <Form.Item {...formItemLayout} label={'供应商编号'}>
                                                {getFieldDecorator(`gysCode`)(<Input  disabled />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'产品范围'}>
                                                {getFieldDecorator(`productScope`,{
                                                      rules: [{ required: false, message: '请选择产品范围' }],
                                                })(<Input disabled  />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'产品类别'}>
                                                {getFieldDecorator(`productType`,{
                                                       rules: [{ required: false, message: '请选择产品类别' }],
                                                })(<Input disabled  />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'重要程度'}>
                                                {getFieldDecorator(`importLevel`,{
                                                       rules: [{ required: true, message: '请选择重要程度' }],
                                                })(
                                                     <Select
                                                     placeholder="请选择"
                                                    //  onChange={this.handleSelectChange}
                                                   >
                                                   {children}
                                                     {/* <Option value="核心III类">核心III类</Option>
                                                     <Option value="核心IIII类">核心IIII类</Option> */}
                                                   </Select>,
                                                )}
                                            </Form.Item>
                                        </Col>
                                      
                                       
                                </Row>
                            </Card>
                         
                          
                            <Card bordered={false} title={<b>资质证书</b>} extra={
                                    <Button type="primary" onClick={() => {
                                        toggleStore.setToggle(SHOW_Certificate_MODEL)
                                    }}>
                                        新增
                                    </Button>
                                } className="new_supplier_producelist">
                                    <Row>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => key} columns={PXZScolumns} dataSource={ZZZSData} />
                                        </Col>
                                    </Row>
                                </Card>
                        </Form>
                     
                    </Modal>
                }
                   {/* {
                    toggleStore.toggles.get(SHOW_ChooseListModel_MODEL)&&<ChooseListModel list={ZSList} options={options} chooseFinishFn={(val)=>{this.choosecertificateFn(val)}} />
                } */}
                   {/* 选择证书 */}
                   {
                    toggleStore.toggles.get(SHOW_Certificate_MODEL)&&<ChooseListModel list={ZzzsList} pagination={Zzzspaginations} options={cerlistModelOption}  chooseFinishFn={(val)=>{this.choosecertificateFn(val)}} />
                }
            </div>
        );
    }
}

export default Form.create({ name: 'NewZrrd' })(NewZrrd);