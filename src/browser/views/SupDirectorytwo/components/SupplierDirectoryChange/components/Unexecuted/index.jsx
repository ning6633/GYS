import React, { Component } from 'react';
import moment from 'moment';
import { Modal, Button, Card, Form, Row, Col, Input, message, Table } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_Unexecuted_MODEL } from "../../../../../../constants/toggleTypes"
import _ from "lodash";
import { supplierDirectory } from "../../../../../../actions"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
@inject('toggleStore', 'directoryStore')
@observer
class Unexecuted extends React.Component {
    state = {
        pageNum: 1,
        rowNum: 10,
        tableData: {
            list: [],
            recordsTotal: 0
        },
        loading: true,
        NowData: new Date().toLocaleDateString().replace(/(\/)+/ig, "-")
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_Unexecuted_MODEL)
    };
    handleSubmit = e => {
        let { addInitcategory, toggleStore } = this.props
        toggleStore.setToggle(SHOW_Unexecuted_MODEL)
    }
    // 选择添加数据
    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, selectedRows)
        this.setState({
            selectedRowKeys,
            selectedRows
        })
    }
    // 翻页请求
    pageChange = (pageNum, rowNum) => {
        this.setState({
            pageNum,
            rowNum,
            loading: true
        }, () => {
            this.getgysupdmessagedetail()
        })
    }

    // 
    async getgysupdmessagedetail(){
        let {DIRECTORYID,GYSID} = this.props.info
        let {orgId} = this.props
        let {pageNum,rowNum} = this.state
        let res = await supplierDirectory.getgysupdmessagedetail({directoryId:DIRECTORYID,gysId:GYSID,orgId,pageNum,rowNum})
        if(res.code == 200){
            this.setState({
                tableData: {
                    list: res.data.list,
                    recordsTotal: res.data.recordsTotal
                },
            })
        }
    }
    
    loaddata = () => {
        this.getgysupdmessagedetail()
    }
    componentDidMount = () => {
        this.loaddata()
    }
    render() {
        let { tableData, pageNum, rowNum, selectedRowKeys, selectedRows } = this.state
        let { toggleStore } = this.props
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
                title: '供应商名称',
                dataIndex: 'gysname',
                width: 250,
                align: "center",
            },
            {
                title: '统一社会信用代码',
                dataIndex: 'gysid',
                width: 200,
                align: "center",
            },
            {
                title: '变更执行状态',
                dataIndex: 'iszx',
                width: 200,
                align: "center",
            },
            {
                title: '变更执行时间',
                dataIndex: 'updatedate',
                width: 230,
                align: "center",
            },
            {
                title: '是否已读',
                dataIndex: 'isread',
                width: 150,
                align: "center"
            }
        ];
        return (
            <div>
                <Modal
                    title={"未执行单位"}
                    visible={toggleStore.toggles.get(SHOW_Unexecuted_MODEL)}
                    onOk={(e) => { this.handleSubmit(e) }}
                    onCancel={this.handleCancel}
                    width={1100}
                >
                    <Table
                        size='middle'
                        // loading={loading}
                        rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''}
                        bordered={true}
                        rowKey={(text) => text.id}
                        // rowSelection={rowSelection}
                        scroll={{ x: 1020 }}
                        columns={columns}
                        pagination={{
                            showTotal: () => `共${tableData.recordsTotal}条`,
                            onChange: (page, num) => { this.pageChange(page, num) },
                            current: pageNum,
                            showQuickJumper: true,
                            total: tableData.recordsTotal,
                            pageSize: rowNum
                        }}
                        dataSource={tableData.list}
                    />
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'unexecuted' })(Unexecuted);;