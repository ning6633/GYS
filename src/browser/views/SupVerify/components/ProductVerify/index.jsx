import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { toJS } from "mobx"
import { Modal, Form, Row, Col, Input, Button, Card, Select, message } from 'antd';
import { SHOW_ProductVerify_MODEL } from "../../../../constants/toggleTypes"
import { supplierAction, supplierVerify } from "../../../../actions"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Option } = Select;

@inject('toggleStore', 'verifyStore')
@observer
class ProductVerify extends React.Component {
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
        }
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ProductVerify_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore,refreshData } = this.props;
        this.props.form.validateFields(async (err, values) => {
            values = this.handelValuesadddunhao(values,true);
            if (!err) {
                console.log(values);
                let gysProducts = values;
                let { productid, supplierId } = this.state;
                let ret = await supplierVerify.modifySupplierProductinfo(supplierId, productid, gysProducts);
                message.success("信息修改成功")
                refreshData();
                toggleStore.setToggle(SHOW_ProductVerify_MODEL)
            }
        });
    };
    handelValuesadddunhao(waitvalue,isarr){
        if(isarr){
            waitvalue.is_sky = waitvalue.is_sky.join(',');
            waitvalue.category = waitvalue.category.join(',');
            waitvalue.model_area = waitvalue.model_area.join(',');
            waitvalue.importance_name = waitvalue.importance_name.join(',');
            waitvalue.match_mode = waitvalue.match_mode.join(',');
        }else{
            waitvalue.is_sky = waitvalue.is_sky.split(',');
            waitvalue.category = waitvalue.category.split(',');
            waitvalue.model_area = waitvalue.model_area.split(',');
            waitvalue.importance_name = waitvalue.importance_name.split(',');
            waitvalue.match_mode = waitvalue.match_mode.split(',');
        }
        return waitvalue;
    }
    async componentDidMount() {
        const { verifyStore } = this.props;
        const { setFieldsValue } = this.props.form;
        // 获取 下拉框字段
        let ret = await supplierAction.getSupplierPuductSelect();
        let verifyEditProduct = toJS(verifyStore.verifyEditProduct)
        verifyEditProduct = this.handelValuesadddunhao(verifyEditProduct)
        this.setState({
            selectField: ret
        })
        this.setState({
            productid: verifyEditProduct.id,
            supplierId: verifyEditProduct.gysid,
            verifyEditProduct
        })
        setFieldsValue({ ...verifyEditProduct })

    }
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const { getFieldDecorator } = this.props.form;
        const { toggleStore } = this.props;
        const { verifyEditProduct } = this.state;
        return (
            <div>
                {
                    toggleStore.toggles.get(SHOW_ProductVerify_MODEL) && <Modal
                        title={`编辑供应商产品信息(${verifyEditProduct.is_right==1?'当前产品数据不正确':"无错误"})`}
                        visible={toggleStore.toggles.get(SHOW_ProductVerify_MODEL)}
                        width={960}
                        centered
                        okText="确认"
                        cancelText="取消"
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >
                        <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>
                            <Card title={"供应商信息"} bordered={false}>
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'供应商名称'}>
                                                {getFieldDecorator(`gysname`)(<Input disabled />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'次'}>
                                                {getFieldDecorator(`level`)(<Input disabled />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'简称'}>
                                                {getFieldDecorator(`name_other`)(<Input disabled />)}
                                            </Form.Item>
                                        </Col><Col span={12} >
                                            <Form.Item {...formItemLayout} label={'别称'}>
                                                {getFieldDecorator(`another_name`)(<Input disabled />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'统一社会信用代码'}>
                                                {getFieldDecorator(`code`)(<Input disabled />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'企业性质'}>
                                                {getFieldDecorator(`property_key`)(<Input disabled />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'上报单位'}>
                                                {getFieldDecorator(`dept_idname`)(<Input disabled />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'上报院'}>
                                                {getFieldDecorator(`gysorg_idname`)(<Input disabled />)}
                                            </Form.Item>
                                        </Col>

                                    </Col>
                                </Row>
                            </Card>
                            <Card title={"产品信息"} bordered={false}>
                                <Row gutter={24}>
                                    <Col span={24}>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'产品名称'}>
                                                {getFieldDecorator(`name`, {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '产品名称',
                                                        },
                                                    ],
                                                })(<Input placeholder="产品名称" />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'是否上天'}>
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
                                            <Form.Item {...formItemLayout} label={'产品分类'}>
                                                {getFieldDecorator(`category`, {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '产品分类',
                                                        },
                                                    ],
                                                })(<Select mode="multiple" allowClear mode="multiple">
                                                    {
                                                        this.state.selectField['cpfl'].map((val, idx) =>
                                                            <Option key={idx} value={val}>{val}</Option>
                                                        )
                                                    }
                                                </Select>)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'配套领域'}>
                                                {getFieldDecorator(`model_area`, {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '配套领域',
                                                        },
                                                    ],
                                                })(<Select mode="multiple" allowClear mode="multiple">
                                                    {
                                                        this.state.selectField['ptly'].map((val, idx) =>
                                                            <Option key={idx} value={val}>{val}</Option>
                                                        )
                                                    }
                                                </Select>)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'重要程度'}>
                                                {getFieldDecorator(`importance_name`, {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '重要程度',
                                                        },
                                                    ],
                                                })(<Select mode="multiple" allowClear mode="multiple">
                                                    {
                                                        this.state.selectField['zycd'].map((val, idx) =>
                                                            <Option key={idx} value={val}>{val}</Option>
                                                        )
                                                    }
                                                </Select>)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'配套方式'}>
                                                {getFieldDecorator(`match_mode`, {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '配套方式',
                                                        },
                                                    ],
                                                })(<Select mode="multiple" allowClear mode="multiple">
                                                    {
                                                        this.state.selectField['ptfs'].map((val, idx) =>
                                                            <Option key={idx} value={val}>{val}</Option>
                                                        )
                                                    }
                                                </Select>)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'任务甲方'}>
                                                {getFieldDecorator(`org_id`, {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '任务甲方',
                                                        },
                                                    ],
                                                })(<Input placeholder="任务甲方" />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'产品范围'}>
                                                {getFieldDecorator(`product_scope`, {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '产品范围',
                                                        },
                                                    ],
                                                })(<Input placeholder="产品范围" />)}
                                            </Form.Item>
                                        </Col>
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

export default Form.create({ name: 'NewsuProduct' })(ProductVerify);