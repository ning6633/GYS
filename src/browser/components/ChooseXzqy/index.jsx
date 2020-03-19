import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { SHOW_ChooseXzqy_MODEL } from "../../constants/toggleTypes"
import { Modal, Form, Icon, message, Input, Cascader, Empty, Card } from 'antd';
import { supplierAction } from "../../actions"
import CustomScroll from "../CustomScroll";
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class ChooseXzqy extends React.Component {
    state = {
        treedata: [],
        chooseXzqy: []
    }
    handleOk = e => {
        const { toggleStore, getChooseXzqy } = this.props;
        const { chooseXzqy } = this.state;
        if(chooseXzqy.length==0){
            message.error('请选择具体行政区域')
            return;
        }
        let curChooseCity = chooseXzqy[0];
        if(curChooseCity.value==7){
            // 当前选择的是国内城市
            if (chooseXzqy.length > 2) {
                getChooseXzqy(this.state.chooseXzqy)
                toggleStore.setToggle(SHOW_ChooseXzqy_MODEL)
            } else {
                message.error('国内城市 - 至少选择至市级，如 国内城市/上海市/上海市辖区')
            }
        }else{
            // 当前选择的是国外城市
            if (chooseXzqy.length > 1) {
                getChooseXzqy(this.state.chooseXzqy)
                toggleStore.setToggle(SHOW_ChooseXzqy_MODEL)
            } else {
                message.error('国外城市 - 至少选择到第二级，如 国际城市/美国')
            }
        }
        
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ChooseXzqy_MODEL)
    };
    async componentDidMount() {
    }
    onChange(value, selectedOptions) {
        console.log(value, selectedOptions);
        this.setState({
            chooseXzqy: selectedOptions
        })
    }
    render() {
        const { city, toggleStore } = this.props;
        return (
            <div>
                <Icon style={{ cursor: 'pointer' }} onClick={() => toggleStore.setToggle(SHOW_ChooseXzqy_MODEL)} type="plus" />
                <Modal
                    title="选择行政区域"
                    visible={toggleStore.toggles.get(SHOW_ChooseXzqy_MODEL)}
                    width={600}
                    centered
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Card>
                        <div style={{ fontSize: 14, color: 'red' }}>*注意1： 国内城市 - 至少选择至市级，如 国内城市/上海市/上海市辖区</div>
                        <div style={{ fontSize: 14, color: 'red',marginBottom:20 }}>*注意2： 国外城市 - 至少选择到第二级，如 国际城市/美国</div>
                        <CustomScroll>
                            <Cascader changeOnSelect={true} onChange={this.onChange.bind(this)} style={{ width: 500 }} placeholder="请选择行政区域..." showSearch={true} options={city} />
                        </CustomScroll>
                    </Card>
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'ChooseXzqy' })(ChooseXzqy);