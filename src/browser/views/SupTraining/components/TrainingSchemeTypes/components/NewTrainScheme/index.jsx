import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, DatePicker, Icon, Button, message, Tooltip, Upload } from 'antd';
import { observer, inject, } from 'mobx-react';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import { SHOW_NewTrainPlan_MODEL, SHOW_ChooseListModel_MODEL } from "../../../../../../constants/toggleTypes"
import { supplierTrain, specialAction, supplierAction } from "../../../../../../actions"
// 公用选择供应商组件
import ChooseListModel from "../../../../../../components/ChooseListModel"
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class NewTrainScheme extends React.Component {
    state = {
        choosetype: "",//新增专家范围还是供应商范围
        expertlist: {},
        supplierList: {},
        trainTypes: [],
        supplierData: [],//选择的供应商类别
        expertData: [],//选择的专家类别
        traintypeData: [],//选择的培训类型
        trainPlanFileData: []
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NewTrainPlan_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore, refreshData } = this.props;
        const { expertData, supplierData, traintypeData, trainPlanFileData } = this.state;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log(values)
                let trainShift = values.trainShift.format('YYYY-MM-DD HH:mm')
                let trainStart = values.trainStartEnd[0].format('YYYY-MM-DD HH:mm')
                let trainEnd = values.trainStartEnd[1].format('YYYY-MM-DD HH:mm')
                let newvalues = {
                    ...values,
                    trainShift
                }
                //先调用创建培训计划接口,得到培训计划id
                let TrainTypeVO = {
                    ...newvalues,
                    status: 0,
                    createUser: supplierTrain.pageInfo.username,
                    updateUser: supplierTrain.pageInfo.username,
                    trainTypeId: traintypeData[0].id,
                    trainStart,
                    trainEnd
                }
                console.log(TrainTypeVO)
                let trainPlanId = await supplierTrain.createTrainPlan(TrainTypeVO)
                //
                if (trainPlanId) {
                    let TrainExpertTypeVO = [];
                    let TrainGysTypeVO = [];
                    let trainPlanFileVO = [];
                    expertData.forEach((item) => {
                        let data = {
                            trainPlanId: trainPlanId,
                            expertField: item.fileid,
                            expertId: item.id,
                            expertName: item.name,
                            expertTel: item.tel,
                        }
                        TrainExpertTypeVO.push(data)
                    })
                    supplierData.forEach((item) => {
                        let data = {
                            trainPlanId: trainPlanId,
                            provider_id: item.provider_id,
                        }
                        TrainGysTypeVO.push(data)
                    })
                    trainPlanFileData.forEach((item) => {
                        let data = {
                            trainPlanId: trainPlanId,
                            fileId : item.fileid,
                            name : item.name ,
                        }
                        trainPlanFileVO.push(data)
                    })
                    //再新增培训计划-专家关联表
                    await supplierTrain.createTrainExpert(TrainExpertTypeVO)
                    //再新增培训计划-供应商关联表
                    await supplierTrain.createTrainGys(TrainGysTypeVO)
                    //再新增培训计划-附件关联表
                    await supplierTrain.createTrainFile(trainPlanFileVO)
                }
                //刷新培训类型列表
                refreshData();
                toggleStore.setToggle(SHOW_NewTrainPlan_MODEL)
            }
        });
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NewTrainPlan_MODEL)
    };

    /******************* 培训类型子表 ******************/
    //新建培训计划——培训类型分页查询
    async zzpjpageChange(page, num) {
        this.loadZzpjApply(page, num)
    }
    //新建培训计划——培训类型搜索
    async zzpjSearch(value) {
        this.loadZzpjApply(1, 10, value)
    }
    //新建培训计划——加载培训类型列表
    async loadZzpjApply(pageNum = 1, rowNum = 10, value) {
        let searchValue = {
            trainName: value || ""
        }
        let trainTypeList = await supplierTrain.getTrainingTypes(pageNum, rowNum, searchValue);
        if (trainTypeList) {
            this.setState({
                trainTypes: trainTypeList,
                trainTypePaginations: { search: (value) => { this.zzpjSearch(value) }, showTotal: () => `共${trainTypeList.recordsTotal}条`, onChange: (page, num) => { this.zzpjpageChange(page, num) }, showQuickJumper: true, total: trainTypeList.recordsTotal, pageSize: 10 }
            })
        }
    }
    /*************************************/

    /******************* 供应商子表 ******************/
    //新建培训计划————供应商分页查询
    async gyspageChange(page, num) {
        this.loadGys(page, num)
    }
    //新建培训计划——供应商搜索
    async gysSearch(value) {
        this.loadGys(1, 10, value)
    }
    //新建培训计划——加载供应商列表
    async loadGys(pageNum = 1, rowNum = 10, value) {
        let searchValue = {
            trainName: value || ""
        }
        let supplierlistret = await supplierAction.searchSupplierInfo(searchValue.trainName);
        let total = supplierlistret.length;
        this.setState({
            supplierList: {
                list: supplierlistret,
                total: supplierlistret.length
            },
            gysPaginations: { search: (value) => { this.gysSearch(value) }, showTotal: () => `共${total}条`, onChange: (page, num) => { this.gyspageChange(page, num) }, showQuickJumper: true, total: supplierlistret.recordsTotal, pageSize: 10 }
        })
    }
    /*************************************/
    /******************* 专家子表 ******************/
    //新建培训计划————专家分页查询
    async expertpageChange(page, num) {
        this.loadExpert(page, num)
    }
    //新建培训计划——专家搜索
    async expertSearch(value) {
        this.loadExpert(1, 10, value)
    }
    //新建培训计划——加载专家列表
    async loadExpert(pageNum = 1, rowNum = 10, value) {
        let searchValue = {
            username: value || ""
        }
        let expertlistret = await this.getSpecialistByFiled(searchValue.username);//根据选取的培训类型中的专家领域 获取专家列表
        let total = expertlistret.length;
        this.setState({
            expertlist: {
                list: expertlistret,
                total: expertlistret.length
            },
            expertPaginations: { search: (value) => { this.expertSearch(value) }, showTotal: () => `共${total}条`, onChange: (page, num) => { this.expertpageChange(page, num) }, showQuickJumper: true, total: expertlistret.recordsTotal, pageSize: 10 }
        })
    }
    /*************************************/
    async componentDidMount() {
        //获取培训类型列表
        this.loadZzpjApply()
        //获取供应商列表
        this.loadGys();
    }
    //根据选取的培训类型中的专家领域 获取专家列表
    async getSpecialistByFiled(username) {
        const { traintypeData } = this.state
        console.log(traintypeData)
        let expertType = [];
        for (let data of traintypeData[0].trainExpertTypeList) {
            if (data.expertTypeName) {
                expertType.push(data.expertTypeName)
            }
        };
        let expertlistret = await specialAction.getSpecialistByFiled(username, expertType)
        return expertlistret;
        /* if (expertlistret) {
            this.setState({
                expertlist: {
                    list: expertlistret,
                    total: expertlistret.length
                }
            })
        } */
    }
    //
    chooseZzApplyFn(data) {
        const { supplierData, expertData, traintypeData, choosetype } = this.state
        const { setFieldsValue } = this.props.form;
        data.forEach(item => {
            if (choosetype == 'specialist') {
                expertData.push(item)
                this.setState({
                    expertData
                })
            } else if (choosetype == 'supplier') {
                supplierData.push(item)
                this.setState({
                    supplierData
                })
            } else if (choosetype == 'chooseTrainType') {
                let _arr = [];
                _arr.push(item)
                this.setState({
                    traintypeData: _arr
                })
                setFieldsValue({
                    trainTypeName: item.trainName
                })
                let gystype = [];
                for (let data of item.trainGysTypeList) {
                    if (data.gysTypeName) {
                        gystype.push(data.gysTypeName)
                    }
                };
                setFieldsValue({
                    trainGysScope: gystype.join(",")//培训范围
                })
            }
        })
    }
    chooseType(choosetype) {
        let listModelOption;
        if (choosetype == "specialist") {
            // this.getSpecialistByFiled();//根据选取的培训类型中的专家领域 获取专家列表
            this.loadExpert();//获取专家列表
            listModelOption = {
                model: SHOW_ChooseListModel_MODEL,
                title: '选择专家',
                type: "checkbox",
                columns: [
                    {
                        title: '序号',
                        dataIndex: 'key',
                        width: 60,
                        align: "center",
                        render: (text, index, key) => key + 1
                    },
                    {
                        title: '专家名称',
                        dataIndex: 'name',
                        width: 100,
                        align: "center",
                        render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
                    },
                    {
                        title: '专家职称',
                        dataIndex: 'title',
                        width: 120,
                        align: "center",
                    },
                    {
                        title: '专家类型',
                        dataIndex: 'typename',
                        width: 100,
                        align: "center",
                    },
                    {
                        title: '专业领域',
                        dataIndex: 'field',
                        width: 100,
                        align: "center",
                    },
                    {
                        title: '专家来源',
                        dataIndex: 'source',
                        width: 100,
                        align: "center",
                    },
                ]
            }
        } else if (choosetype == "supplier") {
            listModelOption = {
                model: SHOW_ChooseListModel_MODEL,
                title: '选择供应商',
                type: "checkbox",
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
                ]
            }
        } else if (choosetype == "chooseTrainType") {
            listModelOption = {
                model: SHOW_ChooseListModel_MODEL,
                title: '选择培训类型',
                columns: [
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
                        align: "center",
                        // fixed: "left",
                    },
                    {
                        title: '供应商类别',
                        dataIndex: 'trainGysTypeList',
                        width: 250,
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
                        width: 150,
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
                        width: 200,
                        align: "center",
                        sorter: (a, b) => (moment(a.createTime).valueOf() - moment(b.createTime).valueOf()),
                        render: (text) => <Tooltip title={text && text.substr(0, 10)}><span>{text && text.substr(0, 10)}</span></Tooltip>
                    },
                    {
                        title: '更新时间',
                        dataIndex: 'updateTime',
                        width: 200,
                        align: "center",
                        sorter: (a, b) => (moment(a.updateTime).valueOf() - moment(b.updateTime).valueOf()),
                        render: (text) => <span>{text && text.replace(/\.0$/, '')}</span>
                    },
                    {
                        title: '是否有效',
                        dataIndex: 'status',
                        width: 100,
                        align: "center",
                        render: (text) => { return text == "yes" ? '是' : '否' },
                    },
                ]
            }
        } else if (choosetype == "trainplanfile") {

        }
        this.setState({
            listModelOption: listModelOption
        })
        this.setState({
            choosetype
        })
    }
    //移除已经添加的专家
    deleteSpecialist(value) {
        const { expertData } = this.state
        let ind = _.findIndex(expertData, { id: value.id })
        expertData.splice(ind, 1)
        this.setState({
            expertData
        })
    }
    //移除已添加的供应商
    deleteSupplier(value) {
        const { supplierData } = this.state
        let ind = _.findIndex(supplierData, { id: value.id })
        supplierData.splice(ind, 1)
        this.setState({
            supplierData
        })
    }
    //上传文件
    setFile(files) {
        console.log(files)
        this.setState({
            trainPlanFileData: files
        })
    }
    render() {
        const { toggleStore } = this.props;
        const { expertlist, supplierList, choosetype, expertData, supplierData, traintypeData, trainTypes, listModelOption, expertPaginations, gysPaginations, trainTypePaginations, isChooseTrainType } = this.state
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const formItemLayout_row = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        //选择弹出框的列表数据
        const typelist = choosetype == "specialist" ? expertlist : (choosetype == "supplier" ? supplierList : trainTypes);
        //选择弹出框的列表数据中默认选择的数据
        const disabledData = choosetype == "specialist" ? expertData : (choosetype == "supplier" ? supplierData : traintypeData);
        //页码
        const paginations = choosetype == "specialist" ? expertPaginations : (choosetype == "supplier" ? gysPaginations : trainTypePaginations);
        let that = this;
        const uploadProps = {
            name: 'file',
            action: `${supplierTrain.FileBaseURL}`,
            /* headers: {
                authorization: 'authorization-text',
            }, */
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    let _fileArr = [];
                    info.fileList.map((file) => {
                        let tempfile = {
                            name: file.name,
                            fileid: file.response.fileid,
                            fileType: file.response.fileType
                        }
                        _fileArr.push(tempfile)
                    })
                    that.setFile(_fileArr)
                    message.success(`${info.file.name} 文件上传成功`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 文件上传失败.`);
                }
            },
        };
        const columns_expert = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '专家名称',
                dataIndex: 'name',
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
            },
            {
                title: '专家职称',
                dataIndex: 'title',
            },
            {
                title: '专家类型',
                dataIndex: 'typename',
            },
            {
                title: '专业领域',
                dataIndex: 'field',
            },
            {
                title: '专家来源',
                dataIndex: 'source',
            },
            {
                title: '操作',
                dataIndex: 'cz',
                render: (text, record) => <Button type="danger" size={'small'} onClick={() => { this.deleteSpecialist(record) }} >删除</Button>
            },

        ]
        const columns_suplier = [
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
            {
                title: '操作',
                dataIndex: 'cz',
                render: (text, record, key) => {
                    return (<div> <Button type="danger" onClick={() => { this.deleteSupplier(record) }} size={'small'}>删除</Button></div>)
                }
            },
        ]

        return (
            <div>
                <Modal
                    title="新建培训计划"
                    width={960}
                    visible={toggleStore.toggles.get(SHOW_NewTrainPlan_MODEL)}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                >
                    {/* <Tabs defaultActiveKey="1" size={'large'}> */}
                    {/* <TabPane tab="复审信息" key="1"> */}
                    <Form className="ant-advanced-search-form" onSubmit={(e) => { }}>

                        <Card bordered={false} className="new_supplier_form">
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'培训计划名称'}>
                                            {getFieldDecorator(`trainPlanName`, {
                                                initValue: "培训计划名称",
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '培训计划名称',
                                                    },
                                                ],
                                            })(<Input />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'培训班次'}>
                                            {getFieldDecorator(`trainShift`, {
                                                initValue: "培训班次",
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '培训班次',
                                                    },
                                                ],
                                            })(<DatePicker format={`YYYY-MM-DD HH:mm`}  locale={locale} style={{ width: '100%' }} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'培训类型'}>
                                            {getFieldDecorator(`trainTypeName`, {
                                                initValue: "培训类型",
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '培训类型',
                                                    },
                                                ],
                                            })(<Input disabled={true} addonAfter={<Icon style={{ cursor: 'pointer' }} onClick={() => { this.chooseType("chooseTrainType"); toggleStore.setToggle(SHOW_ChooseListModel_MODEL) }} type="plus" />} />)}
                                        </Form.Item>
                                    </Col>
                                  
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'培训范围'}>
                                            {getFieldDecorator(`trainGysScope`, {
                                                initValue: '培训范围',
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '培训范围',
                                                    },
                                                ],
                                            })(<Input disabled={true} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'培训主题'}>
                                            {getFieldDecorator(`trainTheme`, {
                                                initValue: '培训主题',
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '培训主题',
                                                    },
                                                ],
                                            })(<Input />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'出行建议'}>
                                            {getFieldDecorator(`cxjy`, {
                                                initValue: '具体地点',
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '具体地点',
                                                    },
                                                ],
                                            })(<Input />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'培训地点'}>
                                            {getFieldDecorator(`trainPlace`, {
                                                initValue: '培训地点',
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '培训地点',
                                                    },
                                                ],
                                            })(<Input />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'具体地点'}>
                                            {getFieldDecorator(`jtdd`, {
                                                initValue: '具体地点',
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '具体地点',
                                                    },
                                                ],
                                            })(<Input />)}
                                        </Form.Item>
                                    </Col>
                                   
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'培训起止日期'}>
                                            {getFieldDecorator(`trainStartEnd`, {
                                                initValue: "培训起止日期",
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '培训起止日期',
                                                    },
                                                ],
                                            })(<RangePicker format={`YYYY-MM-DD HH:mm`} placeholder={['起始时间', '结束时间']} showTime locale={locale} style={{ width: '100%' }} />)}
                                        </Form.Item>
                                    </Col>
                                   
                                </Col>
                            </Row>
                        </Card>
                        <Card bordered={false} title={<b>培训专家</b>} extra={
                            <Button type="primary" onClick={() => {
                                //只有选择培训类型后，才能选择专家
                                if (traintypeData.length) {
                                    this.chooseType("specialist")
                                    toggleStore.setToggle(SHOW_ChooseListModel_MODEL);
                                } else {
                                    message.error("选择培训类型")
                                }
                            }}>
                                新增
                                    </Button>
                        } className="new_supplier_producelist">
                            <Row>
                                <Col span={24}>
                                    <Table rowKey={(text, key) => key} columns={columns_expert} dataSource={expertData} />
                                </Col>
                            </Row>
                        </Card>
                        <Card bordered={false} title={<b>范围外供应商</b>} extra={
                            <Button type="primary" onClick={() => {
                                //只有选择培训类型后，才能选择供应商
                                if (traintypeData.length) {
                                    this.chooseType("supplier")
                                    toggleStore.setToggle(SHOW_ChooseListModel_MODEL);
                                } else {
                                    message.error("选择培训类型")
                                }

                            }}>
                                新增
                                    </Button>
                        } className="new_supplier_producelist">
                            <Row>
                                <Col span={24}>
                                    <Table rowKey={(text, key) => key} columns={columns_suplier} dataSource={supplierData} />
                                </Col>
                            </Row>
                        </Card>
                        <Card bordered={false}
                            title={traintypeData.length ? <Upload {...uploadProps}><Button type="primary"><Icon type="upload" />上传附件</Button></Upload> : ""}
                            className="new_supplier_producelist">
                        </Card>
                    </Form>
                    {/* </TabPane> */}
                    {/* </Tabs> */}
                </Modal>
                {
                    toggleStore.toggles.get(SHOW_ChooseListModel_MODEL) && <ChooseListModel list={typelist} comparedList={disabledData} pagination={paginations} options={listModelOption} chooseFinishFn={(val) => { this.chooseZzApplyFn(val) }} />
                }
            </div >
        );
    }
}

export default Form.create({ name: 'NewSupplier' })(NewTrainScheme);;