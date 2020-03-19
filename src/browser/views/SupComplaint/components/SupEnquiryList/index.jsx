import React, { Component, Fragment } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Row, Input, Tooltip, message, Col, Form, Select } from 'antd';
import Layout from "../../../../components/Layouts";
import { observer, inject, } from 'mobx-react';
import { specialExposure } from "../../../../actions"
import moment from "moment";
import _ from "lodash";
import { SHOW_Exposure_MODEL, SHOW_Talk_MODEL, SHOW_ChooseCompany_MODEL, SHOW_AddList_MODEL } from "../../../../constants/toggleTypes";
import AddList from '../SupAdd/index'
import SupTalk from '../SupTalk'
const { Option } = Select;
const { Search } = Input

@inject('toggleStore', 'supplierStore')
@observer
class Supenquiry extends Component {
    state = {
        statusData: '',
        info: {},
        loading: false,
        currPageNum: 1,
        rowNumOfPage: 20,
        supplierList: {},
        selectedRowKeys: [],
        selectedRows: [],
        getAskReplyListData: [],
        recordData: [],
        role: 0,
        dic: [],
        keyWord: '',
        type: '全部',
        status: '全部',
        gysRoleStatusDict: [],
        centerRoleStatusDict: []
    }
    async getAskList (body) {
        if (body.rowNumOfPage == undefined) {
            body.rowNumOfPage == this.state.rowNumOfPage
        }
        let res = await specialExposure.getAskList(body)
        if (res.code == 200) {
            this.setState({
                supplierList: res.data,
                selectedRowKeys: [],
                loading: false
            })
        }
    }
    async getDic () {
        let { currPageNum, rowNumOfPage, keyWord } = this.state
        let res = await specialExposure.lookUpId('CONSULT_COMPLAIN')
        if (res.code == 200) {
            this.setState({ dic: res.data })
            this.loaddata({ currPageNum, rowNumOfPage, keyWord })
        }
        let ret = await specialExposure.getAskDict()
        if (ret.code == 200) {
            this.setState({
                gysRoleStatusDict: ret.data[0].gysRoleStatusDict,
                centerRoleStatusDict: ret.data[1].centerRoleStatusDict
            })
        }
    }
    async loaddata ({ rowNumOfPage = 20, currPageNum = this.state.currPageNum, keyWord = '', type = '', status = '' }) {
        this.setState({ loading: true })
        this.getAskList({ rowNumOfPage, currPageNum, keyWord, type, status })
    }
    pageChange = (page, row) => {
        let { keyWord, type, status } = this.state
        if (type == '全部') {
            type = ''
        }
        if (status == '全部') {
            status = ''
        }
        this.getAskList({ currPageNum: page, rowNumOfPage: row, keyWord, type, status })
        this.setState({
            currPageNum: page,
            rowNumOfPage: row
        })
    }
    toggleShow () {
        this.setState({ info: {} })
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_Exposure_MODEL);
    }
    showDetails = (record) => {
        record.statusData = 2
        this.setState({ info: record })
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_Exposure_MODEL);
    }
    searchValue (e) {
        let { currPageNum, rowNumOfPage } = this.state
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { type, status, keyWord } = this.state
                if (values.type == '全部') {
                    values.type = ''
                }
                if (values.status == '全部') {
                    values.status = ''
                }
                this.setState({
                    type: values.type,
                    status: values.status,
                    keyWord: e
                })
                this.loaddata({ currPageNum:1, rowNumOfPage, keyWord: e, type: values.type, status: values.status })
            }
        })
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows })
    }
    async updata (id) {
        //提交
        let { selectedRowKeys, selectedRows } = this.state
        let res = await specialExposure.updata(id)
        if (res.code == 200) {
            message.success(res.message)
            this.loaddata({})
        }
        else {
            message.error(res.message)
        }
    }
    async overAsk (id) {
        //结束
        let { selectedRowKeys, selectedRows } = this.state
        let res = await specialExposure.overAsk(id)
        if (res.code == 200) {
            message.success(res.message)
            this.loaddata({})
        }
        else {
            message.error(res.message)
        }
    }
    async getAskReplyList (record) {
        //回复
        let { selectedRowKeys, selectedRows } = this.state
        let res = await specialExposure.getAskReplyList(record.id)
        if (res.code == 200) {
            this.setState({ recordData: record, getAskReplyListData: res.data.reverse() })
            let { toggleStore } = this.props
            toggleStore.setToggle(SHOW_Talk_MODEL);
        }
        else {
            message.error(res.message)
        }
    }
    uploadData = () => {
        let { selectedRows } = this.state
        if (selectedRows[0].status == 0) {
            selectedRows[0].statusData = 1
            this.setState({ info: selectedRows[0] })
            let { toggleStore } = this.props
            toggleStore.setToggle(SHOW_Exposure_MODEL);
        } else {
            message.error('该投诉已提交，无法修改！')
        }
    }
    async handle (record) {
        let { toggleStore } = this.props
        record.statuss = 10
        this.setState({ recordData: record })
        toggleStore.setToggle(SHOW_Talk_MODEL);

    }
    componentDidMount = () => {
        let { type, status } = this.state
        let { setFieldsValue } = this.props.form
        this.getDic()
        setFieldsValue({ type, status })
    }
    render () {
        let { toggleStore } = this.props
        let { getFieldDecorator } = this.props.form
        let { supplierList, role, loading, rowNumOfPage, statusData, info, selectedRowKeys, getAskReplyListData, recordData, dic, keyWord, gysRoleStatusDict, centerRoleStatusDict } = this.state
        const ExposureListOne = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: 'center',
                fixed: 'left',
                render: (text, index, key) => key + 1
            },
            {
                title: '事件名称',
                dataIndex: 'title',
                width: 200,
                align: 'center',
                fixed: 'left',
                render: (text, redord) => <Tooltip title={text}><span onClick={this.showDetails.bind(this, redord)} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '供应商名称',
                dataIndex: 'gys_name',
                width: 200,
                align: 'center',
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
                title: '类型',
                dataIndex: 'type',
                align: 'center',
                render: (text, redord) => {
                    for (let i = 0; i < dic.length; i++) {
                        if (dic[i].code == text) {
                            return (
                                <span>{dic[i].name}</span>
                            )
                        }
                    }
                },
            },
            {
                title: '咨询类型/投诉内容',
                dataIndex: 'content',
                width: 200,
                align: 'center',
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
                title: '发起时间',
                dataIndex: 'create_time',
                width: 150,
                align: 'center',
                sorter: (a, b) => (a.reply_time - b.reply_time),
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
                title: '回复时间',
                dataIndex: 'reply_time',
                width: 150,
                align: 'center',
                sorter: (a, b) => (a.reply_time - b.reply_time),
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
                render: (text, record) => {
                    return (
                        <span>{text || '--.--'}</span>
                    )
                }
            },

            {
                title: '状态',
                dataIndex: 'status_name',
                width: 100,
                align: 'center',
                fixed: 'right',
                render: (text, record) => {
                    if (record.status == 5) {
                        return (
                            <span style={{ color: 'red' }}>{text}</span>
                        )
                    } else {
                        return (
                            <span>{text}</span>
                        )
                    }
                }
            },
            {
                title: '操作',
                dataIndex: '操作',
                width: 150,
                align: 'center',
                fixed: 'right',
                render: (text, record) => {
                    if (record.status == 5) {
                        return (
                            <Button size='small' type='primary' onClick={() => { this.handle(record) }}>办理</Button>
                        )
                    }
                    if (record.status == 10) {
                        return (
                            <Fragment>
                                <Button size='small' type='primary' style={{ marginRight: 10 }} onClick={() => { this.getAskReplyList(record) }}>回复</Button>
                                <Button size='small' type='primary' onClick={() => { this.overAsk(record.id) }}>结束</Button>
                            </Fragment>
                        )
                    }
                    if (record.status == 15) {
                        return (
                            <Button size='small' type='primary' onClick={() => { let re = record; this.showDetails(re) }}>查看</Button>
                        )
                    }
                }
            },

        ]

        const CardSearch = () => {
            return (
                <Form layout="inline">

                    <Form.Item label='状态'>
                        {getFieldDecorator('status', {
                            rules: [
                                {
                                    required: false,
                                    message: '状态',
                                },
                            ],
                        })(<Select style={{ width: 150 }}>
                            <Option value='全部'>全部</Option>
                            {
                                centerRoleStatusDict.map((item, index) => {
                                    return (
                                        <Option key={item.key} value={item.key}>{item.value}</Option>
                                    )
                                })
                            }
                        </Select>)}
                    </Form.Item>

                    <Form.Item label='类型' >
                        {getFieldDecorator('type', {
                            rules: [
                                {
                                    required: false,
                                    message: '类型',
                                },
                            ],
                        })(<Select style={{ width: 150 }}>
                            <Option value=''>全部</Option>
                            {
                                dic.map((item, index) => {
                                    return (
                                        <Option key={item.id} value={item.code}>{item.name}</Option>
                                    )
                                })
                            }
                        </Select>)}
                    </Form.Item>
                    <Form.Item  >
                        {getFieldDecorator('keyWord', {
                            rules: [
                                {
                                    required: false,
                                    message: '搜索',
                                },
                            ],
                        })(<Search placeholder='请输入查询内容' onSearch={(e) => { this.searchValue(e) }} enterButton />)}
                    </Form.Item>


                </Form>
            )
        }
        const AddManner = () => {
            let { selectedRowKeys } = this.state
            return (
                <b>投诉与咨询列表</b>
            )
        }
        const rowSelection = {
            columnWidth: 30,
            selectedRowKeys,
            type: 'radio',
            onChange: this.onSelectChange
        };
        return (
            <Layout title={"供应商关系管理"}>
                {
                    toggleStore.toggles.get(SHOW_ChooseCompany_MODEL) && <ChooseCompany />
                }
                {
                    toggleStore.toggles.get(SHOW_Exposure_MODEL) && <AddList loaddata={() => { this.loaddata({}) }} info={info} ></AddList>
                }
                {
                    toggleStore.toggles.get(SHOW_Talk_MODEL) && <SupTalk role={role} loaddata={() => { this.loaddata({}) }} recordData={recordData} getAskReplyListData={getAskReplyListData}></SupTalk>
                }
                {/* <AddList></AddList> */}
                <Card title={<AddManner />} extra={<CardSearch />}>
                    <Table
                        size='middle'
                        className={'gys_table_height'}
                        columns={ExposureListOne}
                        width={1310}
                        scroll={{ x: 1310 }}
                        dataSource={supplierList.pageList}
                        rowKey={(text) => text.id}
                        // rowSelection={rowSelection}
                        bordered={true}
                        loading={loading}
                        pagination={{
                            showTotal: () => `共${supplierList.totalCount}条`,
                            // current: pageNum, 
                            onChange: (page, num) => { this.pageChange(page, num) },
                            showQuickJumper: {
                                goButton: <Button type="link" size={'small'}>
                                    跳转
                        </Button>
                            },
                            total: supplierList.totalCount,
                            pageSize: 20
                        }}
                    />
                </Card>
            </Layout>
        )
    }
}

export default Form.create({ name: 'supenquiry' })(Supenquiry);