import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, DatePicker, Icon, Button, message, Tooltip, Checkbox, Radio } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_addRoot_MODEL } from "../../../../../../constants/toggleTypes"
import { supplierTrain } from '../../../../../../actions'
import _ from "lodash";
// 公用选择供应商组件
const { TabPane } = Tabs;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class AddRootDirectory extends React.Component {

    handleSubmit = (e) => {
        let { getSubCoursetype } = this.props
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let ret = await supplierTrain.getSubCoursetype()
                if (ret.code == 200 && ret.data.length == 0) {
                    values.parentid = ''
                    let res = await supplierTrain.insertCoursetype(values)
                    if (res.code == 200) {
                        let { toggleStore } = this.props
                        toggleStore.setToggle(SHOW_addRoot_MODEL)
                        getSubCoursetype()
                    }
                }else{
                    message.warning("已存在根目录，请勿重复添加！")
                }
            }
        })
    }
    handleCancel = () => {
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_addRoot_MODEL)
    }

    render = () => {
        const { getFieldDecorator } = this.props.form;
        let { toggleStore } = this.props
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        return (
            <Modal
                title="新建根目录"
                visible={toggleStore.toggles.get(SHOW_addRoot_MODEL)}
                onOk={(e) => { this.handleSubmit(e) }}
                onCancel={this.handleCancel}
            >
                <Form className="ant-advanced-search-form">
                    <Row>
                        <Form.Item {...formItemLayout} label={'类型名称'}>
                            {getFieldDecorator(`name`, {
                                rules: [
                                    {
                                        required: true,
                                        message: '类型名称',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                    </Row>
                    <Row>
                        <Form.Item {...formItemLayout} label={'说明'}>
                            {getFieldDecorator(`description`, {
                                rules: [
                                    {
                                        required: false,
                                        message: '',
                                    },
                                ],
                            })(<Input.TextArea autosize={{ minRows: 5, maxRows: 12 }} />)}
                        </Form.Item>
                    </Row>
                </Form>
            </Modal>
        )
    }


}

export default Form.create({ name: 'addRootDirectory' })(AddRootDirectory);;