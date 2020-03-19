import React, { Component } from 'react';
import { Modal, Button, Card, Form, Row, Col, Input, message, Table } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_NewGYS_MODEL } from "../../../../../../constants/toggleTypes"
import _ from "lodash";
import { supplierDirectory } from "../../../../../../actions"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
@inject('toggleStore', 'directoryStore')
@observer
class NewGYS extends React.Component {
    state = {
        pageNum: 1,
        rowNum: 20,
        tableData: {
            list: [],
            recordsTotal: 0
        },
        loading: true,
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NewGYS_MODEL)
    };
    handleSubmit = e => {
        let { selectedRowKeys } = this.state
        toggleStore.setToggle(SHOW_NewGYS_MODEL)
    }
    // 翻页请求
    pageChange = (pageNum, rowNum) => {
        this.setState({
            pageNum,
            rowNum,
            loading: true
        }, () => {
            this.gysinfosStandard()
        })
    }

    // 
    async localDirectories(){
        let {pageNum,rowNum} = this.state
        let res = await supplierDirectory.localDirectories({pageNum,rowNum})
        if(res.code == 200){
            this.setState({
                tableData: {
                    list: res.data.list,
                    recordsTotal: res.data.recordsTotal
                },
            })
        }else{
            this.setState({
                tableData: {
                    list: [],
                    recordsTotal: 0
                },
            })
        }
    }
    loaddata = () => {
        this.localDirectories()
    }
    componentDidMount = () => {
        this.loaddata()
    }
    render() {
        let { tableData, pageNum, rowNum} = this.state
        let { toggleStore } = this.props
        // const rowSelection = {
        //     columnWidth: 30,
        //     selectedRowKeys,
        //     onChange: (selectedRowKeys, selectedRows) => {
        //         this.onSelectChange(selectedRowKeys, selectedRows)
        //     }
        // };
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
                dataIndex: 'name',
                width: 150,
                align: "center",
            },
            {
                title: '企业性质',
                dataIndex: 'property_key',
                width: 200,
                align: "center",
            },
            {
                title: '统一社会信用代码',
                dataIndex: 'number',
                width: 230,
                align: "center",
            },
            {
                title: '产品范围',
                dataIndex: 'product_scope',
                width: 150,
                align: "center"
            },
            {
                title: '产品类别',
                dataIndex: 'product_category',
                width: 100,
                align: "center",
            }
        ];
        return (
            <div>
                <Modal
                    title={<div style={{width:"100%",fontWeight:900,textAlign:"center"}}>新增供应商列表</div>}
                    visible={toggleStore.toggles.get(SHOW_NewGYS_MODEL)}
                    onOk={(e) => { this.handleSubmit(e) }}
                    onCancel={this.handleCancel}
                    width={950}
                >
                    <Table
                        size='middle'
                        loading={loading}
                        // rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''}
                        // bordered={true}
                        // rowKey={(text) => text.id}
                        // rowSelection={rowSelection}
                        // scroll={{ x: 875 }}
                        // columns={columns}
                        // pagination={{
                        //     showTotal: () => `共${tableData.recordsTotal}条`,
                        //     onChange: (page, num) => { this.pageChange(page, num) },
                        //     current: pageNum,
                        //     showQuickJumper: true,
                        //     total: tableData.recordsTotal,
                        //     pageSize: rowNum
                        // }}
                        // dataSource={tableData.list}
                    />
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'newGYS' })(NewGYS);;