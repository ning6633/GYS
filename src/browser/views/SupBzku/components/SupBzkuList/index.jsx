import React, { Component, Fragment } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Table, Tooltip, Form, Input, Button, message, Upload, Icon, Row, Col, Checkbox, Popconfirm } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import _ from "lodash";
import { SHOW_ShowBZkuAdd_MODEL } from "../../../../constants/toggleTypes";
import { supplierAction } from "../../../../actions"
import SupBZkuManager from "../../../SupBzku/components/SupBZkuNanner/index"
import "./index.less";
const { Search } = Input
@inject('toggleStore', 'supplierStore')
@observer
class SupBzkuList extends Component {
    state = {
        supplierList: {
            list: [],
            recordsTotal: 0
        },
        curPage: 1,
        searchValue: '',
        companyInfo: {},
        selectedRowKeys: [],
        selectedrecords: [], // Check here to configure the default column
        loading: false,
        isEditorBzSup: true, // 标准库是否可以编辑,
        name: '',
        code: '',
        property: '',
        district: '',
        flag: true
    };
    isSearch = false;

    onSelectChange = (selectedRowKeys, selectedrecords) => {
        this.setState({ selectedRowKeys, selectedrecords });
    };
    async addgysInfosTjBjk(redord) {

    }
    chooseBZcompany(data) {
        const { setFieldsValue } = this.props.form;
        this.setState({
            companyInfo: data
        })
        setFieldsValue({
            org_id_name: data.name
        })
    }
    gysStorageInfosexcel() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { deptid } = this.state.companyInfo
                supplierAction.gysStorageInfosexcel({ ...values, dept_id: deptid })
            }
        });
    }

    handleSearch(over) {

        if (over == 'search') {
            this.props.form.validateFields((wee, values) => {
                console.log(values)
                this.setState({
                    searchValue: values,
                    curPage: 1
                })

                this.isSearch = true
                this.searchBzkuSupplierList(values)
            })
        } else {
            this.isSearch = false
            this.props.form.setFields({
                name: "",
                code: "",
                property: "",
                district: ""
            })
           
            this.loaddata()
        }

    }
    handleReset = () => {
        this.props.form.resetFields();
        this.setState({
            curPage: 1
        })
        this.loaddata()
        this.setState({
            companyInfo: {}
        })
    };
    async deleteSupplierBZkuInfo() {
        // let flag = true;
        // let status20 = [];
        // let { selectedrecords } = this.state;
        // for (let i = 0; i < selectedrecords.length; i++) {
        //     if (selectedrecords[i].status == 20) {
        //         flag = false;
        //         status20.push(i + 1)
        //     }
        // }
        let res = await supplierAction.deleteBZkuInfo(this.state.selectedrecords[0].provider_id);
        if (res.code == 200) {
            this.loaddata()
        }
        // if (flag) {
        //     let supplierList = await supplierAction.deleteSupplierBZkuInfo(this.state.selectedRowKeys);
        //     this.loaddata()
        // } else {
        //     message.error(`当前所选数据中包括已提交数据，系统无法删除！`)
        // }
    }
    async loaddata(pageNum = 1, rowNum = 20) {
        this.setState({ curPage: pageNum, loading: true });
        let supplierList = await supplierAction.searchBzkuSupplierList(pageNum, rowNum,{});
        this.setState({
            supplierList: supplierList,
            loading: false
        })
    }

    async uploadSupplierBZkuInfo() {
        if (this.state.isEditorBzSup) {
            // 编辑供应商标准库信息
            const { toggleStore, supplierStore } = this.props;
            let { supplierList } = this.state;
            if (this.state.selectedrecords[0] == undefined) {
                message.error('请先选择要修改的数据')
            } else {
                supplierStore.isRKeditor = true;
                let { id } = this.state.selectedrecords[0]
                supplierStore.islookRKdetail = false;
                toggleStore.setToggle(SHOW_ShowBZkuAdd_MODEL);
                let selectData = _.find(supplierList.list, { id: id })
                supplierStore.setEditSupplierBZkuFeedback(selectData);
            }
        }
    }
    async editSupplierBZkuInfo(selectData) {
        // 点击供应商名称也是编辑标准库信息
        if (this.state.isEditorBzSup) {
            const { toggleStore, supplierStore } = this.props;
            supplierStore.isRKeditor = true;
            supplierStore.islookRKdetail = false;
            supplierStore.setEditSupplierBZkuFeedback(selectData);
            toggleStore.setToggle(SHOW_ShowBZkuAdd_MODEL);
        }
    }
    async searchBzkuSupplierList(searchval, pageNum = 1, rowNum = 20, ) {
        this.setState({ loading: true, flag: true });
        let supplierList = await supplierAction.searchBzkuSupplierList(pageNum, rowNum, searchval);
        console.log(supplierList)
        this.setState({
            supplierList: supplierList,
            loading: false,

        })
    }
    //分页查询
    async pageChange(page, num) {
        this.setState({
            curPage: page
        })
        if (this.isSearch) {
            this.searchBzkuSupplierList(this.state.searchValue, page, num)
        } else {
            this.loaddata(page, num)
        }
    }
    lookGysDetail(redord) {
        const { toggleStore, supplierStore } = this.props;
        /* supplierStore.islookRKdetail = true;
        supplierStore.setEditSupplierBase(redord)
        toggleStore.setToggle(SHOW_SupInfoManager_MODEL) */
    }
    dcExcelBzk(islinshi = false) {
        let { searchValue } = this.state;
        if (islinshi) {
            //临时导出
            supplierAction.gysBaseInfosexcel()
        } else {
            // 导出
            supplierAction.gysPartBaseInfoExcel(searchValue)
        }
    }
    componentDidMount() {
        this.loaddata()
        this.setState({
            curPage: 1
        })
    }
    render = () => {
        const { toggleStore, supplierStore } = this.props;
        const { loading, selectedRowKeys, curPage, name, code, property, district, flag } = this.state;
        const { getFieldDecorator } = this.props.form;
        const rowSelection = {
            columnWidth: 30,
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: 'radio'
        };
        const formItemLayout = {
            labelCol: { span: 10 },
            wrapperCol: { span: 14 },
        };
        const that = this
        const hasSelected = selectedRowKeys.length > 0;
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                fixed: "left",
                render: (text, index, key) => key + 1
            },
            {
                title: '供应商名称',
                dataIndex: 'name',
                width: 300,
                align: "center",
                fixed: "left",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.editSupplierBZkuInfo(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 20)}</span></Tooltip>
            },
            {
                title: '简称/别称',
                dataIndex: 'name_other ',
                width: 200,
                align: "center",
            },
            {
                title: '统一社会信用代码',
                dataIndex: 'code',
                width: 230,
                align: "center",
            },
            {
                title: '企业性质',
                dataIndex: 'property',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text}</span></Tooltip>
            },
            {
                title: '行政区域',
                dataIndex: 'district',
                width: 230,
                align: "center",
            },
            {
                title: '通讯地址',
                dataIndex: 'contact_address',
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            /* {
                title: '上报单位',
                dataIndex: 'org_id_name',
                width: 200,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            }, */
            {
                title: '注册资金',
                dataIndex: 'regist_fund',
                width: 160,
                align: "center",
            },
            {
                title: '创建人',
                dataIndex: 'createuser',
                width: 160,
                align: "center",
            },
            {
                title: '创建时间',
                dataIndex: 'createdate',
                width: 150,
                align: "center",
                sorter: (a, b) => (moment(a.createdate).valueOf() - moment(b.createdate).valueOf()),
                render: (text) => <Tooltip title={text.replace(/\.0$/, '')}><span>{text && text.substr(0, 10)}</span></Tooltip>
            }
        ];

        let TableOpterta = () => {
            return (
                <Row>
                    <div className="table-operations">
                        <Button icon="plus" type="primary" onClick={() => {
                            let { supplierStore } = this.props
                            supplierStore.isRKeditor = false;
                            supplierStore.islookRKdetail = false;
                            toggleStore.setToggle(SHOW_ShowBZkuAdd_MODEL);
                            supplierStore.setEditSupplierBZkuFeedback();
                        }}>新增</Button>
                        <Popconfirm className="confirm_del" placement="bottom" title={'确认要删除吗？'} disabled={!hasSelected} onConfirm={() => { this.deleteSupplierBZkuInfo() }}>
                            <Button type="danger" disabled={!hasSelected} >删除</Button>
                        </Popconfirm>
                        {
                            this.state.isEditorBzSup && <Button onClick={this.uploadSupplierBZkuInfo.bind(this, 1)}>编辑</Button>
                        }
                        <Button onClick={() => { this.dcExcelBzk() }}>导出</Button>
                        {/* <Button onClick={() => { this.dcExcelBzk(true) }}>临时导出</Button> */}

                    </div>
                </Row>
            )
        }

        return (
            <Card title={<TableOpterta />} >
                {
                    toggleStore.toggles.get(SHOW_ShowBZkuAdd_MODEL) && <SupBZkuManager refreshData={() => this.loaddata()} />
                }
                <Form className="ant-advanced-search-form" layout="inline">
                    <Row gutter={24} >
                        <Col span={5}>
                            <Form.Item {...formItemLayout} label={'名称或简称：'}>
                                {getFieldDecorator('name', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '名称或简称',
                                        },
                                    ],
                                })(<Input />)}
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item {...formItemLayout} label={'社会信用代码：'}>
                                {getFieldDecorator('code', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '社会信用代码：',
                                        },
                                    ],
                                })(<Input />)}
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item {...formItemLayout} label={'企业性质：'}>
                                {getFieldDecorator('property', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '企业性质：',
                                        },
                                    ],
                                })(<Input />)}
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item {...formItemLayout} label={'行政区域：'}>
                                {getFieldDecorator('district', {
                                    rules: [
                                        {
                                            required: false,
                                            message: '行政区域：',
                                        },
                                    ],
                                })(<Input />)}
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item style={{ width: 150 }}>
                                <Button style={{ marginRight: 20 }} type="primary" onClick={() => { this.handleSearch("search") }}>搜索</Button>
                                <Button type="primary" onClick={() => { this.handleSearch("again") }}>重置</Button>
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>
                <hr />
                <Table
                    rowSelection={rowSelection}
                    rowKey={(text) => text.id}
                    className={'gys_table_height'}
                    scroll={{ x: 1870 }}
                    size='middle'
                    loading={loading}
                    rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''}
                    bordered={true} rowKey={(text) => text.id}
                    columns={columns} pagination={{
                        showTotal: () => `共${this.state.supplierList.recordsTotal}条`,
                        onChange: (page, num) => { this.pageChange(page, num) }, current: curPage, showQuickJumper: {
                            goButton: <Button type="link" size={'small'}>
                                跳转
                            </Button>
                        }, total: this.state.supplierList.recordsTotal, pageSize: 20
                    }}
                    dataSource={this.state.supplierList.list} />
            </Card>
        )
    }
}

SupBzkuList.propTypes = {
}
export default Form.create({ name: 'SupBzkuList' })(SupBzkuList);