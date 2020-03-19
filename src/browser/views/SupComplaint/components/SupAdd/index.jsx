import React, { Component, Fragment } from 'react';
import { observer, inject, } from 'mobx-react';
import { Modal, Form, Row, Col, Input, Button, Table, Select, message, Icon, Card } from 'antd';
import { SHOW_AddList_MODEL, SHOW_Exposure_MODEL, SHOW_ChooseCompany_MODEL, SHOW_Unit_MODEL } from "../../../../constants/toggleTypes";
import { toJS } from "mobx"
import CustomScroll from '../../../../components/CustomScroll/index'
import _ from "lodash";
import { specialExposure, supBlackList, supplierAction } from "../../../../actions"
import Choosepsupplier from '../../../SupManager/components/Choosepsupplier'
import './index.less'
// import 
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
        statusData: 0,
        dic: [],
        type: '',
        initTypeObj: {}
    }
    closed = () => {
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_Exposure_MODEL);
    }
    handleSubmit = () => {
        let { statusData, type, initTypeObj } = this.state
        let { info } = this.props
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                if (statusData == 1) {
                    values.id = info.id
                    values.gys_id = this.state.supplierId || info.gys_id
                    values.re_dept_id = this.state.re_dept_id || info.re_dept_id
                    values.type = type
                    let res = await specialExposure.update(values)
                    if (res.code == 200) {
                        message.success(res.message)
                        this.closed()
                        this.props.loaddata({})
                    }
                } else {
                    values.gys_id = this.state.supplierId
                    values.re_dept_id = this.state.re_dept_id
                    if (initTypeObj.name == values.type) {
                        values.type = initTypeObj.code
                    }
                    let res = await specialExposure.submitAsk(values)
                    if (res.code == 200) {
                        message.success(res.message)
                        this.closed()
                        this.props.loaddata({})
                    }
                }
            }
        });
    }

    chooseBZsupplier (data) {
        const { setFieldsValue } = this.props.form;
        let { name, provider_id } = data;
        this.setState({
            supplierId: provider_id
        })
        setFieldsValue({ gys_name: name })
    }
    async BZGYS ({ pageNum = 1, rowNum = 20 }) {
        let res = await specialExposure.getGysmessage({ pageNum, rowNum })
        if (res.code == 200) {
            this.setState({ supplierList: res.data })
        }
    }
    uploaddata = () => {
        const { setFieldsValue } = this.props.form;
        let { name, type, content } = this.props.uploadInfo
        setFieldsValue({ name, type, content })
    }

    async getInit () {
        let initType
        let { username } = specialExposure.pageInfo
        let res = await specialExposure.getgysmessagelist(1, 20)
        this.setState({
            gysList: res.data.list
        })
        let ret = await specialExposure.lookUpId('CONSULT_COMPLAIN')
        if (ret.code == 200) {
            initType = ret.data[0].name
            this.setState({ initTypeObj: ret.data[0] })
        }
        // console.log(res)
        const { setFieldsValue } = this.props.form;
        setFieldsValue({ userid: username, type: initType })
    }
    chooseBZcompany (data) {
        const { setFieldsValue } = this.props.form;
        this.setState({
            re_dept_id: data.id,
            companyInfo: data
        })
        setFieldsValue({
            re_dept_name: data.name
        })
    }
    async getAskReplyList (record) {
        //回复
        let { selectedRowKeys, selectedRows } = this.state
        let res = await specialExposure.getAskReplyList(record.id)
        if (res.code == 200) {
            this.setState({ getAskReplyListData: res.data.reverse() })
        }
        else {
            message.error(res.message)
        }
    }
    async getDic (_statusData) {
        let { info } = this.props
        let res = await specialExposure.lookUpId('CONSULT_COMPLAIN')
        if (res.code == 200) {
            this.setState({ dic: res.data })
            if (_statusData == 2 || _statusData == 1) {
                let ret = _.findIndex(res.data, function (e) {
                    return e.code == info.type
                });
                this.setState({ type: info.type })
                this.initValue(res.data[ret].name)
            }
        }
    }
    select = (a) => {
        this.setState({ type: a })
    }
    async initValue (type) {
        let { info } = this.props
        let res = await specialExposure.getOneAskInfoById(info.id)
        let { username } = specialExposure.pageInfo
        const { setFieldsValue } = this.props.form;
        let {
            gys_name,
            re_dept_name,
            title,
            content,
            create_user_name
        } = res.data
        if (info.statusData == 1 || info.statusData == 2) {

            setFieldsValue({
                gys_name,
                re_dept_name,
                title,
                content, type, userid:create_user_name
            })
        }
    }
    async componentDidMount () {
        let { info } = this.props
        this.setState({ statusData: info.statusData })
        this.getDic(info.statusData)
        if (info.gys_id == undefined) {
            this.getInit()
            this.BZGYS({})
        } else {
            this.getAskReplyList(info)
        }

    }
    render () {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        const { supplierStore, toggleStore, info } = this.props;
        const { getFieldDecorator } = this.props.form;
        let { gysList, getAskReplyListData, statusData, dic, ask_name } = this.state

        return (
            <div>
                <Modal

                    title={statusData == 1 ? <b>修改</b> : statusData == 2 ? <b>详情</b> : <b>新建</b>}
                    width={960}
                    visible={true}
                    footer={
                        statusData == 2 ? <Button type='primary' onClick={this.closed}>关闭</Button> :
                            <Fragment>
                                <Button onClick={this.closed}>取消</Button>
                                <Button onClick={this.handleSubmit} type='primary'>确定</Button>
                            </Fragment>
                    }
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
                                                required: true,
                                                message: '请选择供应商名称',
                                            },
                                        ],
                                    })(<Input placeholder='请选择供应商名称' disabled addonAfter={statusData == 2 ? '' :
                                        // <ChooseTBSupplier supplierList={gysList} chooseTBsupplierFn={(data) => this.chooseTBsupplierFn(data)} />
                                        <Choosepsupplier title="选择标准供应商" chooseBZsupplier={(data) => this.chooseBZsupplier(data)} />

                                    } />)}
                                </Form.Item>
                            </Col>
                            <Col span={12} >
                                <Form.Item {...formItemLayout} label={<b>咨询人</b>}>
                                    {getFieldDecorator('userid', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '咨询人',
                                            },
                                        ],
                                    })(<Input disabled />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24} style={{ marginTop: 20 }}>
                            <Col span={12} >
                                <Form.Item {...formItemLayout} label={<b>接收单位</b>}>
                                    {getFieldDecorator('re_dept_name', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '接收单位',
                                            },
                                        ],
                                    })(<Input placeholder='接收单位' disabled addonAfter={statusData == 2 ? '' : <Icon style={{ cursor: 'pointer' }} onClick={() => { toggleStore.setToggle(SHOW_Unit_MODEL); supplierStore.chooseGysCompany = this.chooseBZcompany.bind(this) }} type="plus" />} />)}
                                </Form.Item>
                            </Col>
                            <Col span={12} >
                                <Form.Item {...formItemLayout} label={<b>业务类别</b>} >
                                    {getFieldDecorator('type', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '业务类别',
                                            },
                                        ],
                                    })(<Select disabled={statusData == 2} onSelect={(a, b) => { this.select(a) }}>
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
                                                required: true,
                                                message: '事件名称',
                                            },
                                        ],
                                    })(<Input disabled={statusData == 2} style={{ width: '100%' }} />)}
                                </Form.Item>
                            </Col>

                        </Row>


                        <Row gutter={24}>
                            <Col span={24} style={{ marginTop: 20 }} >
                                <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} label={<b>主体内容</b>} span={1}>
                                    {getFieldDecorator('content', {
                                        rules: [
                                            {
                                                required: false,
                                                message: '主体内容',
                                            },
                                        ],
                                    })(<Input.TextArea disabled={statusData == 2} maxLength={250} style={{ width: '100%' }} onChange={(e) => {
                                        if (e.target.value.length >= 250) {
                                            message.error('输入的内容在250个字符之间')
                                        }
                                    }} rows={6} />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        {statusData != 2 || <Card bordered={false} className="new_supplier_form" title={<b>消息记录</b>} style={{ width: '100%', minHeight: 300 }}>
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

                        </Card>}

                    </Form>
                </Modal>
            </div>
        )
    }
}

export default Form.create({ name: 'supAdd' })(SupAdd);