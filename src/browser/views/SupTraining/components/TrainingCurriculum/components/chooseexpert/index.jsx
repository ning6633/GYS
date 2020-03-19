import React, { Component, Fragment } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, DatePicker, Icon, Button, message, Tooltip  } from 'antd';
import { observer, inject, } from 'mobx-react';
import { supplierTrain } from '../../../../../../actions'
import { SHOW_addExpert_MODEL } from '../../../../../../constants/toggleTypes'
import _ from "lodash";



const { Search } = Input
@inject('toggleStore', 'trainStore')
@observer
class ChooseExpert extends React.Component {
    state = {
        pageNum: 1,
        rowNum: 10,
        loading: true,
        suplier: {
            listZzpjSpecialistVO: [],
            recordsTotal: 0
        },
        selectedRowKeys: [],
        selectedRows: [],
        username: ''
    }
    handleCancel = () => {
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_addExpert_MODEL)
    }
    handleSubmit = () => {
        let { chooseExpert, toggleStore } = this.props
        let { selectedRows } = this.state
        chooseExpert(selectedRows)
        toggleStore.setToggle(SHOW_addExpert_MODEL)
    }
    onSearchValue=(e)=>{
        this.setState({
            username:e
        },()=>{
            this.loaddata()
        })
    }
    async loaddata() {
        let { pageNum, rowNum, username } = this.state
        let options = {
            pageNum,
            rowNum,
            username,
            // usertype:'103'
        }
        let res = await supplierTrain.getSpecialist(options)
        
        if (res.code == 200) {
            this.setState({
                suplier: res.data,
                loading: false
            })
        }
    }
    pageChange = (pageNum, rowNum) => {
        this.setState({
            pageNum,
            rowNum,
            loading: true
        }, () => {
            this.loaddata()
        })
    }
    onSelect = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys, selectedRows
        })
    }
    componentDidMount = () => {
        console.log("111")
        this.loaddata()
    }

    render = () => {
        let { suplier, pageNum, loading, selectedRowKeys } = this.state
        const rowSelection = {
            columnWidth: 30,
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.onSelect(selectedRowKeys, selectedRows)
            },
        };
        const SearchValue=()=>{
            return (
                <Search placeholder="请输入搜索内容" onSearch={(e) => { this.onSearchValue(e) }} enterButton />
            )
        }
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 100,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '专家名称',
                dataIndex: 'name',
                width: 300,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '专家领域',
                dataIndex: 'field',
                width: 230,
                align: "center",
            },
            {
                title: '专家所在单位',
                dataIndex: 'source',
                width: 150,
                align: "center",
            },
            {
                title: '联系方式',
                dataIndex: 'tel',
                width: 150,
                align: "center",
            }
        ];

        return (

            <Modal
                title="选择专家"
                visible={true}
                onOk={(e) => { this.handleSubmit(e) }}
                onCancel={this.handleCancel}
                width={900}
            >
                <Card
                extra={<SearchValue />}
                >
                    <Table
                        size='middle'
                        loading={loading}
                        rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''}
                        bordered={true}
                        rowKey={(text) => text.id}
                        rowSelection={rowSelection}
                        scroll={{ x: 700 }}
                        columns={columns}
                        pagination={{
                            showTotal: () => `共${suplier.recordsTotal}条`,
                            onChange: (page, num) => { this.pageChange(page, num) },
                            current: pageNum,
                            showQuickJumper: {
                                goButton: <Button type="link" size={'small'}>
                                    跳转
                            </Button>
                            },
                            total: suplier.recordsTotal,
                            pageSize: 10
                        }}
                        dataSource={suplier.listZzpjSpecialistVO}
                    >
                    </Table>
                </Card>
            </Modal>
        )
    }


}

export default Form.create({ name: 'ChooseExpert' })(ChooseExpert);;