import React, { Component } from 'react'
import { Table, Card, Tooltip, Button } from 'antd'
import ActionCreator from '../../store/actionCreator'
import Axios from 'axios'
import './index.less'
import AddInfo from './components/AddInfo/index'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ActionType from '../../store/actionType'

const {ADD_INFO} = ActionType
class Release extends Component {

    state = {
        status: 2,
        pageNum: 1,
        rowNum: 20,
        tableData: {
            list: [],
            recordsTotal: 0
        },
        showModal:false
    }

    async getInfo() {
        let { status, pageNum, rowNum } = this.state
        await Axios.get(`http://10.0.32.106:8179/gys/1.0/newTrainPlan?status=${status}&pageNum=${pageNum}&rowNum=${rowNum}`)
            .then(res => {
                if (res.status == 200 && res.data.code == 200) {
                    this.setState({
                        tableData: {
                            list: res.data.data.list,
                            recordsTotal: res.data.data.recordsTotal
                        }
                    })
                }
            })
    }

    changeModal=()=>{
        let {settoggle} = this.props
        settoggle(ADD_INFO)
        this.setState({
        })
    }
    componentDidMount = () => {
        this.getInfo()
    }
    render() {
        let { tableData , } = this.state
        let {settoggle,gettoggle} = this.props
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
            },
            {
                title: '操作',
                dataIndex: 'cz',
                width: 150,
                align: "center",
                render: (text, record) => <Button type="primary">删除</Button>
            },

        ]
        return (
            <Card
                bordered={true}
                title={<b>打分发布中心</b>}>
                <div style={{ marginBottom: "10px" }}>
                    <Button type="primary" onClick={()=>{
                        settoggle(ADD_INFO)
                        this.setState({})
                    }}>新建</Button>
                </div>
                {gettoggle(ADD_INFO) && <AddInfo changeModal={()=>{this.changeModal()}}/>}
                <Table
                    size='middle'
                    // loading={loading}
                    bordered={true}
                    rowKey={(text) => text.id}
                    columns={columns}
                    pagination={{
                        //     showTotal: () => `共${this.state.trainPlanList.recordsTotal}条`, current: curPage, onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: {
                        //         goButton: <Button type="link" size={'small'}>
                        //             跳转
                        //    </Button>
                        //     },
                        total: tableData.recordsTotal,
                        pageSize: 20
                    }}
                    dataSource={tableData.list}
                ></Table>
            </Card>
        )
    }
}

export default connect(state => state,dispatch=>bindActionCreators(ActionCreator,dispatch))(Release)