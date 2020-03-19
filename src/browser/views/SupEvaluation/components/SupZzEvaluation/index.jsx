import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { toJS } from "mobx"
import { Modal, Form, Row, Col, Input, Button, Card, Select, message } from 'antd';
import { SHOW_SupZZApply_MODEL } from "../../../../constants/toggleTypes"
import Choosepsupplier from '../../../SupManager/components/Choosepsupplier'
import { supplierAction, supplierVerify } from "../../../../actions"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Option } = Select;
const { TextArea } = Input;
 

@inject('toggleStore', 'verifyStore','supplierStore')
@observer
class SupZzEvaluation extends React.Component {
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
        toggleStore.setToggle(SHOW_SupZZApply_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore,refreshData } = this.props;
        this.props.form.validateFields(async (err, values) => {
            console.log(err)
            if(!err){
                console.log(values)

            }
            // values = this.handelValuesadddunhao(values,true);
            // if (!err) {
            //     console.log(values);
            //     let gysProducts = values;
            //     let { productid, supplierId } = this.state;
            //     let ret = await supplierVerify.modifySupplierProductinfo(supplierId, productid, gysProducts);
            //     message.success("信息修改成功")
            //     refreshData();
            //     toggleStore.setToggle(SHOW_SupZZApply_MODEL)
            // }
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

    chooseBZsupplier(data) {
        const { supplierStore } = this.props;
        const { setFieldsValue } = this.props.form;
        if (!supplierStore.iseditor) {
            // 当不是编辑状态时才会 ，修改供应商名称
            this.setState({
                supplierId: data.id,
                supplierInfo: data
            })
        }
        setFieldsValue({ ...data })
    }

    async componentDidMount() {
        const { verifyStore } = this.props;
        const { setFieldsValue } = this.props.form;
        // 获取 下拉框字段
        // let ret = await supplierAction.getSupplierPuductSelect();
        // let verifyEditProduct = toJS(verifyStore.verifyEditProduct)
        // verifyEditProduct = this.handelValuesadddunhao(verifyEditProduct)
        // this.setState({
        //     selectField: ret
        // })
        // this.setState({
        //     productid: verifyEditProduct.id,
        //     supplierId: verifyEditProduct.gysid,
        //     verifyEditProduct
        // })
        // setFieldsValue({ ...verifyEditProduct })

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
                    toggleStore.toggles.get(SHOW_SupZZApply_MODEL) && <Modal
                        title={`资质申请详情`}
                        visible={toggleStore.toggles.get(SHOW_SupZZApply_MODEL)}
                        width={960}
                        centered
                        okText="确认"
                        cancelText="取消"
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >
                        <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>
                            <Card  bordered={false}>
                                <Row gutter={24}>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'供应商名称'}>
                                                {getFieldDecorator(`name`, {
                                                    initValue: "供应商名称",
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '供应商名称',
                                                        },
                                                    ],
                                                })(<Input disabled addonAfter={ <Choosepsupplier chooseBZsupplier={(data) => this.chooseBZsupplier(data)} />} />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'供应商编号'}>
                                                {getFieldDecorator(`number`)(<Input disabled />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'联系人'}>
                                                {getFieldDecorator(`name_other`)(<Input disabled />)}
                                            </Form.Item>
                                        </Col><Col span={12} >
                                            <Form.Item {...formItemLayout} label={'拟准入等级'}>
                                                {getFieldDecorator(`another_name`,{
                                                       rules: [{ required: true, message: '请选择拟准入等级' }],
                                                })(
                                                     <Select
                                                     placeholder="请选择"
                                                    //  onChange={this.handleSelectChange}
                                                   >
                                                     <Option value="3">核心III类</Option>
                                                     <Option value="4">核心IIII类</Option>
                                                   </Select>,
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'产品服务范围'}>
                                                {getFieldDecorator(`code`,{
                                                       rules: [{ required: true, message: '请选择拟准入等级' }],
                                                })(
                                                      <Select
                                                      placeholder="请选择"
                                                     //  onChange={this.handleSelectChange}
                                                    >
                                                      <Option value="3">产品</Option>
                                                      <Option value="4">过程</Option>
                                                      <Option value="5">物资</Option>
                                                    </Select>
                                                )}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'过程服务范围'}>
                                                {getFieldDecorator(`property_key`,{
                                                       rules: [{ required: true, message: '请选择拟准入等级' }],
                                                })(  <Select
                                                    placeholder="请选择"
                                                   //  onChange={this.handleSelectChange}
                                                  >
                                                    <Option value="3">设计</Option>
                                                    <Option value="4">机加</Option>
                                                    <Option value="5">试验</Option>
                                                    <Option value="6">特殊过程</Option>
                                                  </Select>)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'推荐理由'}>
                                                {getFieldDecorator(`reason`)(<TextArea 
                                                   autosize={{ minRows: 2, maxRows: 6 }}
                                                rows={4} />)}
                                            </Form.Item>
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

export default Form.create({ name: 'SupZzEvaluation' })(SupZzEvaluation);