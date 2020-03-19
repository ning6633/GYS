import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { SHOW_AddBlackList_MODEL } from "../../../../constants/toggleTypes"
import { Modal, Form, Row, Col, Input, message, Select, Card ,Button} from 'antd';
import { SHOW_BlackList_MODEL,SHOW_ChooseListModel_MODEL,SHOW_Process_MODEL } from "../../../../constants/toggleTypes"
import { toJS } from "mobx"
import { supplierAction, supBlackList, supplierTrain } from "../../../../actions"
import ChooseTBSupplier from '../../../../components/ChooseTBSupplier'
const { Option } = Select;
import "./index.less"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { TextArea } = Input;

@inject('toggleStore', 'supplierStore')
@observer
class AddBlackList extends React.Component {
    state = {
        supFeedback: {},
        supplierList: [],
        supplierId: '',
        supplierInfo: {},
        supBlackType: [],
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_AddBlackList_MODEL)
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_AddBlackList_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore } = this.props;
        const { id } = this.state.supFeedback;
        
        this.props.form.validateFields(async (err, values) => {
            if(!err){
                values.create_user = supBlackList.pageInfo.userId
                let res = await supBlackList.insertGysBlackList(values)
                if(res.code == 200){
                    this.props.loaddata()
                    message.success(res.message)
                }else{
                    message.error("添加失败")
                }
                toggleStore.setToggle(SHOW_AddBlackList_MODEL)
            }
        });
    };
    handleSubmitAndUP = e => {
        e.preventDefault();
        const { toggleStore } = this.props;
        const { id } = this.state.supFeedback;
        this.props.form.validateFields(async (err, values) => {
            if(!err){
                let res = await supBlackList.insertGysBlackList(values)
                if(res.code == 200){
                    let instanceId = res.data.id
                    const  {userId} = supBlackList.pageInfo
                    let openurl = supBlackList.newInfoUrl+`&businessInstId=${instanceId}&userId=${userId}`
                    //信息注入
                    toggleStore.setModelOptions({
                        modelOptions:{
                            detail:'',
                            title:'黑名单申请',
                            url:openurl
                        },
                        model:SHOW_Process_MODEL
                      })
                      //打开流程页面
                      toggleStore.setToggle(SHOW_Process_MODEL)

                    this.props.loaddata()
                    message.success(res.message)
                }else{
                    message.error("添加失败")
                }

                toggleStore.setToggle(SHOW_AddBlackList_MODEL)
            }
        });
    }
    async componentDidMount() {
        let supplierList = await supBlackList.getgysmessagelist(1, 20)
        let supplierBlack = await supBlackList.getDic("BLACKLISTTYPE")
        
        this.setState({
            supplierList: supplierList.data.list,
            supBlackType: supplierBlack.data
        })
    }
    chooseTBsupplierFn(data) {
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
            name: data.name,
            number: data.number,
            property_key: data.property,
            registrationplace: data.registrationplace,
            productioncapacity:''
        })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        let BlackListSelect = () => {
            
        }
        const { toggleStore} = this.props;
        const { getFieldDecorator } = this.props.form;
        let { supplierList, supBlackType , stateQ } = this.state
        return (
            <div>
                
                <Modal
                    title="申请添加到黑名单"
                    visible={toggleStore.toggles.get(SHOW_AddBlackList_MODEL)}
                    width={1000}
                    centered={true}
                    footer={[
                        <Button type='primary' key={1} onClick={this.handleSubmit}>保存</Button>,
                        <Button type='primary' key={2} onClick={this.handleSubmitAndUP}>保存并提交</Button>,
                        <Button type='primary' key={3} onClick={this.handleCancel}>关闭</Button>,
                    ]}
                    onCancel={this.handleCancel}
                >
                    
                    <Row gutter={24}>
                        <Col span={12} >

                            <Form.Item {...formItemLayout} label={'供应商名称：'}>
                                {getFieldDecorator('name', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '供应商名称',
                                        },
                                    ],
                                })(<Input disabled addonAfter={<ChooseTBSupplier supplierList={supplierList} chooseTBsupplierFn={(data) => this.chooseTBsupplierFn(data)} />} />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'供应商编号：'}>
                                {getFieldDecorator('number', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '供应商编号',
                                        },
                                    ],
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'企业性质：'}>
                                {getFieldDecorator('property_key', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '企业性质',
                                        },
                                    ],
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'注册地：'}>
                                {getFieldDecorator(`registrationplace`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '注册地',
                                        },
                                    ],
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'黑名单类别：'}>
                                {getFieldDecorator('type', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '黑名单类别',
                                        },
                                    ],
                                })( <Select placeholder='请选择事故类别' style={{width:150}} onChange={this.selectOnChange}
                                >
                                    {supBlackType.map((item, index) => {
                                        return (
                                            <Option key={index} value={item.code}>{item.name}</Option>
                                        )
                                    })}
                                </Select>)}
                            </Form.Item>
                        </Col>

                    </Row>
                    <Row span={24}>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'原因说明：'}>
                                {getFieldDecorator('reason', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '原因说明',
                                        },
                                    ],
                                })(<Input.TextArea size='large'/>)}
                            </Form.Item>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'AddBlackList' })(AddBlackList);