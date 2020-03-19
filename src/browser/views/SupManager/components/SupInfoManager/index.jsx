import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { toJS } from "mobx"
import { Modal, Form, Row, Col, Input, Cascader, Card, Select, DatePicker, Icon, InputNumber } from 'antd';
import { SHOW_SupInfoManager_MODEL, SHOW_ChooseXzqy_MODEL } from "../../../../constants/toggleTypes"
import { supplierAction } from "../../../../actions";
import moment from "moment"
import ChooseXzqy from "../../../../components/ChooseXzqy";
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Option } = Select;
@inject('toggleStore', 'supplierStore')
@observer
class SupInfoManager extends React.Component {
    state = {
        supplierId: '',
        city: [],
        compQyxz: [],
        district_keyref: '',
        loading: false
    }
    city = {
        guonei: {},
        guoji: {}
    }
    handleCancel = e => {
        const { toggleStore, supplierStore } = this.props;
        supplierStore.islookRKdetail = false;
        supplierStore.isRKeditor = false;
        toggleStore.setToggle(SHOW_SupInfoManager_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore, refreshData, supplierStore } = this.props;
        const { supplierId, district_keyref } = this.state;
        if (!supplierStore.islookRKdetail) {
            this.props.form.validateFields(async (err, values) => {
                if (!err) {
                    this.setState({
                        loading: true
                    })
                    console.log(values);
                    if (isNaN(parseInt(values['is_intern_key']))) {
                        //当前 is_intern_key 是汉子
                        values['is_intern_key'] = values['is_intern_key'] == '是' ? "0" : "1"
                    }
                    values['regist_time'] = values['regist_time'] ? values['regist_time'].format('YYYY-MM-DD') : "";
                    values['check_date'] = values['check_date'] ? values['check_date'].format('YYYY-MM-DD') : "";
                    values['property_key'] = values['property_key'].pop();
                    values['district_key'] = district_keyref;
                    try {
                        if (supplierStore.isRKeditor) {
                            let ret = await supplierAction.gysInfosTjzjkxg({ gysid: supplierId, ...values })
                        } else {
                            let ret = await supplierAction.gysInfosTjzjk({ gysid: supplierId, ...values })
                        }
                        supplierStore.islookRKdetail = false;
                        supplierStore.isRKeditor = false;
                    } catch (error) {
                        console.log(error);
                    }
                    this.setState({
                        loading: false
                    })
                    refreshData()
                    toggleStore.setToggle(SHOW_SupInfoManager_MODEL)
                }
            });
        } else {
            toggleStore.setToggle(SHOW_SupInfoManager_MODEL)
        }
    };
    getChooseXzqy(data) {
        // 获取选择的 供应商行政区域
        let curdistrict = data.pop()
        let xzqyName = curdistrict.label
        let district_key = curdistrict.value
        const { setFieldsValue } = this.props.form;
        setFieldsValue({ district_key: xzqyName })
        this.setState({
            district_keyref: district_key
        })
    }
    async getworldareatree() {
        let ret = await supplierAction.getworldareatree()
        this.city = {
            guonei: ret[0],
            guoji: ret[1]
        }
        this.setState({
            city: [this.city.guonei]
        })
    }
    async getCompanyTypeTree() {
        let ret = await supplierAction.getCompanyTypeTree()
        this.setState({
            compQyxz: ret
        })
    }
    getQyxzCodeArr(name) {
        let compQyxz = this.state.compQyxz;
        let CompCodeQyxz = []
        try {
            for (let i = 0; i < compQyxz.length; i++) {
                for (let j = 0; j < compQyxz[i].qyxzZ.length; j++) {
                    let item = compQyxz[i].qyxzZ[j]
                    if (item.name == name) {
                        CompCodeQyxz.push(compQyxz[i].name, item.name)
                        break;
                    }
                }
            }
        } catch (err) {
            console.log("不标准的企业性质信息")
        }
        return CompCodeQyxz;
    }
    async componentDidMount() {
        await this.getCompanyTypeTree()
        this.getworldareatree()
        const { supplierStore } = this.props;
        console.log('islookRKdetail---', supplierStore.islookRKdetail, supplierStore.isRKeditor);
        if (supplierStore.isRKeditor || supplierStore.islookRKdetail) {
            const { supplierStore } = this.props;
            const { setFieldsValue } = this.props.form;
            let editSupplierBaseref = toJS(supplierStore.editSupplierBase);
            let { property_key } = editSupplierBaseref;
            let regist_time = !editSupplierBaseref.regist_time == false ? moment(editSupplierBaseref.regist_time) : null
            let check_date = !editSupplierBaseref.check_date == false ? moment(editSupplierBaseref.check_date) : null
            let is_intern_key = editSupplierBaseref.is_intern_key ? '否' : '是'
            delete editSupplierBaseref.is_intern_key
            delete editSupplierBaseref.property_key
            delete editSupplierBaseref.regist_time
            delete editSupplierBaseref.check_date
            this.setState({
                district_keyref: editSupplierBaseref.district_name,
                supplierId: editSupplierBaseref.id
            })
            setFieldsValue({ ...editSupplierBaseref, property_key: this.getQyxzCodeArr(property_key), regist_time, check_date, is_intern_key })
        }
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const { getFieldDecorator } = this.props.form;
        const { toggleStore, supplierStore } = this.props;
        // console.log(getFieldDecorator)
        return (
            <div>
                {
                    toggleStore.toggles.get(SHOW_SupInfoManager_MODEL) && <Modal
                        title={supplierStore.islookRKdetail ? '查看供应商信息' : (supplierStore.isRKeditor ? '供应商信息编辑' : '新增供应商信息')}
                        visible={toggleStore.toggles.get(SHOW_SupInfoManager_MODEL)}
                        width={980}
                        centered
                        confirmLoading={this.state.loading}
                        okText="确认"
                        cancelText="取消"
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >
                        <Form className="ant-advanced-search-form" onSubmit={(e) => { console.log(e); this.handleSubmit(e) }}>
                            <Card bordered={false}>
                                <Row gutter={24}>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'供应商名称'}>
                                            {getFieldDecorator(`name`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '供应商名称',
                                                        initialValue: ''
                                                    },
                                                ],
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'简称'}>
                                            {getFieldDecorator(`name_other`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '简称',
                                                        initialValue: ''
                                                    },
                                                ],
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'别名'}>
                                            {getFieldDecorator(`another_name`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '别名',
                                                        initialValue: ''
                                                    },
                                                ],
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'企业性质'}>
                                            {getFieldDecorator(`property_key`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '企业性质',
                                                    },
                                                ],
                                            })(<Cascader disabled={supplierStore.islookRKdetail} placeholder="" fieldNames={{ label: 'name', value: 'name', children: 'qyxzZ' }} showSearch={true} options={this.state.compQyxz} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'社会信用代码'}>
                                            {getFieldDecorator(`code`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '社会信用代码不能含有中文且为必填',
                                                        pattern: /^(\d|\w+)$/
                                                    },
                                                ],
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'注册资金（¥/万元）'}>
                                            {getFieldDecorator(`regist_fund`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '注册资金（¥/万元）',
                                                        initialValue: ''
                                                    },
                                                ],
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'是否国内供应商'}>
                                            {getFieldDecorator(`is_intern_key`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '是否国内供应商',
                                                        initialValue: 0
                                                    },
                                                ],
                                            })(<Select disabled={supplierStore.islookRKdetail} onChange={(val) => { val == 1 ? this.setState({ city: [this.city.guoji] }) : this.setState({ city: [this.city.guonei] }) }}>
                                                <Option value="0">是</Option>
                                                <Option value="1">否</Option>
                                            </Select>)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'行政区域'}>
                                            {getFieldDecorator(`district_key`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '行政区域',
                                                    },
                                                ],
                                            })(<Input disabled={true} addonAfter={!supplierStore.islookRKdetail ? <Icon style={{ cursor: 'pointer' }} onClick={() => toggleStore.setToggle(SHOW_ChooseXzqy_MODEL)} type="plus" /> : null} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'通讯地址'}>
                                            {getFieldDecorator(`contact_address`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '通讯地址',
                                                        initialValue: ''
                                                    },
                                                ],
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'法人姓名'}>
                                            {getFieldDecorator(`legal_person`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '法人姓名',
                                                        initialValue: ''
                                                    },
                                                ],
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'法人电话'}>
                                            {getFieldDecorator(`legal_person_tel`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '法人电话',
                                                        initialValue: ''
                                                    },
                                                ],
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'登记机关'}>
                                            {getFieldDecorator(`registry_department`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '登记机关',
                                                        initialValue: ''
                                                    },
                                                ],
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'注册时间'}>
                                            {getFieldDecorator(`regist_time`)(<DatePicker placeholder='' disabled={supplierStore.islookRKdetail} style={{ width: '100%' }} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'营业期限'}>
                                            {getFieldDecorator(`open_date`)(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'年检日期'}>
                                            {getFieldDecorator(`check_date`)(<DatePicker placeholder='' disabled={supplierStore.islookRKdetail} style={{ width: '100%' }} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'经营行业'}>
                                            {getFieldDecorator(`business_sector`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '经营行业',
                                                        initialValue: ''
                                                    },
                                                ],
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'主要人员'}>
                                            {getFieldDecorator(`main_persons`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '主要人员',
                                                        initialValue: ''
                                                    },
                                                ],
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'股东'}>
                                            {getFieldDecorator(`shareholder`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '股东',
                                                        initialValue: ''
                                                    },
                                                ],
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>

                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'所属名录'}>
                                            {getFieldDecorator(`belong_list`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '所属名录',
                                                        initialValue: ''
                                                    },
                                                ],
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'产品认定范围'}>
                                            {getFieldDecorator(`product_scope`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '产品认定范围',
                                                        initialValue: ''
                                                    },
                                                ],
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'经营范围'}>
                                            {getFieldDecorator(`business_scope`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '经营范围',
                                                        initialValue: ''
                                                    },
                                                ],
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'上报人联系方式'}>
                                            {getFieldDecorator(`tel`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '上报人联系方式',
                                                        initialValue: ''
                                                    },
                                                ],
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Card>
                        </Form>
                        {
                            toggleStore.toggles.get(SHOW_ChooseXzqy_MODEL) && <ChooseXzqy getChooseXzqy={this.getChooseXzqy.bind(this)} city={this.state.city} />
                        }
                    </Modal>
                }
            </div>
        );
    }
}

export default Form.create({ name: 'NewsuProduct' })(SupInfoManager);