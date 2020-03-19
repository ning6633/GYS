import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_LOGIN_MODEL } from "../../constants/toggleTypes"

// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class LoginModel extends React.Component {
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_LOGIN_MODEL)
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_LOGIN_MODEL)
    };
    render() {
        const { toggleStore } = this.props;
        return (
            <div>
                <Button type="primary" onClick={() => { toggleStore.setToggle(SHOW_LOGIN_MODEL) }}>
                    打开模态框
                </Button>
                <Modal
                    title="Basic Modal"
                    visible={toggleStore.toggles.get(SHOW_LOGIN_MODEL)}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Modal>
            </div>
        );
    }
}

export default LoginModel;