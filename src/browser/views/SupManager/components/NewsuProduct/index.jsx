import React, { Component } from 'react';
import { toJS } from "mobx"
import { observer, inject, } from 'mobx-react';
import { SHOW_NEWPRODUCT_MODEL } from "../../../../constants/toggleTypes"
import { Modal, Form, Row, Col, Input, Button, Empty, Select, message } from 'antd';
import { supplierAction } from "../../../../actions"
import Choosepsupplier from "../Choosepsupplier"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Option } = Select;
@inject('toggleStore', 'supplierStore')
@observer
class NewsuProduct extends React.Component {
    state = {
        errorcolumn: [],
        editProductId: '',
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
        }
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NEWPRODUCT_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore, getProductInfo, supplierStore, supplierId } = this.props;
        this.props.form.validateFields(async (err, values) => {
            values = this.handelValuesadddunhao(values, true);
            if (!err) {
                let { editProductId } = this.state;
                if (editProductId && supplierStore.iseditorproduct) {
                    // 如果是编辑产品，则是直接修改后台数据
                    values.id = editProductId;
                    let ret = await supplierAction.editorSupplierProductInfo(supplierId, editProductId, values);
                } else {
                    values.id = null;
                }
                try {
                    getProductInfo({ ...values, errorcolumn: [] })
                    this.props.form.resetFields();
                    if (!supplierStore.iseditorproduct) {
                        Modal.confirm({
                            content: '产品添加成功，是否继续？',
                            okText: '是',
                            cancelText: '否',
                            onCancel: () => {
                                toggleStore.setToggle(SHOW_NEWPRODUCT_MODEL)
                            },
                        });
                    } else {
                        toggleStore.setToggle(SHOW_NEWPRODUCT_MODEL)
                    }
                } catch (error) {
                    console.log(error);
                }

            }
        });
    };
    handelValuesadddunhao(waitvalue, isarr) {
        if (isarr) {
            // waitvalue.is_sky = waitvalue.is_sky.join(',');
            waitvalue.category = waitvalue.category.join(',');
            waitvalue.model_area = waitvalue.model_area.join(',');
            waitvalue.importance_name = waitvalue.importance_name.join(',');
            waitvalue.match_mode = waitvalue.match_mode.join(',');
        } else {
            // waitvalue.is_sky = waitvalue.is_sky.split(',');
            waitvalue.category = waitvalue.category.split(',');
            waitvalue.model_area = waitvalue.model_area.split(',');
            waitvalue.importance_name = waitvalue.importance_name.split(',');
            waitvalue.match_mode = waitvalue.match_mode.split(',');
        }
        return waitvalue;
    }
    chooseBZsupplier(data) {
        const { setFieldsValue } = this.props.form;
        let { name } = data;
        setFieldsValue({ org_id: name })
    }
    async componentDidMount() {
        const { supplierStore } = this.props;
        const { setFieldsValue } = this.props.form;
        let ret = await supplierAction.getSupplierPuductSelect();
        this.setState({
            selectField: ret
        })
        if (supplierStore.iseditorproduct) {
            let editSupplierProductInforef = toJS(supplierStore.editSupplierProductInfo)
            editSupplierProductInforef = this.handelValuesadddunhao(editSupplierProductInforef);
            // 当前位编辑产品
            this.setState({
                errorcolumn: editSupplierProductInforef.errorcolumn,
                editProductId: editSupplierProductInforef.id
            })
            setFieldsValue({ ...editSupplierProductInforef })
        }
    }
    render() {
        const { toggleStore, supplierId, supplierStore } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { errorcolumn } = this.state;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        return (
            <div>
                {
                    toggleStore.toggles.get(SHOW_NEWPRODUCT_MODEL) && <Modal
                        title={supplierStore.iseditorproduct ? "编辑产品" : "新增产品"}
                        visible={toggleStore.toggles.get(SHOW_NEWPRODUCT_MODEL)}
                        width={800}
                        centered
                        okText="确认"
                        cancelText="取消"
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >
                        <Form className="ant-advanced-search-form" >
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={(errorcolumn.length > 0 && errorcolumn.indexOf('name') != -1) ? <span style={{ color: 'red' }}>产品名称</span> : '产品名称'}>
                                            {getFieldDecorator(`name`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '产品名称',
                                                    },
                                                ],
                                            })(<Input />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={(errorcolumn.length > 0 && errorcolumn.indexOf('is_sky') != -1) ? <span style={{ color: 'red' }}>是否上天</span> : '是否上天'}>
                                            {getFieldDecorator(`is_sky`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '是否上天',
                                                    },
                                                ],
                                            })(<Select allowClear>
                                                {
                                                    this.state.selectField['sfst'].map((val, idx) =>
                                                        <Option key={idx} value={val}>{val}</Option>
                                                    )
                                                }
                                            </Select>)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={(errorcolumn.length > 0 && errorcolumn.indexOf('category') != -1) ? <span style={{ color: 'red' }}>产品分类</span> : '产品分类'}>
                                            {getFieldDecorator(`category`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '产品分类',
                                                    },
                                                ],
                                            })(<Select showArrow={true} allowClear mode="multiple">
                                                {
                                                    this.state.selectField['cpfl'].map((val, idx) =>
                                                        <Option key={idx} value={val}>{val}</Option>
                                                    )
                                                }
                                            </Select>)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={(errorcolumn.length > 0 && errorcolumn.indexOf('model_area') != -1) ? <span style={{ color: 'red' }}>配套领域</span> : '配套领域'}>
                                            {getFieldDecorator(`model_area`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '配套领域',
                                                    },
                                                ],
                                            })(<Select showArrow={true} allowClear mode="multiple">
                                                {
                                                    this.state.selectField['ptly'].map((val, idx) =>
                                                        <Option key={idx} value={val}>{val}</Option>
                                                    )
                                                }
                                            </Select>)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={(errorcolumn.length > 0 && errorcolumn.indexOf('importance_name') != -1) ? <span style={{ color: 'red' }}>重要程度</span> : '重要程度'}>
                                            {getFieldDecorator(`importance_name`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '重要程度',
                                                    },
                                                ],
                                            })(<Select showArrow={true} allowClear mode="multiple">
                                                {
                                                    this.state.selectField['zycd'].map((val, idx) =>
                                                        <Option key={idx} value={val}>{val}</Option>
                                                    )
                                                }
                                            </Select>)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={(errorcolumn.length > 0 && errorcolumn.indexOf('match_mode') != -1) ? <span style={{ color: 'red' }}>配套方式</span> : '配套方式'}>
                                            {getFieldDecorator(`match_mode`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '配套方式',
                                                    },
                                                ],
                                            })(<Select showArrow={true} allowClear mode="multiple">
                                                {
                                                    this.state.selectField['ptfs'].map((val, idx) =>
                                                        <Option key={idx} value={val}>{val}</Option>
                                                    )
                                                }
                                            </Select>)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={(errorcolumn.length > 0 && errorcolumn.indexOf('org_id') != -1) ? <span style={{ color: 'red' }}>任务甲方</span> : '任务甲方'}>
                                            {getFieldDecorator(`org_id`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '任务甲方',
                                                    },
                                                ],
                                            })(<Input disabled={true} addonAfter={<Choosepsupplier title="选择任务甲方" chooseBZsupplier={(data) => this.chooseBZsupplier(data)} />} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={(errorcolumn.length > 0 && errorcolumn.indexOf('product_scope') != -1) ? <span style={{ color: 'red' }}>产品范围</span> : '产品范围'}>
                                            {getFieldDecorator(`product_scope`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '产品范围',
                                                    },
                                                ],
                                            })(<Input />)}
                                        </Form.Item>
                                    </Col>
                                </Col>
                            </Row>
                        </Form>
                    </Modal>
                }

            </div>
        );
    }
}

export default Form.create({ name: 'NewsuProduct' })(NewsuProduct);