
import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, DatePicker, Icon, Button, message, Tooltip, Checkbox, Radio } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_addChildren_MODEL } from "../../../../../../constants/toggleTypes"
import { supplierTrain } from '../../../../../../actions'
import _ from "lodash";
// 公用选择供应商组件

const { TabPane } = Tabs;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class AddChildrenDirectory extends React.Component {
    state = {
        parentid:''
    }
    handleSubmit = (e) => {
        let { getSubCoursetype,statuss} = this.props
        let {parentid} = this.state
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
               if(statuss == 0){
                values.parentid = parentid
                let res = await supplierTrain.insertCoursetype(values)
                if (res.code == 200) {
                    let { toggleStore } = this.props
                    toggleStore.setToggle(SHOW_addChildren_MODEL)
                    getSubCoursetype()
                }
               }else{
                values.id = parentid
                let res = await supplierTrain.updateCoursetype(values)
                if (res.code == 200) {
                    let { toggleStore } = this.props
                    toggleStore.setToggle(SHOW_addChildren_MODEL)
                    getSubCoursetype()
                }
               }
            }
        })
    }
    handleCancel = () => {
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_addChildren_MODEL)
    }

    async componentDidMount(){
        // event : 获取选中元素的info
        let {event,statuss} = this.props
        let {setFieldsValue} = this.props.form
        this.setState({
            parentid:event.selectedNodes[0].props.dataRef.id
        })
        
        if(statuss == 0){
            setFieldsValue({
                parentname:event.selectedNodes[0].props.dataRef.name
            }) 
        }else{
            let res = await supplierTrain.getCoursetype(event.selectedNodes[0].props.dataRef.id)
            if(res.code == 200){
                setFieldsValue({
                    name:res.data[0].name,
                    description:res.data[0].description,
                })
            }
        }
    }


    render = () => {
        const { getFieldDecorator } = this.props.form;
        let { toggleStore,statuss } = this.props
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        return (
            <Modal
                title={statuss == 0 ? <b>新建节点</b> : <b>修改节点</b>}
                visible={toggleStore.toggles.get(SHOW_addChildren_MODEL)}
                onOk={(e) => { this.handleSubmit(e) }}
                onCancel={this.handleCancel}
            >
                <Form className="ant-advanced-search-form">
                    {statuss == 0 ? <Row>
                        <Form.Item {...formItemLayout} label={'所属类别'}>
                            {getFieldDecorator(`parentname`, {
                                rules: [
                                    {
                                        required: false,
                                        message: '所属类别',
                                    },
                                ],
                            })(<Input disabled = {true}/>)}
                        </Form.Item>
                    </Row> : null}
                    <Row>
                        <Form.Item {...formItemLayout} label={'类型名称'}>
                            {getFieldDecorator(`name`, {
                                rules: [
                                    {
                                        required: true,
                                        message: '类型名称',
                                    },
                                ],
                            })(<Input/>)}
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

export default Form.create({ name: 'addChildrenDirectory' })(AddChildrenDirectory);