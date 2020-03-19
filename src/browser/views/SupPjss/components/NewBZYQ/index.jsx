import React, { Component } from 'react';
import { Modal, Button, Card, Form, Row, Col, Input, Upload, Icon, message } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_NewBZYQ_MODEL } from "../../../../constants/toggleTypes"

// 新建标准要求
@inject('toggleStore')
@observer
class NewBZYQ extends Component {
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NewBZYQ_MODEL)
        this.props.form.validateFields((err, values) => {
            console.log(values)
        })
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NewBZYQ_MODEL)
    };
    handleSubmit = e => {
        const { toggleStore } = this.props;
        this.props.form.validateFields((err, values) => {
            console.log(values)
            const { addBZYQFn} = this.props
            addBZYQFn(values)
            toggleStore.setToggle(SHOW_NewBZYQ_MODEL)
        })
    }
    componentDidMount() {
    }
    handleChange(value) {
        console.log(`selected ${value}`);
    }
    render() {
        const { toggleStore } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
        };
        const uploadProps = {
            name: 'file',
            action: `http://10.0.37.16:5080/srm/userloginservlet?LoginFrom=CADLogin&&userName=administrator&password=administrator&URL=rest/srm/file/web/upload`,
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 文件上传成功，正在等待服务端转换...`);
                    setTimeout(() => {
                        message.success("文件转换成功，开始加载数据...")
                        // that.loaddata();
                    }, 3000);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 文件上传失败.`);
                }
            },
        };
        return (
            <div>
                <Modal
                    width={700}
                    title="新建标准要求"
                    visible={toggleStore.toggles.get(SHOW_NewBZYQ_MODEL)}
                    onOk={(e) => { this.handleSubmit(e) }}
                    onCancel={this.handleCancel}
                    okText="提交"
                >
                    <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>
                        <Card bordered={false} className="new_supplier_form">
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item {...formItemLayout} label={'要求名称'}>
                                        {getFieldDecorator(`name`, {
                                            rules: [
                                                {
                                                    required: false,
                                                },
                                            ],
                                        })(<Input />)}
                                    </Form.Item>
                                    <Form.Item {...formItemLayout} label={'要求类型'}>
                                        {getFieldDecorator(`type`, {
                                            rules: [
                                                {
                                                    required: false,
                                                },
                                            ],
                                        })(<Input />)}
                                    </Form.Item>
                                    <Form.Item {...formItemLayout} label={'标准文件编号'}>
                                        {getFieldDecorator(`number`, {
                                            rules: [
                                                {
                                                    required: false,
                                                },
                                            ],
                                        })(<Input />)}
                                    </Form.Item>
                                    <Form.Item {...formItemLayout} label={'文件附件'}>
                                        {getFieldDecorator(`attachment`, {
                                            rules: [
                                                {
                                                    required: false,
                                                },
                                            ],
                                        })(<div style={{ display: "inline-block", marginRight: 8 }}>
                                            <Upload {...uploadProps}>
                                                <Button>
                                                    <Icon type="upload" />选择文件
                                                </Button>
                                            </Upload>
                                        </div>)}
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

export default Form.create({ name: 'NewBZYQForm' })(NewBZYQ);;