import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Upload, Icon, Tooltip, message, Select, Form, Row, Col, Input, Popconfirm } from 'antd';
import Layout from "../../../../components/Layouts";
const ButtonGroup = Button.Group;
const { Option } = Select;
const { Search } = Input;
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import _ from "lodash";
import { supplierTrain } from "../../../../actions"
import { SHOW_SpwcialDetails_MODEL, } from "../../../../constants/toggleTypes";
import SpwcialDetails from "./components/SpecialDetails/index"

@inject('toggleStore')
@observer
class TrainingSpecial extends Component {
    state = {
        pageNum: 1,
        rowNum: 20,
        loading: true,
        queryName: '',
        TrainApplyNewOutVO: {
            list: [],
            recordsTotal: 0
        },
        recordId: "",
    }


    details = (record) => {
        // 查看培训计划详情
        this.setState({
            recordId: record.id
        })
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_SpwcialDetails_MODEL)
    }
    async loaddata() {
        let { pageNum, rowNum, queryName } = this.state
        let res = await supplierTrain.trainApplyNew({ pageNum, rowNum, queryName })
        if (res.code == 200) {
            this.setState(
                {
                    TrainApplyNewOutVO: res.data,
                    loading: false
                }
            )
        }
    }
    pageChange = (pageNum, rowNum) => {
        // 翻页
        this.setState({
            pageNum, rowNum,
            loading: true
        }, () => {
            this.loaddata()
        })
    }
    onSearchValue = (e) => {
        // 模糊查询
        this.setState({
            queryName: e,
            pageNum: 1
        }, () => {
            this.loaddata()
        })
    }
    componentDidMount = () => {
        this.loaddata()
    }
    render() {
        let { toggleStore } = this.props
        let { TrainApplyNewOutVO, pageNum, rowNum, recordId, loading, queryName } = this.state
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 50,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '名称',
                dataIndex: 'name',
                width: 100,
                align: "center",
                render: (text, record) => {
                    return (
                        <span style={{ cursor: "pointer", 'color': '#3383da' }} onClick={() => { this.details(record) }}>{text}</span>
                    )
                }
            },
            {
                title: '培训类型',
                dataIndex: 'traintypename',
                width: 100,
                align: "center",
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 100,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            // cursor:'pointer'
                        }
                    }
                },
                render: (text, record) => {
                    return <Tooltip title = {text}><span>{text.join("、")}</span></Tooltip>
                }
            },
            {
                title: '日期',
                dataIndex: 'time',
                width: 200,
                align: "center",
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 200,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            // cursor:'pointer'
                        }
                    }
                },
            },
            {
                title: '地点',
                dataIndex: 'pxdd1',
                width: 200,
                align: "center",
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 100,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            // cursor:'pointer'
                        }
                    }
                },
                render: (text, record) => {
                    return <Tooltip title={text}><span>{text}</span></Tooltip>
                }
            },
            {
                title: '培训对象',
                dataIndex: 'pxdx',
                width: 100,
                align: "center",
                // sorter: (a, b) => (moment(a.trainShift).valueOf() - moment(b.trainShift).valueOf()),
                // render: (text) => <Tooltip title={text && text.substr(0, 10)}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '培训主题',
                dataIndex: 'zt',
                width: 100,
                align: "center",
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                align: "center",
                render: (text, record) => {
                    switch (text) {
                        case '0':
                            return (<span style={{ color: "#fe0a0a" }}>待审批</span>)
                            break;
                        case '1':
                            return (<span style={{ color: "#ff9b37" }}>已退回</span>)
                            break;
                        case '2':
                            return (<span style={{ color: "#b3b3b3" }}>实施中</span>)
                            break;
                        case '3':
                            return (<span style={{ color: "#000" }}>已完成</span>)
                            break;
                        default: break;
                    }
                }
            }
        ];
        const SearchValue = () => {
            return (
                <Search placeholder="请输入搜索内容" defaultValue={queryName} onSearch={(e) => { this.onSearchValue(e) }} enterButton />
            )
        }
        return (
            <Layout title={"供应商培训管理"}>
                <Card extra={<SearchValue />}>

                    <Table
                        size='middle'
                        loading={loading}
                        className={'gys_table_height'}
                        bordered={true}
                        rowKey={(text) => text.id}
                        // rowSelection={userTypeVerty == 'approve' ? rowSelection : null} 
                        scroll={{ x: 950 }}
                        columns={columns}
                        pagination={{
                            showTotal: () => `共${TrainApplyNewOutVO.recordsTotal}条`,
                            current: pageNum,
                            onChange: (page, num) => {
                                this.pageChange(page, num)
                            },
                            showQuickJumper: {
                                goButton: <Button type="link" size={'small'}>
                                    跳转
                            </Button>
                            },
                            total: TrainApplyNewOutVO.recordsTotal,
                            pageSize: 20
                        }}
                        dataSource={TrainApplyNewOutVO.list}
                    />
                    {
                        toggleStore.toggles.get(SHOW_SpwcialDetails_MODEL) && <SpwcialDetails recordId={recordId} />
                    }
                </Card>
            </Layout>
        )
    }
}

export default TrainingSpecial;