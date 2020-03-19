import React, { Component } from 'react';
import { Modal, Button, Card, Form, Col, Input, message, Table } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_Initialization_MODEL } from "../../../../../../constants/toggleTypes"
import _ from "lodash";
import { supplierDirectory } from "../../../../../../actions"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性


const {Search} = Input
@inject('toggleStore', 'directoryStore')
@observer
class Initialization extends React.Component {
    state = {
        pageNum: 1,
        rowNum: 20,
        tableData: {
            list: [],
            recordsTotal: 0
        },
        loading: true,
        selectedRowKeys: [],
        selectedRows: [],
        keyword:''
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_Initialization_MODEL)
    };
    handleSubmit = e => {
        let { selectedRowKeys } = this.state
        let { addInitcategory, toggleStore } = this.props
        addInitcategory(selectedRowKeys)
        toggleStore.setToggle(SHOW_Initialization_MODEL)
    }
    // 选择添加数据
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        })
    }
    // 翻页请求
    pageChange = (pageNum, rowNum) => {
        this.setState({
            pageNum,
            rowNum:20,
            loading: true
        }, () => {
            this.gysinfosStandard()
        })
    }

    // 根据产品分类获取标准库供应商
    async gysinfosStandard() {
        let { pageNum, rowNum ,keyword} = this.state
        let { producttype, status } = this.props
        // 从父元素获取的产品类别查询供应商
        console.log(status)
        switch (status) {
            case 0:
                let res = await supplierDirectory.getBZkugGysinfos({ pageNum, rowNum,gysName:keyword })
                if (res.code == 200) {
                    this.setState({
                        tableData: res.data,
                        loading: false
                    })
                };
                break;
            case 1:
                let ret = await supplierDirectory.getAuthorizedDirectories({ pageNum, rowNum,keyword })
                if (ret.code == 200) {
                    this.setState({
                        tableData: ret.data,
                        loading: false
                    })
                };
                break;
            default:
                break;
        }
    }

    // 搜索供应商
    searchCompanyInfo=(value)=>{
        console.log(value)
        this.setState({
            keyword:value,
            pageNum:1
        },()=>{
            this.gysinfosStandard()
        })
    }
    loaddata = () => {
        this.gysinfosStandard()
    }
    componentDidMount = () => {
        this.loaddata()
    }
    render() {
        let { tableData, pageNum, rowNum, selectedRowKeys, keyword } = this.state
        let { toggleStore ,status} = this.props
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
                dataIndex: 'name',
                width: 150,
                sorter: (a, b) => (a.name.charCodeAt(0) - b.name.charCodeAt(0)),
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
                    title={<div style={{width:"100%",fontWeight:900,textAlign:"center"}}>{status == 1 ? <span>从授权名录中添加</span>:<span>初始化</span>}</div>}
                    visible={toggleStore.toggles.get(SHOW_Initialization_MODEL)}
                    onOk={(e) => { this.handleSubmit(e) }}
                    onCancel={this.handleCancel}
                    width={950}
                >
                   <Card extra={<Search placeholder="搜索供应商" defaultValue={keyword} onSearch={value => this.searchCompanyInfo(value)} enterButton />}>
                   <Table
                        size='middle'
                        // loading={loading}
                        rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''}
                        bordered={true}
                        rowKey={(text) => text.id}
                        rowSelection={rowSelection}
                        scroll={{ x: 875 }}
                        columns={columns}
                        pagination={{
                            showTotal: () => `共${tableData.recordsTotal}条`,
                            onChange: (page, num) => { this.pageChange(page, num) },
                            current: pageNum,
                            showQuickJumper: true,
                            total: tableData.recordsTotal,
                            pageSize: rowNum,
                        }}
                        dataSource={tableData.list}
                    />
                   </Card>
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'initialization' })(Initialization);;