import React, { Component } from 'react';
import moment from 'moment';
import { Modal, Button, Card, Form, Row, Col, Input, message, Table, DatePicker, Select } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_GYSDirectories_MODEL, SHOW_Unexecuted_MODEL } from "../../../../../../constants/toggleTypes"
import _ from "lodash";
import { supplierDirectory } from "../../../../../../actions"
import "./index.less"
import Unexecuted from '../Unexecuted'
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { RangePicker } = DatePicker
const dateFormat = 'YYYY-MM-DD';
const { Search } = Input
const GetNowData = new Date().toLocaleDateString().replace(/(\/)+/ig, "-")
@inject('toggleStore', 'directoryStore')
@observer
class GYSDirectories extends React.Component {
    state = {
        pageNum: 1,
        rowNum: 2,
        tableData: {
            list: [],
            recordsTotal: 0
        },
        loading: true,
        startdate:GetNowData,
        enddate:GetNowData,
        eventype:'',
        info:{},
        NowData: GetNowData
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_GYSDirectories_MODEL)
    };
    handleSubmit = e => {
        let { addInitcategory, toggleStore } = this.props
        toggleStore.setToggle(SHOW_GYSDirectories_MODEL)
    }



    // 数据请求
    async getgysupdmessage() {
        let { directoryId ,orgId} = this.props
        let { pageNum, rowNum,startdate,enddate,eventype } = this.state
        let _tmp = ''
        if(eventype == '全部'){
            _tmp = ''
        }else{
            _tmp = eventype
        }
        let res = await supplierDirectory.getgysupdmessage({ directoryId,orgId, startdate,enddate,eventype:_tmp,pageNum, rowNum })
        if (res.code == 200) {
            let _arr = []
            let _flag = 0
            _arr = res.data.list
            _arr.forEach(element => {
                element.flag = _flag
                _flag ++
            });
            this.setState({
                tableData: {
                    list: _arr,
                    recordsTotal: res.data.recordsTotal
                },
                loading:false
            })
        }
    }
    // 翻页请求
    pageChange = (pageNum, rowNum) => {
        this.setState({
            pageNum,
            rowNum,
            loading: true
        }, () => {
            this.getgysupdmessage()
        })
    }

    // 时间选择器
    onChangeRangePicker=(e)=>{
        if(e.length>0){
            this.setState({
                startdate:e[0]._d.toLocaleDateString().replace(/(\/)+/ig, "-"),
                enddate:e[1]._d.toLocaleDateString().replace(/(\/)+/ig, "-"),
            })
        }
    }

    //选择类型
    onSelect=(e)=>{
        this.setState({
            eventype:e
        })
    }

    // 条件搜索
    searchValue=()=>{
        this.setState({
            pageNum:1,
            loading: true
        },()=>{
            this.getgysupdmessage()
        })
    }
    loaddata = () => {
        this.getgysupdmessage()
    }
    componentDidMount = () => {
        this.loaddata()
    }
    render() {
        let { tableData, pageNum, rowNum, selectedRowKeys, loading, NowData,info } = this.state
        let { toggleStore ,orgId} = this.props
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '修改内容',
                dataIndex: 'GYSNAME',
                width: 150,
                align: "center",
            },
            {
                title: '修改类型',
                dataIndex: 'operateevent',
                width: 200,
                align: "center",
            },
            {
                title: '修改时间',
                dataIndex: 'MODIFYDATE',
                width: 230,
                align: "center",
                render: (text) => {
                    if (text != '') {
                        let _date = new Date(text)
                        return (
                            <span>{`${_date.getFullYear()}-${_date.getMonth()}-${_date.getDate()}`}</span>
                        )
                    }else{
                        return (
                            <span>
                                ----/--
                            </span>
                        )
                    }
                }
            },
            {
                title: '已通知单位数量',
                dataIndex: 'tzsl',
                width: 150,
                align: "center"
            },
            {
                title: '未执行单位数量',
                dataIndex: 'wzxsl',
                width: 100,
                align: "center",
                render: (text, record) => {
                    // if(text > 0){
                        return (
                            <span style={{ cursor: 'pointer' ,color:"red"}} onClick={() => {
                                this.setState({
                                    info:record
                                })
                                const { toggleStore } = this.props;
                                toggleStore.setToggle(SHOW_Unexecuted_MODEL)
                            }}>{text}</span>
                        )
                    // }else{
                    //     return (
                    //         <span>0</span>
                    //     )
                    // }
                }
            }
        ];
        return (
            <div>
                <Modal
                    title={"供应商名录修改记录"}
                    visible={toggleStore.toggles.get(SHOW_GYSDirectories_MODEL)}
                    onCancel={this.handleCancel}
                    width={950}
                    footer={<Button type="primary" onClick={()=>{this.handleSubmit()}}>关闭</Button>}
                >
                    <div className="search">
                        <Button type="primary" size="small" style={{ marginLeft: "10px" }} onClick={()=>{this.searchValue()}}>查询</Button>
                        <Select style={{ marginLeft: "10px", width: "100px" }} size="small" defaultValue="全部" onSelect={(e)=>{
                            this.onSelect(e)
                        }}>
                            <Select.Option value='全部'>全部</Select.Option>
                            <Select.Option value='新增'>新增</Select.Option>
                            <Select.Option value='删除'>删除</Select.Option>
                            <Select.Option value='修改'>修改</Select.Option>
                        </Select>
                        <RangePicker
                            defaultValue={[moment(NowData, dateFormat),
                            moment(NowData, dateFormat)]}
                            format={dateFormat}
                            size="small"
                            disabledDate={(current)=>{
                                return current && current > moment().endOf('day');
                            }}
                            onChange={(e)=>{this.onChangeRangePicker(e)}}
                        >
                        </RangePicker>
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
                    {
                        toggleStore.toggles.get(SHOW_Unexecuted_MODEL) && <Unexecuted orgId={orgId} info={info}/>
                    }
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'gysDirectories' })(GYSDirectories);;