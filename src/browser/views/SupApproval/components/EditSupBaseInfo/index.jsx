import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { SHOW_EditSupBaseInfo_MODEL } from "../../../../constants/toggleTypes"
import { Modal, Form, Row, Col, Input, message, Select, Card } from 'antd';
import { supplierAction,supplierApproval } from "../../../../actions"
const { Option } = Select;
import "./index.less"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { TextArea } = Input;

@inject('toggleStore', 'supplierStore')
@observer
class EditSupBaseInfo extends React.Component {
    state = {
        supFeedback: {}
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_EditSupBaseInfo_MODEL)
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_EditSupBaseInfo_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore } = this.props;
        const { id } = this.state.supFeedback;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let ret = await supplierAction.supplierfeedback(id, values.content)
                toggleStore.setToggle(SHOW_EditSupBaseInfo_MODEL)
            }
        });
    };
    componentDidMount() {
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const { toggleStore, supplierStore } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { userId} =supplierApproval.pageInfo
        let { name, code, property_key } = supplierStore.supFeedback;
        return (
            <div>
                <Modal
                    title="修改基本信息"
                    visible={toggleStore.toggles.get(SHOW_EditSupBaseInfo_MODEL)}
                    width={900}
                    centered
                    footer={null}
                    okText="提交"
                    cancelText="取消"
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                >
                    <Row gutter={24}>
                        <Col span={24} >
                            <div style={{height: 600 }}>
                                <iframe style={{ width: 850, height: "100%" }} src={supplierApproval.newInfoUrl+`&userId=${userId}`} frameBorder="none"></iframe>
                            </div>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'EditSupBaseInfo' })(EditSupBaseInfo);