import React, { Component } from 'react';
import { Modal, Button ,Card ,Form , Row, Col,Input  } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_DirectEdit_MODEL } from "../../../../constants/toggleTypes"
import { supplierDirectory } from "../../../../actions"
import _ from "lodash";
const { TextArea } = Input;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const initData = {
    "createdate": "",
    "createuser": "",
    "description": "",
    "name": "",
  }
@inject('toggleStore','directoryStore')
@observer
class ShowDirectEdit extends React.Component {
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_DirectEdit_MODEL)
        this.props.form.validateFields((err,values)=>{
            console.log(values)
        })
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_DirectEdit_MODEL)
    };
    handleSubmit = e =>{
        const { toggleStore,currentDirectory ,refreshData,detail} = this.props;
    
        this.props.form.validateFields((err,values)=>{
            console.log(values)
            let newData = _.defaults(initData)
            newData['name'] = values.name
            newData['description'] = values.description
            newData['id'] = detail.id
            newData['status'] = detail.status
            newData['createdate'] = detail.createdate
            console.log(newData)
            supplierDirectory.editDirect(newData).then(res=>{
                console.log(res)
                if(res.code==200){
                    refreshData(currentDirectory)
                    toggleStore.setToggle(SHOW_DirectEdit_MODEL)
                }
            })
        })
    }
    componentDidMount(){
        const { setFieldsValue } = this.props.form;
        const { detail} = this.props
        setFieldsValue({
            description: detail.description,
            name: detail.name,
        })
    }
    render() {
        const { toggleStore,currentDirectory } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        return (
            <div>
                <Modal
                    title="修改名录"
                    visible={toggleStore.toggles.get(SHOW_DirectEdit_MODEL)}
                    onOk={(e) => { this.handleSubmit(e) }}
                    onCancel={this.handleCancel}
                >
                  <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>
                          <Card bordered={false}  className="new_supplier_form">
                             <Row gutter={24}>
                                <Col span={24}>
                                 <Form.Item {...formItemLayout} label={'名录名称'}>
                                            {getFieldDecorator(`name`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '名录名称不能为空',
                                                    },
                                                ],
                                            })(<Input  />)}
                                 </Form.Item>
                                 <Form.Item {...formItemLayout} label={'说明'}>
                                            {getFieldDecorator(`description`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '说明',
                                                    },
                                                ],
                                            })(  <TextArea rows={4} />)}
                                 </Form.Item>
                               
                                </Col>
                             </Row>
                          </Card>
                  </Form>
                  
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'ShowDirectEdit' })(ShowDirectEdit);;