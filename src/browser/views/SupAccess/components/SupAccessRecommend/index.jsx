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
import { SHOW_NewTrainType_MODEL, SHOW_EditTrainType_MODEL ,SHOW_ChooseCompany_MODEL} from "../../../../constants/toggleTypes";
import NewRecommend from "./components/NewRecommend";
import EditTrainType from "./components/EditTrainType";
import ChooseCompanyModel  from './components/ChooseCompanyModel'
@inject('toggleStore')
@observer
class SupAccessRecommend extends Component {
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
                <Button icon="plus" type="primary" onClick={() => {  toggleStore.setToggle(SHOW_NewTrainType_MODEL) }}>新建</Button>
                {/* <Button type="primary" disabled={!hasSelected} onClick={() => { console.log("修改") }}>修改</Button> */}
                <Popconfirm className="confirm_del" placement="bottom" title={'确认要删除吗？'} onConfirm={() => { console.log("删除"); this.deleteTrainType() }}>
                    <Button type="danger" disabled={!hasSelected} >删除</Button>
                </Popconfirm>
            </div>
        )
        let TableExtra = ()=>(
            // <div className="">
            //       <Search placeholder="名称" style={{float:"right" }} onSearch={value => { this.handleSearch(value) } }enterButton />

            //             {/* <Select style={{ width: 160, marginLeft: 20,float:"right" }}  defaultValue='0'>
            //                          <Option key={0} value={'0'}>待办</Option>
            //                          <Option key={1} value={'1'}>已办</Option>
            //              </Select> */}
            // </div>

            <Row >
                    <Col span={12}>
                    <Select defaultValue={'0'}  style={{ width: 120}} >
                    <Option key={0} value={'0'}>待办</Option>
                    <Option key={1} value={'1'}>已办</Option>
                        <Option key={2} value="">全部</Option>
                    </Select>
                    </Col>
                    <Col span={12}>   <Search placeholder="名称" style={{float:"right" }} onSearch={value => { this.handleSearch(value) } }enterButton /></Col>
            </Row>
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
                title: '被推荐供应商名称',
                dataIndex: 'trainName',
                width: 200,
                // fixed: "left",
                align: "center",
            },
            {
                title: '统一社会信用代码',
                dataIndex: 'code',
                width: 200,
                align: "center",
              
            },
            {
                title: '推荐的产品类别',
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
          
        //    {
        //         title: '状态',
        //         dataIndex: 'status',
        //         width: 100,
        //         align: "center",
        //         render: (text) => { return text == "yes" ? '是' : '否' },
        //     }, 
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
                           <Button type="primary"
                           onClick={() => { toggleStore.setToggle(SHOW_ChooseCompany_MODEL)}}
                            style={{ marginRight: 5 }} size={'small'}>提交</Button>
                    </div>)
                }
            }
        ];
        return (
            <Layout title={"我的推荐管理"} >
                <Card title={ <TableOpterta />} extra={<TableExtra />}  >
                    {
                        toggleStore.toggles.get(SHOW_NewTrainType_MODEL) && <NewRecommend refreshData={() => this.loaddata()} />
                    }
                    {
                        toggleStore.toggles.get(SHOW_ChooseCompany_MODEL) && <ChooseCompanyModel editrecord={editrecord} refreshData={() => this.loaddata()} />
                    }
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
SupAccessRecommend.propTypes = {
}
export default Form.create({ name: 'SupAccessRecommend' })(SupAccessRecommend);