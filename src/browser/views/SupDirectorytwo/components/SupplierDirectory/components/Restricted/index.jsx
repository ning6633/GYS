import React, { Component } from 'react';
import { Modal, Button, Card, Form, Row, Col, Input, message, Table } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_Restricted_MODEL } from "../../../../../../constants/toggleTypes"
import _ from "lodash";
import { supplierDirectory } from "../../../../../../actions"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
@inject('toggleStore', 'directoryStore')
@observer
class Restricted extends React.Component {
    state = {
        pageNum: 1,
        rowNum: 10,
        tableData: {
            list: [],
            recordsTotal: 0
        },
        loading: true,
        selectedRowKeys: [],
        selectedRows: []
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_Restricted_MODEL)
    };
    handleSubmit = e => {
        let { selectedRowKeys } = this.state
        let { toggleStore, restrictgys } = this.props
        this.props.form.validateFields(async(err, values) => {
            if (!err) {
                restrictgys({ orgids: selectedRowKeys, scope: values.scope })
                toggleStore.setToggle(SHOW_Restricted_MODEL)
            }
        });
    }

    // 复选框选择
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        })
    }


    //  获取该角色下的限用单位
    async getaAllSubOrgdepartment(pageNum = 1, rowNum = 15) {
        supplierDirectory.getaAllSubOrgdepartment().then(res => {
            if (res.code == 200) {
                let _arr = []
                this.jiexi(res.data, _arr)
                this.setState({
                    tableData: {
                        list: _arr,
                        recordsTotal: _arr.length
                    },
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

    loaddata = () => {
        this.getaAllSubOrgdepartment()
    }
    componentDidMount = () => {
        this.loaddata()
    }
    render() {
        let { tableData, rowNum, selectedRowKeys, selectedRows } = this.state
        let { toggleStore } = this.props
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 22 },
        };
        const rowSelection = {
            columnWidth: 30,
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.onSelectChange(selectedRowKeys, selectedRows)
            }
        };
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '单位名称',
                dataIndex: 'name',
                width: 150,
                align: "center",
            },
            {
                title: '统一社会信用代码',
                dataIndex: 'number',
                width: 230,
                align: "center",
            }
        ];
        return (
            <div>
                <Form>
                    <Modal
                        title={<div style={{width:"100%",fontWeight:900,textAlign:"center"}}>限用</div>}
                        visible={toggleStore.toggles.get(SHOW_Restricted_MODEL)}
                        onOk={(e) => { this.handleSubmit(e) }}
                        onCancel={this.handleCancel}
                        width={950}
                    >
                        <Form.Item {...formItemLayout} label={'限用范围'}>
                            {getFieldDecorator(`scope`, {
                                rules: [
                                    {
                                        required: true,
                                        message: '限用范围',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label={'限用单位'} required={true} >
                            <Table
                                size='middle'
                                // loading={loading}
                                // rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''}
                                bordered={true}
                                rowKey={(text) => text.id}
                                rowSelection={rowSelection}
                                // scroll={{ x: 875 }}
                                columns={columns}
                                pagination={{
                                    showTotal: () => `共${tableData.recordsTotal}条`,
                                    // onChange: (page, num) => { this.pageChange(page, num) },
                                    // current: pageNum,
                                    showQuickJumper: true,
                                    total: tableData.recordsTotal,
                                    pageSize: rowNum
                                }}
                                dataSource={tableData.list}
                            />
                        </Form.Item>
                    </Modal>
                </Form>

            </div>
        );
    }
}

export default Form.create({ name: 'restricted' })(Restricted);;