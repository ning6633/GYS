import React, { Component } from 'react';
import { Modal, Button, Card, Form, Row, Col, Input, Descriptions , Empty , message,Select } from 'antd';
import { observer, inject, } from 'mobx-react';
import { toJS } from "mobx"
import { supplierEvalution} from "../../../../actions"
import { SHOW_ShowPJZJ_MODEL } from "../../../../constants/toggleTypes"
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
class ShowPJZJ extends Component {
    state = {
        recordData:null
         
    }
 
    componentDidMount() {
        const { specialistStore ,} = this.props;
     
        let recordData = toJS(specialistStore.specialistDetail) 
        console.log(recordData)
        this.setState({ 
            recordData
        });
      
    }
    // handleChange(value) {
    //     console.log(`selected ${value}`);
    // }
    handleCancel = () => {
        const { toggleStore ,} = this.props;
        toggleStore.setToggle(SHOW_ShowPJZJ_MODEL)
    };

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
        const { toggleStore ,specialistStore} = this.props;
        const  recordData  = specialistStore.specialistDetail;
        
     
     
        
     
        return (
            <div>
                <Modal
                    width={700}
                    title="专家信息"
                    visible={toggleStore.toggles.get(SHOW_ShowPJZJ_MODEL)}
                    footer={null}
                    // onOk={(e) => { this.handleSubmit(e) }}
                  onCancel={this.handleCancel}
                    // okText="提交"
                >
                <Row gutter={24}>
                    <Col span={6}>
                    {
                        recordData.fileid ?
                         <img alt="example" style={{ width: '120px',height:'150px' }} src={`${supplierEvalution.FileBaseURL}${ recordData.fileid}`} />
                         :<Empty description="暂无头像"/>
                    }

                    </Col>
                    <Col span={18}>
                    <Descriptions  layout="vertical">
                        <Descriptions.Item label="专家名称">{recordData.name}</Descriptions.Item>
                        <Descriptions.Item label="专家职称">{recordData.title}</Descriptions.Item>
                        <Descriptions.Item label="分类">{recordData.typename}</Descriptions.Item>
                        <Descriptions.Item label="专家领域" >
                        {recordData.field}
                        </Descriptions.Item>
                        <Descriptions.Item label="专家来源">{recordData.source}</Descriptions.Item>
                        <Descriptions.Item label="电话">{recordData.tel}</Descriptions.Item>
                        <Descriptions.Item label="邮箱">{recordData.email}</Descriptions.Item>
                   </Descriptions>
                    </Col>
                </Row>
             
                    
                </Modal>
            </div>
        );
    }
}

export default ShowPJZJ