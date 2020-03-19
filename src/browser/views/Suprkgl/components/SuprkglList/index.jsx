import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Row, Input, Tooltip, message, Col, Form, Select, Upload, Icon } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import _ from "lodash";
import { SHOW_SupInfoManager_MODEL } from "../../../../constants/toggleTypes";
import { supplierAction } from "../../../../actions"
import ChooseCompany from "../../../../components/Choosecompany"
import SupInfoManager from "../../../SupManager/components/SupInfoManager"
import "./index.less";
const { Option } = Select;
const ButtonGroup = Button.Group;

@inject('toggleStore', 'supplierStore')
@observer
class SuprkglList extends Component {
    state = {
        supplierList: {
            list: [],
            recordsTotal: 0
        },
        curPage: 1,
        searchValue: '',
        companyInfo: {},
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
    };
    isSearch = false;
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    async addgysInfosTjBjk(redord, isCheHui = false) {
        console.log(redord);
        // 提交信息body 体
        if (!isCheHui) {
            let supplierList = await supplierAction.tjGysBaseInfos(redord.id);
        }
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
    gysStorageInfosexcel() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let { deptid } = this.state.companyInfo
                supplierAction.gysStorageInfosexcel({ ...values, dept_id: deptid })
            }
        });
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
                    this.searchRukuSupplierList({ ...values, dept_id: deptid })
                } else {
                    this.isSearch = false
                    this.loaddata()
                }
            }
        });
    };
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
    async loaddata(pageNum = 1, rowNum = 20) {
        this.setState({ curPage: pageNum, loading: true });
        let supplierList = await supplierAction.gysStorageInfosDept(pageNum, rowNum);
        this.setState({
            supplierList: supplierList,
            loading: false
        })
    }
    async searchRukuSupplierList(searchval, pageNum = 1, rowNum = 20, ) {
        this.setState({ loading: true });
        let supplierList = await supplierAction.searchRukuSupplierList(pageNum, rowNum, searchval);
        this.setState({
            supplierList: supplierList,
            loading: false
        })
    }
    //分页查询
    async pageChange(page, num) {
        this.setState({
            curPage: page
        })
        if (this.isSearch) {
            let { deptid } = this.state.companyInfo
            this.searchRukuSupplierList({ ...this.state.searchValue, dept_id: deptid }, page, num)
        } else {
            this.loaddata(page, num)
        }
    }
    lookGysDetail(redord) {
        if (redord.status != 0 || redord.tj_status == 0) {
            const { toggleStore, supplierStore } = this.props;
            supplierStore.islookRKdetail = true;
            supplierStore.setEditSupplierBase(redord)
            toggleStore.setToggle(SHOW_SupInfoManager_MODEL)
        } else {
            this.gysInfosTjzjkxg(redord)
        }
    }
    gysInfosTjzjkxg(redord) {
        // 编辑供应商提交信息
        const { toggleStore, supplierStore } = this.props;
        supplierStore.isRKeditor = true;
        supplierStore.setEditSupplierBase(redord)
        toggleStore.setToggle(SHOW_SupInfoManager_MODEL)
    }
    componentDidMount() {
        this.loaddata()
    }
    render() {
        const { toggleStore, supplierStore } = this.props;
        const { loading, selectedRowKeys, curPage } = this.state;
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
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.lookGysDetail(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
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
                title: '状态',
                dataIndex: 'status',
                width: 150,
                align: "center",
                render: (text, redord) => redord.tj_status == 1 ? "被撤回" : (text == 10 ? '已入库' : (text == 0 ? '未入库' : '无效数据'))
            },
            {
                title: '上报人',
                dataIndex: 'createuser',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}>{text}</Tooltip>
            },
            {
                title: '上报人联系方式',
                dataIndex: 'tel',
                width: 200,
                align: "center",
                render: (text) => <Tooltip title={text}>{text}</Tooltip>
            },
           
            {
                title: '时间',
                dataIndex: 'createdate',
                width: 150,
                align: "center",
                sorter: (a, b) => (moment(a.createdate).valueOf() - moment(b.createdate).valueOf()),
                render: (text) => <Tooltip title={text.replace(/\.0$/, '')}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '更新时间',
                dataIndex: 'updatedate',
                width: 200,
                align: "center",
                sorter: (a, b) => (moment(a.updatedate).valueOf() - moment(b.updatedate).valueOf()),
                render: (text) => <span>{text.replace(/\.0$/, '')}</span>
            },
            {
                title: '操作',
                dataIndex: 'modify',
                align: "center",
                width: 150,
                fixed: "right",
                render: (text, redord) => {
                    return (<div><Button disabled={redord.status != 0 || redord.tj_status == 0} style={{ marginRight: 5 }} onClick={() => { this.gysInfosTjzjkxg(redord) }} size={'small'}>编辑</Button><Button disabled={redord.status != 0 || redord.tj_status == 0} onClick={() => { this.addgysInfosTjBjk(redord) }} size={'small'}>{redord.status != 0 ? "已入库" : (redord.tj_status == 0 ? "已提交" : "提交")}</Button></div>)
                }
            },
        ];
        let that = this
        const uploadProps = {
            name: 'file',
            action: `${supplierAction.BaseURL}upload?userId=${supplierAction.pageInfo.username}&departmentId=${supplierAction.pageInfo.departmentId}`,
            headers: {
                authorization: 'authorization-text',
            },

            onChange(info) {

                if (info.file.status !== 'uploading') {
                    // console.log(info.file, info.fileList);
                    message.loading('loading', 3)
                }
                if (info.file.status === 'done') {
                    console.log(info.file);
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
                <Button icon="plus" type="primary" onClick={() => { toggleStore.setToggle(SHOW_SupInfoManager_MODEL); }}>新增</Button>
                {/* <Popconfirm className="confirm_del" placement="bottom" title={'确认要删除吗？'} onConfirm={() => { this.deleteSupplierInfo() }}>
                    <Button type="danger" disabled={!hasSelected} >删除</Button>
                </Popconfirm> */}
                <Upload {...uploadProps}>
                    <Button type='primary' >
                        <Icon type="upload" />上传
                        </Button>
                    <Button style={{ marginLeft: 15 }} icon="download" onClick={() => window.open(supplierAction.FileBaseURL + 'waitToStore')}>
                        下载模板
                        </Button>
                </Upload>
            </div>
        )
        return (
            <Card title={<TableOpterta />}>
                {
                    toggleStore.toggles.get(SHOW_SupInfoManager_MODEL) && <SupInfoManager refreshData={() => this.loaddata()} />
                }

                <Table className={'gys_table_height'} scroll={{ x: 2180 }} size='middle' loading={loading} rowClassName={(text) => text.tj_status == 1 ? 'is_beichehui' : ''} bordered={true} rowKey={(text) => text.id} columns={columns} pagination={{
                    showTotal: () => `共${this.state.supplierList.recordsTotal}条`, onChange: (page, num) => { this.pageChange(page, num) }, current: curPage, showQuickJumper: {
                        goButton: <Button type="link" size={'small'}>
                            跳转
                    </Button>
                    }, total: this.state.supplierList.recordsTotal, pageSize: 20
                }} dataSource={this.state.supplierList.list} />
            </Card>
        )
    }
}

SuprkglList.propTypes = {
}
export default Form.create({ name: 'SuprkglList' })(SuprkglList);;