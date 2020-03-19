import React, { Component } from 'react';
import { Modal, Button, Card, Form, Row, Col, Input, message, Table } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_Authorization_MODEL } from "../../../../../../constants/toggleTypes"
import _ from "lodash";
import { supplierDirectory } from "../../../../../../actions"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
@inject('toggleStore', 'directoryStore')
@observer
class Authorization extends React.Component {
    state = {
        pageNum: 1,
        rowNum: 20,
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
        toggleStore.setToggle(SHOW_Authorization_MODEL)
    };
    handleSubmit = e => {
        let {selectedRowKeys,selectedRows} = this.state
        let {toggleStore,addAuthorizationInfo,selectNode} = this.props
        let _arr = []
        if(selectNode[0] == "集团"){
            if(selectedRows.length > 0){
                selectedRows.forEach((item)=>{
                    let _tmp = {
                        departmentname:item.name,
                        id:item.id,
                        parentid:item.pid
                    }
                    _arr.push(_tmp)
                })
            }
        }else if(selectNode[0] == "院"){
            if(selectedRows.length > 0){
                selectedRows.forEach((item)=>{
                    let _tmp = {
                        departmentname:item.name,
                        id:item.id,
                        parentid:item.parent
                    }
                    _arr.push(_tmp)
                })
            }
        }
        addAuthorizationInfo(_arr)
        toggleStore.setToggle(SHOW_Authorization_MODEL)
    }
    // 选择添加数据
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        })
    }
    // 翻页请求 数据接口未支持翻页请求
    // pageChange = (pageNum, rowNum) => {
    //     this.setState({
    //         pageNum,
    //         rowNum,
    //         loading: true
    //     }, () => {
    //         this.gysinfosStandard()
    //     })
    // }

    // 集团获取授权的企业
    getaAllSubOrgdepartmentnew(pageNum = 1, rowNum = 15) {
        supplierDirectory.getaAllSubOrgdepartmentnew().then(res => {
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

    
    // 院获取授权的企业
    async getSubOrgdepartmentnew(){
        let {pageNum,rowNum} = this.state
        let ret = await supplierDirectory.getSubOrgdepartmentnew({pageNum,rowNum})
        if(ret.code == 200){
            this.setState({
                tableData: {
                    list: ret.data.list,
                    recordsTotal: ret.recordsTotal
                },
            })
        }
    }


    loaddata = () => {
        let {rowNum} = this.state
        let {selectNode} = this.props
        if(selectNode[0] == "集团"){
            console.log("jituan")
            this.getaAllSubOrgdepartmentnew()
        }else if(selectNode[0] == "院"){
            console.log("yuan")
            this.getSubOrgdepartmentnew({pageNum:1,rowNum})
        }
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
            },
            {
                title: '授权角色',
                dataIndex: 'product_scope',
                width: 150,
                align: "center"
            }
        ];
        return (
            <div>
                <Modal
                    title={<div style={{width:"100%",fontWeight:900,textAlign:"center"}}>授权</div>}
                    visible={toggleStore.toggles.get(SHOW_Authorization_MODEL)}
                    onOk={(e) => { this.handleSubmit(e) }}
                    onCancel={this.handleCancel}
                    width={950}
                >
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
                            // showTotal: () => `共${tableData.recordsTotal}条`,
                            // onChange: (page, num) => { this.pageChange(page, num) },
                            // current: pageNum,
                            // showQuickJumper: true,
                            // total: tableData.recordsTotal,
                            // pageSize: rowNum
                        }}
                        dataSource={tableData.list}
                    />
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'authorization' })(Authorization);;