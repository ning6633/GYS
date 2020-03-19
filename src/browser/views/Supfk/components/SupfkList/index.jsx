import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Row, Input, Tooltip, message, Col, Form, Select } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import _ from "lodash";
import { SHOW_FeedBack_MODEL } from "../../../../constants/toggleTypes";
import FeedBack from "../../../SupManager/components/FeedBack"
import { supplierAction } from "../../../../actions"
import "./index.less";
const { Option } = Select;

@inject('toggleStore', 'supplierStore')
@observer
class SupfkList extends Component {
    state = {
        supplierList: {
            list: [],
            recordsTotal: 0
        },
        companyInfo: {},
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
    };

    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    async submitSupplierInfo(redord) {
        const { toggleStore, supplierStore } = this.props;
        if (redord.is_diff != 0) {
            toggleStore.setToggle(SHOW_SupInfoManager_MODEL)
        } else {
            let supplierList = await supplierAction.submitSupplierInfo([redord.id]);
            message.success("提交成功")
            this.loaddata()
        }
    }
    async submitSupplierInfopl() {
        let supplierList = await supplierAction.submitSupplierInfo(this.state.selectedRowKeys);
        message.success("提交成功")
        this.loaddata()
    }
    async deleteSupplierInfo() {
        let supplierList = await supplierAction.deleteSupplierInfo(this.state.selectedRowKeys);
        if (supplierList) {
            message.success("删除成功")
            this.loaddata()
        }
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
    handleSearch = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { deptid } = this.state.companyInfo
                this.searchRukuSupplierList({ ...values, dept_id: deptid })
            }
        });
    };
    handleReset = () => {
        this.props.form.resetFields();
        this.loaddata()
        this.setState({
            companyInfo: {}
        })
    };
    async loaddata(pageNum = 1, rowNum = 20) {
        this.setState({ curPage:pageNum,loading: true });
        let supplierList = await supplierAction.getfeedbacksList(pageNum, rowNum);
        console.log(supplierList);
        this.setState({
            supplierList: supplierList,
            loading: false
        })
    }
    async searchRukuSupplierList(searchval, pageNum = 1, rowNum = 20, ) {
        this.setState({ curPage:pageNum,loading: true });
        let supplierList = await supplierAction.searchRukuSupplierList(pageNum, rowNum, searchval);
        this.setState({
            supplierList: supplierList,
            loading: false
        })
    }
    //分页查询
    async pageChange(page, num) {
        this.loaddata(page, num)
    }
    componentDidMount() {
        this.loaddata()
    }
    async feedbackQus(record) {
        console.log(record);
        const { toggleStore, supplierStore } = this.props;
        supplierStore.islookFkdetail = true;
        toggleStore.setToggle(SHOW_FeedBack_MODEL)
        supplierStore.setEditSuppliersupFeedback(record);
    }
    render() {
        const { toggleStore, supplierStore } = this.props;
        const { loading, selectedRowKeys } = this.state;
        const { getFieldDecorator } = this.props.form;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
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
                width: 200,
                align: "center",
                fixed: "left",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.feedbackQus(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '是否社会统一代码错误',
                dataIndex: 'is_code_error',
                width: 300,
                align: "center",
                render: (text) => { return text == 0 ? '否' : '是' },
            },
            {
                title: '是否名称错误',
                dataIndex: 'is_name_error',
                width: 200,
                align: "center",
                render: (text) => { return text == 0 ? '否' : '是' },
            },
            {
                title: '企业性质',
                dataIndex: 'property_key',
                width: 150,
                align: "center",
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 120,
                align: "center",
                render: (text) => text == 20 ? '已接收' : '待确认'
            },
            {
                title: '统一社会信用代码',
                dataIndex: 'code',
                width: 230,
                align: "center",
            },
            {
                title: '反馈内容',
                dataIndex: 'content',
                width: 330,
                align: "center",
            },
            {
                title: '上报单位',
                dataIndex: 'from_org_name',
                width: 200,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '提交人 ',
                dataIndex: 'from_user_id',
                width: 160,
                align: "center",
            },
            {
                title: '接收时间',
                dataIndex: 'accept_time',
                width: 150,
                align: "center",
                sorter: (a, b) => (moment(a.create_time).valueOf() - moment(b.create_time).valueOf()),
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                width: 150,
                align: "center",
                sorter: (a, b) => (moment(a.update_time).valueOf() - moment(b.update_time).valueOf()),
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            /* {
                title: '操作',
                dataIndex: 'modify',
                align: "center",
                width: 200,
                render: (text, redord) => {
                    return (<div><Button disabled={redord.status == 20} onClick={() => { this.editorSupplierInfo(redord) }} style={{ marginRight: 5 }} type="primary" size={'small'}>禁止</Button>   <Button disabled={redord.status == 20} onClick={() => { this.submitSupplierInfo(redord) }} size={'small'}>入库</Button></div>)
                }
            }, */
        ];


        let TableOpterta = () => (
            <div className="table-operations">
                {/* <Button icon="plus" type="primary" onClick={() => { toggleStore.setToggle(SHOW_NewPJZS_MODEL); }}>供应商入库</Button> */}
            </div>
        )
        return (
            <Card title={<TableOpterta />}>
                {
                    toggleStore.toggles.get(SHOW_FeedBack_MODEL) && <FeedBack />
                }
                <Table className={'gys_table_height'} scroll={{ x: 2000 }} size='middle' loading={loading} rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''} bordered={true} rowKey={(text) => text.id} columns={columns} pagination={{ showTotal: () => `共${this.state.supplierList.recordsTotal}条`,onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: {
                    goButton: <Button type="link" size={'small'}>
                    跳转
                    </Button>
                }, total: this.state.supplierList.recordsTotal, pageSize: 20 }} dataSource={this.state.supplierList.listGysFeedbacks} />
            </Card>
        )
    }
}

SupfkList.propTypes = {
}
export default Form.create({ name: 'SupRuKuList' })(SupfkList);