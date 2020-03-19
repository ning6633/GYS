import React, { Component } from 'react'; 
import { observer, inject, } from 'mobx-react';
import { SHOW_AddBlackList_MODEL, SHOW_ModifyBlackList_MODEL } from "../../../../constants/toggleTypes"
import { Modal, Form, Row, Col, Input, message, Select, Card, Button } from 'antd';
import { SHOW_BlackList_MODEL, SHOW_ChooseListModel_MODEL, SHOW_Process_MODEL } from "../../../../constants/toggleTypes"
import { toJS } from "mobx"
import { supplierAction, supBlackList, supplierTrain } from "../../../../actions"
import ChooseTBSupplier from '../../../../components/ChooseTBSupplier'
const { Option } = Select;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { TextArea } = Input;

@inject('toggleStore', 'supplierStore')
@observer
class ModifyBlackList extends React.Component {

    state = {
        supBlackType: []
    }
    handleSubmit = (e)=>{
        e.preventDefault();
        const { toggleStore } = this.props;
        let {id,status} = this.props.info
        this.props.form.validateFields(async (err, values) => {
            if(!err){
                values.id = id
                let res = await supBlackList.updateGysBlackList(values)
                console.log(res)
                if(res.code == 200){
                    this.props.loaddata()
                    message.success(res.message)
                }else{
                    message.error("修改失败")
                }
                toggleStore.setToggle(SHOW_ModifyBlackList_MODEL)
            }
        });
    }
    againLoaddata = () => {
        this.loaddata()
    }
    handleCancel = e => {
        const { toggleStore } = this.props; 
        toggleStore.setToggle(SHOW_ModifyBlackList_MODEL)
    };

    async componentDidMount() {
        const { setFieldsValue } = this.props.form;
        let supplierBlack = await supBlackList.getDic("BLACKLISTTYPE")
        this.setState({
            supBlackType: supplierBlack.data
        })
        let { info } = this.props
        let {name,number,property_key,registrationplace,create_date,statusV,type,reason} = info
        setFieldsValue({
            // ...info
            name,number,property_key,registrationplace,create_date,statusV,type,reason
        })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const { status} = this.props.info;
        const { getFieldDecorator } = this.props.form;
        let { supBlackType } = this.state
        return (
            //  <div>ljroeqwjreipowjripew</div>
            <div>
                <Modal
                    title={<b>查看详情</b>}
                    width={960}
                    visible={true}
                    onCancel={this.handleCancel}
                    footer={
                        <div>
                            {status == 0?<Button type="primary" onClick={this.handleSubmit} >修改并保存</Button>:''}
                            <Button type="primary" onClick={this.handleCancel}>关闭</Button>
                        </div>
                    }
                >
                    <Form className="ant-advanced-search-form" >
                        <Row>
                            <Col span={12}>
                                <Form.Item {...formItemLayout} label={'供应商名称：'}>
                                    {getFieldDecorator('name', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '供应商名称',
                                            },
                                        ],
                                    })(<Input disabled />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
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
                            <Col span={12}>
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
                            <Col span={12}>
                                <Form.Item {...formItemLayout} label={'注册地址：'}>
                                    {getFieldDecorator('registrationplace', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '注册地址',
                                            },
                                        ],
                                    })(<Input disabled />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item {...formItemLayout} label={'创建时间'}>
                                    {getFieldDecorator('create_date', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '创建时间',
                                            },
                                        ],
                                    })(<Input disabled />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item {...formItemLayout} label={'状态：'}>
                                    {getFieldDecorator('statusV', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '状态',
                                            },
                                        ],
                                    })(<Input disabled />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item {...formItemLayout} label={'黑名单类别：'}>
                                    {getFieldDecorator('type', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '注册地址',
                                            },
                                        ],
                                    })(<Select placeholder='请选择事故类别' style={{ width: 150 }} disabled={ status == 0 ? false : true}>
                                        {supBlackType.map((item, index) => {
                                            return (
                                                <Option key={index} value={item.code}>{item.name}</Option>
                                            )
                                        })}
                                    </Select>)}
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row>
                            <Col span={12}>
                                <Form.Item {...formItemLayout} label={'原因：'}>
                                    {getFieldDecorator('reason', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '加入黑名单时间',
                                            },
                                        ],
                                    })(<Input.TextArea disabled={ status == 0 ? false : true}/>)}
                                </Form.Item>

                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default Form.create({ name: 'modifyBlackList' })(ModifyBlackList);