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
class SupRuKuList extends Component {
    state = {
        supplierList: {
            list: [],
            recordsTotal: 0
        },
        searchValue: '',
        companyInfo: {},
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        pageNum: 1,
        rowNum: 20,
        code: "",
        dept_id: "",
        name: "",
        org_id_name: "",
        org_id: '',
        property_key: "",
        status: ""
    };
    isSearch = false;
    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };
    async addgysInfosTjBjk(redord, isCheHui = false) {
        // 提交信息body 体
        let {pageNum,rowNum} = this.state
        if (!isCheHui) {
            let tjInfoBody =
            {
                ...redord
            }
            let supplierList = await supplierAction.addgysInfosTjBjk(tjInfoBody);
        } else {
            // 撤回
            let chSupInfo = await supplierAction.tuihuiSupplierzjk(redord.id);
        }
        this.loaddata(pageNum,rowNum)
    }
    chooseBZcompany(data) {
        const { setFieldsValue } = this.props.form;
        console.log(data)
        this.setState({
            companyInfo: data,
            org_id_name: data.name,
            org_id: data.id
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
        let {rowNum} = this.state
        this.setState({pageNum:1})
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    searchValue: values,
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
                    values.org_id = this.state.org_id
                        this.setState({
                            code: values.code,
                            name: values.name,
                            org_id_name: values.org_id_name,
                            property_key: values.property_key,
                            status: values.status,
                            org_id:values.org_id
                        })
                    this.searchRukuSupplierList({ ...values, dept_id: deptid },1)
                } else {
                    this.isSearch = false
                    this.loaddata(1,rowNum)
                }
            }
        });
    };
    handleReset = () => {
        this.props.form.resetFields();
        this.setState({
            pageNum: 1,
            code:'',
            name:'',
            org_id_name:'',
            property_key:'',
            status:'',
            org_id:'',
            searchValue:''
        },()=>{
            this.loaddata(1,this.state.rowNum)})
        
        this.setState({
            companyInfo: {}
        })
    };
    async loaddata(pageNum,rowNum) {
        let { setFieldsValue } = this.props.form
        let {
            code,
            name,
            org_id_name,
            property_key,
            status,
            org_id
        } = this.state
        setFieldsValue({
            code,
            name,
            org_id_name,
            property_key,
            status
        })
        this.setState({ loading: true });
        let supplierList = await supplierAction.searchRukuSupplierList(pageNum, rowNum,{
            code,
            name,
            org_id_name,
            property_key,
            status,
            org_id
        });
        this.setState({
            supplierList: supplierList,
            loading: false
        })
    }
    async searchRukuSupplierList(searchval,page ) {
        let {rowNum} = this.state
        this.setState({ loading: true });
        let supplierList = await supplierAction.searchRukuSupplierList(page, rowNum, searchval);
        this.setState({
            supplierList: supplierList,
            loading: false
        })
    }
    //分页查询
    async pageChange(page, num) {
        this.setState({
            pageNum: page
        })
        if (this.isSearch) {
            let { deptid } = this.state.companyInfo
            this.searchRukuSupplierList({ ...this.state.searchValue, dept_id: deptid },page)
        } else {
            this.loaddata(page, num)
        }
    }
    lookGysDetail(redord) {
        const { toggleStore, supplierStore } = this.props;
        supplierStore.islookRKdetail = true;
        supplierStore.setEditSupplierBase(redord)
        toggleStore.setToggle(SHOW_SupInfoManager_MODEL)
    }
    again=()=>{
        let {pageNum,rowNum} = this.state
        this.loaddata(pageNum,rowNum)
    }
    componentDidMount() {
        let {pageNum,rowNum} = this.state
        this.loaddata(pageNum,rowNum)
    }

    render() {
        const { toggleStore, supplierStore } = this.props;
        const { loading, selectedRowKeys, pageNum } = this.state;
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
                render: (text, redord) => redord.tj_status == 1 ? "已撤回" : (text == 10 ? '已入库' : (text == 0 ? '未入库' : '无效数据'))
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
                    return (<div><Button disabled={redord.status != 0 || redord.tj_status == 1} style={{ marginRight: 5 }} onClick={() => { this.addgysInfosTjBjk(redord) }} size={'small'}>入库</Button><Button disabled={redord.status != 0 || redord.tj_status == 1} onClick={() => { this.addgysInfosTjBjk(redord, true) }} size={'small'}>{redord.tj_status == 1 ? '已撤回' : '撤回'}</Button></div>)
                }
            },
        ];


        let TableOpterta = () => (
            <div className="table-operations">

                {/* <Button icon="plus" type="primary" onClick={() => { toggleStore.setToggle(SHOW_NewPJZS_MODEL); }}>供应商入库</Button> */}
            </div>
        )
        let that = this
        const uploadProps = {
            name: 'file',
            action: `${supplierAction.BaseURL}upload?userId=${supplierAction.pageInfo.username}&departmentId=${supplierAction.pageInfo.departmentId}`,
            headers: {
                authorization: 'authorization-text',
            },

            onChange(info) {
                let {pageNum,rowNum} = this.state
                if (info.file.status !== 'uploading') {
                    // console.log(info.file, info.fileList);
                    message.loading('loading', 3)
                }
                if (info.file.status === 'done') {
                    message.info(`${info.file.name} 文件上传成功，正在等待服务端转换...`);
                    setTimeout(() => {
                        try {
                            message.success(info.file.response.message)
                        } catch (error) {
                            message.error(error);
                        }
                        message.success("开始加载数据...")
                        that.loaddata(pageNum,rowNum);
                    }, 3000);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 文件上传失败`);
                }
            },
        };
        let TableFileUpload = (e) => {
            return (
                <div style={{ display: "inline-block", marginRight: 8, marginTop: 3 ,width:250}}>
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
        }
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        return (
            <Card>
                {
                    toggleStore.toggles.get(SHOW_SupInfoManager_MODEL) && <SupInfoManager refreshData={() => this.again()} />
                }
                <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                   
                        <Row justify='end' className='gys_tb_search'>
                        <Col md={8} xxl={ { span: 4 }} >
                            <Form.Item label={`状态`} {...formItemLayout}>
                                {getFieldDecorator(`status`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: 'Input something!',
                                        },
                                    ],
                                    initialValue: ""
                                })(<Select style={{ width: 170 }}>
                                    <Option value='0'>未入库</Option>
                                    <Option value='10'>已入库</Option>
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col md={8} xxl={{ span: 4, }} >
                            <Form.Item label={`供应商名称`} {...formItemLayout}>
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
                        <Col md={8} xxl={{ span: 4 }}>
                            <Form.Item label={`信用代码`} {...formItemLayout}>
                                {getFieldDecorator(`code`, {
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
                        <Col md={8} xxl={{ span: 4 }}>
                            <Form.Item label={`企业性质`}>
                                {getFieldDecorator(`property_key`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: 'Input something!',
                                        },
                                    ],
                                })(<Input style={{ width: 150 }} placeholder="" />)}
                            </Form.Item>
                        </Col>
                        <Col md={8} xxl={{ span: 4 }}>
                            <Form.Item label={`上报单位`}>
                                {getFieldDecorator(`org_id_name`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: 'Input something!',
                                        },
                                    ],
                                })(<Input  disabled addonAfter={<ChooseCompany chooseBZcompany={(data) => this.chooseBZcompany(data)} />} />)}
                            </Form.Item>
                        </Col>
                        <Col md={8} xxl={{ span: 4 }} style={{ padding: '3px 0 3px 60px' }}>
                            <ButtonGroup>
                                <Button type="primary" htmlType="submit">
                                    搜索
                                </Button>
                                <Button onClick={this.handleReset}>
                                    重置
                                </Button>
                                <Button onClick={() => this.gysStorageInfosexcel()}>导出</Button>
                            </ButtonGroup>
                        </Col>
                        
                    </Row>
                    <Row className="gys_tb_search" >
                    <Col md={9} xxl={{ span: 3 }} >
                            <TableFileUpload />
                        </Col>
                    </Row>
                </Form>
                <Table className={'gys_table_height'} scroll={{ x: 2180 }} size='middle' loading={loading} rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''} bordered={true} rowKey={(text) => text.id} columns={columns} pagination={{
                    showTotal: () => `共${this.state.supplierList.recordsTotal}条`, 
                    onChange: (page, num) => { this.pageChange(page, num) }, 
                    current: pageNum, 
                    showQuickJumper: {
                        goButton: <Button type="link" size={'small'}>
                            跳转
                    </Button>
                    }, 
                    total: this.state.supplierList.recordsTotal, 
                    pageSize: 20
                }} dataSource={this.state.supplierList.list} />
            </Card>
        )
    }
}

SupRuKuList.propTypes = {
}
export default Form.create({ name: 'SupRuKuList' })(SupRuKuList);;