import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { number, bool, string, array, object,func,oneOfType} from 'prop-types';
import _ from "lodash";
import { SHOW_ChooseSupplierPub_MODEL } from "../../constants/toggleTypes"
import { Modal, Form, Icon, Table, Input, Button, Tooltip, Card } from 'antd';
import { supplierAction } from "../../actions"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Search } = Input;

const columns = [
    {
        title: '序号',
        dataIndex: 'key',
        width: 100,
        align: "center",
        render: (text, index, key) => key + 1
    },
    {
        title: '供应商名称',
        dataIndex: 'name',
        width: 300,
        align: "center",
        render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
    },
    {
        title: '统一社会信用代码',
        dataIndex: 'code',
        width: 230,
        align: "center",
    },
    {
        title: '简称',
        dataIndex: 'name_other',
        width: 150,
        align: "center",
    },
    {
        title: '别称',
        dataIndex: 'another_name',
        width: 150,
        align: "center",
    },
    {
        title: '行政区域名称',
        dataIndex: 'district_key',
        width: 230,
        align: "center",
    },
];

@inject('toggleStore')
@observer
class ChooseSupplier extends React.Component {
    state = {
        supplierList: [],
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
    };
    handleOk = e => {
        const { toggleStore,chooseBZsupplierFn ,supplierList} = this.props;
        const { selectedRowKeys } = this.state
        let selectData = _.find(supplierList, { id: selectedRowKeys[0] })
        chooseBZsupplierFn(selectData);
        toggleStore.setToggle(SHOW_ChooseSupplierPub_MODEL)
    };
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        const { chooseBZsupplierFn ,supplierList } = this.props;
        this.setState({ selectedRowKeys });
    
    };
    async searchSupplierInfo(name) {
        /* let ret = await supplierAction.searchSupplierInfo(name);
        this.setState({
            supplierList: ret
        }) */
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ChooseSupplierPub_MODEL)
    };
     componentDidMount() {
        const { supplierList } = this.props;
        // this.setState({
        //     supplierList: supplierList
        // })
    }
    render() {
        const { toggleStore,pagination,supplierList } = this.props;
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: 'radio'
        };
        return (
            <div>
                <Icon style={{ cursor: 'pointer' }} onClick={() => toggleStore.setToggle(SHOW_ChooseSupplierPub_MODEL)} type="plus" />
                <Modal
                    title="选择供应商"
                    visible={toggleStore.toggles.get(SHOW_ChooseSupplierPub_MODEL)}
                    width={800}
                    centered
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Card extra={<Search placeholder="搜索" onSearch={value => this.searchSupplierInfo(value)} enterButton />}>
                        <Table size='middle' loading={loading} bordered={true} rowKey={(text) => text.id} rowSelection={rowSelection} columns={columns} pagination={{...pagination}} dataSource={supplierList} />
                    </Card>
                </Modal>
            </div>
        );
    }
}
ChooseSupplier.propTypes = {
    pagination:oneOfType([object,bool]),   // 分页配置
    supplierList:array, // 供应商列表
    chooseBZsupplierFn:func // 已选择的供应商
}
export default Form.create({ name: 'ChooseSupplier' })(ChooseSupplier);