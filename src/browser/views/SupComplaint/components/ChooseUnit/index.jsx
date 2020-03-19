import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { SHOW_Unit_MODEL } from "../../../../constants/toggleTypes"
import { Modal, Form, Icon, Tree, Input, Button, Empty, Card, List } from 'antd';
import { specialExposure } from "../../../../actions"
import CustomScroll from "../../../../components/CustomScroll"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Search } = Input;
const { TreeNode } = Tree;
@inject('toggleStore', 'supplierStore')
@observer
class ChooseCompany extends React.Component {
    state = {
        isSearch: false,
        treedata: []
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_Unit_MODEL)
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_Unit_MODEL)
    };
    onSelect = (selectedKeys, event) => {
        const { supplierStore, chooseBZcompany } = this.props;
        if(event.selectedNodes.length == 1){
            let itemData = event.selectedNodes[0].props.dataRef || ''
        chooseBZcompany ? chooseBZcompany(itemData) : supplierStore.chooseGysCompany(itemData)
        }
    };
    chooseCompanyInfo(itemData,key){
        const { supplierStore, chooseBZcompany } = this.props;
        const {treedata} = this.state;
        treedata.map((val, idx) => {
            treedata[idx].checked = false
        })
        treedata[key].checked = true
        this.setState({
            treedata
        })
        chooseBZcompany ? chooseBZcompany(itemData) : supplierStore.chooseGysCompany(itemData)
    }
    async searchCompanyInfo(name) {
        if (name) {
            let ret = await specialExposure.searchCompanyInfo(name);
            console.log(ret)
            this.setState({
                isSearch: true,
                treedata: ret
            })
        } else {
            this.setState({
                isSearch: false,
            })
            this.componentDidMount()
        }

    }
    async componentDidMount() {
        let ret = await specialExposure.getCompanyListTree()
        console.log(ret)
        this.setState({
            treedata: ret
        })
    }
    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        };
    }
    gettreenode(tree, key = 0) {
        return tree.map((treenode, idx) => {
            return (
                <TreeNode dataRef={treenode} title={treenode.name} key={[key + '' + idx]}>{
                    treenode.children && treenode.children.length > 0 ? (
                        this.gettreenode(treenode.children, key + '' + idx)
                    ) : null
                }</TreeNode>
            )
        })
    }
    render() {
        const { toggleStore } = this.props;
        const { treedata } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        return (
            <div>
                <Icon style={{ cursor: 'pointer' }} onClick={() => toggleStore.setToggle(SHOW_Unit_MODEL)} type="plus" />
                <Modal
                    title="选择院所"
                    visible={toggleStore.toggles.get(SHOW_Unit_MODEL)}
                    width={800}
                    centered
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Card extra={<Search placeholder="搜索院所" onSearch={value => this.searchCompanyInfo(value)} enterButton />}>
                        {
                            this.state.isSearch ? <div>
                                {
                                    treedata.length == 0 ? <Empty /> : <CustomScroll>
                                        {
                                            treedata ? <div>
                                                <List
                                                    size="small"
                                                    header={<h3>搜索结果：</h3>}
                                                    bordered
                                                    dataSource={treedata}
                                                    renderItem={(item,key) => <List.Item  onClick={() => { this.chooseCompanyInfo(item,key) }} className={(item.checked && 'checked_item') + ' supplierItem'}>{item.name}</List.Item>}
                                                />
                                            </div> : <Empty />
                                        }
                                    </CustomScroll>
                                }
                            </div> : (<div>
                                {
                                    treedata.length == 0 ? <Empty /> : <CustomScroll>
                                        {
                                            treedata ? <Tree defaultExpandAll showLine defaultExpandedKeys={['0']} onSelect={this.onSelect.bind(this)}>
                                                {
                                                    this.gettreenode(treedata)
                                                }
                                            </Tree> : <Empty />
                                        }
                                    </CustomScroll>
                                }
                            </div>)
                        }
                    </Card>
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'ChooseCompany' })(ChooseCompany);