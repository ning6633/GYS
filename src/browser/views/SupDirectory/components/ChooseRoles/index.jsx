import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import _ from "lodash";
import { SHOW_ChooseRoles_MODEL } from "../../../../constants/toggleTypes"
import { Modal, Form, Icon, Table, Input, Button, Tooltip, Card, Upload, Select, message, Cascader } from 'antd';
import { supplierAction, supplierDirectory } from "../../../../actions"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Search } = Input;
const { Option } = Select;
const ButtonGroup = Button.Group;


const options = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
            {
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [
                    {
                        value: 'xihu',
                        label: 'West Lake',
                        code: 752100,
                    },
                ],
            },
        ],
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
            {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                    {
                        value: 'zhonghuamen',
                        label: 'Zhong Hua Men',
                        code: 453400,
                    },
                ],
            },
        ],
    },
];
const columns = [
    {
        title: '序号',
        dataIndex: 'key',
        width: 60,
        align: "center",
        render: (text, index, key) => key + 1
    },
    {
        title: '组织名称',
        dataIndex: 'name',
        width: 250,
        align: "center",
        render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 15)}</span></Tooltip>
        // render: (text, record) => {
        // return (
        //     <Cascader
        //         options={options}
        //         defaultValue={['zhejiang', 'hangzhou', 'xihu']}
        //         // displayRender={displayRender}
        //         style={{ width: '100%' }}
        //     />
        // )
        // }
    },
    {
        title: '层级',
        dataIndex: 'layer',
        width: 230,
        align: "center",
    },

];
@inject('toggleStore')
@observer
class ChooseRoles extends React.Component {
    state = {
        supplierList: [],
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        nextOrgList: []
    };
    handleOk = e => {
        const { toggleStore, authortyDirect } = this.props;
        const { selectedRowKeys, nextOrgList } = this.state;
        // selectedSupplier(this.state.selectedRowKeys);
        let pushArr = []
        selectedRowKeys.forEach(item => {
            let OrgObject = nextOrgList.find(element => {
                return element.id == item
            })
            if (OrgObject) {
                pushArr.push({
                    departmentname: OrgObject.name,
                    id: OrgObject.id,
                    parentid: OrgObject.pid
                })
            }
        })
        authortyDirect(pushArr)

    };
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ selectedRowKeys });

    };
    async searchSupplierInfo(name) {
        let ret = await supplierAction.searchSupplierInfo(name);
        this.setState({
            supplierList: ret
        })
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ChooseRoles_MODEL)
    };
    async componentDidMount() {
        // console.log(this.createTree(nextOrgList.listOrgDeparment))
        this.loaddata()

    }
    //分页查询
    async pageChange(page, num) {
        this.loaddata(page, num)
    }
    async loaddata(pageNum = 1, rowNum = 15) {
        this.setState({ loading: true });
        let params = {
            pageNum,
            rowNum
        }
        supplierDirectory.getaAllSubOrgdepartment(params).then(res => {
            if (res.code == 200) {
                let _arr = []
                this.jiexi(res.data, _arr)
                _arr.sort()
                this.setState({
                    nextOrgList: _arr,
                    loading: false
                })

            }
        })

    }

    jiexi = (data, _arr) => {
        data.forEach((item, index) => {
            let _tmp = JSON.parse(JSON.stringify(item))
            _tmp.children = null
            _arr.push(_tmp)
            if (item.children == null) {
                return;
            }
            this.jiexi(item.children, _arr)
        })
    }
    render() {
        const { toggleStore } = this.props;
        const { loading, selectedRowKeys, nextOrgList } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };


        let TableFilterBtn = () => (
            <div className="table-fileter">
                <Search placeholder="搜索组织" onSearch={value => { console.log(value) }} enterButton />
            </div>
        )
        return (
            <div>
                <Modal
                    title="选择授权组织"
                    visible={toggleStore.toggles.get(SHOW_ChooseRoles_MODEL)}
                    width={1000}
                    centered
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Card  >
                        {/* <Table size='middle' loading={loading} bordered={true} rowKey={(text) => text.id} rowSelection={rowSelection} columns={columns} pagination={false} dataSource={this.state.supplierList} /> */}
                        <Table size='middle' loading={loading} rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''} bordered={true} rowKey={(text) => text.id} rowSelection={rowSelection} columns={columns} pagination={{ onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: true, total: nextOrgList.length, pageSize: 10 }} dataSource={nextOrgList} />
                    </Card>
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'ChooseRoles' })(ChooseRoles);