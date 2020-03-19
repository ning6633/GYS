import React, { Component, Fragment } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Row, Input, Tooltip, message, Col, Form, Select, Popconfirm } from 'antd';
import Layout from "../../../../components/Layouts";
import { observer, inject, } from 'mobx-react';
import { specialExposure } from "../../../../actions"
import moment from "moment";
import _ from "lodash";
import { SHOW_Exposure_MODEL, SHOW_AddList_MODEL } from "../../../../constants/toggleTypes";
import SupQuery from '../SupQuery/index'
import SupAdd from '../SupAdd/index'
const { Option } = Select;
const { Search } = Input

@inject('toggleStore', 'supplierStore')
@observer
class SupExposurePlatformManagement extends Component {
    state = {
        exposureList: {
            list: [],
            recordsTotal: 0
        },
        selectedRowKeys: [],
        selectedRows: [],
        info: {},
        loading: false,
        pageNum: 1,
        rowNum: 20,
        deleteId: '',
        uploadInfo: {},
        status: '',
        providerName: ''
    }

    showDetails = (data) => {
        this.setState({ info: data })
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_Exposure_MODEL);
    }
    async loaddata({ isManage = true, rowNum = 20, pageNum = 1, providerName = null, isExcellent = '' }) {
        this.setState({ loading: true })
        let res = await specialExposure.getExposure({ isManage, rowNum, pageNum, providerName, isExcellent })
        if (res.code == 200) {
            this.setState({
                exposureList: res.data,
                loading: false,
                selectedRowKeys: []
            })
        }else{
            this.setState({
                exposureList:{
                    list: [],
                    recordsTotal: 0
                } ,
                loading: false,
                selectedRowKeys: []
            })
        }

    }
    pageChange = (page, num) => {
        let { providerName } = this.state
        this.setState({ pageNum: page, rowNum: num, providerName })
    }
    onChange = (selectedRowKeys, selectedRows) => {
        let { providerName } = this.state
        this.setState({
            // deleteId: text[0].id,
            uploadInfo: selectedRows[0],
            selectedRowKeys,
            selectedRows,
            providerName
        })
    }
    search = (e) => {
        let { pageNum, rowNum } = this.state
        this.setState({ providerName: e })
        this.loaddata({ pageNum, rowNum, providerName: e })
    }
    addList = () => {
        this.setState({ status: 100 })
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_AddList_MODEL);
    }
    upload = () => {
        this.setState({ status: 200 })
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_AddList_MODEL);
    }
    async delete() {
        let { selectedRowKeys, pageNum, rowNum } = this.state
        let res = await specialExposure.deletemessage(selectedRowKeys[0])
        if (res.code == 200) {
            message.success(res.message)
            this.setState({
                // deleteId: '',
                selectedRowKeys: []
            })
            this.loaddata({ pageNum, rowNum })
        }
    }
    async changStatus(status, record) {
        let { pageNum, rowNum } = this.state
        let res = await specialExposure.updateAvailable(record.id)
        if (res.code == 200) {
            message.success(res.message)
            this.loaddata({ pageNum, rowNum })
        }
    }
    componentDidMount = () => {

        let { pageNum, rowNum } = this.state
        this.loaddata({ pageNum, rowNum })
    }

    render() {
        const ExposureList = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: 'center',
                fixed: 'left',
                render: (text, index, key) => key + 1
            },
            {
                title: '供应商名称',
                dataIndex: 'name',
                width: 200,
                align: 'center',
                fixed: 'left',
                render: (text, redord) => <Tooltip title={text}><span onClick={this.showDetails.bind(this, redord)} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '曝光性质',
                dataIndex: 'type',
                width: 200,
                align: 'center',
                render: (text) => {
                    if (text == 1) {
                        return (
                            <span>优质供应商</span>
                        )
                    }
                    if (text == 2) {
                        return (
                            <span>劣质供应商</span>
                        )
                    }
                }
            },
            {
                title: '曝光原因',
                dataIndex: 'content',
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
                align: 'center',
            },
            {
                title: '曝光时间',
                dataIndex: 'update_time',
                width: 200,
                align: 'center',
                sorter: (a, b) => (moment(a.updatedate).valueOf() - moment(b.updatedate).valueOf()),
                render: (text) => {
                    return (
                        <span>{text && text.substring(0, text.length - 2)}</span>
                    )
                }
            },
            {
                title: '是否有效',
                dataIndex: 'status',
                width: 100,
                align: 'center',
                render: (text) => {
                    if (text == 0) {
                        return (<span>未确认</span>)
                    }
                    if (text == 10) {
                        return (<span>已确认</span>)
                    }
                }
            },
            {
                title: '操作',
                dataIndex: 'statusV',
                width: 100,
                align: 'center',
                fixed: 'right',
                render: (text, record) => {
                    return (
                        <div>
                            <Popconfirm disabled={record.status == 10} placement="top" title={'您确定要曝光该供应商吗？'} onConfirm={() => { this.changStatus(10, record) }}>

                                {
                                    record.status == 10 ? '' : <Button type='primary' size='small' disabled={record.status == 10} onClick={() => { }}>确认</Button>
                                }
                            </Popconfirm>
                            {/* <Button size='small' disabled = {record.status == 0} onClick={()=>{this.changStatus(0,record)}}>撤销</Button> */}
                        </div>
                    )
                }
            },
        ]
        const CardTitle = () => {
            let { selectedRowKeys } = this.state
            return (
                <Fragment>
                    <Button type='primary' onClick={() => { this.addList() }} style={{ marginRight: 10 }}>新建</Button>
                    <Popconfirm placement="topLeft" disabled={!(selectedRowKeys.length == 1)} title='确定要删除吗？' onConfirm={() => { this.delete() }} okText="是" cancelText="否">
                        <Button type='danger' disabled={!(selectedRowKeys.length == 1)} style={{ marginRight: 10 }}>删除</Button>
                    </Popconfirm>
                    <Button type='primary' disabled={!(selectedRowKeys.length == 1)} onClick={() => { this.upload() }} style={{ marginRight: 10 }}>修改</Button>
                </Fragment>
            )
        }
        const CardSearch = () => {
            return (
                <Fragment>
                    <Search placeholder='请输入查询内容' onSearch={(e) => { this.search(e) }} enterButton />
                </Fragment>
            )
        }
        let { loading, selectedRowKeys, exposureList, info, pageNum, rowNum, uploadInfo, status } = this.state
        let { toggleStore } = this.props
        const rowSelection = {
            columnWidth: 30,
            type: 'radio',
            selectedRowKeys,
            onChange: this.onChange
        };
        return (
            <Layout title={"供应商关系管理"}>
                {
                    toggleStore.toggles.get(SHOW_Exposure_MODEL) && <SupQuery info={info}></SupQuery>
                }
                {
                    toggleStore.toggles.get(SHOW_AddList_MODEL) && <SupAdd status={status} uploadInfo={uploadInfo} loaddata={() => { this.loaddata({}) }} ></SupAdd>
                }

                <Card title={<CardTitle></CardTitle>} extra={<CardSearch></CardSearch>}>
                    <Table
                        size='middle'
                        className={'gys_table_height'}
                        columns={ExposureList}
                        width={1060}
                        scroll={{ x: 1060 }}
                        dataSource={exposureList.list}
                        rowKey={(text) => text.id}
                        rowSelection={rowSelection}
                        bordered={true}
                        loading={loading}
                        pagination={{
                            showTotal: () => `共${exposureList.recordsTotal}条`,
                            // current: pageNum, 
                            onChange: (page, num) => { this.pageChange(page, num) },
                            showQuickJumper: {
                                goButton: <Button type="link" size={'small'}>
                                    跳转
                        </Button>
                            },
                            total: exposureList.recordsTotal,
                            pageSize: rowNum
                        }}
                    />
                </Card>
            </Layout>
        )
    }
}

export default Form.create({ name: 'supExposurePlatformManagement' })(SupExposurePlatformManagement);