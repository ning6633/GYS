import React, { Component } from 'react';
import { Modal, Button, Card, Form, Row, Col, Input, Upload, Icon, message } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_NewBZYQ_MODEL } from "../../../../../../constants/toggleTypes"

import { supplierEvalution } from "../../../../../../actions"

// 新建标准要求
@inject('toggleStore')
@observer
class NewBZYQ extends Component {
    constructor(){
        super()
        this.handleUploadChange = this.handleUploadChange.bind(this)
    }
    state={
        fileList:[]
    }
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
        const { toggleStore,addBZYQFn } = this.props;
        const { fileList} = this.state

        this.props.form.validateFields((err, values) => {
            if(fileList.length>0){
                values['fileid'] = fileList[0].response.fileid
                values['fileName'] =  fileList[0].fileName
            }else{
                values['fileid'] = null
                values['fileName'] =  null
            }
            console.log(fileList)
            console.log(values)
         
            addBZYQFn(values)
            toggleStore.setToggle(SHOW_NewBZYQ_MODEL)
        })
    }
    handleUploadChange(info) {

        // if (info.file.status !== 'uploading') {
        //     console.log(info.file, info.fileList);
        // }
        // if (info.file.status === 'done') {
        //     message.success(`${info.file.name} 文件上传成功，正在等待服务端转换...`);
        //     setTimeout(() => {
        //         message.success("文件转换成功，开始加载数据...")
        //         // that.loaddata();
        //     }, 3000);
        // } else if (info.file.status === 'error') {
        //     message.error(`${info.file.name} 文件上传失败.`);
        // }
        let fileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-1);
    
        // 2. Read from response and show file link
        fileList = fileList.map(file => {
            file['fileName']=file.name
          if (file.response) {
            // Component will show file.url as link
            file.url = file.response.url;
          }
          return file;
        });
       console.log(fileList)
        this.setState({ fileList });
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            name:fileList[0].name
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
            action:supplierEvalution.FileBaseURL,
            multiple: false,
            onChange:this.handleUploadChange
        };
        return (
            <div>
                <Modal
                    width={700}
                    title="新建附件"
                    visible={toggleStore.toggles.get(SHOW_NewBZYQ_MODEL)}
                    onOk={(e) => { this.handleSubmit(e) }}
                    onCancel={this.handleCancel}
                    okText="提交"
                >
                    <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>
                        <Card bordered={false} className="new_supplier_form">
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item {...formItemLayout} label={'名称'}>
                                        {getFieldDecorator(`name`, {
                                            rules: [
                                                {
                                                    required: false,
                                                },
                                            ],
                                        })(<Input />)}
                                    </Form.Item>
                                  
                                   
                                    <Form.Item {...formItemLayout} label={'附件'}>
                                        {getFieldDecorator(`attachment`, {
                                            rules: [
                                                {
                                                    required: false,
                                                },
                                            ],
                                        })(<div style={{ display: "inline-block", marginRight: 8 }}>
                                            <Upload {...uploadProps} fileList={this.state.fileList}>
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