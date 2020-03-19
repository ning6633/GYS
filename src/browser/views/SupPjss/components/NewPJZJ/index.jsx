import React, { Component } from 'react';
import { Modal, Button, Card, Form, Row, Col, Input, Upload, Icon, message,Select } from 'antd';
import { observer, inject, } from 'mobx-react';
import { specialAction } from "../../../../actions"
import { toJS } from "mobx"
import { SHOW_NewPJZS_MODEL } from "../../../../constants/toggleTypes"
const { Option} = Select
function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
// 新建标准要求
@inject('toggleStore','specialistStore')
@observer
class NewPJZJ extends Component {
    state = {
        fileList: [
          
          ],
          previewVisible: false,
          previewImage: '',
          fileid:'',
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NewPJZS_MODEL)
        this.props.form.validateFields((err, values) => {
            console.log(values)
        })
    };
    handleParentCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NewPJZS_MODEL)
    };
    handleSubmit = e => {
        const { toggleStore } = this.props;
        this.props.form.validateFields((err, values) => {
            console.log(values)
            const { addZJFn} = this.props
            values['fileid'] =this.state.fileid|| ''
            addZJFn(values)
            toggleStore.setToggle(SHOW_NewPJZS_MODEL)
        })
    }
   async componentDidMount() {
        // const { specialistStore ,} = this.props;
        // const { setFieldsValue } = this.props.form
        // let recordData = toJS(specialistStore.specialistDetail) 
        // setFieldsValue({ ...recordData })
        // console.log(recordData)
        
     
    }
    // handleChange(value) {
    //     console.log(`selected ${value}`);
    // }
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        console.log(file)
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
  
      this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
      });
    };
  
    handleChange = ({ fileList }) =>{
        console.log(fileList[0].status)
        if (fileList[0].status === 'done') {
            this.setState({ 
                fileid:fileList[0].response.fileid
            });
                message.success("头像上传成功")
              
        } else if (fileList[0].status === 'error') {
            message.error(`头像上传失败.`);
        }else{

        }
        this.setState({ 
            fileList, 
        });
    } 
    handleTypeChange(value){
         console.log(value)
    }
    render() {
        const { toggleStore ,specialistTypes } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { fileList ,previewVisible,previewImage } =this.state
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
     
          const uploadButton = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">Upload</div>
            </div>
          );
       
        return (
            <div>
                <Modal
                    width={700}
                    title="添加专家信息"
                    visible={toggleStore.toggles.get(SHOW_NewPJZS_MODEL)}
                    onOk={(e) => { this.handleSubmit(e) }}
                    onCancel={this.handleParentCancel}
                    okText="提交"
                >
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
               <img alt="example" style={{ width: '100%' }} src={previewImage} />
               </Modal>
                
                    <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>
                        <Card bordered={false} className="new_supplier_form">
                            <Row gutter={24}>
                                <Col span={12}>
                                <Form.Item {...formItemLayout} label={'选择头像'}>
                                  <Upload
                                  action={specialAction.FileBaseURL+'img'}
                                  listType="picture-card"
                                  fileList={fileList}
                                  onPreview={this.handlePreview}
                                  onChange={this.handleChange}
                                    >
                                    {fileList.length >= 1 ? null : uploadButton}
                                    </Upload>
                                    </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                    <Form.Item {...formItemLayout} label={'专家名称'}>
                                        {getFieldDecorator(`name`, {
                                            rules: [
                                                {
                                                    required: false,
                                                },
                                            ],
                                        })(<Input />)}
                                    </Form.Item>
                                    </Col>
                                  
                                    <Col span={12}>
                                    <Form.Item {...formItemLayout} label={'专家职称'}>
                                        {getFieldDecorator(`title`, {
                                            rules: [
                                                {
                                                    required: false,
                                                },
                                            ],
                                        })(<Input />)}
                                    </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                    <Form.Item {...formItemLayout} label={'专家类型'}>
                                        {getFieldDecorator(`type`, {
                                            rules: [
                                                {
                                                    required: false,
                                                },
                                            ],
                                        })( <Select
                                            placeholder="请选择专家类型"
                                            onChange={this.handleTypeChange}
                                          
                                          >
                                          {
                                              specialistTypes.map(item=>{
                                                  return (
                                                    <Option key={item.id} value={item.code}>{item.name}</Option>
                                                  )
                                              })
                                          }
                                            {/* <Option value="PXZJ">培训专家</Option>
                                            <Option value="evalution">资质评价专家</Option>
                                            <Option value="RDZJ">评价认定专家</Option> */}
                                          </Select>)}
                                    </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                    <Form.Item {...formItemLayout} label={'专家领域'}>
                                        {getFieldDecorator(`field`, {
                                            rules: [
                                                {
                                                    required: false,
                                                },
                                            ],
                                        })(<Input />)}
                                    </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                    <Form.Item {...formItemLayout} label={'所属单位'}>
                                        {getFieldDecorator(`source`, {
                                            rules: [
                                                {
                                                    required: false,
                                                },
                                            ],
                                        })(<Input />)}
                                    </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                    <Form.Item {...formItemLayout} label={'电话'}>
                                        {getFieldDecorator(`tel`, {
                                            rules: [
                                                {
                                                    required: false,
                                                },
                                            ],
                                        })(<Input />)}
                                    </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                    <Form.Item {...formItemLayout} label={'邮箱'}>
                                        {getFieldDecorator(`email`, {
                                            rules: [
                                                {
                                                    required: false,
                                                },
                                            ],
                                        })(<Input />)}
                                    </Form.Item>
                                    {/* <Form.Item {...formItemLayout} label={'文件附件'}>
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
                                    </Form.Item> */}
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'NewPJZJForm' })(NewPJZJ);;