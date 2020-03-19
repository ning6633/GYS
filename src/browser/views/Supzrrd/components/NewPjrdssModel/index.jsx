import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, Select, Icon, Button, message, Tooltip } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_PJSSJL_MODEL,SHOW_NewBZYQ_MODEL,SHOW_ChooseSupplierPub_MODEL  } from "../../../../constants/toggleTypes"

// 公用选择供应商组件
import ChooseSupplier from "../../../../components/ChooseSupplier"
const { TabPane } = Tabs;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class NewPjrdssModel extends React.Component {
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_PJSSJL_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore } = this.props;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log(values);
                toggleStore.setToggle(SHOW_PJSSJL_MODEL)
            }
        });
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_PJSSJL_MODEL)
    };
    render() {
        const { toggleStore } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const columns_standard = [
            {
                title: '序号',
                dataIndex: 'key',
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
            },
            {
                title: '质量要求',
                dataIndex: 'quality_request',
            }
        ]
        const columns_expert = [
            {
                title: '名称',
                dataIndex: 'name',
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
            },
            {
                title: '上传人',
                dataIndex: 'people',
            },
            {
                title: '上传时间',
                dataIndex: 'time',
            },
            {
                title: '大小',
                dataIndex: 'size',
            }
        ]
        return (
            <div>
                <Modal
                    title="合同录入"
                    width={960}
                    visible={toggleStore.toggles.get(SHOW_PJSSJL_MODEL)}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                >
                    <Form className="ant-advanced-search-form" onSubmit={(e) => { }}>
                        <Card bordered={false} className="new_supplier_form">
                            <Row gutter={12}>
                                <Col span={24}>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'合同编码'}>
                                            {getFieldDecorator(`name`, {
                                                initValue: "合同编码",
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '合同编码',
                                                    },
                                                ],
                                            })(<Input />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'甲方名称'}>
                                            {getFieldDecorator(`code`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '甲方名称',
                                                    },
                                                ],
                                            })(<Input />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'甲方单位编号'}>
                                            {getFieldDecorator(`name_other`)(<Input />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'甲方签署人'}>
                                            {getFieldDecorator(`another_name`)(<Input />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'乙方名称'}>
                                            {getFieldDecorator(`name_other`)(<Input />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'乙方单位编号'}>
                                            {getFieldDecorator(`another_name`)(<Input />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'产品范围'}>
                                            {getFieldDecorator(`name_other`)(<Input />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'过程范围'}>
                                            {getFieldDecorator(`another_name`)(<Input />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'合同标的'}>
                                            {getFieldDecorator(`name_other`)(<Input />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'合同周期'}>
                                            {getFieldDecorator(`another_name`)(<Input />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'乙方签署人'}>
                                            {getFieldDecorator(`name_other`)(<Input />)}
                                        </Form.Item>
                                    </Col>
                                    
                                </Col>
                            </Row>
                        </Card>
                        <Card bordered={false} title={<b>附件</b>} extra={
                            <Button type="primary" onClick={() => {
                                toggleStore.setToggle(SHOW_NewBZYQ_MODEL)
                            }}>
                                上传
                            </Button>   
                        } className="new_supplier_producelist">
                            <Row>
                                <Col span={24}>
                                    <Table rowKey={(text, key) => key} columns={columns_expert} dataSource={[]} />
                                </Col>
                            </Row>
                        </Card>
                        <Card bordered={false} title={<b>合同要求</b>} extra={
                            <Button type="primary">
                                新增
                            </Button>
                        } className="new_supplier_producelist">
                            <Row>
                                <Col span={24}>
                                    <Table rowKey={(text, key) => key} columns={columns_standard} dataSource={[]} />
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                        
                    
                </Modal>
                {
                    toggleStore.toggles.get(SHOW_ChooseSupplierPub_MODEL)&&<ChooseSupplier chooseBZsupplierFn={(val)=>{console.log(val)}} supplierList={[]} />
                }
            </div>
        );
    }
}

export default Form.create({ name: 'NewPjrdssModel' })(NewPjrdssModel);;