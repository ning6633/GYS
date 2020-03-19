import React, { Component, Fragment } from 'react';
import { observer, inject, } from 'mobx-react';
import { Modal, Form, Row, Col, Input, Button, Table, Select, message, Icon, Card } from 'antd';
import { SHOW_AddList_MODEL, SHOW_Talk_MODEL, SHOW_Exposure_MODEL, SHOW_ChooseCompany_MODEL } from "../../../../constants/toggleTypes";
import { toJS } from "mobx"

import CustomScroll from '../../../../components/CustomScroll/index'
import { specialExposure, supplierAction } from "../../../../actions"
import ChooseTBSupplier from '../../../../components/ChooseTBSupplier'
// import Choosesupplier from '../../../SupExposureStage/components/Choosesupplier'

// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { TextArea } = Input;
const { Option } = Select;

@inject('toggleStore', 'supplierStore')
@observer
class SupAdd extends React.Component {
    state = {
        supplierId: '',
        info: {},
        supplierInfo: {},
        supplierList: [],
        provider_id: '',
        uploadList: {},
        list: {},
        gysList: [],
        re_dept_id: '',
        getAskReplyListData: [],
        recordData: {},
        dic: []
    }
    closed = () => {
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_Talk_MODEL);
    }
    handleSubmit = () => {
        let { recordData } = this.state
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                if (recordData.statuss == 10) {
                    values.content = values.content_hf
                    delete values.content_hf
                    values.ask_id = recordData.id
                    let res = await specialExposure.dealAsk(values)
                    if (res.code == 200) {
                        message.success(res.message)
                        this.closed()
                        this.props.loaddata({})
                    }
                    else {
                        message.error(res.message)
                    }
                } else {
                    let {role} = this.props
                    values.content = values.content_hf
                    delete values.content_hf
                    values.ask_id = recordData.id
                    if(role == 0){
                        let res = await specialExposure.centerReplyAsk(values)
                        if (res.code == 200) {
                            message.success(res.message)
                            this.closed()
                            this.props.loaddata({})
                        }
                    }else if(role == 1){
                        let res = await specialExposure.gysReplyAsk(values)
                        if (res.code == 200) {
                            message.success(res.message)
                            this.closed()
                            this.props.loaddata({})
                        }
                    }
                }
            }
        });
    }
    chooseBZsupplier(data) {
        const { setFieldsValue } = this.props.form;
        let { name, provider_id } = data;
        this.setState({
            provider_id
        })
        setFieldsValue({ name })
    }
    async BZGYS() {
        let res = await specialExposure.getGysmessage()
        if (res.code == 200) {
            this.setState({ supplierList: res.data })
        }
    }
    uploaddata = () => {
        const { setFieldsValue } = this.props.form;
        let { name, type, content } = this.props.uploadInfo
        setFieldsValue({ name, type, content })
    }
    chooseTBsupplierFn(data) {
        const { supplierStore } = this.props;
        const { setFieldsValue } = this.props.form;
        if (!supplierStore.iseditor) {
            // 当不是编辑状态时才会 ，修改供应商名称
            this.setState({
                supplierId: data.id,
                supplierInfo: data
            })
        }
        setFieldsValue({
            gys_name: data.name,

        })
    }
    async getDic() {
        let { recordData } = this.props
        let res = await specialExposure.lookUpId('CONSULT_COMPLAIN')
        if (res.code == 200) {
            let ret = _.findIndex(res.data, function (e) {
                return e.code == recordData.type
            });
            this.initValue(res.data[ret].name)
        }
    }
    async getInit() {
        let { username } = specialExposure.pageInfo
        let res = await specialExposure.getgysmessagelist(1, 20)
        this.setState({
            gysList: res.data.list
        })
        // console.log(res)
        const { setFieldsValue } = this.props.form;
        setFieldsValue({ name: username })
    }
    chooseBZcompany(data) {
        const { setFieldsValue } = this.props.form;
        this.setState({
            re_dept_id: data.id,
            companyInfo: data
        })
        setFieldsValue({
            re_dept_name: data.name
        })
    }
    async initValue(type) {
        const { setFieldsValue } = this.props.form;
        let { getAskReplyListData, recordData } = this.props
        let { username } = specialExposure.pageInfo
        let res = await specialExposure.getOneAskInfoById(recordData.id)
        if (res.code == 200) {
            this.setState({ getAskReplyListData, recordData })
            let {
                gys_name,
                re_dept_name,
                title,
                content,
                create_user_name
            } = res.data
            setFieldsValue({
                gys_name,
                re_dept_name,
                title,
                content, type, userid:create_user_name
            })
        } else {
            message.error(res.message)
        }
    }
    async componentDidMount() {
        this.getDic()

    }
    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        const { getFieldDecorator } = this.props.form;
        let { gysList, getAskReplyListData, dic } = this.state
        
        return (
            <Modal
                title={<b>回复</b>}
                width={960}
                visible={true}
                onCancel={this.closed}
                onOk={this.handleSubmit}
            >
                <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>
                    <Row gutter={24}>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={<b>供应商名称</b>}>
                                {getFieldDecorator('gys_name', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '请选择供应商名称',
                                        },
                                    ],
                                })(<Input placeholder='请选择供应商名称' disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={<b>咨询人</b>}>
                                {getFieldDecorator('userid', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '咨询人',
                                        },
                                    ],
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24} style={{ marginTop: 20 }}>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={<b>上报院</b>}>
                                {getFieldDecorator('re_dept_name', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '上报院',
                                        },
                                    ],
                                })(<Input placeholder='请选择上报院' disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={<b>业务类别</b>} >
                                {getFieldDecorator('type', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '业务类别',
                                        },
                                    ],
                                })(<Select disabled placeholder='业务类别'>
                                    {dic.map((item, index) => {
                                        return (
                                            <Option key={item.code} value={item.code}>{item.name}</Option>
                                        )
                                    })}
                                </Select>)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24} style={{ marginTop: 20 }}>
                        <Col span={24} >
                            <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} span={1} label={<b>事件名称</b>}>
                                {getFieldDecorator('title', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '事件名称',
                                        },
                                    ],
                                })(<Input disabled style={{ width: '100%' }} />)}
                            </Form.Item>
                        </Col>

                    </Row>

                    <Row gutter={24} style={{ marginTop: 20 }} >
                        <Col span={24}>
                            <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label={<b>主体内容</b>} span={1}>
                                {getFieldDecorator('content', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '主体内容',
                                        },
                                    ],
                                })(<Input.TextArea disabled maxLength={250} style={{ width: '100%' }} onChange={(e) => {
                                    if (e.target.value.length >= 250) {
                                        message.error('输入的内容在250个字符之间')
                                    }
                                }} />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Card bordered={false} className="new_supplier_form" title={<b>消息记录</b>} style={{ width: '100%', minHeight: 300 }}>
                        <Row gutter={24} >
                            <CustomScroll>
                                <Col span={18} push={3} style={{ marginTop: 20 }} >
                                    {getAskReplyListData.map((item, index) => {
                                        return (
                                            <Fragment key={index}>
                                    <p><b className='gys_talkAboutName'>{item.user_name}</b><span className='gys_talkAboutTime'>{item.create_time}</span></p>
                                                <p > {item.content}</p>
                                            </Fragment>
                                        )
                                    })}
                                </Col>
                            </CustomScroll>
                        </Row>
                        <Row gutter={24}>
                            <Col span={24} style={{ marginTop: 20 }} >
                                <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label={<b>回复</b>} span={1}>
                                    {getFieldDecorator('content_hf', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '原因',
                                            },
                                        ],
                                    })(<Input.TextArea maxLength={150} style={{ width: '100%' }} onChange={(e) => {
                                        if (e.target.value.length >= 150) {
                                            message.error('输入的内容在150个字符之间')
                                        }
                                    }} />)}
                                </Form.Item>
                            </Col>
                        </Row>

                    </Card>
                </Form>
            </Modal>
        )
    }
}

export default Form.create({ name: 'supAdd' })(SupAdd);