import React, { Component } from 'react';
import { Modal, Select, Card, Form, Row, Col, Input, DatePicker, Icon, message } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_NewPJZS_MODEL } from "../../../../constants/toggleTypes"
import moment from "moment";
const { RangePicker } = DatePicker;
const { Option } = Select
import { supplierAccepted } from "../../../../actions"

// 新建准入证书
@inject('toggleStore')
@observer
class NewPJZS extends Component {
    state={
        ZRZSlist:[]
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
    handleSubmit = e => {
        const { toggleStore } = this.props;
        this.props.form.validateFields(async (err, values) => {
            console.log(values)
            let date = values.time.format('YYYY-MM-DD')
            values['toTime'] = date
            if (!err) {
                let ret = await supplierAccepted.supplierNewcer(values)
                console.log(ret);
                const { loaddata} = this.props
                loaddata()
                toggleStore.setToggle(SHOW_NewPJZS_MODEL)
            }
        })
    }
   async componentDidMount() {
        let result = await supplierAccepted.getDic('TYPE_ZRZS')
        console.log(result)
        if(result.code==200){
            this.setState({
                ZRZSlist:result.data
            })
        }
    }
    disabledDate(current){
        return current && current < moment().endOf('day');
    }
    handleChange(value) {
        console.log(`selected ${value}`);
    }
    render() {
        const { toggleStore } = this.props;
        const { ZRZSlist }  = this.state
        const ZRZSoptions = ()=>{
            return ZRZSlist.length>0? ZRZSlist.map(item=><Option key={item.name}>{item.name}</Option>):null
          }
         const children = [ZRZSoptions()]
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
        };
        const rangeConfig = {
            rules: [{ type: 'array', required: true, message: '请选择有效期' }],
          };
        return (
            <div>
                <Modal
                    width={700}
                    title="新建评价认定准入证书"
                    visible={toggleStore.toggles.get(SHOW_NewPJZS_MODEL)}
                    onOk={(e) => { this.handleSubmit(e) }}
                    onCancel={this.handleCancel}
                    okText="提交"
                >
                    <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>
                        <Card bordered={false} className="new_supplier_form">
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item {...formItemLayout} label={'证书名称'}>
                                        {getFieldDecorator(`name`, {
                                            rules: [
                                                {
                                                    required: false,
                                                },
                                            ],
                                        })(<Input />)}
                                    </Form.Item>
                                    <Form.Item {...formItemLayout} label={'证书类型'}>
                                        {getFieldDecorator(`type`, {
                                            rules: [
                                                {
                                                    required: false,
                                                },
                                            ],
                                        })(<Select>
                                            {children}
                                          
                                        </Select>)}
                                    </Form.Item>
                                    <Form.Item {...formItemLayout} label={'发证机构'}>
                                        {getFieldDecorator(`org`, {
                                            rules: [
                                                {
                                                    required: false,
                                                },
                                            ],
                                        })(<Input />)}
                                    </Form.Item>
                                    <Form.Item {...formItemLayout} label={'有效期限'}>
                                        {getFieldDecorator('time', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message:'有效期限不能为空'
                                                },
                                            ],
                                        })(<DatePicker disabledDate={this.disabledDate}  format={`YYYY-MM-DD`}  style={{width:'100%'}} />)}
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