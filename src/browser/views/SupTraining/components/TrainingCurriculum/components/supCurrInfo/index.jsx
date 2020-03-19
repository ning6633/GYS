import React, { Component, Fragment } from 'react'
import { observer, inject, } from 'mobx-react';
import { Table, message, Card, Icon, Button, Input, Tooltip } from 'antd'
import { supplierTrain } from '../../../../../../actions'
import { SHOW_addTrain_MODEL } from "../../../../../../constants/toggleTypes"
import AddTrainingCourse from '../addTrainingCourse'



const { Search } = Input
@inject('toggleStore', 'trainStore')
@observer
class SupCurrInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            suplier: {
                list: [],
                rocordTotle: 0
            },
            selectedRowKeys: [],
            rowNum: 10,
            flag: "build",
            record: ""
        }
    }
    addCoures = () => {
        //新建课程
        this.setState({
            flag: "build"
        })
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_addTrain_MODEL)
    }
    async delete() {
        let { selectedRowKeys } = this.state
        let { trainStore, loadInfo } = this.props
        let res = await supplierTrain.deletecourselist(selectedRowKeys)
        if (res.code == 200) {
            this.setState({
                selectedRowKeys: []
            }, () => {
                message.success(res.message)
                loadInfo(trainStore.oneInfo)
            })

        }
    }
    onSelect(selectedRowKeys, selectedRows) {
        this.setState({
            selectedRowKeys
        })
    }
    onSearchValue = (e) => {
        let { trainStore, loadInfo } = this.props
        trainStore.searchValue(e)
        trainStore.changePageNum(1)
        loadInfo(trainStore.oneInfo)
        this.setState({
            pageNum: 1
        })
    }


    updata = (record) => {
        //修改
        this.setState({
            flag: "upload",
            record
        })
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_addTrain_MODEL)
    }
    lookDetails = (record) => {
        //查看详情
        this.setState({
            flag: "details",
            record
        })
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_addTrain_MODEL)
    }
    pageChange = (pageNum, rowNum) => {
        this.setState({
            pageNum,
            rowNum
        })
        let { trainStore, loadInfo } = this.props
        trainStore.changePageNum(pageNum)
        loadInfo(trainStore.oneInfo)
    }
    componentDidMount = () => {

    }


    // shouldComponentUpdate=(nextProps,nextState)=>{
    //     let {oneInfo} = nextProps
    //     console.log(nextProps)
    //     return nextProps.trainStore.oneInfo.event ?  nextProps.trainStore.oneInfo.selected : false   //判断是否有必要刷新页面
    // }
    render = () => {
        let { pageNum, selectedRowKeys, flag, record } = this.state
        let { toggleStore, loadInfo, trainStore } = this.props
        // let hashold = !trainStore.oneInfo.selected 
        let hashold = trainStore.oneInfo.selected ? false : true
        const rowSelection = {
            columnWidth: 30,
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.onSelect(selectedRowKeys, selectedRows)
            },
            getCheckboxProps: record => ({
                disabled: record.status === '200', // Column configuration not to be checked
                name: record.name,
            }),
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
                title: '课程名称',
                dataIndex: 'name',
                width: 200,
                align: "center",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.lookDetails(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text}</span></Tooltip>
            },
            {
                title: '课程描述',
                dataIndex: 'descri',
                width: 200,
                align: "center",
               
            },
            {
                title: '专家/讲师',
                dataIndex: 'specialist',
                width: 200,
                align: "center",
                render: (text, redord) => {
                    if(text[text.length-1] == ","){
                        return <span>{text.substr(0, text.length - 1)}</span>
                    }else{
                        return <span>{text}</span>
                    }
                }
            },
            {
                title: '课件数',
                dataIndex: 'coursewarecount',
                width: 100,
                align: "center",
                render: (text, redord) => {
                    return < Tooltip>{text == 0 ? <span>无</span> : <span onClick={(e) => { this.lookDetails(redord) }} style={{ cursor: "pointer", 'color': '#3383da',textDecoration:'underline' }}>{text}</span>}</Tooltip>
                }
            },
            {
                title: '是否有效',
                dataIndex: 'isvalid',
                width: 100,
                align: "center",
                render: (text, redord) => {
                    if(text == 0){
                        return <span>否</span>
                    }else{
                        return <span>是</span>
                    }
                }
            },
            {
                title: '操作',
                dataIndex: 'caozuo',
                width: 200,
                align: "center",
                render: (text, record) => {
                    return (
                        <Button type="primary" size="small" disabled={hashold} onClick={() => { this.updata(record) }}>编辑</Button>
                    )
                }
            },
        ];
        const AddModel = () => {
            return (
                <Fragment>
                    <Button icon="plus" disabled={hashold} type="primary" style={{ marginRight: 20 }} onClick={() => { this.addCoures() }}>新建</Button>
                    <Button disabled={hashold || selectedRowKeys.length == 0} type="danger" onClick={() => { this.delete() }}>删除</Button>
                </Fragment>
            )
        }
        const SearchValue = () => {
            return (
                <Fragment>
                    <Search placeholder="请输入搜索内容" disabled = {hashold} onSearch={(e) => { this.onSearchValue(e) }} enterButton />
                </Fragment>
            )
        }
        return (
            <Fragment>
                <Card style={{ height: '85vh' }} title={<AddModel />} extra={<SearchValue />}>
                    <Table
                        size='middle'
                        // loading={loading}
                        rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''}
                        bordered={true}
                        rowKey={(text) => text.id}
                        rowSelection={rowSelection}
                        scroll={{ x: 900 }}
                        columns={columns}
                        pagination={{
                            showTotal: () => `共${trainStore.allInfo.recordsTotal}条`,
                            onChange: (page, num) => { this.pageChange(page, num) },
                            current: pageNum,
                            showQuickJumper: true,
                            total: trainStore.allInfo.recordsTotal,
                            pageSize: 10
                        }}
                        dataSource={trainStore.allInfo.list.slice()}
                    >

                    </Table>
                </Card>
                {toggleStore.toggles.get(SHOW_addTrain_MODEL) && <AddTrainingCourse info={record} loadInfo={loadInfo} flag={flag} />}

            </Fragment>
        )
    }
}


export default SupCurrInfo