import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { toJS } from "mobx"
import { Modal, Form, Row, Col, Input, Button, Card, Select, message } from 'antd';
import { ShOW_RecommendDetail_MODEL } from "../../../../constants/toggleTypes"
import Choosepsupplier from '../../../SupManager/components/Choosepsupplier'
import { supplierAction, supplierRecommend } from "../../../../actions"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Option } = Select;
const { TextArea } = Input;
 

@inject('toggleStore')
@observer
class ShowProcessModel extends React.Component {
    state = {
        productid: "",
        supplierId: "",
        verifyEditProduct:{},
      
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        const { model } = toggleStore.getModelOptions()
        toggleStore.setToggle(model)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore,refreshData } = this.props;
      
    };
   

 
    async componentDidMount() {
        const { setFieldsValue } = this.props.form;
     

    }
    componentWillUnmount(){
        this.setState=(state,callback)=>{
            return;
        }
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const { getFieldDecorator } = this.props.form;
        const { toggleStore } = this.props;
        const { verifyEditProduct } = this.state;
        const { userId} =supplierRecommend.pageInfo
        const {model,modelOptions,detail} = toggleStore.getModelOptions()
      //  const FrameUrl = supplierRecommend.ApprovalUrl+ `&usage=${detail.status==0?'edit':'view'}&objId=${detail.id}&processInstanceId=${detail.processInstId}&status=${detail.status}&processReceiveId=${detail.processReceiveId}&userId=${userId}&processInstId=${detail.processInstId}`
        // console.log(FrameUrl)
        let style = {
            width:'100%',
            height:'67vh',
            border:'none'
        }
        return (
            <div>
                {
                    toggleStore.toggles.get(model) && <Modal
                        title={modelOptions.title}
                        visible={toggleStore.toggles.get(model)}
                       width={1000}
                      
                        bodyStyle={{
                          
                             height:'700px'
                         }}
                        centered
                        okText="确认"
                        cancelText="取消"
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                        footer={null}
                    >
                       <iframe style={style} src={modelOptions.url} ></iframe>
                    </Modal>
                }
            </div>
        );
    }
}

export default Form.create({ name: 'ShowProcessModel' })(ShowProcessModel);