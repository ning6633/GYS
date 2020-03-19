import React, { Component } from 'react';
import { Modal, Select, Card, Form, Row, Col, Input, DatePicker, Icon, message ,Upload,Button ,InputNumber  } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_NewPJZS_MODEL } from "../../../../constants/toggleTypes"
import { supplierEvalution } from "../../../../actions"
const { RangePicker } = DatePicker;
const { Option } = Select
import moment from 'moment';
// 新建评价证书
@inject('toggleStore')
@observer
class NewPJZS extends Component {
    state = {
        fileId:'',
        ZRZSlist:[]
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        const {fileId} = this.state
     //   toggleStore.setToggle(SHOW_NewPJZS_MODEL)
        this.props.form.validateFields((err, values) => {
            console.log(values)
            console.log(fileId)
        })
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NewPJZS_MODEL)
    };
    handleSubmit = e => {
        const { submitFn} = this.props;
        const {fileid} = this.state
        this.props.form.validateFields((err, values) => {
            console.log(values)
            values['fileid'] = fileid || ''
            console.log(fileid)
            submitFn(values)
          //  toggleStore.setToggle(SHOW_NewPJZS_MODEL)
        })
    }
    disabledDate(current){
        return current && current < moment().endOf('day');
    }
   async componentDidMount() {
        let result = await supplierEvalution.getDic('TYPE_ZZZS')
        console.log(result)
        if(result.code==200){
            this.setState({
                ZRZSlist:result.data
            })
        }
    }
    handleChange({file}) {
      
        if (file.status === 'done') {
            console.log(file)
            this.setState({ 
                fileid:file.response.fileid
            });
                message.success("上传附件成功")
              
        } else if (file.status === 'error') {
            message.error(`头像上传失败.`);
        }else{

        }
       
    }
    onRemove(){
        this.setState({
            fileid:''
        })
    }
    render() {
        const { toggleStore } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { ZRZSlist} = this.state
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
        };
        const ZRZSoptions = ()=>{
            return ZRZSlist.length>0? ZRZSlist.map(item=><Option key={item.name}>{item.name}</Option>):null
          }
         const children = [ZRZSoptions()]
       
        return (
            <div>
                <Modal
                    width={700}
                    title="新建资质评价证书"
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
                                           {children}
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
                                        })(<DatePicker format={`YYYY-MM-DD`} disabledDate={this.disabledDate} style={{width:'100%'}} />)}
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

export default Form.create({ name: 'NewPJZSForm' })(NewPJZS);;