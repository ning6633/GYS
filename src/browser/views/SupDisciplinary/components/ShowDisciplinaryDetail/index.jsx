import React, { Component } from 'react';
import { Modal, Select, Card, Form, Row, Col, Input, Tooltip, Icon, message, DatePicker } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_ShowPJZJ_MODEL, SHOW_ChooseSupplierPub_MODEL } from "../../../../constants/toggleTypes"

import { supplierEvalution, supplierAction, SupPa } from "../../../../actions"
import ChooseListModel from "../../../../components/ChooseListModel"
const { TextArea } = Input;
const { Option } = Select
// 新建一年一评价
@inject('toggleStore')
@observer
class ShowDisciplinaryDetail extends Component {
    constructor() {
        super()
        this.handleUploadChange = this.handleUploadChange.bind(this)
    }
    state = {
        fileList: [],
        SupList: [],
        Suppaginations: {},
        listModelOption: {},
        currentGys: {},
        importantlist: [],
        rewordTypes: []
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ShowPJZJ_MODEL)
        this.props.form.validateFields((err, values) => {
            console.log(values)
        })
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ShowPJZJ_MODEL)
    };
    async  handleSubmit() {
        const { toggleStore, refreshData, NewPa } = this.props;
        const { currentGys } = this.state

        this.props.form.validateFields((err, values) => {
            console.log(values)
            if (!err) {
                let newData = {
                    ...values,
                    reward_TIME: values.time.format('YYYY-MM-DD'),
                    gys_ID: 'd3165139-feaa-11e9-adb2-10e7c6448b2e',//currentGys.id,

                }
                console.log(newData)
                //   NewPa(newData)
            }
            // fileList.length>0? values['fileid'] = fileList[0].response.fileid:null
            // console.log(fileList)
            // console.log(values)
            // refreshData(values)

            // let result = await SupPa.newPa(newData)
            // refreshData(values)

        })
    }
    handleUploadChange(info) {
        // if (info.file.status !== 'uploading') {
        //     console.log(info.file, info.fileList);
        // }
        // if (info.file.status === 'done') {
        //     message.success(`${info.file.name} 文件上传成功，正在等待服务端转换...`);
        //     setTimeout(() => {
        //         message.success("文件转换成功，开始加载数据...")
        //         // that.loaddata();
        //     }, 3000);
        // } else if (info.file.status === 'error') {
        //     message.error(`${info.file.name} 文件上传失败.`);
        // }
        let fileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-1);

        // 2. Read from response and show file link
        fileList = fileList.map(file => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
            }
            return file;
        });
        console.log(fileList)
        this.setState({ fileList });
    }
    async chooseSupFn(data) {
        const { setFieldsValue } = this.props.form
        console.log(data)
        if (data) {
            let supObj = data[0]
            setFieldsValue({
                gysname: supObj.name,
                code: supObj.code,
            })
            this.setState({
                currentGys: supObj
            })
        }
    }

    //供应商load分页查询
    async SuppageChange(page, num) {
        this.loadSup(page, num)
    }
    //供应商搜索
    async SupSearch(value) {
        this.loadSup(1, 10, value)
    }
    //加载供应商
    async loadSup(pageNum = 1, rowNum = 10, name = '') {

        let ret = await supplierAction.searchSupplierInfo(name);
        console.log(ret)
        this.setState({
            SupList: {
                list: ret,
                recordsTotal: ret.length
            },
            Suppaginations: { search: (value) => { this.SupSearch(value) }, showTotal: () => `共${ret.length}条`, onChange: (page, num) => { this.SuppageChange(page, num) }, showQuickJumper: true, total: ret.length, pageSize: 10 }
        })


    }
    async componentDidMount() {
        const { detail } = this.props
        const { setFieldsValue } = this.props.form
        console.log(detail)
        if (detail) {
            let { gysname,
                reward_TYPE,
                important,
                reward_TIME,
                reasion } = detail
            setFieldsValue({
                important,
                reward_TIME,
                gysname: detail.gys_NAME,
                reasion: detail.reasion,
                reward_TYPE: detail.reward_TYPE,
                //  time:detail.reward_TIME
            })
            this.setState({
                currentGys: detail
            })
        }
        this.loadSup()
        //选择供应商model
        let listModelOption = {
            model: SHOW_ChooseSupplierPub_MODEL,
            title: '乙方供应商',
            type: 'radio',
            columns: [
                {
                    title: '序号',
                    dataIndex: 'key',
                    width: 100,
                    align: "center",
                    render: (text, index, key) => key + 1
                },
                {
                    title: '供应商名称',
                    dataIndex: 'name',
                    width: 300,
                    align: "center",
                    render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
                },
                {
                    title: '统一社会信用代码',
                    dataIndex: 'code',
                    width: 230,
                    align: "center",
                },
                {
                    title: '简称',
                    dataIndex: 'name_other',
                    width: 150,
                    align: "center",
                },
                {
                    title: '别称',
                    dataIndex: 'another_name',
                    width: 150,
                    align: "center",
                },
                {
                    title: '行政区域名称',
                    dataIndex: 'district_key',
                    width: 230,
                    align: "center",
                },
            ],
        }
        this.setState({
            listModelOption,

        })
        let result = await supplierEvalution.getDic('IMPORTANT')
        let rewordsResult = await supplierEvalution.getDic('TYPE_REWARDS')
        console.log(rewordsResult.data)
        this.setState({
            importantlist: result.data || [],
            rewordTypes: rewordsResult.data || []
        })

    }
    handleChange(value) {
        console.log(`selected ${value}`);
    }
    onChange(value) {

    }

    render() {
        const { toggleStore } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { SupList, Suppaginations, listModelOption, importantlist, rewordTypes } = this.state
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const TypeOptions = (list) => {
            return list.length > 0 ? list.map(item => <Option key={item.name}>{item.name}</Option>) : null
        }
        const CodeOptions = (list) => {
            return list.length > 0 ? list.map(item => <Option key={item.code}>{item.name}</Option>) : null
        }

        //重要程度
        const children = [TypeOptions(importantlist)]
        //奖惩类型
        const rewordchildren = [CodeOptions(rewordTypes)]
        return (
            <div>
                <Modal
                    width={900}
                    title="供应商奖惩记录详情"
                    visible={toggleStore.toggles.get(SHOW_ShowPJZJ_MODEL)}
                    footer={null}
                    onOk={(e) => { this.handleSubmit(e) }}
                    onCancel={this.handleCancel}
                    okText="提交"
                >
                    <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>
                        <Card bordered={false} className="new_supplier_form">
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'供应商名称'}>
                                            {getFieldDecorator(`gysname`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '选择供应商名称',
                                                    },
                                                ],
                                            })(<Input disabled={true} />)}
                                        </Form.Item>

                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'奖惩类型'}>
                                            {getFieldDecorator(`reward_TYPE`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '奖惩类型不能为空'
                                                    },
                                                ],
                                            })(<Input disabled={true} />)}
                                        </Form.Item>

                                    </Col>
                                    <Col span={12} >

                                        <Form.Item {...formItemLayout} label={'重要类型'}>
                                            {getFieldDecorator(`important`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '重要类型不能为空'
                                                    },
                                                ],
                                            })(<Input disabled={true} />)}
                                        </Form.Item>


                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'奖惩时间'}>
                                            {getFieldDecorator('reward_TIME', {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '奖惩时间不能为空'
                                                    },
                                                ],
                                            })(<Input disabled={true} />)}
                                        </Form.Item>


                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'奖惩原因'}>
                                            {getFieldDecorator(`reasion`)(<TextArea rows={4} disabled={true} />)}
                                        </Form.Item>

                                    </Col>
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                </Modal>
                {/* 选择供应商 */}
                {
                    toggleStore.toggles.get(SHOW_ChooseSupplierPub_MODEL) && <ChooseListModel list={SupList} pagination={Suppaginations} options={listModelOption} chooseFinishFn={(val) => { this.chooseSupFn(val) }} />
                }


            </div>
        );
    }
}

export default Form.create({ name: 'ShowDisciplinaryDetail' })(ShowDisciplinaryDetail);;