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
 

@inject('toggleStore', 'verifyStore','supplierStore')
@observer
class ShowRecommendDetail extends React.Component {
    state = {
        productid: "",
        supplierId: "",
        verifyEditProduct:{},
        selectField: {
            "zycd": [

            ],
            "cpfl": [

            ],
            "ptfs": [

            ],
            "ptly": [

            ],
            "sfst": [

            ]
        }
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(ShOW_RecommendDetail_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore,refreshData } = this.props;
        // this.props.form.validateFields(async (err, values) => {
        //     console.log(err)
        //     if(!err){
        //         console.log(values)

        //     }
          
        // });
    };
   

    chooseBZsupplier(data) {
        const { supplierStore } = this.props;
        const { setFieldsValue } = this.props.form;
        if (!supplierStore.iseditor) {
            // 当不是编辑状态时才会 ，修改供应商名称
            this.setState({
                supplierId: data.id,
                supplierInfo: data
            })
        }
        setFieldsValue({ ...data })
    }

    async componentDidMount() {
        const { verifyStore } = this.props;
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
        const { toggleStore,detail ,options } = this.props;
        const { verifyEditProduct } = this.state;
        const { userId} =supplierRecommend.pageInfo
      //  const FrameUrl = supplierRecommend.ApprovalUrl+ `&usage=${detail.status==0?'edit':'view'}&objId=${detail.id}&processInstanceId=${detail.processInstId}&status=${detail.status}&processReceiveId=${detail.processReceiveId}&userId=${userId}&processInstId=${detail.processInstId}`
        // console.log(FrameUrl)
        let style = {
            width:'100%',
            height:'60vh',
            border:'none'
        }
        return (
            <div>
                {
                    toggleStore.toggles.get(ShOW_RecommendDetail_MODEL) && <Modal
                        title={options.title}
                        visible={toggleStore.toggles.get(ShOW_RecommendDetail_MODEL)}
                       width={900}
                        //  height={700}
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
                       <iframe style={style} src={options.url} ></iframe>
                    </Modal>
                }
            </div>
        );
    }
}

export default Form.create({ name: 'ShowRecommendDetail' })(ShowRecommendDetail);