import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { toJS } from "mobx"
import { Modal, Form, Row, Col, Input, Button, Card, Select,Radio, message,Table ,Tooltip} from 'antd';
import { SHOW_Process_MODEL ,SHOW_ChooseListModel_MODEL,SHOW_ShowSupApply_MODEL } from "../../../../constants/toggleTypes"
import Choosepsupplier from '../../../SupManager/components/Choosepsupplier'
import { supplierAction, supplierEvalution,supplierApproval } from "../../../../actions"
import ChooseListModel from '../../../../components/ChooseListModel'
import ShowRecommendDetail from '../../../SupRecommend/components/ShowRecommendDetail'
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Option } = Select;
const { TextArea } = Input;
 



@inject('toggleStore','supplierStore')
@observer
class ShowSupZzApply extends React.Component {
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
        value:2,
        satisfacted:false,
        userTypeVerty:'sup'
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ShowSupApply_MODEL)
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
        //         toggleStore.setToggle(SHOW_ShowSupApply_MODEL)
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
   
 

      //资质申请
      async ZzApply(id,record){
        const  {userId} = supplierEvalution.pageInfo
        const {toggleStore} = this.props
      let openUrl = supplierEvalution.ZJSQUrl+`&businessInstId=${id}&userId=${userId}`
      console.log(openUrl)
      toggleStore.setModelOptions({
        detail:record,
        modelOptions:{
            title:'资质申请提交',
            url:openUrl
        },
        model:SHOW_Process_MODEL
      })
  
      toggleStore.setToggle(SHOW_Process_MODEL)
      

     }
    

      //为实施评价打分
      async markSsju(id,evaluateSatisfaction){
        let result = await supplierEvalution.ZzpjSatisfaction(id,evaluateSatisfaction) 
       
        if(result.code==200){
            this.setState({
                satisfacted:true,
                isScore:this.converDF(evaluateSatisfaction)
            })
            message.success(result.message)
        }else{
            message.error('评分失败')
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
        switch (Number(type)) {
            case 2:
                str = '满意'
                break;
                case 1:
                str = '一般'
                break;
                case 0:
                str = '不满意'
           
            default:
                break;
        }
        return str
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


    

 
 //资质审批
 async Zzsp(record){
  
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
    async componentDidMount() {
        const { detail } = this.props;
        const { setFieldsValue } = this.props.form;
        const { roleNameKey } = supplierEvalution.pageInfo
        //获取所有审核角色名单
        let ApproveroleLists = await supplierApproval.getCharacter()
        console.log(ApproveroleLists)
        //获取自身角色信息
        let roles = roleNameKey.split(',')
  console.log(roles)
        //判断是否是审核角色
        for (let roleName of roles) {
            let userVerty = ApproveroleLists.some(item => item == roleName)
            if (userVerty) {
                this.setState({
                    userTypeVerty: 'approve'
                })
                break
            }
        }
        setFieldsValue({
            ...detail,
            result:detail.pass!=''?(detail.pass=='1'?'通过':'未通过'):null
        })

        if(detail.pass==''){
            message.error('该申请没有参加任何评价')
            this.setState({
                satisfacted:true
                })
        }
        if (detail.evaluate_satisfaction != '') {
            this.setState({
            isScore:detail.evaluate_satisfaction==''?'未打分':detail.evaluate_satisfaction
            })
        }
        // let certificateRet = await supplierTrain.getTrainCertificate() 

        // console.log(certificateRet)
        if(detail.passCertificate){
            this.setState({
                ZSList:detail.passCertificate,
                speacialist:detail.specialists
            })
        }
      
     

    }
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const CPFLoptions = ()=><Option key={'火工品'}>{'火工品'}</Option>
        const { getFieldDecorator } = this.props.form;
        const { toggleStore,supplierStore,detail  } = this.props;
        const  {userId} = supplierEvalution.pageInfo
        const { satisfacted,ZSList  ,speacialist ,userTypeVerty  ,isScore } = this.state
        console.log(userTypeVerty)
        const children = [CPFLoptions()]
        const PXZScolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 55,
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
                title: '发证机构',
                dataIndex: 'fromorg',
            },
            // {
            //     title: '发证日期',
            //     dataIndex: 'expiry_months',
            //  },
             {
                title: '有效期',
                dataIndex: 'totime',
             },
             {
                title: '证书附件',
                dataIndex: 'file',
                width: 130,
                align: "center",
                render: (text, redord) =>redord.fileid && <span onClick={() => { window.open(`${supplierEvalution.FileBaseURL}${redord.fileid}`) }} style={{ cursor: "pointer", 'color': '#3383da' }}>查看附件</span>
            },
        ]
        const Pjzjcolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '专家名称',
                dataIndex: 'specialistname',
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
            },
            {
                title: '专家职称',
                dataIndex: 'specialisttitle',
            },
            {
                title: '专家类型',
                dataIndex: 'specialisttype',
            },
            {
                title: '专业领域',
                dataIndex: 'specialistfield',
            },
            {
                title: '专家来源',
                dataIndex: 'specialistemail',
            },
            // {
            //     title: '操作',
            //     dataIndex: 'cz',
            //     render: (text,record) =>   <Button type="danger"  onClick={() => { this.deleteSpecialist(record) }} >删除</Button>
            // },
          
        ]
    
        return (
            <div>
                {
                    toggleStore.toggles.get(SHOW_ShowSupApply_MODEL) && <Modal
                        title={`资质申请实施记录详情`}
                        visible={toggleStore.toggles.get(SHOW_ShowSupApply_MODEL)}
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
                               {
                                   detail.status =='0' &&  <Button type="primary"  onClick={()=>{this.ZzApply(detail.id,detail)}}>提交</Button>
                               }
                                {
                                   detail.status =='1' && (detail.process_received==userId) ?<Button type="primary"  onClick={()=>{this.Zzsp(detail)}}>审批</Button>:null
                               }
                                {
                                   detail.status =='1' && (detail.process_received==null) ?<Button type="primary"  onClick={()=>{this.ZzApply(detail.id)}}>提交</Button>:null
                               }
                               
                              </Button.Group>
                              
                            </Card>
                            <Card  bordered={false}>
                                <Row gutter={24}>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'资质评价名称'}>
                                                {getFieldDecorator(`name`, {
                                                    initialValue: "name",
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: '供应商名称',
                                                        },
                                                    ],
                                                })(<Input disabled />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'认证机构'}>
                                                {getFieldDecorator(`doquaevalorg`,{
                                                       initialValue: "doquaevalorg",
                                                })(<Input disabled />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'评价地点'}>
                                                {getFieldDecorator(`quaplace`,{
                                                       initialValue: "quaplace",
                                                      rules: [{ required: false, message: '请选择产品范围' }],
                                                })(   <Input disabled />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'评价时间'}>
                                                {getFieldDecorator(`create_time`,{
                                                      initialValue: "create_time",
                                                       rules: [{ required: false, message: '请选择产品类别' }],
                                                })(
                                                    <Input disabled />
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'产品范围'}>
                                            {getFieldDecorator(`product_scope`,{
                                                initialValue: "product_scope",
                                            })(   <Input disabled />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'产品类别'}>
                                                {getFieldDecorator(`product_category`,{
                                                     initialValue: "product_category",
                                                })(   <Input disabled />)}
                                            </Form.Item>
                                        </Col>
                                       
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'拟准入等级'}>
                                                {getFieldDecorator(`admittance_grade`,{
                                                     initialValue: "admittance_grade",
                                                       rules: [{ required: false, message: '请选择拟准入等级' }],
                                                })(
                                                     <Input disabled />
                                                )}
                                            </Form.Item>
                                        </Col>
                                    
                                        {/* <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'推荐码'}>
                                                {getFieldDecorator(`referral_code`,{
                                                       rules: [{ required: false, message: '请输入推荐码' }],
                                                })(   <Input disabled />)}
                                            </Form.Item>
                                        </Col> */}
                                     
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'评价结果'}>
                                                {getFieldDecorator(`result`,{
                                                      initialValue: "",
                                                })(   <Input disabled />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={detail.evaluate_satisfaction == '' && userTypeVerty == 'sup' && !satisfacted ? 10 : 12} >
                                        <Form.Item {...formItemLayout} label={'满意度'}>
                                            {
                                                detail.evaluate_satisfaction == '' && userTypeVerty == 'sup' && !satisfacted ?
                                                    <Radio.Group onChange={this.onChange} value={this.state.value}>
                                                        <Radio value={2}>满意</Radio>
                                                        <Radio value={1}>一般</Radio>
                                                        <Radio value={0}>不满意</Radio>
                                                    </Radio.Group> :
                                                 (   <Input disabled  value={isScore}/>)
                                            }

                                        </Form.Item>

                                    </Col>

                                    <Col span={12} >
                                        {
                                            detail.evaluate_satisfaction == '' && userTypeVerty == 'sup' && !satisfacted ? <Button type="primary" onClick={() => {
                                                this.markSsju(detail.applyid, this.state.value)
                                            }}>
                                                确定
                                        </Button> : null
                                        }

                                    </Col>
                                       
                                </Row>
                            </Card>
                         
                          {
                              //判断是否有实施记录
                               detail.pass!=''?(
                                detail.pass=='1'?
                                <Card bordered={false} title={<b>资质证书</b>} 
                                className="new_supplier_producelist">
                                    <Row>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => key} columns={PXZScolumns} dataSource={ZSList} />
                                        </Col>
                                    </Row>
                                </Card>
                            :
                            
                            <Card bordered={false} title={<b>不通过原因</b>} 
                            className="new_supplier_producelist">
                                <Row>
                                    <Col span={24}>
                                        
                                     <TextArea rows={3} value={detail.deception} disabled />
                                    </Col>
                                </Row>
                            </Card>
                               ):null
                              
                          }
                           <Card bordered={false} title={<b>评价专家</b>} 
                          className="new_supplier_producelist">
                              <Row>
                                  <Col span={24}>
                                      <Table rowKey={(text, key) => key} columns={Pjzjcolumns} dataSource={speacialist} />
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

export default Form.create({ name: 'ShowSupZzApply' })(ShowSupZzApply);