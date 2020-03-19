import React, { Component , Fragment } from 'react';
import { Modal, Select, Card, Form, Row, Col, Input, DatePicker,Button, Icon, message } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_NewPJZS_MODEL } from "../../../../constants/toggleTypes"
import { supplierEvalution, supYearAudit } from "../../../../actions"
import moment from 'moment'
import { debug } from 'util';
const { RangePicker } = DatePicker;
const { Option } = Select
// 新建评价证书
@inject('toggleStore')
@observer
class NewPJZS extends Component {
    state = {
        fileType: [],
        statuss:''
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NewPJZS_MODEL)
        this.props.form.validateFields((err, values) => {
            console.log(values)
        })
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NewPJZS_MODEL)
    };
    handleSubmit = (e) => {
        //获取表单数据
        const { toggleStore, statuss, info } = this.props;
        this.props.form.validateFields(async (err, values) => {
            values.toTime = values.toTime.format('YYYY-MM-DD')
            if (statuss == 0) {
                //添加复审证书
                let res = await supYearAudit.insertcertificate(values)
                if (res.code == 200) {
                    message.success(res.message)
                    toggleStore.setToggle(SHOW_NewPJZS_MODEL)
                    this.props.loaddata()
                }
            } else if (statuss == 1) {
                //修改复审证书
                let _tmp = new Date().toLocaleDateString()
                _tmp = _tmp.replace(/\//g, '-')
                values.updateTime = _tmp
                values.id = info[0].id
                let res = await supYearAudit.updatecertificate(values)
                if (res.code == 200) {
                    message.success(res.message)
                    toggleStore.setToggle(SHOW_NewPJZS_MODEL)
                    this.props.loaddata()
                }
            }
        })
    }
    async getcertificatestype () {
        let res = await supYearAudit.getcertificatestype()
        if (res.code == 200) {
            this.setState({
                fileType: res.data
            })
        }
    }
    upload (info) {
        let { setFieldsValue } = this.props.form
        info.toTime = moment(info.toTime)
        let {
            name,
            type,
            org,
            toTime
        } = info
        setFieldsValue({
            name,
            type,
            org,
            toTime
        })
    }
    showInfo (info) {
        let { setFieldsValue } = this.props.form
        info.toTime = moment(info.toTime)
        let {
            name,
            type,
            org,
            toTime
        } = info
        setFieldsValue({
            name,
            type,
            org,
            toTime
        })
    }
   async componentDidMount () {
        let { info, statuss } = this.props
        this.setState({statuss})
        if (statuss == 1 ) {
            this.upload(info[0])
        }
        if(statuss == 3){
            this.showInfo(info[0])
        }
        this.getcertificatestype()
        let userInfo = await supplierEvalution.getUserInfo()
        if(userInfo.code==200){
            const { setFieldsValue } = this.props.form
            setFieldsValue({
                org:userInfo.data[0].departmentname
            })
        }

    }
  
    render () {
        const { toggleStore } = this.props;
        let { fileType , statuss } = this.state
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
       
        return (
            <div>
                <Modal
                    title={statuss == 0 ? <b>新建复审证书</b> : statuss == 1 ? <b>修改复审证书</b> : statuss == 3 ? <b>复审证书详情</b> : null}
                    visible={toggleStore.toggles.get(SHOW_NewPJZS_MODEL)}
                    onOk={(e) => { this.handleSubmit(e) }}
                    width={800}
                    onCancel={this.handleCancel}
                    footer = {
                        statuss == 0 || statuss == 1?
                        <Fragment>
                            <Button  onClick={()=>{this.handleCancel()}} style={{marginRight:10}}>关闭</Button>
                            <Button type = 'primary' onClick={()=>{this.handleSubmit()}}>提交</Button>
                        </Fragment> : statuss ==3 ? <Button  onClick={()=>{this.handleCancel()}}>关闭</Button> : null

                    }
                >
                    <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>
                        <Card bordered={false} className="new_supplier_form">
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item {...formItemLayout} label={'证书名称'} style={{ marginBottom: 50 }}>
                                        {getFieldDecorator(`name`, {
                                            rules: [
                                                {
                                                    required: true,
                                                },
                                            ],
                                        })(<Input disabled = {statuss == 3} placeholder = '请输入证书名称' span={8} />)}
                                    </Form.Item>

                                </Col>
                                <Col span={12}>
                                    <Form.Item {...formItemLayout} label={'证书类型'}>
                                        {getFieldDecorator(`type`, {
                                            rules: [
                                                {
                                                    required: true,
                                                },
                                            ],
                                        })(<Select disabled = {statuss == 3} placeholder = '请选择证书类型'> 
                                            {fileType.map((item, index) => {
                                                return <Option key={item.key} value={item.text}>{item.text}</Option>
                                            })}
                                        </Select>)}
                                    </Form.Item>

                                </Col>

                            </Row>
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item {...formItemLayout} label={'发证机构'}>
                                        {getFieldDecorator(`org`, {
                                            rules: [
                                                {
                                                    required: true,
                                                },
                                            ],
                                        })(<Input disabled = {statuss == 3} placeholder = '请输入发证机构' />)}
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item {...formItemLayout} label={'有效期限'}>
                                        {getFieldDecorator('toTime', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择有效期限',
                                                },
                                            ],
                                        }
                                        )(<DatePicker disabled = {statuss == 3} placeholder='请选择有限期限'
                                            disabledDate={
                                                (current) => { return current && current < moment().subtract(1, "days"); }
                                            }
                                            format="YYYY-MM-DD" style={{ width: '100%' }}
                                        />
                                        )}
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

export default Form.create({ name: 'NewPJZSForm' })(NewPJZS);;