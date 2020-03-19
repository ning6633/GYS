import React, { Component, Fragment } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, DatePicker, Icon, Button, message, Tooltip, Checkbox, Radio, Upload } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from 'moment'
import { SHOW_uploadCourseware_MODEL } from "../../../../../../constants/toggleTypes"
import { supplierTrain } from '../../../../../../actions'
import _ from "lodash";
// 公用选择供应商组件
const { TabPane } = Tabs;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore', 'trainStore')
@observer
class UploadCourseware extends React.Component {
    state = {
        fileid: '',
        id:''
    }
    handleCancel = () => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_uploadCourseware_MODEL)
    }
    handleSubmit = () => {
        let { uploadCourseware,toggleStore } = this.props
        let {fileid,id} = this.state
        this.props.form.validateFields(async (err, values) => {
            values.fileid = fileid
            values.updatedate = moment().format("YYYY-MM-DD")
            values.id = id
            uploadCourseware(values)
            toggleStore.setToggle(SHOW_uploadCourseware_MODEL)
        })
    }
    uploadCourseware = () => {
        // 上传课件
    }
    componentDidMount = () => {
    }
    render = () => {
        const { getFieldDecorator } = this.props.form;
        let { toggleStore } = this.props
        let { fileid } = this.state
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 21 },
        };
        let _that = this
        const uploadProps = {
            name: 'file',
            action: supplierTrain.FileBaseURL,
            onChange(info) {
                
                if (info.file.status !== 'uploading') {
                    // console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 文件上传成功`);
                    // setTimeout(() => {
                    //     message.success("文件转换成功，开始加载数据...")
                    //     // that.loaddata();
                    // }, 3000);
                    if (info.fileList.length > 1) {
                        info.fileList.splice(0, 1)
                    }
                    _that.setState({
                        fileid: info.fileList[0].response.fileid,
                        id:info.fileList[0].response.fileid,
                    })
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 文件上传失败.`);
                }
            },
        };
        return (
            <Modal
                title="新建课件"
                visible={toggleStore.toggles.get(SHOW_uploadCourseware_MODEL)}
                onOk={(e) => { this.handleSubmit(e) }}
                onCancel={this.handleCancel}
                width={900}
            >
                <Form className="ant-advanced-search-form">
                    <Row className="trainCurr_rowe">
                        <Form.Item {...formItemLayout} label={'名称'}>
                            {getFieldDecorator(`name`, {
                                rules: [
                                    {
                                        required: true,
                                        message: '课件名称不能为空',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                    </Row>
                    <Row className="trainCurr_rowe">
                        <Form.Item {...formItemLayout} label={'内容简介'}>
                            {getFieldDecorator(`describe`, {
                                rules: [
                                    {
                                        required: false,
                                        message: '内容简介不能为空',
                                    },
                                ],
                            })(<Input.TextArea autosize={{ minRows: 5, maxRows: 12 }} />)}
                        </Form.Item>
                    </Row>
                    <Row className="trainCurr_rowe">
                        <Form.Item {...formItemLayout} label={'附件'}>
                            {getFieldDecorator(`fileid`, {
                                rules: [
                                    {
                                        required: false,
                                        message: '附件不能为空',
                                    },
                                ],
                            })(<Upload {...uploadProps} >
                                <Tooltip placement="rightTop" title="一次只可以上传一条附件">
                                    <Button>
                                        <Icon type="upload" />选择文件
                                </Button>
                                </Tooltip>
                            </Upload>)}
                        </Form.Item>

                    </Row>

                </Form>
            </Modal>
        )
    }


}

export default Form.create({ name: 'uploadCourseware' })(UploadCourseware);;