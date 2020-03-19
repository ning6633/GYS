import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Upload, Input, Tooltip, message, Select } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import _ from "lodash";
import { SHOW_PJSSJL_MODEL, SHOW_NewBZYQ_MODEL, SHOW_EditContract_MODEL } from "../../../../constants/toggleTypes";
import { supplierAction, supContractAct } from "../../../../actions"
import NewssModel from "../NewssModel"
import NewBZYQ from "../NewBZYQ"
import EditContract from "../EditContract"

import "./index.less";
const { Search } = Input;

@inject('toggleStore', 'supplierStore', 'contractStore')
@observer
class SupplierInfo extends Component {
    state = {
        supplierList: {
            list: [],
            recordsTotal: 0
        },
        selectedRowKeys: [], // Check here to configure the default column
        selectedRow: [],
        loading: false,
        editrecord: "",
        isdelay: false,
        htnumber: '',
        pageNum: 1,
        rowNum: 20,
        gyscode: ''
    };

    onSelectChange = (selectedRowKeys, selectedRow) => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ selectedRowKeys, selectedRow });
    };
    async submitSupplierInfo(redord) {
        const { toggleStore, supplierStore } = this.props;
        if (redord.is_diff != 0) {
            toggleStore.setToggle(SHOW_SupInfoManager_MODEL)
        } else {
            let supplierList = await supplierAction.submitSupplierInfo([redord.id]);
            message.success("提交成功")
            let { pageNum, rowNum, gyscode, htnumber } = this.state
            this.loaddata(pageNum, rowNum, gyscode, htnumber)
        }
    }
    async submitSupplierInfopl() {
        let supplierList = await supplierAction.submitSupplierInfo(this.state.selectedRowKeys);
        message.success("提交成功")
        let { pageNum, rowNum, gyscode, htnumber } = this.state
        this.loaddata(pageNum, rowNum, gyscode, htnumber)
    }
    //删除合同
    async deleteContract() {
        let { selectedRow, selectedRowKeys, pageNum, rowNum, htnumber, gyscode } = this.state
        console.log(selectedRow)
        if (selectedRow[0].htsubmit == 0) {
            let res = await supContractAct.deleteContract(selectedRowKeys[0]);
            if (res.code == 200) {
                this.setState({
                    selectedRowKeys: [],
                    selectedRow: [],

                }, () => {
                    this.loaddata(pageNum, rowNum, gyscode, htnumber)
                })
            }
        } else {
            message.error('该合同已提交，无法删除！')
        }
    }
    editorSupplierInfo(record) {
        this.setState({
            editrecord: record
        })
        const { toggleStore } = this.props;
        // 查看详情
        toggleStore.setToggle(SHOW_EditContract_MODEL)
    }
    async loaddata(pageNum = 1, rowNum = 20, gyscode = '', htnumber = '') {
        this.setState({ loading: true });
        let supplierList = await supContractAct.getContractList(pageNum, rowNum, gyscode, htnumber);
        this.setState({
            supplierList: supplierList,
            loading: false
        })
    }
    //搜索
    searchValue(value) {
        let { gyscode } = this.state
        this.setState(
            {
                pageNum: 1
            }, () => { this.loaddata(1, 20, gyscode, value) }
        )
    }
    //分页查询
    async pageChange(page, num) {
        let { htnumber, gyscode } = this.state
        this.setState({
            pageNum: page,
            rowNum: num
        }, () => {
            this.loaddata(page, num, gyscode, htnumber)
        })
    }
    async componentDidMount() {
        let { contractStore, isdelay } = this.props;
        let { editrecord } = this.state
        //根据userid获取社会信用代码（mock）
        let res = await supContractAct.getUserInfoByUserId();
        if (res.code == 200) {
            let gysid = res.data.gysId
            let ret = await supContractAct.getstandardgysbyid(gysid);
            if (ret.code == 200) {
                let gyscode
                if (ret.data) {
                    gyscode = ret.data.code
                    contractStore.setGyscode(gyscode)
                    this.setState({
                        gyscode: ret.data.code
                    },
                        () => {
                            this.loaddata(1, 20, ret.data.code)
                        }
                    )
                } else {
                    gyscode = ''
                }

            } else {
                message.error("当前用户信息获取失败！")
            }
        } else {
            message.error("当前用户信息获取失败！")
        }

    }
    // 书安心列表
    refreshData = () => {
        let { pageNum, rowNum, gyscode, htnumber } = this.state
        this.loaddata(pageNum, rowNum, gyscode, htnumber)
    }
    //关闭合同
    async closeContract(record) {
        let { pageNum, rowNum, htnumber, gyscode } = this.state
        await supContractAct.closeContract(record.htId);
        this.loaddata(pageNum, rowNum, gyscode, htnumber)
    }
    //改变延期状态
    changeIsDelay() {
        this.setState({
            isdelay: false
        })
    }
    //延期合同
    async delayContract(record) {
        let { pageNum, rowNum, htnumber, gyscode } = this.state
        this.setState({
            editrecord: record,
            isdelay: true
        })
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_EditContract_MODEL)
        this.loaddata(pageNum, rowNum, gyscode, htnumber)
    }
    //甲方提交合同
    async submitContract(record) {
        let { pageNum, rowNum, htnumber, gyscode } = this.state
        await supContractAct.submitContract(record.htId);
        this.loaddata(pageNum, rowNum, gyscode, htnumber)
    }
    //乙方提交合同
    async submitContractYF(record) {
        let { pageNum, rowNum, htnumber, gyscode } = this.state
        await supContractAct.submitContractYF(record.htId);
        this.loaddata(pageNum, rowNum, gyscode, htnumber)
    }
    render() {
        const { toggleStore, contractStore } = this.props;
        const { loading, selectedRowKeys, editrecord, isdelay, pageNum } = this.state;
        const rowSelection = {
            selectedRowKeys,
            type: 'radio',
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        const gyscode = contractStore.gyscode;
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                // fixed: "left",
                render: (text, index, key) => key + 1
            },
            {
                title: '合同编码',
                dataIndex: 'htbm',
                width: 200,
                align: "center",
                // fixed: "left",
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 150,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.editorSupplierInfo(redord, redord.status == 20) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text}</span></Tooltip>
            },
           
            {
                title: '甲方名称',
                dataIndex: 'jfmc',
                width: 200,
                align: "center",
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 200,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
            },
            {
                title: '甲方单位编号',
                dataIndex: 'jfbh',
                width: 230,
                align: "center",
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 230,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
            },
            {
                title: '乙方名称',
                dataIndex: 'yfmc',
                width: 200,
                align: "center",
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 200,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
            },
            {
                title: '乙方单位编号',
                dataIndex: 'yfbh',
                width: 150,
                align: "center",
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 150,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
            },
            {
                title: '质量问题',
                dataIndex: 'quality_problem',
                width: 100,
                align: "center",
            },
            {
                title: '不合格品处理',
                dataIndex: 'unaccepted_product',
                width: 100,
                align: "center",
            },
            {
                title: '产品范围',
                dataIndex: 'cpfw',
                width: 120,
                align: "center",
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 150,
                align: "center",
                render: (text, record) => { return record.htsubmit == 0 ? "未提交" : (record.htsubmit == 1 ? "已提交" : (text == 2 ? "已关闭" : (text == 1 ? "已延期" : ""))) }
            },
            {
                title: '操作',
                dataIndex: 'modify',
                align: "left",
                fixed: "right",
                align: 'center',
                width: 150,
                render: (text, record) => {
                    if (gyscode == record.yfbh) {
                        if (record.htsubmit == 0) {
                            //乙方
                            return <div>
                                <Button type="primary" disabled={!(record.htsubmit == 0)}
                                    onClick={() => { this.editorSupplierInfo(record) }}
                                    style={{ marginRight: 5 }} size={'small'}>编辑</Button>
                                <Button type="primary" disabled={record.htsubmit == 1 || record.htsubmit == 2}
                                    onClick={() => { this.submitContract(record) }}
                                    style={{ marginRight: 5 }} size={'small'}>提交</Button>
                            </div>
                        } else if (record.htsubmit == 1) {
                            return '等待甲方确认'
                        } else if (record.htsubmit == 2 && !(record.status == 2)) {
                            return (<div><Button type="primary"
                                onClick={() => { this.editorSupplierInfo(record) }}
                                style={{ marginRight: 5 }} size={'small'}>编辑</Button></div>)
                        } else if (record.status == 2) {
                            return (
                                <Button type="primary"
                                    onClick={() => { this.editorSupplierInfo(record) }}
                                    style={{ marginRight: 5 }} size={'small'}>查看</Button>
                            )
                        }
                        
                        
                        
                    } else {
                        // 甲方
                        if (record.htsubmit == 1) {
                            return (<div>
                                <Button type="primary" disabled={record.htsubmit == 2}
                                    onClick={() => { this.editorSupplierInfo(record) }}
                                    style={{ marginRight: 5 }} size={'small'}>编辑</Button>
                                <Button type="primary" disabled={record.htsubmit == 2}
                                    onClick={() => { this.submitContractYF(record) }}
                                    style={{ marginRight: 5 }} size={'small'}>提交</Button>
                            </div>)
                        } else if (record.htsubmit == 2) {
                            if (record.status == 0 || record.status == 1) {
                                return (<div>
                                    <Button type="primary" disabled={record.htsubmit == 0 || record.htsubmit == 1}
                                        onClick={() => { this.closeContract(record) }}
                                        style={{ marginRight: 5 }} size={'small'}>关闭</Button>
                                    <Button type="primary" disabled={record.htsubmit == 0 || record.htsubmit == 1}
                                        onClick={() => { this.delayContract(record) }}
                                        style={{ marginRight: 5 }} size={'small'}>延期</Button>
                                </div>)
                            } else if (record.status == 2) {
                                return <Button type="primary"
                                    onClick={() => { this.editorSupplierInfo(record) }}
                                    style={{ marginRight: 5 }} size={'small'}>查看</Button>
                            }
                        }
                    }







                    // return gyscode == record.jfbh ? (<div>
                    //     <Button type="primary" disabled={!(record.htsubmit == 0)}
                    //         onClick={() => { this.editorSupplierInfo(record) }}
                    //         style={{ marginRight: 5 }} size={'small'}>编辑</Button>
                    //     <Button type="primary" disabled={record.htsubmit == 1 || record.htsubmit == 2}
                    //         onClick={() => { this.submitContract(record) }}
                    //         style={{ marginRight: 5 }} size={'small'}>提交</Button>
                    //     <Button type="primary" disabled={record.htsubmit == 0 || record.htsubmit == 1}
                    //         onClick={() => { this.closeContract(record) }}
                    //         style={{ marginRight: 5 }} size={'small'}>关闭</Button>
                    //     <Button type="primary" disabled={record.htsubmit == 0 || record.htsubmit == 1}
                    //         onClick={() => { this.delayContract(record) }}
                    //         style={{ marginRight: 5 }} size={'small'}>延期</Button>
                    // </div>) : (<div>
                    //     <Button type="primary" disabled={record.htsubmit == 2}
                    //         onClick={() => { this.editorSupplierInfo(record) }}
                    //         style={{ marginRight: 5 }} size={'small'}>编辑</Button>
                    //     <Button type="primary" disabled={record.htsubmit == 2}
                    //         onClick={() => { this.submitContractYF(record) }}
                    //         style={{ marginRight: 5 }} size={'small'}>提交</Button>
                    // </div>)
                }
            }
        ];

        let TableOpterta = () => (
            <div className="table-operations">
                <Button icon="edit" type="primary" onClick={() => { toggleStore.setToggle(SHOW_PJSSJL_MODEL); }}>新建</Button>
                <Button type="danger" disabled={!hasSelected} onClick={() => { this.deleteContract() }} >删除</Button>
            </div>
        )
        let TableFilterBtn = () => (
            <div className="table-fileter">
                <Search placeholder="请输入搜索内容" onSearch={(value) => { this.searchValue(value) }} enterButton />
            </div>
        )

        return (
            <Card title={<TableOpterta />} extra={<TableFilterBtn />}>
                {
                    toggleStore.toggles.get(SHOW_PJSSJL_MODEL) && <NewssModel refreshData={() => this.refreshData()} />
                }
                {
                    toggleStore.toggles.get(SHOW_NewBZYQ_MODEL) && <NewBZYQ />
                }
                {
                    toggleStore.toggles.get(SHOW_EditContract_MODEL) && <EditContract editrecord={editrecord} isdelay={isdelay} changeIsDelay={() => { this.changeIsDelay() }} refreshData={() => this.refreshData()} />
                }
                <Table
                    size='middle'
                    scroll={{ x: 1700 }}
                    loading={loading}
                    rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''}
                    bordered={true}
                    rowKey={(text) => text.htId}
                    rowSelection={rowSelection}
                    columns={columns}
                    pagination={{
                        onChange: (page, num) => { this.pageChange(page, num) },
                        current: pageNum,
                        showQuickJumper: true, total: this.state.supplierList.recordsTotal, pageSize: 20
                    }} dataSource={this.state.supplierList.list} />
            </Card>
        )
    }
}

SupplierInfo.propTypes = {
}
export default SupplierInfo;