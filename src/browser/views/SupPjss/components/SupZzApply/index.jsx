import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { toJS } from "mobx"
import { Modal, Form, Row, Col, Input, Button, Card, Select, message,Table ,Tooltip} from 'antd';
import { SHOW_RecommendApply_MODEL,SHOW_ChooseListModel_MODEL } from "../../../../constants/toggleTypes"
import Choosepsupplier from '../../../SupManager/components/Choosepsupplier'
import { supplierAction, supplierEvalution,supplierTrain } from "../../../../actions"
import ChooseListModel from '../../../../components/ChooseListModel'
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

@inject('toggleStore', 'verifyStore','supplierStore')
@observer
class SupZzApply extends React.Component {
    state = {
        productid: "",
        supplierId: "",
        verifyEditProduct:{},
        selectField: {
            "zycd": [

            ],
            "cpfl": [

            ],
            "ptfs": [

            ],
            "ptly": [

            ],
            "sfst": [

            ]
        },
        PXZSData:[],
        ZSList:[]
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
        const { PXZSData,supplierId} = this.state
        this.props.form.validateFields(async (err, values) => {
            if(!err){
                let postData = {
                    ...values,
                    product_category:values.product_category.join(','),
                    gysid:supplierId,
                    train_certificate_id:this.converIds(PXZSData)|| ''
                }
               console.log(postData) 
               let ret = await supplierEvalution.newZzpjApply(postData)
               console.log(ret)
               if(ret.code==200){
                refreshData()
                toggleStore.setToggle(SHOW_RecommendApply_MODEL)
                   if(type=='submit'){
                    let instanceId = ret.data.id
                    console.log(instanceId)
                    let applyResult = await supplierEvalution.editApplyStatus(instanceId)
                    console.log(applyResult)
                   }else{

                   }
                  
              
               }
            }
           // supplierEvalution.newZzpjApply
            // values = this.handelValuesadddunhao(values,true);
            // if (!err) {
            //     console.log(values);
            //     let gysProducts = values;
            //     let { productid, supplierId } = this.state;
            //     let ret = await supplierVerify.modifySupplierProductinfo(supplierId, productid, gysProducts);
            //     message.success("信息修改成功")
            //     refreshData();
            //     toggleStore.setToggle(SHOW_RecommendApply_MODEL)
            // }
        });
    };
    
    converIds(arr){
        let _arr = []
        arr.forEach(item=>{
            _arr.push(item.id)
        })
          return _arr.join(',')
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
        const {PXZSData } = this.state
        PXZSData.push(data)
        this.setState({
            PXZSData
            })
      }
    chooseBZsupplier(data) {
        console.log(data)
        const { supplierStore } = this.props;
        const { setFieldsValue } = this.props.form;
        if (!supplierStore.iseditor) {
            // 当不是编辑状态时才会 ，修改供应商名称
            this.setState({
                supplierId: data.id,
                supplierInfo: data
            })
        }
        setFieldsValue({
            gys_name:data.name,
            gys_number:data.code
        })
    }

    async componentDidMount() {
        const { verifyStore } = this.props;
        const { setFieldsValue } = this.props.form;

        let certificateRet = await supplierTrain.getTrainCertificate() 
        console.log(certificateRet)
        this.setState({
            ZSList:certificateRet.data
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
        const CPFLoptions = ()=><Option key={'火工品'}>{'火工品'}</Option>
        const { getFieldDecorator } = this.props.form;
        const { toggleStore,supplierStore  } = this.props;
        const { ZSList,PXZSData } = this.state
        const children = [CPFLoptions()]
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
                                                            required: true,
                                                            message: '供应商名称',
                                                        },
                                                    ],
                                                })(<Input disabled addonAfter={ <Choosepsupplier chooseBZsupplier={(data) => this.chooseBZsupplier(data)} />} />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'供应商编号'}>
                                                {getFieldDecorator(`gys_number`)(<Input  />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'产品范围'}>
                                                {getFieldDecorator(`product_scope`,{
                                                      rules: [{ required: true, message: '请选择产品范围' }],
                                                })( <Select
                                                     placeholder="请选择"
                                                    //  onChange={this.handleSelectChange}
                                                   >
                                                     <Option value="单机">单机</Option>
                                                     <Option value="分系统">分系统</Option>
                                                     <Option value="部组件">部组件</Option>
                                                     <Option value="物资">物资</Option>
                                                   </Select>,)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'产品类别'}>
                                                {getFieldDecorator(`product_category`,{
                                                       rules: [{ required: true, message: '请选择产品类别' }],
                                                })(
                                                    <Select
                                                    mode="tags"
                                                    size={'default'}
                                                    placeholder="请选择"
                                                    
                                                    onChange={this.handleChange}
                                                    style={{ width: '100%' }}
                                                  >
                                                    {children}
                                                  </Select>
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'拟准入等级'}>
                                                {getFieldDecorator(`admittance_grade`,{
                                                       rules: [{ required: true, message: '请选择拟准入等级' }],
                                                })(
                                                     <Select
                                                     placeholder="请选择"
                                                    //  onChange={this.handleSelectChange}
                                                   >
                                                     <Option value="核心III类">核心III类</Option>
                                                     <Option value="核心IIII类">核心IIII类</Option>
                                                   </Select>,
                                                )}
                                            </Form.Item>
                                        </Col>
                                      
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'推荐码'}>
                                                {getFieldDecorator(`referral_code`,{
                                                       rules: [{ required: true, message: '请输入推荐码' }],
                                                })( <Input  />)}
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
                    toggleStore.toggles.get(SHOW_ChooseListModel_MODEL)&&<ChooseListModel list={ZSList} options={options} chooseFinishFn={(val)=>{this.choosecertificateFn(val)}} />
                }
            </div>
        );
    }
}

export default Form.create({ name: 'NewsupZzApply' })(SupZzApply);