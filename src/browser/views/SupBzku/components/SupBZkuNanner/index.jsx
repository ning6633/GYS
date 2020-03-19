import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { toJS } from "mobx"
import { Modal, Form, Row, Col, Input, Cascader, Card, Select, DatePicker, Icon, InputNumber } from 'antd';
import { SHOW_ShowBZkuAdd_MODEL, SHOW_ChooseXzqy_MODEL } from "../../../../constants/toggleTypes"
import { supplierAction } from "../../../../actions";
import moment from "moment"
import ChooseXzqy from "../../../../components/ChooseXzqy";
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Option } = Select;
@inject('toggleStore', 'supplierStore')
@observer
class SupBZkuManager extends React.Component {
    state = {
        supBZkuFeedbackAdd: {},
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
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ShowBZkuAdd_MODEL)
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
                    // 处理属性 - 后端非得要前端获取出来再传，明明后端可以自己取
                    let propertyref = values['property_key'].pop()
                    let { name, code } = this.getQyxzCodeArr(propertyref, true).pop()
                    // ---
                    values['regist_time'] = values['regist_time'] ? values['regist_time'].format('YYYY-MM-DD') : "";
                    values['check_date'] = values['check_date'] ? values['check_date'].format('YYYY-MM-DD') : "";
                    values['open_date_from'] = values['open_date_from'] ? values['open_date_from'].format('YYYY-MM-DD') : "";
                    values['open_date_to'] = values['open_date_to'] ? values['open_date_to'].format('YYYY-MM-DD') : "";
                    values['district_key'] = district_keyref;
                    values['is_intern_key'] = values['is_intern'] == '是' ? 1 : 0
                    values['property_key'] = code;
                    values['property'] = name;
                    supplierStore.isRKeditor ? await supplierAction.modifySupBZkuInfo(values, this.state.supplierId) : await supplierAction.addSupBZkuInfo(values)
                    this.setState({
                        loading: false
                    })
                    refreshData()
                    toggleStore.setToggle(SHOW_ShowBZkuAdd_MODEL)
                }
            });
        } else {
            toggleStore.setToggle(SHOW_ShowBZkuAdd_MODEL)
        }

    };
    getChooseXzqy(data) {
        // 获取选择的 供应商行政区域
        let curdistrict = data.pop()
        let xzqyName = curdistrict.label
        let district_key = curdistrict.value
        const { setFieldsValue } = this.props.form;
        setFieldsValue({ district: xzqyName })
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
    getQyxzCodeArr(name, isShowCode = false) {
        let compQyxz = this.state.compQyxz;
        let CompCodeQyxz = []
        try {
            for (let i = 0; i < compQyxz.length; i++) {
                for (let j = 0; j < compQyxz[i].qyxzZ.length; j++) {
                    let item = compQyxz[i].qyxzZ[j]
                    if (item.name == name) {
                        if (isShowCode) {
                            CompCodeQyxz.push({ name: compQyxz[i].name, code: compQyxz[i].code }, { name: item.name, code: item.code })
                        } else {
                            CompCodeQyxz.push(compQyxz[i].name, item.name)
                            break;
                        }
                    }
                }
            }
        } catch (err) {
            console.log("不标准的企业性质信息")
        }
        return CompCodeQyxz;
    }
    async componentDidMount() {
        const { supplierStore } = this.props;
        await this.getCompanyTypeTree()
        this.getworldareatree()
        if (supplierStore.isRKeditor) {
            // supBZkuFeedback
            const { setFieldsValue } = this.props.form;
            let editSupBZkuFeedback = toJS(supplierStore.supBZkuFeedback);
            let { property } = editSupBZkuFeedback;
            let regist_time = !editSupBZkuFeedback.regist_time == false ? moment(editSupBZkuFeedback.regist_time) : null
            let open_date_from = !editSupBZkuFeedback.open_date_from == false ? moment(editSupBZkuFeedback.open_date_from) : null
            let open_date_to = !editSupBZkuFeedback.open_date_to == false ? moment(editSupBZkuFeedback.open_date_to) : null
            let check_date = !editSupBZkuFeedback.check_date == false ? moment(editSupBZkuFeedback.check_date) : null
            delete editSupBZkuFeedback.property_key
            delete editSupBZkuFeedback.regist_time
            delete editSupBZkuFeedback.check_date
            delete editSupBZkuFeedback.open_date_to
            delete editSupBZkuFeedback.open_date_from
            this.setState({
                district_keyref:editSupBZkuFeedback.district_key,
                supplierId: editSupBZkuFeedback.id
            })
            setFieldsValue({
                ...editSupBZkuFeedback,
                regist_time,
                open_date_from,
                open_date_to,
                check_date,
                property_key: this.getQyxzCodeArr(property),
            })
        }
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const { getFieldDecorator } = this.props.form;
        const { toggleStore, supplierStore } = this.props;
        const { supBZkuFeedback } = this.props.supplierStore
        this.state.supBZkuFeedbackAdd = supBZkuFeedback
        return (
            <div>
                {
                    toggleStore.toggles.get(SHOW_ShowBZkuAdd_MODEL) && <Modal
                        title={!supplierStore.isRKeditor ? "新增标准供应商" : (supplierStore.islookRKdetail ? "查看标准供应商" : "编辑标准供应商")}
                        visible={toggleStore.toggles.get(SHOW_ShowBZkuAdd_MODEL)}
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
                                        <Form.Item {...formItemLayout} label={'供应商名称'}>{getFieldDecorator(`name`, {
                                            rules: [{
                                                required: true,
                                                message: '供应商名称',
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
                                                    },
                                                ]
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
                                                ]
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'注册资金（¥/万元）'}>
                                            {getFieldDecorator(`regist_fund`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '注册资金（¥/万元）'
                                                    },
                                                ],
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'是否国内供应商'}>
                                            {getFieldDecorator(`is_intern`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '是否国内供应商'
                                                    },
                                                ],
                                            })(<Select disabled={supplierStore.islookRKdetail} onChange={(val) => { val == '否' ? this.setState({ city: [this.city.guoji] }) : this.setState({ city: [this.city.guonei] }) }}>
                                                <Option value="是">是</Option>
                                                <Option value="否">否</Option>
                                            </Select>)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'行政区域'}>
                                            {getFieldDecorator(`district`, {
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
                                                        message: '法人姓名'
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
                                                    },
                                                ],
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'科研许可证号'}>
                                            {getFieldDecorator(`license_code`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '科研许可证号',
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
                                        <Form.Item {...formItemLayout} label={'营业开始时间'}>
                                            {getFieldDecorator(`open_date_from`)(<DatePicker placeholder='' disabled={supplierStore.islookRKdetail} style={{ width: '100%' }} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'营业结束时间'}>
                                            {getFieldDecorator(`open_date_to`)(<DatePicker placeholder='' disabled={supplierStore.islookRKdetail} style={{ width: '100%' }} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'年检日期'}>
                                            {getFieldDecorator(`check_date`)(<DatePicker placeholder='' disabled={supplierStore.islookRKdetail} style={{ width: '100%' }} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'体系认证情况'}>
                                            {getFieldDecorator(`quality_system`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '体系认证情况',
                                                    },
                                                ]
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>


                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'保密资质'}>
                                            {getFieldDecorator(`secrecy`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '保密资质',
                                                    },
                                                ]
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'税务登记号'}>
                                            {getFieldDecorator(`tax_code`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '税务登记号',
                                                        initialValue: ''
                                                    },
                                                ]
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'经营行业'}>
                                            {getFieldDecorator(`business_sector`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '经营行业',
                                                    },
                                                ]
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'公司类型'}>
                                            {getFieldDecorator(`company_type`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '公司类型',
                                                    },
                                                ]
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'确认分区'}>
                                            {getFieldDecorator(`confirm_flag`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '确认分区',
                                                    },
                                                ]
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
                                                    },
                                                ]
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
                                                    },
                                                ]
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
                                                    },
                                                ]
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
                                                    },
                                                ]
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
                                                    },
                                                ]
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col>
                                    {/* <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'上报人联系方式'}>
                                            {getFieldDecorator(`tel`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '上报人联系方式',
                                                    },
                                                ]
                                            })(<Input disabled={supplierStore.islookRKdetail} />)}
                                        </Form.Item>
                                    </Col> */}
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

export default Form.create({ name: 'NewsuProduct2' })(SupBZkuManager);