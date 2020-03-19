import React, { Component, Fragment } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Row, Input, Tooltip, message, Col, Form, Select, Popconfirm } from 'antd';
import Layout from "../../../../components/Layouts";
import { observer, inject, } from 'mobx-react';
import { specialExposure } from "../../../../actions"
import moment from "moment";
import _ from "lodash";
import { SHOW_Exposure_MODEL, SHOW_AddList_MODEL } from "../../../../constants/toggleTypes";
import SupAdd from '../AddList'
const { Option } = Select;
const { Search } = Input

@inject('toggleStore', 'supplierStore')
@observer
class Supcommunication extends Component {
    state = {
        pageNum: 1,
        rowNum: 20,
        supplierList: {},
        loading: false,
        statuss: 1,
        selectedRowKeys: [],
        selectedRows: [],
        title: '',
        address: ''
    }
    async loaddata({ pageNum = 1, rowNum = 20, title = '', address = '' }) {
        this.setState({ loading: true })
        let res = await specialExposure.getComminication({ pageNum, rowNum, title, address })
        // console.log(res)
        if (res.code == 200) {
            this.setState({
                supplierList: res.data,
                selectedRowKeys: [],
                loading: false
            })
            if (this.state.supplierList.length > 0) {
                this.setState({
                    supplierList: [],
                    selectedRowKeys: [],
                    loading: false
                }

                )
            }
        }
    }
    pageChange(pageNum, rowNum) {
        this.setState({ pageNum, rowNum, loading: false })
        this.loaddata({ pageNum, rowNum })
    }
    addList = () => {
        this.setState({ statuss: 1 })
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_AddList_MODEL);
    }
    showInfo = (record) => {
        let _arr = []
        _arr.push(record)
        this.setState({ statuss: 12, selectedRows: _arr })
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_AddList_MODEL);
    }
    async goDown(data) {
        data.status = 0
        let res = await specialExposure.cancleCommunication(data.id)
        if (res.code == 200) {
            this.loaddata({})
        }
    }
    async  delete() {
        let { selectedRowKeys, selectedRows } = this.state
        let res = await specialExposure.delComminicationById(selectedRowKeys)
        if (res.code == 200) {
            this.loaddata({})
        } else {
            message.error('该记录已提交，无法删除！')
        }
    }
    upload = () => {
        this.setState({ statuss: 0 })
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_AddList_MODEL);
    }
    async callBack(data) {
        let res = await specialExposure.publishCommunication(data.id)
        if (res.code == 200) {
            this.loaddata({})
        }
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows })
    }
    handleSubmit = () => {
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.loaddata({ title: values.title, address: values.address })
            }
        })
    }
    componentDidMount = () => {
        let { pageNum, rowNum } = this.state
        this.loaddata({ pageNum, rowNum })
    }
    render() {

        const Communication = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: 'center',
                fixed: 'left',
                render: (text, index, key) => key + 1
            },
            {
                title: '主题',
                dataIndex: 'title',
                align: 'center',
                render: (text, redord) => {
                    return <Tooltip title={text}>
                        <span
                            onClick={() => { this.showInfo(redord) }}
                            style={{ cursor: "pointer", 'color': '#3383da' }}>
                            {text && text.substr(0, 10)}
                        </span>
                    </Tooltip>
                },

            },
            {
                title: '地点',
                dataIndex: 'address',
                align: 'center',
                width: 200,
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 100,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
            },

            {
                title: '开始时间',
                dataIndex: 'start_TIME',
                width: 200,
                align: 'center',
                sorter: (a, b) => (moment(a.start_TIME).valueOf() - moment(b.start_TIME).valueOf()),

                render: (text) => {
                    return (
                        <span>
                            {text.substr(0, 10)}
                        </span>
                    )
                }
            },
            {
                title: '结束时间',
                dataIndex: 'end_TIME',
                width: 200,
                align: 'center',
                sorter: (a, b) => {
                    return moment(a.end_TIME).valueOf() - moment(b.end_TIME).valueOf()
                },
                render: (text) => {
                    return (
                        <span>
                            {text.substr(0, 10)}
                        </span>
                    )
                }
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                align: 'center',
                render: (text) => {
                    if (text == 0) {
                        return (
                            <span>未提交</span>
                        )
                    }
                    if (text == 1) {
                        return (
                            <span>已提交</span>
                        )
                    }
                }
            },
            {
                title: '操作',
                dataIndex: '操作',
                width: 200,
                align: 'center',
                fixed: 'right',
                render: (text, record) => {
                    return (
                        <Fragment>
                            {record.status == 0 ? <Button size='small' disabled={record.status == 1} type='primary' onClick={() => { this.callBack(record) }} >提交</Button> :
                                <Button size='small' disabled={record.status == 0} type='primary' onClick={() => { this.goDown(record) }}>撤回</Button>
                            }
                        </Fragment>
                    )
                }
            },

        ]
        const CardTitle = () => {
            let { selectedRowKeys } = this.state
            return (
                <Fragment>
                    <Button type='primary' onClick={() => { this.addList() }} style={{ marginRight: 10 }}>新建</Button>
                    <Popconfirm placement="topLeft" disabled={selectedRowKeys.length == 0} title='确定要删除吗？' onConfirm={() => { this.delete() }} okText="是" cancelText="否">
                        <Button type='danger' disabled={selectedRowKeys.length == 0} style={{ marginRight: 10 }}>删除</Button>
                    </Popconfirm>
                    <Button type='primary' disabled={selectedRowKeys.length == 0 || selectedRowKeys.length > 1} onClick={() => { this.upload() }} style={{ marginRight: 10 }}>修改</Button>
                </Fragment>
            )
        }
        let { supplierList, selectedRowKeys, loading, rowNum, statusData, info, selectedRows, statuss } = this.state
        const rowSelection = {
            columnWidth: 30,
            type: 'check',
            onChange: this.onSelectChange,
            selectedRowKeys,
        };
        let ExtraSearch = () => {
            let { getFieldDecorator } = this.props.form
            return (
                <Fragment>
                    <Form layout="inline" >
                        <Form.Item label='主题' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            {getFieldDecorator('tittle', {
                                rules: [
                                    {
                                        required: false,
                                        message: '主题',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label='地址' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            {getFieldDecorator('address', {
                                rules: [
                                    {
                                        required: false,
                                        message: '地址',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>

                        <Button type='primary' style={{ marginTop: 3 }} onClick={this.handleSubmit}>搜索</Button>
                        {/* <Search placeholder="请输入内容" onSearch={(e)=>{this.onSearch(e)}} enterButton></Search> */}
                    </Form>
                </Fragment>
            )
        }
        let { toggleStore } = this.props
        return (
            <Layout title={"供应商关系管理"}>
                {
                    toggleStore.toggles.get(SHOW_AddList_MODEL) && <SupAdd loaddata={() => { this.loaddata({}) }} statuss={statuss} uploadInfo={selectedRows[0]}></SupAdd>
                }
                <Card title={<CardTitle></CardTitle>} extra={<ExtraSearch></ExtraSearch>}>
                    <Table
                        size='middle'
                        className={'gys_table_height'}
                        columns={Communication}
                        width={1110}
                        scroll={{ x: 1110 }}
                        dataSource={supplierList.list}
                        rowKey={(text) => text.id}
                        rowSelection={rowSelection}
                        bordered={true}
                        loading={loading}
                        pagination={{
                            showTotal: () => `共${supplierList.recordsTotal}条`,
                            // current: pageNum, 
                            onChange: (page, num) => {
                                this.pageChange(page, num)
                            },
                            showQuickJumper: {
                                goButton: <Button type="link" size={'small'}>
                                    跳转
                        </Button>
                            },
                            total: supplierList.recordsTotal,
                            pageSize: 20
                        }}
                    />
                </Card>
            </Layout>
        )
    }
}

export default Form.create({ name: 'Supcommunication' })(Supcommunication);