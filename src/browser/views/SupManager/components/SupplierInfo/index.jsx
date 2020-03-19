import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Upload, Icon, Tooltip, message, Select, Form, Row, Col, Input, Popconfirm } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import _ from "lodash";
import { SHOW_LOGIN_MODEL, SHOW_FeedBack_MODEL, SHOW_SupInfoManager_MODEL, SHOW_ChooseCompany_MODEL } from "../../../../constants/toggleTypes";
import { supplierAction } from "../../../../actions"
import NewSupplier from "../NewSupplier";
import SupInfoManager from "../SupInfoManager";
import ChooseCompany from "../../../../components/Choosecompany"
import FeedBack from "../FeedBack";
import "./index.less";
const { Option } = Select;
const ButtonGroup = Button.Group;

@inject('toggleStore', 'supplierStore')
@observer
class SupplierInfo extends Component {
    state = {
        supplierList: {
            list: [],
            recordsTotal: 0
        },
        curPage: 1,
        searchValue: '',
        companyInfo: {},
        selectedrecords: [],
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
    };
    isSearch = false;
    onSelectChange = (selectedRowKeys, selectedrecords) => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ selectedRowKeys, selectedrecords });
    };
    async submitSupplierInfo(redord, ischehui) {
        let { curPage, searchValue } = this.state;
        if (!ischehui) {
            const { toggleStore, supplierStore } = this.props;
            // 提交信息body 体
            let tjInfoBody =
            {
                "code": redord.code,
                "dept_id": redord.dept_id,
                "id": redord.id,
                "level": redord.level,
                "name": redord.name,
                "property_key": redord.property_key,
                "updateuser": supplierAction.pageInfo.userId,
            }
            // 校验信息是否存在问题
            let ret = await supplierAction.verifySupplierInfo(tjInfoBody)
            if (ret) {
                let supplierList = await supplierAction.submitSupplierInfo(tjInfoBody);
            }
        } else {
            // 如果是撤回的话：
            let ret = await supplierAction.tuihuiSupplierInfo(redord.id)
        }
        if (this.isSearch) {
            let { deptid } = this.state.companyInfo
            this.searchWithTypeSupplierList({ ...searchValue, dept_id: deptid }, curPage)
        } else {
            this.loaddata(curPage)
        }
    }
    async submitSupplierInfopl() {
        let { curPage } = this.state;
        let supplierList = await supplierAction.submitSupplierInfo(this.state.selectedRowKeys);
        message.success("提交成功")
        this.loaddata(curPage)
    }
    async deleteSupplierInfo() {
        let flag = true;
        let status20 = [];
        let { selectedrecords, curPage } = this.state;
        for (let i = 0; i < selectedrecords.length; i++) {
            if (selectedrecords[i].status == 20) {
                flag = false;
                status20.push(i + 1)
            }
        }
        if (flag) {
            let supplierList = await supplierAction.deleteSupplierInfo(this.state.selectedRowKeys);
            this.setState({
                selectedrecords: [],
                selectedRowKeys: [],
            })
            this.loaddata(curPage)
        } else {
            message.error(`当前所选数据中包括已提交数据，系统无法删除！`)
        }
    }
    editorSupplierInfo(redord, islookdetail = false) {
        const { toggleStore, supplierStore } = this.props;
        if (islookdetail) {
            // 查看详情
            supplierStore.setEditSupplierInfo(redord)
            supplierStore.iseditor = true;
            supplierStore.islookdetail = true;
            toggleStore.setToggle(SHOW_LOGIN_MODEL)
        } else {
            supplierStore.islookdetail = false;
            if (redord.status == !20) {
                supplierStore.setEditSupplierInfo(redord)
                supplierStore.iseditor = true;
                toggleStore.setToggle(SHOW_LOGIN_MODEL)
            } else {
                message.error("已提交供应商记录，无法编辑")
            }
        }
    }
    async loaddata(pageNum = 1, rowNum = 20) {
        this.setState({
            curPage: pageNum,
            loading: true
        })
        let supplierList = await supplierAction.getSupplierList(pageNum, rowNum);
        console.log(supplierList)
        this.setState({
            supplierList: supplierList,
            loading: false
        })
    }
    //分页查询
    async pageChange(page, num) {
        this.setState({
            curPage: page,
            selectedRowKeys: []
        })
        if (this.isSearch) {
            let { deptid } = this.state.companyInfo
            this.searchWithTypeSupplierList({ ...this.state.searchValue, dept_id: deptid }, page, num)
        } else {
            this.loaddata(page, num)
        }
    }
    async feedbackQus() {
        const { toggleStore, supplierStore } = this.props;
        let { selectedRowKeys, supplierList } = this.state;
        supplierStore.islookFkdetail = false;
        if (selectedRowKeys.length == 1) {
            let selectData = _.find(supplierList.list, { id: selectedRowKeys[0] })
            supplierStore.setEditSuppliersupFeedback(selectData);
            toggleStore.setToggle(SHOW_FeedBack_MODEL)
        } else {
            message.warning("问题反馈只支持选择一个供应商")
        }
    }
    gysTbInfosexcel() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // 根据当前搜索条件导出 EXCEL
                let { deptid } = this.state.companyInfo
                let { userId, departmentId } = supplierAction.pageInfo
                supplierAction.gysTbInfosexcel({ ...values, dept_id: deptid, userId, departmentId: departmentId })
            }
        });
    }
    componentDidMount() {
        this.loaddata()
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
    handleSearch = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    searchValue: values,
                    curPage: 1
                })
                // 判断当前搜索输入框内是否有值，有值就是搜索，没值就是重新获取数据
                let flag = false;
                for (let key in values) {
                    if (values[key]) {
                        flag = true;
                    }
                }
                if (flag) {
                    this.isSearch = true
                    let { deptid } = this.state.companyInfo
                    this.searchWithTypeSupplierList({ ...values, dept_id: deptid })
                } else {
                    this.isSearch = false
                    this.loaddata()
                }
            }
        });
    };
    async searchWithTypeSupplierList(searchval, pageNum = 1, rowNum = 20, ) {
        this.setState({ loading: true });
        let supplierList = await supplierAction.searchWithTypeSupplierList(pageNum, rowNum, searchval);
        this.setState({
            supplierList: supplierList,
            loading: false
        })
    }
    handleReset = () => {
        this.setState({
            curPage: 1
        })
        this.props.form.resetFields();
        this.loaddata()
        this.setState({
            companyInfo: {}
        })
    };
    render() {
        console.log(this.state)
        const { toggleStore, supplierStore } = this.props;
        const { loading, selectedRowKeys, curPage } = this.state;
        const rowSelection = {
            columnWidth: 30,
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const that = this;
        const hasSelected = selectedRowKeys.length > 0;
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                fixed: "left",
                render: (text, index, key) => key + 1
            },
            {
                title: '供应商名称',
                dataIndex: 'name',
                width: 200,
                align: "center",
                fixed: "left",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.editorSupplierInfo(redord, redord.status == 20) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 15)}</span></Tooltip>
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 120,
                align: "center",
                render: (text) => text == 20 ? '已提交' : '未提交'
            },
            {
                title: '统一社会信用代码',
                dataIndex: 'code',
                width: 230,
                align: "center",
            },
            {
                title: '企业性质',
                dataIndex: 'property_key',
                width: 150,
                align: "center",
            },
            {
                title: '简称',
                dataIndex: 'name_other',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '别称',
                dataIndex: 'another_name',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '行政区域',
                dataIndex: 'district_key',
                width: 230,
                align: "center",
            },
            {
                title: '上报院',
                dataIndex: 'org_id_name',
                width: 200,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 12)}</span></Tooltip>
            },
            {
                title: '上报单位',
                dataIndex: 'dept_name',
                width: 200,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 12)}</span></Tooltip>
            },
            {
                title: '供应商次1-10',
                dataIndex: 'level',
                width: 160,
                align: "center",
            },
            {
                title: '是否有差异',
                dataIndex: 'is_diff',
                width: 100,
                align: "center",
                render: (text) => { return text == 0 ? '否' : '是' },
            },
            {
                title: '数据上报时间',
                dataIndex: 'gys_create_time',
                width: 200,
                align: "center",
                sorter: (a, b) => (moment(a.gys_create_time).valueOf() - moment(b.gys_create_time).valueOf()),
                render: (text) => <Tooltip title={text && text.substr(0, 10)}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '更新时间',
                dataIndex: 'update_time',
                width: 200,
                align: "center",
                sorter: (a, b) => (moment(a.update_time).valueOf() - moment(b.update_time).valueOf()),
                render: (text) => <span>{text && text.replace(/\.0$/, '')}</span>
            },
            {
                title: '操作',
                dataIndex: 'modify',
                align: "center",
                width: 150,
                fixed: "right",
                render: (text, redord) => {
                    return (<div><Button disabled={redord.status == 20} onClick={() => { this.editorSupplierInfo(redord) }} style={{ marginRight: 5 }} size={'small'}>编辑</Button>   {redord.status == 20 ? <Button onClick={() => { this.submitSupplierInfo(redord, true) }} size={'small'}>撤回</Button> : <Button onClick={() => { this.submitSupplierInfo(redord) }} size={'small'}>提交</Button>}</div>)
                }
            },
        ];

        const uploadProps = {
            name: 'file',
            action: `${supplierAction.BaseURL}files?userId=${supplierAction.pageInfo.userId}&departmentId=${supplierAction.pageInfo.departmentId}`,
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    // console.log(info.file, info.fileList);
                    message.loading('loading', 3)
                }
                if (info.file.status === 'done') {
                    // console.log(info.file);
                    message.info(`${info.file.name} 文件上传成功，正在等待服务端转换...`);
                    setTimeout(() => {
                        try {
                            message.success(info.file.response.message)
                        } catch (error) {
                            message.error(error);
                        }
                        message.success("开始加载数据...")
                        that.loaddata();
                    }, 3000);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 文件上传失败`);
                }
            },
        };
        let TableOpterta = () => (
            <div className="table-operations">
                <Button icon="plus" type="primary" onClick={() => { toggleStore.setToggle(SHOW_LOGIN_MODEL); supplierStore.iseditor = false; supplierStore.islookdetail = false; }}>填报数据</Button>
                <Popconfirm className="confirm_del" disabled={!hasSelected} placement="bottom" title={'确认要删除吗？'} onConfirm={() => { this.deleteSupplierInfo() }}>
                    <Button type="danger" disabled={!hasSelected} >删除</Button>
                </Popconfirm>
                <Button type="primary" disabled={!hasSelected} onClick={() => { this.feedbackQus() }}>供应商问题反馈</Button>
                <div style={{ display: "inline-block", marginRight: 8 }}>
                    <Upload {...uploadProps}>
                        <Button>
                            <Icon type="upload" />上传Excel文件
                        </Button>
                    </Upload>
                </div>
                {/* <Button type="primary" disabled={!hasSelected} onClick={() => { this.submitSupplierInfopl() }}>提交</Button> */}
                <Button icon="download" onClick={() => window.open(supplierAction.FileBaseURL + '2')}>下载模板</Button>
                <Button icon="plus" type="primary" onClick={() => { supplierStore.islookRKdetail = false; supplierStore.isRKeditor = false; toggleStore.setToggle(SHOW_SupInfoManager_MODEL); }}>新增供应商</Button>
                {/* <Button icon="arrow-up">导出</Button> */}
            </div>
        )

        return (
            <Card>
                {
                    toggleStore.toggles.get(SHOW_LOGIN_MODEL) && <NewSupplier refreshData={() => this.loaddata()} />
                }
                {
                    toggleStore.toggles.get(SHOW_FeedBack_MODEL) && <FeedBack />
                }
                {
                    toggleStore.toggles.get(SHOW_SupInfoManager_MODEL) && <SupInfoManager refreshData={() => this.loaddata()} />
                }
                <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                    <Row className="gys_tb_search">
                        <Col md={6} xl={{ span: 5, offset: 4 }} xxl={{ span: 5, offset: 6 }}  >
                            <Form.Item label={`名称或简称`}>
                                {getFieldDecorator(`name`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: 'Input something!',
                                        },
                                    ],
                                    initialValue: ""
                                })(<Input style={{ width: 150 }} placeholder="" />)}
                            </Form.Item>
                        </Col>
                        <Col md={4} xl={3} xxl={3} >
                            <Form.Item label={`状态`}>
                                {getFieldDecorator(`status`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: 'Input something!',
                                        },
                                    ],
                                    initialValue: ""
                                })(<Select style={{ width: 100, marginRight: 10 }} >
                                    <Option value="20">已提交</Option>
                                    <Option value="0">未提交</Option>
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col md={4} xl={3} xxl={3}>
                            <Form.Item label={`次`}>
                                {getFieldDecorator(`level`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: 'Input something!',
                                        },
                                    ],
                                })(<Select style={{ width: 100, marginRight: 10 }}>
                                    <Option value="一次">一次</Option>
                                    <Option value="二次">二次</Option>
                                    <Option value="三次">三次</Option>
                                    <Option value="四次">四次</Option>
                                    <Option value="五次">五次</Option>
                                    <Option value="六次">六次</Option>
                                    <Option value="七次">七次</Option>
                                    <Option value="八次">八次</Option>
                                    <Option value="九次">九次</Option>
                                    <Option value="十次">十次</Option>
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col md={5} xl={5} xxl={4}>
                            <Form.Item label={`上报单位`}>
                                {getFieldDecorator(`org_id_name`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: 'Input something!',
                                        },
                                    ],
                                })(<Input style={{ width: 130 }} disabled addonAfter={<Icon style={{ cursor: 'pointer' }} onClick={() => { toggleStore.setToggle(SHOW_ChooseCompany_MODEL); supplierStore.chooseGysCompany = this.chooseBZcompany.bind(this) }} type="plus" />} />)}
                            </Form.Item>
                        </Col>
                        <Col md={5} xl={4} xxl={3} style={{ textAlign: 'right', padding: '3px 0' }}>
                            <ButtonGroup>
                                <Button type="primary" htmlType="submit">
                                    搜索
                                </Button>
                                <Button onClick={this.handleReset}>
                                    重置
                                </Button>
                                <Button onClick={() => this.gysTbInfosexcel()}>导出</Button>
                            </ButtonGroup>
                        </Col>
                    </Row>
                </Form>
                <TableOpterta />
                {
                    toggleStore.toggles.get(SHOW_ChooseCompany_MODEL) && <ChooseCompany />
                }
                <Table
                    size='middle'
                    loading={loading}
                    className={'gys_table_height'}
                    // rowClassName={(text) => {
                    //     let classNameStr = '';
                    //     if (text.is_diff == 1 || text.gys_data_id == 0) {
                    //         classNameStr += 'is_diff'
                    //     }
                    //     return classNameStr;
                    // }}
                    bordered={true} rowKey={(text) => text.id} rowSelection={rowSelection} scroll={{ x: 2480 }} columns={columns} pagination={{
                        showTotal: () => `共${this.state.supplierList.recordsTotal}条`, current: curPage, onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: {
                            goButton: <Button type="link" size={'small'}>
                                跳转
                            </Button>
                        }, total: this.state.supplierList.recordsTotal, pageSize: 20
                    }} dataSource={this.state.supplierList.list} />
            </Card>
        )
    }
}

SupplierInfo.propTypes = {
}
export default Form.create({ name: 'SupplierInfo' })(SupplierInfo);