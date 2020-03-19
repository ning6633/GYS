import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Upload, Icon, Tooltip, message, Select, Form, Row, Col, Input, Popconfirm } from 'antd';
import './index.less';
import Layout from "../../../../components/Layouts";
const ButtonGroup = Button.Group;
const { Option } = Select;
const { Search } = Input;
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import _ from "lodash";
import { supplierTrain, supplierApproval } from "../../../../actions"
import { SHOW_NewTrainPlot_MODEL, SHOW_CheckAttachedFiles_MODEL, SHOW_ApplyTrain_MODEL } from "../../../../constants/toggleTypes";
import NewTrainScheme from "./components/NewTrainScheme";
import CheckAttachedFiles from "../../../../components/CheckAttachedFiles";
import ApplyTrain from "./components/ApplyTrain";
@inject('toggleStore')
@observer
class TrainingScheme extends Component {
    state = {
        trainPlot: {
            list: [],
            recordsTotal: 1
        },
        curPage: 1,
        searchValue: {
            name: ""
        },
        selectedrecords: [],
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        editrecord: {},
        userTypeVerty: "",
        modelType:0
    };
    isSearch = false;
    onSelectChange = (selectedRowKeys, selectedrecords) => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ selectedRowKeys, selectedrecords });
    };
    handleReset = () => {
        this.setState({
            curPage: 1
        })
        this.props.form.resetFields();
        this.loaddata()
        this.setState({
            searchValue: {}
        })
    };
    // handleSearch = e => {
    //     e.preventDefault();
    //     this.props.form.validateFields((err, values) => {
    //         console.log(values)
    //         if (!err) {
    //             this.setState({
    //                 searchValue: values,
    //                 curPage: 1
    //             }, () => {
    //                 this.loaddata();
    //             })
    //         }
    //     });
    // };
    //搜索
    handleSearch(value) {
        console.log(value)
        this.setState({
            searchValue: {
                name: value
            },
            curPage: 1
        }, () => {
            this.loaddata();
        })
    }
    async loaddata(pageNum = 1, rowNum = 20) {
        console.log(this.state.userTypeVerty)
        const { userTypeVerty } = this.state;
        this.setState({
            curPage: pageNum,
            loading: true
        })
        let searchValue = this.state.searchValue;
      
        let trainPlot = await supplierTrain.getTrainSchmeList(  {pageNum, rowNum}) 
        console.log(trainPlot)
        this.setState({
            trainPlot: trainPlot.data,
            loading: false
        })
    }
    async componentDidMount() {
        const { roleNameKey } = supplierTrain.pageInfo
        const { toggleStore } = this.props;
        //获取所有审核角色名单
        let ApproveroleLists = await supplierApproval.getCharacter()
        //获取自身角色信息
        let roles = roleNameKey.split(',')
        //判断是否是审核角色
        for (let roleName of roles) {
            let userVerty = ApproveroleLists.some(item => item == roleName)
            if (userVerty) {
                this.setState({
                    userTypeVerty: 'approve'
                })
                break
            }
        }
        //监听流程窗口关闭
        window.closeModel = (modelname) => {
            toggleStore.setToggle(modelname)
            this.loaddata()
        }
        this.loaddata()
    }
    //分页查询
    async pageChange(page, num) {
        this.setState({
            curPage: page,
            selectedRowKeys: []
        })
        this.loaddata(page, num)
    }
    //删除培训策划
    async deleteTrainPlot() {
        await supplierTrain.deleteTrainPlot(this.state.selectedRowKeys);
        this.loaddata()
        this.setState({ selectedRowKeys: [] })
    }

    //查看培训策划详情
    async getTrainPlotDetail(record){
        const { toggleStore } = this.props;
        this.setState({
            editrecord: record,
            modelType:1
        })
        toggleStore.setToggle(SHOW_NewTrainPlot_MODEL)
    }
    //编辑培训策划
    async EditTrainPlot(record) {
        const { toggleStore } = this.props;
        this.setState({
            editrecord: record,
            modelType:2
        })
        toggleStore.setToggle(SHOW_NewTrainPlot_MODEL)
    }
    //查看附件详情
    checkfile(record) {
        const { toggleStore } = this.props;
        this.setState({
            editrecord: record,
        })
        toggleStore.setToggle(SHOW_CheckAttachedFiles_MODEL)
    }
    //申请培训
    applyTrain(record) {
        const { toggleStore } = this.props;
        this.setState({
            editrecord: record,
        })
        toggleStore.setToggle(SHOW_ApplyTrain_MODEL)
    }
    covertype(arr){
        let strarr = []
        if(arr==null) return
        arr.forEach(item=>{
            strarr.push(item.name)
        })
        return  strarr.join('，')
    }
    render() {
        const { toggleStore } = this.props;
        const { userTypeVerty, loading, selectedRowKeys, curPage, editrecord ,modelType} = this.state;
        const rowSelection = {
            columnWidth: 30,
            selectedRowKeys,
            type:'checkbox',
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        let TableOpterta = () => (
            <div className="table-operations">
                <Button icon="plus" type="primary" onClick={() => {  toggleStore.setToggle(SHOW_NewTrainPlot_MODEL);this.setState({modelType:0}) }}>新建</Button>
                <Popconfirm className="confirm_del" placement="bottom" title={'确认要删除吗？'} onConfirm={() => { this.deleteTrainPlot() }}>
                    <Button type="danger" disabled={!hasSelected} >删除</Button>
                </Popconfirm>
            </div>
        )
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 50,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '编号',
                dataIndex: 'code',
                width: 80,
                align: "center",
            },
            {
                title: '培训策划名称',
                dataIndex: 'name',
                width: 200,
                align: "center",
                render: (text, record) => <Tooltip title={text}><span onClick={()=>this.getTrainPlotDetail(record)} style={{ cursor: "pointer", 'color': '#3383da'}}>{text && text.substr(0, 20)}</span></Tooltip>
            },
            {
                title: '培训类型',
                dataIndex: 'trainTypeName',
                width: 200,
                align: "center",
               render:(text,record)=>record.type && `${record.type=="zx"?'专项->':'准入->'} ${this.covertype(record.trainplottype)}` 
            },
            {
                title: '人员规模',
                dataIndex: 'rygm',
                width: 80,
                align: "center",
            },
            {
                title: '培训主题',
                dataIndex: 'zt',
                width: 239,
                align: "center",
            },
            {
                title: '培训时间',
                dataIndex: 'time',
                width: 170,
                align: "center",
                // sorter: (a, b) => (moment(a.trainShift).valueOf() - moment(b.trainShift).valueOf()),
                // render: (text) => <Tooltip title={text && text.substr(0, 10)}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '培训对象',
                dataIndex: 'pxdx',
                width: 120,
                align: "center",
            },
            {
                title: '发布时间',
                dataIndex: 'createTime',
                width: 150,
                align: "center",
                sorter: (a, b) => (moment(a.createTime).valueOf() - moment(b.createTime).valueOf()),
                render: (text) => <Tooltip title={text && text.substr(0, 10)}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
         
           
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                align: "center",
                sorter: (a, b) => (Number(a.status) - Number(b.status)),
                render: (text,record) => { return userTypeVerty == 'approve' ?(text == 3 ? '审批' : "未审批"):(text == null ? '未申请':(text == 0 ? '未提交' : (text == 1 ||text == 2 ? "已申请" : (text == 3 ?"已完成":""))))  }
            },
            {
                title: '操作',
                dataIndex: 'modify',
                align: "center",
                fixed: "right",
                width: 100,
                render: (text, record) => {
                    return (
                        <Button type="primary" disabled={record.status == 20}
                        onClick={() => { this.EditTrainPlot(record) }}
                        style={{ marginRight: 5 }} size={'small'}>编辑</Button>  
                        
                //         userTypeVerty == 'approve' ? (record.status==3?"":<div>
                //     <Button type="primary" disabled={record.status == 20}
                //         onClick={() => { this.EditTrainPlot(record) }}
                //         style={{ marginRight: 5 }} size={'small'}>编辑</Button>
                // </div>) :(record.status == null?(<Button type="primary"
                //         onClick={() => { this.applyTrain(record) }}
                //         style={{ marginRight: 5 }} size={'small'}>申请</Button>):"") 
                        )
                }
            }
        ];
        return (
            <Layout title={"供应商培训策划管理"}>
                <Card title={<TableOpterta /> } extra={<Search placeholder="搜索培训策划名称" onSearch={value => { this.handleSearch(value) }} enterButton />}>
                    {
                        toggleStore.toggles.get(SHOW_NewTrainPlot_MODEL) && <NewTrainScheme refreshData={() => this.loaddata()} modelType={modelType} info={editrecord} />
                    }
                    {/* {
                        toggleStore.toggles.get(SHOW_EditTrainPlot_MODEL) && <EditTrainPlot editrecord={editrecord} refreshData={() => this.loaddata()} />
                    } */}
                    {
                        toggleStore.toggles.get(SHOW_CheckAttachedFiles_MODEL) && <CheckAttachedFiles editrecord={editrecord} />
                    }
                    {
                        toggleStore.toggles.get(SHOW_ApplyTrain_MODEL) && <ApplyTrain editrecord={editrecord} refreshData={() => this.loaddata()} />
                    }
                    <Table
                        size='middle'
                        loading={loading}
                        className={'gys_table_height'}
                        bordered={true} rowKey={(text) => text.id} rowSelection={ rowSelection } scroll={{ x: 1900 }} columns={columns} pagination={{
                            showTotal: () => `共${this.state.trainPlot.recordsTotal}条`, current: curPage, onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: {
                                goButton: <Button type="link" size={'small'}>
                                    跳转
                            </Button>
                            }, total: this.state.trainPlot.recordsTotal, pageSize: 20
                        }} dataSource={this.state.trainPlot.list} />
                </Card>
            </Layout>
        )
    }
}
TrainingScheme.propTypes = {
}
export default Form.create({ name: 'TrainingScheme' })(TrainingScheme);