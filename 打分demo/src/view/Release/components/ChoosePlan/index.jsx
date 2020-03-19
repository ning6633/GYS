import React, { Component } from 'react'
import { Table, Card, Tooltip, Button , Modal} from 'antd'
import Axios from 'axios'


class ChoosePlan extends Component {

    state = {
        pageNum: 1,
        rowNum: 10,
        tableData: {
            list: [],
            recordsTotal: 0
        },
        showModal:false,
        selectedRowKeys:[],
        selectedRows:[]
    }

    // 翻页
    pageChange=(pageNum,rowNum)=>{
        this.setState({
            pageNum,rowNum
        },()=>{
            this.newTrainPlan()
        })
    }

    // 选择计划
    onSelectChange=(selectedRowKeys,selectedRows)=>{
        this.setState({
            selectedRowKeys,selectedRows
        })
    }
    // onCancel
    onCancel=()=>{
        let {changeModal} = this.props
        changeModal()
    }

    // 确定
    onOk=()=>{
        let {selectedRows} = this.state
        let {onChoosePlan,changeModal} = this.props
        changeModal()
        onChoosePlan(selectedRows[0])
    }

    // 获取计划列表
    async newTrainPlan() {
        let {pageNum,rowNum} = this.state
            await Axios.get(`http://10.0.32.106:8179/gys/1.0/newTrainPlan?pageNum=${pageNum}&rowNum=${rowNum}`)
                .then(res => {
                    if (res.status == 200 && res.data.code == 200) {
                        this.setState({
                            tableData: {
                                list: res.data.data.list,
                                recordsTotal: res.data.data.recordsTotal
                            },
                        })
                    }
                })
    }

    loaddata=()=>{
        this.newTrainPlan()
    }
    componentDidMount = () => {
        this.loaddata()
    }
    render() {
        let { tableData  ,selectedRowKeys,pageNum,rowNum} = this.state
        let {showModal,changeModal} = this.props
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '培训计划名称',
                dataIndex: 'name',
                width: 150,
                align: "center",
                render: (text, record) => <Tooltip title={text}><span style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 20)}</span></Tooltip>
            },

            {
                title: '培训类型',
                dataIndex: 'type',
                width: 200,
                align: "center",
                render: (text, record) => record.type && `${record.type == "zx" ? '专项' : '准入'}`
            },
            {
                title: '培训主题',
                dataIndex: 'zt',
                width: 150,
                align: "center",
            },
            {
                title: '培训目的',
                dataIndex: 'pxmd',
                width: 150,
                align: "center",
            }

        ]
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys,selectedRows)=>{
                this.onSelectChange(selectedRowKeys,selectedRows)
            },
            type: 'radio'
        };
        return (
            <Modal
            title="选择计划"
            visible={showModal}
            width={1000}
            okText="确认"
            cancelText="取消"
            onOk={()=>{this.onOk()}}
            onCancel={()=>{this.onCancel()}}
            >
                <Card
                bordered={true}
                title={<b>选择计划</b>}>
                <Table
                    size='small'
                    // loading={loading}
                    bordered={true}
                    rowKey={(text) => text.id}
                    columns={columns}
                    rowSelection={rowSelection}
                    pagination={{
                            showTotal: () => `共${tableData.recordsTotal}条`, 
                            current: pageNum, 
                            onChange: (page, num) => { this.pageChange(page, num) }, 
                            showQuickJumper: {
                                goButton: <Button type="link" size={'small'}>
                                    跳转
                           </Button>
                            },
                        total: tableData.recordsTotal,
                        pageSize: rowNum
                    }}
                    dataSource={tableData.list}
                ></Table>
            </Card>
            </Modal>
        )
    }
}

export default ChoosePlan