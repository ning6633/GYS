import React, { Component } from 'react'; 
import { observer, inject, } from 'mobx-react';
import { Modal, Form, Row, Col, Input,message,  Button , Table ,DatePicker, Select} from 'antd';
import { SHOW_TrainLicen_MODEL } from "../../../../../../constants/toggleTypes";
import supplierTrain from '../../../../../../actions/supplierTrain'
import moment from 'moment'
import { supplierEvalution} from '../../../../../../actions'
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const {Option} = Select

@inject('toggleStore', 'supplierStore')
@observer
class SupLicence extends React.Component {
    state={
        ModificationData:[],
        LicenceType:[],
        TrainTypeInfosArgs:[],
        startDate:null
    }
    async addTrainCertificate(body) {
        //新增培训证书
        let {toggleStore} = this.props
        console.log(body)
        //为了演示写死过期时间
        body['expiry_months'] = '2020-05-10'
        let res = await supplierTrain.addTrainCertificate(body)
        if (res.code == 200) {
        toggleStore.setToggle(SHOW_TrainLicen_MODEL)
            message.success(res.message)
            this.props.loaddata()
        }else{
            message.error(res.message)
        }
    }

    async getDic(){
        let res = await supplierTrain.getDic('TYPE_PXZS')
        let ret = await supplierTrain.getDic('TRAIN_PROPERTIES')
        console.log(ret)
        if(res.code == 200){
            this.setState({
                LicenceType:res.data,
                TrainTypeInfosArgs:ret.data
            })
        }
    }

    //资质类型
    // async getTrainTypeInfosArgs(){
    //     let res = await supplierTrain.getTrainTypeInfosArgs()
    //     if(res.code == 200){
    //         console.log(res.data)
    //         let tmp = []
    //         for(let i = 0;i<res.data.list.length;i++){
    //             if(tmp.indexOf(res.data.list[i].trainName) == -1){
    //                 tmp.push(res.data.list[i])
    //             }
    //         }
    //         this.setState({
    //             TrainTypeInfosArgs:tmp
    //         })
    //     }
    // }
    async modifyTrainCertificate(id){
        let {toggleStore} = this.props
        let res = await supplierTrain.modifyTrainCertificate(id)
        if(res.code == 200){
        toggleStore.setToggle(SHOW_TrainLicen_MODEL)
            message.success(res.message)
            this.props.loaddata()
        }
    }
   
    handleSubmit=()=>{
        // this.addTrainCertificate()
        let {toggleStore,onSelectKey} = this.props

        this.props.form.validateFields(async (err, values) => {
            if(!err){
                if(onSelectKey.length > 0){

                    values.id = onSelectKey[0].id
                  //  values.expiry_months = values.expiry_months.format("YYYY-MM-DD")
                    this.modifyTrainCertificate(values)
                }else{
                  //  values.expiry_months = values.expiry_months.format("YYYY-MM-DD")
                    this.addTrainCertificate(values)
                }
            }
        });
    }
    cancel=()=>{
        let {toggleStore} = this.props
        toggleStore.setToggle(SHOW_TrainLicen_MODEL)
    }
    
   async componentDidMount(){
        let {onSelectKey} = this.props
        const { setFieldsValue } = this.props.form;
        if(onSelectKey.length == 1){
            let {name,type,train_type_id,authoritied_orgname,expiry_months} = onSelectKey[0]
            setFieldsValue({
                name,type,train_type_id,authoritied_orgname
            })
        }
        this.getDic()
        let userInfo = await supplierEvalution.getUserInfo()
        if(userInfo.code==200){
            const { setFieldsValue } = this.props.form
            setFieldsValue({
                authoritied_orgname:userInfo.data[0].departmentname
            })
        }
    }
    
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        let {LicenceType,TrainTypeInfosArgs} = this.state
        let {onSelectKey} = this.props
        return (
            <div>
                <Modal
                    title={<b>{onSelectKey.length>0?'修改培训证书':'添加培训证书'}</b>}
                    width={960}
                    visible= {true}
                    onOk = {this.handleSubmit}
                    onCancel = {this.cancel}
                >
                     
                    <Row className="gys_tb_search">
                        <Col span = {12} >
                            <Form.Item {...formItemLayout} label={`证书名称`} >
                                {getFieldDecorator(`name`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Input something!',
                                        },
                                    ]
                                })(<Input disabled = {onSelectKey.length == 1} />)}
                            </Form.Item>
                            </Col>
                            <Col span={12}>
                            <Form.Item {...formItemLayout} label={`证书类型`}>
                                {getFieldDecorator(`type`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Input something!',
                                        },
                                    ]
                                })(<Select placeholder='请选择证书类别' style={{width:150}} onChange={this.selectOnChange}
                                >
                                    {LicenceType.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.code}>{item.name}</Option>
                                        )
                                    })}
                                </Select>)}
                            </Form.Item>
                            </Col>
                          
                            <Col span={12}>
                            <Form.Item {...formItemLayout} label={`发证机构`}>
                                {getFieldDecorator(`authoritied_orgname`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Input something!',
                                        },
                                    ]
                                })(<Input placeholder="" />)}
                            </Form.Item>
                            </Col>
                            <Col span={12}>
                            <Form.Item {...formItemLayout} label={`培训类型`}>
                                {getFieldDecorator(`train_type_id`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Input something!',
                                        },
                                    ]
                                })(<Select placeholder='请选择培训类别' style={{width:150}} onChange={this.selectOnChange}
                                >
                                    {TrainTypeInfosArgs.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.code}>{item.name}</Option>
                                        )
                                    })}
                                </Select>)}
                            </Form.Item>
                            </Col>
                            {/* <Col span={12}>
                            <Form.Item {...formItemLayout} label={`有效期`}>
                                {getFieldDecorator(`expiry_months`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Input something!',
                                        },
                                    ]
                                })(<DatePicker disabledDate={(current)=>{
                                    if(!current){
                                        return false
                                    }else{

                                       return current < moment().subtract(1, "days")
                                    }
                                }} format={`YYYY年MM月DD日`}  style={{width:'100%'}} />)}
                            </Form.Item>
                        </Col> */}
                          <Col span={12}>
                            <Form.Item {...formItemLayout} label={`有效期`}>
                                {getFieldDecorator(`expiry_months`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Input something!',
                                        },
                                    ]
                                })(<Select placeholder='请选择' style={{width:150}} onChange={this.selectOnChange}
                                >
                                  <Option key={0} value={0.5}>6个月</Option>
                                 <Option key={1} value={1}>一年</Option>
                                 <Option key={2} value={3}>三年</Option>
                                 <Option key={3} value={5}>五年</Option>
                                </Select>)}
                            </Form.Item>
                        </Col>
                    </Row>
                </Modal>
            </div>
        )
    }
}

export default Form.create({ name: 'supLicence' })(SupLicence);