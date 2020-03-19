
import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, DatePicker, Icon, Button, message, Tooltip, Checkbox, Radio, Descriptions } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_ListSelection_MODEL } from "../../../../../../constants/toggleTypes"
import { supplierTrain } from '../../../../../../actions'
import _ from "lodash";
// 公用选择供应商组件

const { TabPane } = Tabs;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class ListSelection extends React.Component {
    state={
        selectedRowKeys:[],
        selectedRows:[],
        pageNum:1,
        rowNum:10,
        list:[],
        loading:true
    }

    handleCancel = () => {
        //点击取消，隐藏model框
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_ListSelection_MODEL)
    }
    handleSubmit = () => {
        //点击确定出发的事件
        let {getChooseList} = this.props
        let {selectedRows} = this.state
        getChooseList(selectedRows)
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_ListSelection_MODEL)
    }
    onSelectChange=(selectedRowKeys,selectedRows)=>{
        this.setState({
            selectedRowKeys,
            selectedRows
        })
    }
    async trainApplyNewUsers(gysId){
        let res = await supplierTrain.trainApplyNewUsers(gysId)
        if(res.code == 200 ){
            this.setState({
                list:res.data,
                loading:false
            })
        }
    }
    async loaddata(){
        let res = await supplierTrain.comfgysInfo()
        if(res.code == 200 ){
            this.trainApplyNewUsers(res.data.gysId)
        }
    }
    componentDidMount=()=>{
        this.loaddata()
    }
    render = () => {
        let { toggleStore } = this.props
        let { selectedRowKeys,selectedRows,pageNum,rowNum ,list,loading} = this.state
        const rowSelection = {
            columnWidth: 30,
            selectedRowKeys,
            onChange: this.onSelectChange,
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
                title: '姓名',
                dataIndex: 'username',
                width: 100,
                align: "center",
            },
            {
                title: '性别',
                dataIndex: 'gender',
                width: 100,
                align: "center",
            },
            {
                title: '所属部门',
                dataIndex: 'userorg',
                width: 200,
                align: "center",
            },
            {
                title: '现任职务/职称',
                dataIndex: 'title',
                width: 100,
                align: "center",
            },
            {
                title: '联系方式',
                dataIndex: 'tel',
                width: 100,
                align: "center",
            },
            {
                title: '备注',
                dataIndex: 'otherinfo',
                width: 100,
                align: "center",
            },

        ]
        return (
            <Modal
                title={<div style={{ width: "100%", textAlign: "center", fontWeight: 900 }}>人员列表</div>}
                visible={toggleStore.toggles.get(SHOW_ListSelection_MODEL)}
                onOk={(e) => { this.handleSubmit(e) }}
                onCancel={this.handleCancel}
                width={900}
            >

                <Table
                    size='middle'
                    loading={loading}
                    bordered={true}
                    rowKey={(text) => text.id}
                    rowSelection={rowSelection} 
                    scroll={{ x: 845 }}
                    columns={columns}
                    // pagination={{
                    //     showTotal: () => `共${this.state.trainPlanList.recordsTotal}条`, current: curPage, onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: {
                    //         goButton: <Button type="link" size={'small'}>
                    //             跳转
                    //     </Button>
                    //     }, total: this.state.trainPlanList.recordsTotal, pageSize: 20
                    // }} 
                    dataSource={list}
                />


            </Modal>
        )
    }


}

export default Form.create({ name: "listSelection" })(ListSelection);
