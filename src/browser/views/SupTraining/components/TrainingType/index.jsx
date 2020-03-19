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
import { supplierTrain } from "../../../../actions"
import { SHOW_NewTrainType_MODEL, SHOW_EditTrainType_MODEL } from "../../../../constants/toggleTypes";
import NewTrainType from "./components/NewTrainType";
import EditTrainType from "./components/EditTrainType";
@inject('toggleStore')
@observer
class TrainingType extends Component {
    state = {
        trainTypeList: {
            list: [],
            recordsTotal: 0
        },
        curPage: 1,
        searchValue: {
            trainName: ""
        },
        selectedrecords: [],
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        editrecord: ""
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
    /* handleSearch = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            console.log(values)
            if (!err) {
                this.setState({
                    searchValue: values,
                    curPage: 1
                }, () => {
                    this.loaddata();
                })
            }
        });
    }; */
     //搜索
     handleSearch(value) {
        console.log(value)
        this.setState({
            searchValue: {
                trainName: value
            },
            curPage: 1
        }, () => {
            this.loaddata();
        })
    }
    async loaddata(pageNum = 1, rowNum = 20) {
        this.setState({
            curPage: pageNum,
            loading: true
        })
        let searchValue = this.state.searchValue;
        let trainTypeList = await supplierTrain.getTrainingTypes(pageNum, rowNum, searchValue);
        console.log(trainTypeList)
        this.setState({
            trainTypeList: trainTypeList,
            loading: false
        })
    }
    componentDidMount() {
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
    //删除培训类型
    async deleteTrainType() {
        await supplierTrain.deleteTrainType(this.state.selectedRowKeys);
        this.loaddata()
        this.setState({ selectedRowKeys: [] })
    }
    //编辑培训类型
    async editTrainType(record) {
        const { toggleStore } = this.props;
        this.setState({
            editrecord: record,
        },()=>{
            toggleStore.setToggle(SHOW_EditTrainType_MODEL)
        })
    }
    render() {
        const { toggleStore } = this.props;
        const { loading, selectedRowKeys, curPage, editrecord } = this.state;
        const rowSelection = {
            columnWidth: 30,
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        const { getFieldDecorator } = this.props.form;
        let TableOpterta = () => (
            <div className="table-operations">
                <Button icon="plus" type="primary" onClick={() => { console.log("新建"); toggleStore.setToggle(SHOW_NewTrainType_MODEL) }}>新建</Button>
                {/* <Button type="primary" disabled={!hasSelected} onClick={() => { console.log("修改") }}>修改</Button> */}
                <Popconfirm className="confirm_del" placement="bottom" title={'确认要删除吗？'} onConfirm={() => { console.log("删除"); this.deleteTrainType() }}>
                    <Button type="danger" disabled={!hasSelected} >删除</Button>
                </Popconfirm>
            </div>
        )
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                // fixed: "left",
                render: (text, index, key) => key + 1
            },
            {
                title: '培训类型名称',
                dataIndex: 'trainName',
                width: 200,
                // fixed: "left",
                align: "center",
            },
            {
                title: '供应商类别',
                dataIndex: 'trainGysTypeList',
                width: 200,
                align: "center",
                render: (text, redord) => {
                    let gystype = [];
                    for (let data of text) {
                        if (data.gysTypeName) {
                            gystype.push(data.gysTypeName)
                        }
                    };
                    return <span>{gystype.join(",")}</span>
                }
            },
            {
                title: '专家类别',
                dataIndex: 'trainExpertTypeList',
                width: 200,
                align: "center",
                render: (text, redord) => {
                    let pxzjtype = [];
                    for (let data of text) {
                        if (data.expertTypeName) {
                            pxzjtype.push(data.expertTypeName);
                        }
                    };
                    return <span>{pxzjtype.join(",")}</span>
                }
            },
            {
                title: '创建日期',
                dataIndex: 'createTime',
                width: 100,
                align: "center",
                sorter: (a, b) => (moment(a.createTime).valueOf() - moment(b.createTime).valueOf()),
                render: (text) => <Tooltip title={text && text.substr(0, 10)}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '更新时间',
                dataIndex: 'updateTime',
                width: 100,
                align: "center",
                sorter: (a, b) => (moment(a.updateTime).valueOf() - moment(b.updateTime).valueOf()),
                // render: (text) => <span>{text && text.replace(/\.0$/, '')}</span>
                render: (text) => <Tooltip title={text && text.substr(0, 10)}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            /* {
                title: '是否有效',
                dataIndex: 'status',
                width: 100,
                align: "center",
                render: (text) => { return text == "yes" ? '是' : '否' },
            }, */
            {
                title: '操作',
                dataIndex: 'modify',
                align: "center",
                width: 100,
                // fixed: "right",
                render: (text, record) => {
                    return (<div>
                        <Button type="primary" disabled={record.status == 20}
                            onClick={() => { this.editTrainType(record) }}
                            style={{ marginRight: 5 }} size={'small'}>编辑</Button>
                    </div>)
                }
            }
        ];
        return (
            <Layout title={"供应商培训管理"} >
                <Card extra={<Search placeholder="培训类型名称" onSearch={value => { this.handleSearch(value) }} enterButton />}>
                    {
                        toggleStore.toggles.get(SHOW_NewTrainType_MODEL) && <NewTrainType refreshData={() => this.loaddata()} />
                    }
                    {
                        toggleStore.toggles.get(SHOW_EditTrainType_MODEL) && <EditTrainType editrecord={editrecord} refreshData={() => this.loaddata()} />
                    }
                    <TableOpterta />
                    <Table
                        size='middle'
                        loading={loading}
                        className={'gys_table_height'}
                        bordered={true} rowKey={(text) => text.id} rowSelection={rowSelection} scroll={{ x: 945 }} columns={columns} pagination={{
                            showTotal: () => `共${this.state.trainTypeList.recordsTotal}条`, current: curPage, onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: {
                                goButton: <Button type="link" size={'small'}>
                                    跳转
                            </Button>
                            }, total: this.state.trainTypeList.recordsTotal, pageSize: 20
                        }} dataSource={this.state.trainTypeList.list} />
                </Card>
            </Layout>
        )
    }
}
TrainingType.propTypes = {
}
export default Form.create({ name: 'TrainingType' })(TrainingType);