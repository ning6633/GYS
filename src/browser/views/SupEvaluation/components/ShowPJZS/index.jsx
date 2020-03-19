import React, { Component } from 'react';
import { Modal, Select, Card, Form, Row, Col, Input, DatePicker, Icon, message ,Upload,Button ,InputNumber  } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_ShowPJZS_MODEL } from "../../../../constants/toggleTypes"
const { RangePicker } = DatePicker;
import { supplierEvalution } from "../../../../actions"
const { Option } = Select
// 新建评价证书
@inject('toggleStore')
@observer
class ShowPJZS extends Component {
    state = {
        fileId:'',
        fileList:[]
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        const {fileId} = this.state
     //   toggleStore.setToggle(SHOW_ShowPJZS_MODEL)
        this.props.form.validateFields((err, values) => {
            console.log(values)
            console.log(fileId)
        })
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ShowPJZS_MODEL)
    };
    handleSubmit = e => {
        const { editFn} = this.props;
        const {fileid} = this.state
        this.props.form.validateFields((err, values) => {
            console.log(values)
            values['fileid'] = fileid || ''
            console.log(fileid)
            editFn(values)
          //  toggleStore.setToggle(SHOW_ShowPJZS_MODEL)
        })
    }
    componentDidMount() {
        const { detail} = this.props
        const { setFieldsValue } = this.props.form;
        console.log(detail)
        if(detail.fileid){
            this.setState({
                fileList:[{
                    uid:detail.fileid,
                    name:'附件',
                    url:`${supplierEvalution.FileBaseURL}${detail.fileid}`
                }]
            })
        }
       
        setFieldsValue({
            certificatename: detail?detail.certificatename:null,
            type: detail?detail.type:null,
            fromorg:detail?detail.fromorg:null,
           // time:detail?detail.totime:null,
           // satisfaction:detail?detail.satisfaction:null,
        })
    }
    handleChange({file,fileList }) {
      
        if (file.status === 'done') {
            console.log(file)
            this.setState({ 
                fileid:file.response.fileid,
                fileList:[{
                    uid:file.response.fileid,
                    name:file.name,
                    url:`${supplierEvalution.FileBaseURL}${file.response.fileid}`
                }] 
            });
                message.success("上传附件成功")
              
        } else if (file.status === 'error') {
            message.error(`头像上传失败.`);
        }else{

        }
        // this.setState({
        //     fileList:[{
        //         uid:file.response.fileid,
        //         name:file.name,
        //         url:`http://10.0.32.106:8091/aspfile/file/1.0/files/${file.response.fileid}`
        //     }] 
        // })
       
    }
    onRemove(){
        this.setState({
            fileid:'',
            fileList:[]
        })
    }
    render() {
        const { toggleStore } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { fileList } = this.state
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
                    title="资质评价证书详情"
                    visible={toggleStore.toggles.get(SHOW_ShowPJZS_MODEL)}
                    onOk={(e) => { this.handleSubmit(e) }}
                    onCancel={this.handleCancel}
                    okText="提交"
                >
                    <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>
                        <Card bordered={false} className="new_supplier_form">
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item {...formItemLayout} label={'证书名称'}>
                                        {getFieldDecorator(`certificatename`, {
                                            rules: [
                                                {
                                                    required: true,
                                                    message:'证书名称不能为空'
                                                },
                                            ],
                                        })(<Input />)}
                                    </Form.Item>
                                    <Form.Item {...formItemLayout} label={'证书类型'}>
                                        {getFieldDecorator(`type`, {
                                            rules: [
                                                {
                                                    required: true,
                                                    message:'证书类型不能为空'
                                                },
                                            ],
                                        })(<Select>
                                            <Option value="类型一">类型一</Option>
                                            <Option value="类型二">类型二</Option>
                                        </Select>)}
                                    </Form.Item>
                                    <Form.Item {...formItemLayout} label={'发证机构'}>
                                        {getFieldDecorator(`fromorg`, {
                                            rules: [
                                                {
                                                    required: true,
                                                    message:'发证机构不能为空'
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
                                        })(<DatePicker  format={`YYYY-MM-DD`}  style={{width:'100%'}} />)}
                                    </Form.Item>
                                    <Form.Item {...formItemLayout} label={'文件附件'}>
                                        {getFieldDecorator(`attachment`, {
                                            rules: [
                                                {
                                                    required: false,
                                                },
                                            ],
                                        })(<div style={{ display: "inline-block", marginRight: 8 }}>
                                            <Upload 
                                               action={supplierEvalution.FileBaseURL}
                                               onChange={this.handleChange.bind(this)}
                                               onRemove={this.onRemove.bind(this)}
                                               fileList={fileList}
                                            >
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

export default Form.create({ name: 'ShowPJZSForm' })(ShowPJZS);;