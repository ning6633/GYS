import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { toJS } from "mobx"
import { Modal, Form, Row, Col, Input, Button, Card, Select,Radio, message,Table ,Tooltip,Tabs} from 'antd';
import { SHOW_RecommendApply_MODEL,SHOW_ChooseListModel_MODEL,SHOW_ShowSupPJrd_MODEL } from "../../../../constants/toggleTypes"
import Choosepsupplier from '../../../SupManager/components/Choosepsupplier'
import { supplierAction, supplierEvalution,supplierTrain } from "../../../../actions"
import ChooseListModel from '../../../../components/ChooseListModel'
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs; 




@inject('toggleStore', 'verifyStore','supplierStore')
@observer
class ShowSupPJrd extends React.Component {
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
        ZSList:[],
        value:0,
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ShowSupPJrd_MODEL)
    };
    deleteZs(key){
        const {PXZSData } = this.state 
        PXZSData.splice(key,1)
        this.setState({
            PXZSData
            })
    }
    onChange = e => {
        this.setState({
          value: e.target.value,
        });
      };
   async handleSubmit(type){
      //  e.preventDefault();
        // const { toggleStore,refreshData } = this.props;
        // const { PXZSData,supplierId} = this.state
        // this.props.form.validateFields(async (err, values) => {
        //     console.log(values)
        //     if(!err){
        //         let postData = {
        //             ...values,
        //             product_category:values.product_category.join(','),
        //             gysid:supplierId,
        //             gys_train_certificate_rel_ids:this.converIds(PXZSData)|| ''
        //         }
        //        console.log(postData) 
        //        let ret = await supplierEvalution.newZzpjApply(postData)
        //        console.log(ret)
        //        if(ret.code==200){
        //         refreshData()
        //         toggleStore.setToggle(SHOW_ShowSupPJrd_MODEL)
        //            if(type=='submit'){
        //             let instanceId = ret.data.id
        //             console.log(instanceId)
        //             let applyResult = await supplierEvalution.editApplyStatus(instanceId)
        //             console.log(applyResult)
        //            }else{

        //            }
                  
              
        //        }
        //     }
    
        // });
    };
   
    //申请提交(审批)
    async applySubmit(){
        const { toggleStore,refreshData,detail } = this.props;
        let ret = await supplierEvalution.editApplyStatus(detail.apply.id)
        if(ret.code==200){
            refreshData()
            toggleStore.setToggle(SHOW_ShowSupPJrd_MODEL)
            message.success(ret.message)
              
          
           }
    }

      //资质申请
      async ZzApply(id){
        const  {userId} = supplierEvalution.pageInfo
      let openurl = supplierEvalution.ZJSQUrl+`&businessInstId=${id}&userId=${userId}`
       console.log(openurl)
        window.open(openurl)
     }
    

      //为实施评价打分
      async markSsju(id,evaluateSatisfaction){
        let result = await supplierEvalution.markSsju(id,evaluateSatisfaction) 
        console.log(result)
        if(result.code==200){
            message.success(result.message)
        }else{
            message.danger('评分失败')
        }
    }
    converIds(arr){
        let _arr = []
        arr.forEach(item=>{
            _arr.push(item.id)
        })
          return _arr.join(',')
    }

    converDF(type){
        let str = ''
        switch (type) {
            case '0':
                str = '满意'
                break;
                case '1':
                str = '一般'
                break;
                case '2':
                str = '不满意'
           
            default:
                break;
        }
        return str
  }

    saveZzsq(){

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
 //资质审批
 async Zzsp(record){
    console.log(record)
   const  {userId} = supplierEvalution.pageInfo
   let openurl = supplierEvalution.ZJSQUrl+ `&businessInstId=${record.id}&processInstanceId=${record.processinstid}&status=${record.status}&userId=${userId}`
    console.log(openurl)
     window.open(openurl)
}
    async componentDidMount() {
        const { verifyStore,detail } = this.props;
        const { setFieldsValue } = this.props.form;
        console.log(detail)
        setFieldsValue({
            ...detail.apply
        })
        // let certificateRet = await supplierTrain.getTrainCertificate() 

        // console.log(certificateRet)
        // this.setState({
        //     ZSList:certificateRet.data
           
        // })
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
        const { toggleStore,detail  } = this.props;
        console.log(detail)
        const zrApplyDetail = detail.apply
        const zzzsData = detail.certs|| []
        const PXZScolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '证书名称',
                dataIndex: 'certificatename',
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
            },
            {
                title: '证书编号',
                dataIndex: 'code',
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
                    title: '有效期',
                    dataIndex: 'totime',
             }
        ]
       
        return (
            <div>
                {
                    toggleStore.toggles.get(SHOW_ShowSupPJrd_MODEL) && <Modal
                        title={`评价认定详情`}
                        visible={toggleStore.toggles.get(SHOW_ShowSupPJrd_MODEL)}
                        width={960}
                        centered
                        footer={null}
                        okText="确认"
                        cancelText="取消"
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >
              
                        <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>
                            <Card  bordered={false}>
                                <Row gutter={24}>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'供应商名称'}>
                                                {getFieldDecorator(`gysName`, {
                                                    initValue: "评价认定名称",
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: '评价认定名称',
                                                        },
                                                    ],
                                                })(<Input disabled />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'供应商编号'}>
                                                {getFieldDecorator(`gysCode`)(<Input disabled />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'产品范围'}>
                                                {getFieldDecorator(`productScope`)(
                                                     <Input disabled />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'产品类别'}>
                                                {getFieldDecorator(`productType`)(   <Input disabled />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'申请重要程度'}>
                                                {getFieldDecorator(`importLevel`)(   <Input disabled />)}
                                            </Form.Item>
                                        </Col>
                                        {/* <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'评价结果'}>
                                                {getFieldDecorator(`refer`)(   <Input disabled />)}
                                            </Form.Item>
                                        </Col> */}
                                     
                                        {/* <Col span={zrApplyDetail.evaluate_satisfaction&& zrApplyDetail.status=='3'==null? 10:12} >
                                            <Form.Item {...formItemLayout} label={'满意度'}>
                                            {
                                          zrApplyDetail.evaluate_satisfaction==null && zrApplyDetail.status=='3'? 
                                          <Radio.Group onChange={this.onChange} value={this.state.value}>
                                          <Radio value={0}>满意</Radio>
                                          <Radio value={1}>一般</Radio>
                                          <Radio value={2}>不满意</Radio>
                                          </Radio.Group>:<Input disabled value={zrApplyDetail.evaluate_satisfaction } />
                                      }
                                            
                                            </Form.Item>
                                           
                                        </Col> */}
                                      
                                       
                                </Row>
                            </Card>
                          
                            <Card bordered={false} title={<b>资质证书</b>} 
                         
                                className="new_supplier_producelist">
                                    <Row>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => key} columns={PXZScolumns} dataSource={zzzsData} />
                                        </Col>
                                    </Row>
                                </Card>
                        </Form>
                    
                    </Modal>
                }
                 
            </div>
        );
    }
}

export default Form.create({ name: 'ShowSupPJrd' })(ShowSupPJrd);