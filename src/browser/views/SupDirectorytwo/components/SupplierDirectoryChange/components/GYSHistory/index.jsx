import React, { Component } from 'react';
import moment from 'moment';
import { Modal, Button, Card, Form, Row, Col, Input, message, Table, DatePicker, Select } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_GYSHistory_MODEL } from "../../../../../../constants/toggleTypes"
import _ from "lodash";
import { supplierDirectory } from "../../../../../../actions"
import "./index.less"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { MonthPicker } = DatePicker
const dateFormat = 'YYYY-MM';
const { Search } = Input
const GetNowData = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`
@inject('toggleStore', 'directoryStore')
@observer
class GYSHistory extends React.Component {
    state = {
        pageNum: 1,
        rowNum: 2,
        tableData: {
            list: [],
            recordsTotal: 0
        },
        loading: true,
        startdate: GetNowData,
        endDate: GetNowData,
        gysname: '',
        info: {},
        NowData: GetNowData
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_GYSHistory_MODEL)
    };
    handleSubmit = e => {
        let { addInitcategory, toggleStore } = this.props
        toggleStore.setToggle(SHOW_GYSHistory_MODEL)
    }



    // 集团查询历史版本
    async searchgyshistoriesbyjt() {
        let { directoryId, orgId } = this.props
        let { pageNum, rowNum, endDate, gysname } = this.state
        let res = await supplierDirectory.searchgyshistoriesbyjt({ directoryId, endDate, gysname, pageNum, rowNum })
        if (res.code == 200) {
            let _arr = []
            let _flag = 0
            if (res.data.list > 0) {
                _arr = res.data.list
                _arr.forEach(element => {
                    element.flag = _flag
                    _flag++
                });
                this.setState({
                    tableData: {
                        list: _arr,
                        recordsTotal: res.data.recordsTotal
                    },
                    loading: false
                })
            } else {
                this.setState({
                    tableData: {
                        list: res.data.list,
                        recordsTotal: res.data.recordsTotal
                    },
                    loading: false
                })
            }
        }
    }
    // 院所查询历史版本
    async searchgyshistories() {
        let { directoryId, orgId } = this.props
        let { pageNum, rowNum, endDate, gysname } = this.state
        let res = await supplierDirectory.searchgyshistories({ directoryId, orgID: orgId, endDate, pageNum, rowNum })
        if (res.code == 200) {
            let _arr = []
            let _flag = 0
            if (res.data.list > 0) {
                _arr = res.data.list
                _arr.forEach(element => {
                    element.flag = _flag
                    _flag++
                });
                this.setState({
                    tableData: {
                        list: _arr,
                        recordsTotal: res.data.recordsTotal
                    },
                    loading: false
                })
            } else {
                this.setState({
                    tableData: {
                        list: res.data.list,
                        recordsTotal: res.data.recordsTotal
                    },
                    loading: false
                })
            }
        }
    }
    // 翻页请求
    pageChange = (pageNum, rowNum) => {
        this.setState({
            pageNum,
            rowNum,
            loading: true
        }, () => {
            this.loaddata()
        })
    }

    // 时间选择器
    onChangeRangePicker = (e) => {
        let _q = e._d.toLocaleDateString().replace(/(\/)+/ig, "-")
        this.setState({
            endDate: _q.slice(0,_q.lastIndexOf('-')),
        })
    }


    // 条件搜索
    searchValue = () => {
        this.setState({
            pageNum: 1,
            loading: true
        }, () => {
            this.loaddata()
        })
    }
    loaddata = () => {
        let { selectNode, onSelectInfo } = this.props
        switch (onSelectInfo) {
            case '集团':
                this.searchgyshistoriesbyjt()
                break;
            case '院':
                this.searchgyshistories()
                break;
            case '厂所':
                this.searchgyshistories()
                break;
            default:
                this.searchgyshistories()
                break;
        }
        // this.loaddata()
    }
    componentDidMount = () => {
        this.loaddata()
    }
    render() {
        let { tableData, pageNum, rowNum, selectedRowKeys, loading, NowData, info, gysname } = this.state
        let { toggleStore, orgId } = this.props
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
            },
            {
                title: '配套领域',
                dataIndex: '配套领域',
                width: 100,
                align: "center",
            }
        ];
        return (
            <div>
                <Modal
                    title={"供应商名录修改记录"}
                    visible={toggleStore.toggles.get(SHOW_GYSHistory_MODEL)}
                    onCancel={this.handleCancel}
                    width={950}
                    footer={<Button type="primary" onClick={() => { this.handleSubmit() }}>关闭</Button>}
                >
                    <div className="search">
                        <Button type="primary" size="small" style={{ marginLeft: "10px" }} onClick={() => { this.searchValue() }}>查询</Button>
                        <Input type='text' style={{ width: "200px", marginLeft: '20px' }} size='small' placeholder='搜索供应商' value={gysname}
                            onChange={(e) => {
                                this.setState({
                                    gysname: e.target.value
                                })
                            }} />
                        <MonthPicker
                            defaultValue={moment(NowData, dateFormat)}
                            format={dateFormat}
                            size="small"
                            // disabledDate={(current) => {
                            //     return current && current > moment().endOf('day');
                            // }}
                            onChange={(e) => { this.onChangeRangePicker(e) }}
                        >
                        </MonthPicker >
                    </div>
                    <Table
                        size='middle'
                        loading={loading}
                        rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''}
                        bordered={true}
                        rowKey={(text) => text.flag}
                        scroll={{ x: 875 }}
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
                    {/* 弹出未执行单位modal框 */}
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'gysHistory' })(GYSHistory);;