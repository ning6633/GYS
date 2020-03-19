import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Upload, Input, Tooltip, message, Select ,Popconfirm} from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import _ from "lodash";
import { SHOW_NewPJZS_MODEL } from "../../../../constants/toggleTypes";
import { supplierAction, supYearAudit } from "../../../../actions"
import NewPJZS from "../NewPJZS"

import "./index.less";
const { Search } = Input;

@inject('toggleStore', 'supplierStore')
@observer
class SupReviewCertificateList extends Component {
    state = {
        supplierList: {
            list: [],
            recordsTotal: 0
        },
        statuss: 0,
        certificatesname: '',
        pageNum: 1,
        rowNum: 20,
        selectedRowKeys: [], // Check here to configure the default column
        selectRow: [],
        loading: false,
        info: []
    };

    onSelectChange = (selectedRowKeys, selectRow) => {
        this.setState({ selectedRowKeys, selectRow, info: selectRow });
    };

    async loaddata ({ pageNum = 1, rowNum = 20, certificatesname = '' }) {
        this.setState({ loading: true });
        let res = await supYearAudit.getcertificates({ pageNum, rowNum, certificatesname });
        if (res.code == 200) {
            this.setState({
                selectedRowKeys: [],
                selectRow: [],
                supplierList: res.data,
                loading: false
            })
        }
    }
    //修改
    uploadData () {
        let { toggleStore } = this.props
        this.setState({
            statuss: 1
        })
        toggleStore.setToggle(SHOW_NewPJZS_MODEL);
    }
    //删除
    async deleteData () {
        let { selectedRowKeys } = this.state
        let res = await supYearAudit.deletecertificates(selectedRowKeys[0]);
        if (res.code == 200) {
            message.success(res.message)
            this.loaddata({})
        }

    }
    //分页查询
    pageChange (pageNum, rowNum) {
        let { certificatesname } = this.state
        this.setState({ pageNum })
        this.loaddata({ pageNum, rowNum, certificatesname })
    }
    //搜索
    searchValue = (value) => {
        let { pageNum, rowNum } = this.state
        this.setState({ certificatesname: value, pageNum: 1 })
        this.loaddata({ pageNum: 1, rowNum, certificatesname: value })
    }
    //查看详情
    editorSupplierInfo = (redord) => {
        let { toggleStore } = this.props
        let arr = []
        arr.push(redord)
        this.setState({ info: arr, statuss: 3 })
        toggleStore.setToggle(SHOW_NewPJZS_MODEL);
    }
    goBack = () => {
        this.loaddata({})
    }
    componentDidMount () {
        let { pageNum, rowNum } = this.state
        this.loaddata({ pageNum, rowNum })
    }
    render () {
        const { toggleStore, supplierStore } = this.props;
        const { loading, selectedRowKeys, selectRow, info, pageNum, rowNum, statuss } = this.state;
        const rowSelection = {
            type: 'radio',
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const that = this;
        const hasSelected = selectedRowKeys.length > 0;
        let { supplierList } = this.state
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '证书名称',
                dataIndex: 'name',
                width: 200,
                align: "center",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.editorSupplierInfo(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '发证日期',
                dataIndex: 'createTime',
                width: 120,
                align: "center",
                render: (text) => text == 20 ? '已提交' : '未提交'
            },
            {
                title: '发证机构',
                dataIndex: 'org',
                width: 230,
                align: "center",
            },
            {
                title: '有效期',
                dataIndex: 'toTime',
                align: "center",
                width: 200,
                // render: (text, redord) => {
                //     return (<div><Button disabled={redord.status == 20} onClick={() => { this.editorSupplierInfo(redord) }} style={{ marginRight: 5 }} type="primary" size={'small'}>编辑</Button></div>)
                // }
            },
        ];
        let TableOpterta = () => (
            <div className="table-operations">
                <Button icon="edit" type="primary" onClick={() => { this.setState({ statuss: 0 }); toggleStore.setToggle(SHOW_NewPJZS_MODEL); }}>新建</Button>
                <Popconfirm placement="topLeft" disabled={!hasSelected} title='确定要删除吗？' onConfirm={() => { this.deleteData() }} okText="是" cancelText="否">
                    <Button type="danger" disabled={!hasSelected} style = {{marginRight:10}}>删除</Button>
                </Popconfirm>
                <Button type="primary" disabled={!hasSelected} onClick={() => { this.uploadData() }} >修改</Button>
            </div>
        )
        let TableFilterBtn = () => (
            <div className="table-fileter">
                <Search placeholder="搜索证书名称" onSearch={(value) => { this.searchValue(value) }} enterButton />
            </div>
        )
        return (
            <Card title={<TableOpterta />} extra={<TableFilterBtn />}>
                {
                    toggleStore.toggles.get(SHOW_NewPJZS_MODEL) && <NewPJZS statuss={statuss} loaddata={this.goBack} info={info} />
                }
                <Table
                    size='middle'
                    loading={loading}
                    rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''}
                    bordered={true}
                    rowKey={(text) => text.id}
                    rowSelection={rowSelection}
                    columns={columns}
                    pagination={{
                        showTotal: () => `共${supplierList.recordsTotal}条`,
                        onChange: (page, num) => { this.pageChange(page, num) },
                        showQuickJumper: {
                            goButton: <Button type="link" size={'small'}>
                                跳转
                    </Button>
                        },
                        total: supplierList.recordsTotal,
                        current: pageNum,
                        pageSize: 20
                    }}
                    dataSource={supplierList.list} />
            </Card>
        )
    }
}

SupReviewCertificateList.propTypes = {
}
export default SupReviewCertificateList;