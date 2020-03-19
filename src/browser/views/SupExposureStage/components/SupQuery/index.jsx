import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { SHOW_AddBlackList_MODEL, SHOW_ModifyBlackList_MODEL } from "../../../../constants/toggleTypes"
import { Modal, Form, Row, Col, Input, Button, Table } from 'antd';
import { SHOW_Exposure_MODEL } from "../../../../constants/toggleTypes";
import { toJS } from "mobx"
import { supplierAction, supBlackList, supplierTrain } from "../../../../actions"
import ChooseTBSupplier from '../../../../components/ChooseTBSupplier'
import "./index.less"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { TextArea } = Input;

@inject('toggleStore', 'supplierStore')
@observer
class SupQuery extends React.Component {
    state = {
        list: []
    }
    handleSubmit = () => {
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_Exposure_MODEL);
    }
    componentDidMount = () => {
        const { setFieldsValue } = this.props.form;
        let {name,content,type}=this.props.info
        if(type == 1){
            type = '优质供应商'
        }
        if(type == 2){
            type = '劣质供应商'
        }
        setFieldsValue({ name,content,type})

    }
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Modal
                    title={<b>详情信息</b>}
                    width={700}
                    visible={true}
                    footer={
                        <Button onClick={this.handleSubmit} type='primary'>关闭</Button>
                    }
                    onCancel={this.handleSubmit}
                >
                    <div className='BG_box'>
                    <Form className="ant-advanced-search-form" >
                    <Row gutter={24}>
                        <Col span={24} >
                            <Form.Item {...formItemLayout} label={<b>供应商名称</b>} labelAlign='right' labelCol={{span: 3, offset: 2}}>
                                {getFieldDecorator('name', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '供应商名称',
                                        },
                                    ],
                                })(<Input disabled  style={{width:300}}/>)}
                            </Form.Item>
                        </Col>
                        </Row>
                        <Row gutter={24} style={{ marginTop: 20 }}>
                        <Col span={24} >
                            <Form.Item {...formItemLayout} label={<b>曝光性质</b>} labelAlign='right' labelCol={{span: 3, offset: 2}}>
                                {getFieldDecorator('type', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '供应商名称',
                                        },
                                    ],
                                })(<Input disabled style={{width:300}} />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    
                    
                    <Row gutter = {24} style={{ marginTop: 20 }}>
                    <Col span={24} >
                            <Form.Item {...formItemLayout} label={<b>曝光原因</b>} labelAlign='right' labelCol={{span: 3, offset: 2}} >
                                {getFieldDecorator('content', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请输入0~150个字符',
                                        },
                                    ],
                                })(<Input.TextArea disabled rows={8}/>)}
                            </Form.Item>
                        </Col>
                    </Row>
                    </Form>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default Form.create({ name: 'supQuery' })(SupQuery);