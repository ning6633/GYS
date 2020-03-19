import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { number, bool, string, array, object,func,oneOfType} from 'prop-types';
import _ from "lodash";
import { SHOW_ChooseSpecialist_MODEL } from "../../constants/toggleTypes"
import { Modal, Form, Icon, Table, Input, Button, Tooltip, Card } from 'antd';
import { supplierAction } from "../../actions"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Search } = Input;

const columns = [
    {
        title: '序号',
        dataIndex: 'key',
        width: 60,
        align: "center",
        render: (text, index, key) => key + 1
    },
    {
        title: '专家名称',
        dataIndex: 'name',
        width: 100,
        align: "center",
        render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
    },
    {
        title: '专家职称',
        dataIndex: 'title',
        width: 120,
        align: "center",
    },
    {
        title: '专家类型',
        dataIndex: 'typename',
        width: 100,
        align: "center",
    },
    {
        title: '专业领域',
        dataIndex: 'field',
        width: 100,
        align: "center",
    },
    {
        title: '专家来源',
        dataIndex: 'source',
        width: 100,
        align: "center",
    },
];

@inject('toggleStore')
@observer
class ChooseSpecialist extends React.Component {
    state = {
        specialist: [],
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
    };
    handleOk = e => {
        const { toggleStore,chooseSpecialistFn ,specialist} = this.props;
        const { selectedRowKeys } = this.state
        let selectData = _.find(specialist, { id: selectedRowKeys[0] })
        chooseSpecialistFn(selectData);
        toggleStore.setToggle(SHOW_ChooseSpecialist_MODEL)
    };
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ selectedRowKeys });
    
    };
    async searchSupplierInfo(name) {
        /* let ret = await supplierAction.searchSupplierInfo(name);
        this.setState({
            specialist: ret
        }) */
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ChooseSpecialist_MODEL)
    };
     componentDidMount() {
        const { specialist } = this.props;
        // this.setState({
        //     specialist: specialist
        // })
    }
    render() {
        const { toggleStore,pagination,specialist,title } = this.props;
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: 'radio'
        };
        return (
            <div>
                <Icon style={{ cursor: 'pointer' }} onClick={() => toggleStore.setToggle(SHOW_ChooseSpecialist_MODEL)} type="plus" />
                <Modal
                    title={title?title:"选择评价专家"}
                    visible={toggleStore.toggles.get(SHOW_ChooseSpecialist_MODEL)}
                    width={800}
                    centered
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Card extra={<Search placeholder="搜索" onSearch={value => this.searchSupplierInfo(value)} enterButton />}>
                        <Table size='middle' loading={loading} bordered={true} rowKey={(text) => text.id} rowSelection={rowSelection} columns={columns} pagination={{...pagination}} dataSource={specialist} />
                    </Card>
                </Modal>
            </div>
        );
    }
}
ChooseSpecialist.propTypes = {
    pagination:oneOfType([object,bool]),   // 分页配置
    specialist:array, // 专家列表
   
}
export default Form.create({ name: 'ChooseSpecialist' })(ChooseSpecialist);