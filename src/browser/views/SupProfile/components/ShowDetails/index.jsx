import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, DatePicker, Icon, Button, message, Tooltip } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_ShowArchives_MODEL, SHOW_Modification_MODEL, SHOW_Punishment_MODEL } from "../../../../constants/toggleTypes"
import { supArchives } from "../../../../actions"
import CustomScroll from '../../../../components/CustomScroll/index'
import moment from 'moment'
import Punishment from '../Punishment/index'


import _ from "lodash";
// 公用选择供应商组件
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { TabPane } = Tabs;
@inject('toggleStore', 'supplierStore')
@observer
class SupDetailModel extends React.Component {
    state = {
        QualificationData: [], //资质信息
        QualificationTotal: 0,
        getQualificationDataPageNum: 1,
        TrainingData: [],  //培训信息
        TrainingTotal: 0,
        getQEApplygysidPageNum: 1,
        CorporateData: [],   // 法人证书
        CorporateTotal: 0,
        getSupCorporatePageNum: 1,
        IdentificationData: [],  //认定信息
        IdentificationTotal: 0,
        getImplementListPageNum: 1,
        AchievementsData: [], //绩效评估
        AchievementsTotal: 0,
        getEvaluatePageNum: 1,
        AnnualData: [],  //年度审核
        AnnualTotal: 0,
        getEvaluateRecordListPageNum: 1,
        PunishmentData: [],  //惩奖记录
        supplierList: [],
        isAccess: true,
        PunishmentListData: [],
        num: '',
        key: '基本信息',
        noTitleKey: '基本信息',
        rowNum: 10,
    }
    // handleSubmit = e => {
    //     e.preventDefault();
    //     const { toggleStore } = this.props;
    //     toggleStore.setToggle(SHOW_ShowArchives_MODEL)

    // };
    handleCancel = () => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ShowArchives_MODEL)
    }

    async getShowDetailsInfo() {
        let { editSupplierArchivesInfo } = this.props.supplierStore
        let res = await supArchives.getSupArchivesInfoOne(editSupplierArchivesInfo.providerid)
        if (res.code == 200) {
            message.success(res.message)
            this.setState({ supplierList: res.data.gysmessage })
            this.initValue()
        }


    }
    initValue = () => {
        const { setFieldsValue } = this.props.form;
        let { supplierList } = this.state
        let {
            name,
            number,
            shortname,
            anothername,
            property_key,
            property,
            registrationplace,
            gystype,
            detailaddr,
            productscope,
            contacts_tel,
            telphone,
            militarychief,
            email,
            qualitychief,
            contacts,
            briefintroduction,
            productioncapacity
        } = supplierList
        setFieldsValue({
            name,
            number,
            shortname,
            anothername,
            property_key,
            property,
            registrationplace,
            gystype,
            detailaddr,
            productscope,
            contacts_tel,
            telphone,
            militarychief,
            email,
            qualitychief,
            contacts,
            briefintroduction,
            productioncapacity
        })
    }
    //法人信息
    async getSupCorporate() {
        let { providerid } = this.props.supplierStore.editSupplierArchivesInfo
        let { getSupCorporatePageNum, rowNum } = this.state
        let res = await supArchives.getSupCorporate({ providerid, getSupCorporatePageNum, rowNum })
        if (res.code == 200) {
            // message.success(res.message)
            if (res.data.length == 0) {
                this.setState({ CorporateData: [], CorporateTotal: 0 })
            } else {
                this.setState({ CorporateData: res.data.list, CorporateTotal: res.data.recordsTotal })
            }
        } else {
            message.error(res.message)
        }
    }
    //资质信息
    async getQualificationData() {
        let { providerid } = this.props.supplierStore.editSupplierArchivesInfo
        let { getQualificationDataPageNum, rowNum } = this.state
        let res = await supArchives.getQualificationData({ providerid, getQualificationDataPageNum, rowNum })
        if (res.code == 200) {
            // message.success(res.message)
            if (res.data.length == 0) {
                this.setState({ QualificationData: [], QualificationTotal: 0 })
            } else {
                this.setState({ QualificationData: res.data.list, QualificationTotal: res.data.recordsTotal })
            }
        } else {
            message.error(res.message)
        }
    }
    //培训信息
    async getQEApplygysid() {
        let { providerid } = this.props.supplierStore.editSupplierArchivesInfo
        let { getQEApplygysidPageNum, rowNum } = this.state
        let res = await supArchives.getQEApplygysid({ providerid, getQEApplygysidPageNum, rowNum })
        if (res.code == 200) {
            // message.success(res.message)
            if (res.data.length == 0) {
                this.setState({ TrainingData: [], TrainingTotal: 0 })
            } else {
                this.setState({ TrainingData: res.data.list, TrainingTotal: res.data.recordsTotal })
            }
        } else {
            message.error(res.message)
        }
    }
    //认定信息
    async getImplementList() {
        let { providerid } = this.props.supplierStore.editSupplierArchivesInfo
        let { getImplementListPageNum, rowNum } = this.state
        let res = await supArchives.getImplementList({ providerid, getImplementListPageNum, rowNum })
        if (res.code == 200) {
            // message.success(res.message)
            if (res.data.length == 0) {
                this.setState({ IdentificationData: [], IdentificationTotal: 0 })
            } else {
                this.setState({ IdentificationData: res.data.list, IdentificationTotal: res.data.recordsTotal })
            }
        } else {
            message.error(res.message)
        }
    }

    //绩效评价
    async getEvaluate() {
        let { providerid } = this.props.supplierStore.editSupplierArchivesInfo
        let { getEvaluatePageNum, rowNum } = this.state
        let res = await supArchives.getEvaluate({ providerid, getEvaluatePageNum, rowNum })
        if (res.code == 200) {
            // message.success(res.message)
            if (res.data.length == 0) {
                this.setState({ AchievementsData: [], AchievementsTotal: 0 })
            } else {
                this.setState({ AchievementsData: res.data.list, AchievementsTotal: res.data.recordsTotal })
            }
        } else {
            message.error(res.message)
        }
    }

    //惩奖记录
    async getPunishmentsList() {
        let { editSupplierArchivesInfo } = this.props.supplierStore
        let { PunishmentListData } = this.state
        let res = await supArchives.getPunishmentsList(editSupplierArchivesInfo)
        if (res.code == 200) {
            PunishmentListData.push(res.data)
            if (PunishmentListData.length > 1) {
                PunishmentListData.splice(1, 1)
            }
            // message.success(res.message)
            // PunishmentData
            if (res.data.length == 0) {
                this.setState({ PunishmentData: [] })
            } else {
                this.setState({ PunishmentData: res.data })
            }
        } else {
            message.error(res.message)
        }
    }
    //年度审核 
    async getEvaluateRecordList() {
        let { providerid } = this.props.supplierStore.editSupplierArchivesInfo
        let { getEvaluateRecordListPageNum, rowNum } = this.state
        let res = await supArchives.getEvaluateRecordList({ providerid, getEvaluateRecordListPageNum, rowNum })
        if (res.code == 200) {
            this.setState({ AnnualData: res.data.list, AnnualTotal: res.data.recordsTotal })
        } else {
            message.error(res.message)
        }
    }

    //修改记录

    
    onTabChange = (key, type) => {
        this.setState({ [type]: key });
        if (key == '基本信息') {
            setTimeout(() => {
                this.initValue()
            }, 0)
        }
    };
    //惩奖记录详情
    showAll = (num) => {
        this.setState({ num })
        let { toggleStore, supplierStore } = this.props
        toggleStore.setToggle(SHOW_Punishment_MODEL)
    }
    modification = () => {
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_Modification_MODEL)
    }
    async getInfoAll() {
        this.getSupCorporate() //法人信息
        this.getQualificationData()//资质信息
        this.getQEApplygysid() //培训信息
        this.getImplementList()//认定信息
        this.getEvaluate()//绩效评价
        this.getPunishmentsList()//惩奖记录
        this.getEvaluateRecordList()  //年度审核


    }
    async componentDidMount() {
        this.getShowDetailsInfo()
        this.getInfoAll()
    }
    downLoad = (text) => {
        let { FileBaseURL } = supArchives
        window.open(FileBaseURL + text)
    }
    render() {
        let { httcgxCount, tbppCount, xqzgCount, ytCount } = this.state.PunishmentData
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const { getFieldDecorator } = this.props.form;
        //法人证书
        const Corporatecolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                align: 'center',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '证书名称',
                dataIndex: 'name',
                align: 'center',
                width: 100,
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
            },
            {
                title: '制发机关',
                dataIndex: 'issuingauthority',
                align: 'center',
                width: 100,
            },
            {
                title: '有效期',
                dataIndex: 'startdate',
                align: 'center',
                width: 300,
                render: (text, redord) => {
                    return (
                        <span>
                            自
                            {moment(redord.startdata).format('LL')}
                            至
                            {moment(redord.enddata).format('LL')}
                        </span>
                    )

                }
            },
            {
                title: '上传人',
                dataIndex: 'createuser',
                align: 'center',
                width: 100,
            },
            {
                title: '上传时间',
                dataIndex: 'uploaddate',
                align: 'center',
                width: 200,
                render: (text, redord) => {
                    return (
                        <span>
                            {moment(text).format('LL')}
                        </span>
                    )

                }
            },
            {
                title: '大小',
                dataIndex: 'attachmentsize',
                align: 'center',
                width: 100,
            },
            {
                title: '附件',
                dataIndex: 'attachment',
                align: 'center',
                width: 100,
                render: (text, redord) => {
                    return <span onClick={() => {
                        this.downLoad(text)
                    }} style={{ cursor: "pointer", 'color': '#3383da' }}>附件</span>
                }
            },

        ]
        //资质信息
        const Qualificationcolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 70,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '资质名称',
                dataIndex: 'name',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
            },
            {
                title: '资质类别',
                dataIndex: 'type',
                width: 100,
                align: "center",
            },
            {
                title: '体系认证范围',
                dataIndex: 'scope',
                width: 130,
                align: "center",
            },
            {
                title: '证书名称',
                dataIndex: 'certificatetitle',
                width: 100,
                align: "center",
            },
            {
                title: '认证方单位',
                dataIndex: 'certificationauthority',
                width: 100,
                align: "center",
            },
            {
                title: '有效期',
                dataIndex: 'enddate',
                width: 300,
                align: "center",
                render: (text, redord) => {
                    return (
                        <span>
                            自
                            {moment(redord.startdata).format('LL')}
                            至
                            {moment(redord.enddata).format('LL')}
                        </span>
                    )

                }
            },
            {
                title: '附件',
                dataIndex: 'attachment',
                width: 100,
                align: "center",
                render: (text, redord) => {
                    return <span onClick={() => {
                        this.downLoad(text)
                    }} style={{ cursor: "pointer", 'color': '#3383da' }}>附件</span>
                }
            },
        ]
        //培训信息
        const Trainingcolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 70,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '培训名称',
                dataIndex: 'trainname',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
            },
            {
                title: '培训班次',
                dataIndex: 'trainshift',
                width: 150,
                align: "center",
            },
            {
                title: '培训类型',
                dataIndex: 'type',
                width: 200,
                align: "center",
            },
            {
                title: '证书名称',
                dataIndex: 'NAME',
                width: 150,
                align: "center",
            },
            {
                title: '认证方单位',
                dataIndex: 'AUTHORITIED_ORGNAME',
                width: 200,
                align: "center",
            },
            {
                title: '有效期',
                dataIndex: 'EXPIRY_DATE',
                width: 170,
                align: "center",
                render: (text, redord) => {
                    return (
                        <span>
                            自
                            {moment(redord.startdata).format('LL')}
                            至
                            {moment(redord.enddata).format('LL')}
                        </span>
                    )

                }
            },
            {
                title: '附件',
                dataIndex: 'ATTACHMENT',
                width: 100,
                align: "center",
                render: (text, redord) => {
                    return <span onClick={() => {
                        this.downLoad(text)
                    }} style={{ cursor: "pointer", 'color': '#3383da' }}>附件</span>
                }
            },
        ]
        //认定信息
        const Identificationcolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 70,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '认定名称',
                dataIndex: 'name',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
            },
            {
                title: '重要程度',
                dataIndex: 'importLevel',
                width: 100,
                align: "center",
            },
            {
                title: '认定时间',
                dataIndex: 'evaluateDate',
                width: 150,
                align: "center",
                render: (text, redord) => {
                    return (
                        <span>
                            {moment(text).format('LL')}
                        </span>
                    )

                }
            },
            {
                title: '证书名称',
                dataIndex: 'certificatename',
                width: 150,
                align: "center",
            },
            {
                title: '认证方单位',
                dataIndex: 'evaluateOrg',
                width: 200,
                align: "center",
            },
            {
                title: '有效期',
                dataIndex: 'totime',
                width: 250,
                align: "center",
                render: (text, redord) => {
                    return (
                        <span>
                            自
                            {moment(redord.evaluateDate).format('LL')}
                            至
                            {moment(redord.totime).format('LL')}
                        </span>
                    )

                }
            },
            {
                title: '附件',
                dataIndex: 'attachmentfileID',
                width: 100,
                align: "center",
                render: (text, redord) => {
                    return <span onClick={() => {
                        this.downLoad(text)
                    }} style={{ cursor: "pointer", 'color': '#3383da' }}>附件</span>
                }
            },
        ]
        //绩效评价
        const Achievementscolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 50,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '绩效评价时间',
                dataIndex: 'createdate',
                width: 100,
                align: "center",
                render: (text, redord) => {
                    return (
                        <span>
                            {moment(text).format('LL')}
                        </span>
                    )

                }
            },
            {
                title: '评价内容',
                dataIndex: 'evaluatecontent',
                width: 100,
                align: "center",
            },
            {
                title: '绩效评价结果',
                dataIndex: 'result',
                width: 100,
                align: "center",
            },

        ]
        //年度审核
        const Annualcolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 70,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '复审名称',
                dataIndex: 'AnnualauditName',
                width: 200,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
            },
            {
                title: '复审时间',
                dataIndex: 'AnnualauditDate',
                width: 100,
                align: "center",
            },
            {
                title: '复审结果',
                dataIndex: 'AnnualauditResult',
                width: 100,
                align: "center",
            },
            {
                title: '证书名称',
                dataIndex: 'NAME',
                width: 100,
                align: "center",
            },
            {
                title: '认证方单位',
                dataIndex: 'ORG',
                width: 100,
                align: "center",
            },
            {
                title: '有效期',
                dataIndex: 'TOTIME',
                width: 200,
                align: "center",
            },
            {
                title: '附件',
                dataIndex: 'FILEID',
                width: 100,
                align: "center",
                render: (text, redord) => {
                    return <span onClick={() => {
                        this.downLoad(text)
                    }} style={{ cursor: "pointer", 'color': '#3383da' }}>附件</span>
                }
            },
        ]
       //奖惩记录 
        const Punishmentcolumns = [

            {
                title: '突出贡献奖记录',
                dataIndex: 'httcgxCount',
                width: 100,
                align: "center",
                render: (text) =>
                    <Tooltip title={text}>
                        {text == 0 ? <span>无</span> :
                            <span onClick={this.showAll.bind(this, 0)} style={{ cursor: "pointer", 'color': '#3383da' }} >
                                {text + '次'}
                    </span>}
                    </Tooltip>
            },
            {
                title: '通报记录',
                dataIndex: 'tbppCount',
                width: 100,
                align: "center",
                render: (text) =>
                    <Tooltip title={text}>
                        {text == 0 ? <span>无</span> :
                            <span onClick={this.showAll.bind(this, 1)} style={{ cursor: "pointer", 'color': '#3383da' }} >
                                {text + '次'}
                    </span>}
                    </Tooltip>
            },
            {
                title: '约谈记录',
                dataIndex: 'ytCount',
                width: 100,
                align: "center",
                render: (text) =>
                <Tooltip title={text}>
                    {text == 0 ? <span>无</span> :
                        <span onClick={this.showAll.bind(this, 2)} style={{ cursor: "pointer", 'color': '#3383da' }} >
                            {text + '次'}
                </span>}
                </Tooltip>
            },
            {
                title: '限期整改记录',
                dataIndex: 'xqzgCount',
                width: 100,
                align: "center",
                render: (text) =>
                <Tooltip title={text}>
                    {text == 0 ? <span>无</span> :
                        <span onClick={this.showAll.bind(this, 3)} style={{ cursor: "pointer", 'color': '#3383da' }} >
                            {text + '次'}
                </span>}
                </Tooltip>
            }
        ]





        let { toggleStore } = this.props
        let { num,
            CorporateData,
            CorporateTotal,
            QualificationData,
            TrainingData,
            IdentificationData,
            AchievementsData,
            AnnualData,
            PunishmentData,
            PunishmentListData,
            QualificationTotal,
            TrainingTotal,
            IdentificationTotal,
            AchievementsTotal,
            AnnualTotal,
            getQualificationDataPageNum,
            getQEApplygysidPageNum,
            getSupCorporatePageNum,
            getImplementListPageNum,
            getEvaluatePageNum,
            getEvaluateRecordListPageNum
        } = this.state

        const tabListNoTitle = [
            {
                key: '基本信息',
                tab: '基本信息',
            },
            {
                key: '法人证书',
                tab: '法人证书',
            },
            {
                key: '资质信息',
                tab: '资质信息',
            },
            {
                key: '培训信息',
                tab: '培训信息',
            },
            {
                key: '认定信息',
                tab: '认定信息',
            },
            {
                key: '绩效评价',
                tab: '绩效评价',
            },
            {
                key: '年度审核',
                tab: '年度审核',
            },
            {
                key: '奖惩记录',
                tab: '奖惩记录',
            },
        ];

        const contentListNoTitle = {
            基本信息:
                <Row gutter={24} justify='space-between'>
                    <Col span={24}>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'供应商名称'}>
                                {getFieldDecorator(`name`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '供应商名称',
                                        },
                                    ],
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>

                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'统一社会信用代码'}>
                                {getFieldDecorator(`number`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '统一社会信用代码',
                                        },
                                    ],
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'简称'}>
                                {getFieldDecorator(`shortname`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '简称',
                                        },
                                    ],
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'别称'}>
                                {getFieldDecorator(`anothername`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '别称',
                                        },
                                    ],
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'供应商编号'}>
                                {getFieldDecorator(`property_key`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '供应商编号',
                                        },
                                    ],
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'企业性质'}>
                                {getFieldDecorator(`property`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '企业性质',
                                        },
                                    ],
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'注册地'}>
                                {getFieldDecorator(`registrationplace`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '注册地',
                                        },
                                    ],
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'供应商类别'}>
                                {getFieldDecorator(`gystype`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '供应商类别',
                                        },
                                    ],
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'详细地址'}>
                                {getFieldDecorator(`detailaddr`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '详细地址',
                                        },
                                    ],
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'体系认证范围'}>
                                {getFieldDecorator(`productscope`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '体系认证范围',
                                        },
                                    ],
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'座机'}>
                                {getFieldDecorator(`contacts_tel`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '座机',
                                        },
                                    ],
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'法人代表'}>
                                {getFieldDecorator(`legalrepresentative`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '法人代表',
                                        },
                                    ],
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'手机号码'}>
                                {getFieldDecorator(`telphone`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '手机号码',
                                        },
                                    ],
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'军品负责人'}>
                                {getFieldDecorator(`militarychief`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '军品负责人',
                                        },
                                    ],
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'邮箱'}>
                                {getFieldDecorator(`email`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '邮箱',
                                        },
                                    ],
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'质量负责人'}>
                                {getFieldDecorator(`qualitychief`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '质量负责人',
                                        },
                                    ],
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'注册联系人'}>
                                {getFieldDecorator(`contacts`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '注册联系人·',
                                        },
                                    ],
                                })(<Input disabled />)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'企业简介'}>
                                {getFieldDecorator(`briefintroduction`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '企业简介',
                                        },
                                    ],
                                })(<Input.TextArea disabled size='large'></Input.TextArea>)}
                            </Form.Item>
                        </Col>
                        <Col span={12} >
                            <Form.Item {...formItemLayout} label={'供应能力'}>
                                {getFieldDecorator(`productioncapacity`, {
                                    rules: [
                                        {
                                            required: false,
                                            message: '供应能力',
                                        },
                                    ],
                                })(<Input.TextArea disabled size='large'></Input.TextArea>)}
                            </Form.Item>
                        </Col>
                    </Col>
                </Row>,


            法人证书:
                <Table bordered={true} rowKey={(text, key) => key} scroll={{ x: 1060 }} columns={CorporateData.length > 0 ? Corporatecolumns : []} dataSource={CorporateData}
                    pagination={{
                        showTotal: () => `共${CorporateTotal}条`,
                        total: CorporateTotal,
                        showQuickJumper: {
                            goButton: <Button type="link" size={'small'}>
                                跳转
                                </Button>
                        },
                        current: getSupCorporatePageNum,
                        onChange: (page, num) => {
                            this.setState({ getSupCorporatePageNum: page }, () => {
                                this.getSupCorporate() //法人信息
                            })
                        },
                        pageSize: 10
                    }} />
            ,
            资质信息:
                <Table bordered={true} rowKey={(text, key) => key} scroll={{ x: 1000 }} columns={QualificationData.length > 0 ? Qualificationcolumns : []} dataSource={QualificationData}
                    pagination={{
                        showTotal: () => `共${QualificationTotal}条`,
                        total: QualificationTotal,
                        showQuickJumper: {
                            goButton: <Button type="link" size={'small'}>
                                跳转
                                </Button>
                        },
                        current: getQualificationDataPageNum,
                        onChange: (page, num) => {
                            this.setState({ getQualificationDataPageNum: page }, () => {
                                this.getQualificationData()
                            })
                        },
                        pageSize: 10
                    }} />
            ,
            培训信息:
                <Table bordered={true} rowKey={(text, key) => key} scroll={{ x: 1090 }} columns={TrainingData.length > 0 ? Trainingcolumns : []} dataSource={TrainingData}
                    pagination={{
                        showTotal: () => `共${TrainingTotal}条`,
                        total: TrainingTotal,
                        showQuickJumper: {
                            goButton: <Button type="link" size={'small'}>
                                跳转
                                </Button>
                        },
                        current: getQEApplygysidPageNum,
                        onChange: (page, num) => {
                            this.setState({ getQEApplygysidPageNum: page }, () => {
                                this.getQEApplygysid() //培训信息
                            })
                        },
                        pageSize: 10
                    }} />
            ,
            认定信息:
                <Table bordered={true} rowKey={(text, key) => key} scroll={{ x: 1170 }} columns={IdentificationData.length > 0 ? Identificationcolumns : []} dataSource={IdentificationData}
                    pagination={{
                        showTotal: () => `共${IdentificationTotal}条`,
                        total: IdentificationTotal,
                        showQuickJumper: {
                            goButton: <Button type="link" size={'small'}>
                                跳转
                                </Button>
                        },
                        current: getImplementListPageNum,
                        onChange: (page, num) => {
                            this.setState({ getImplementListPageNum: page }, () => {
                                this.getImplementList()//认定信息
                            })
                        },
                        pageSize: 10
                    }} />
            ,
            绩效评价:
                <Table bordered={true} rowKey={(text, key) => key} scroll={{ x: 350 }} columns={AchievementsData.length > 0 ? Achievementscolumns : []} dataSource={AchievementsData}
                    pagination={{
                        showTotal: () => `共${AchievementsTotal}条`,
                        total: AchievementsTotal,
                        showQuickJumper: {
                            goButton: <Button type="link" size={'small'}>
                                跳转
                                </Button>
                        },
                        current: getEvaluatePageNum,
                        onChange: (page, num) => {
                            this.setState({ getEvaluatePageNum: page }, () => {
                                this.getEvaluate()//绩效评价
                            })
                        },
                        pageSize: 10
                    }} />
            ,
            年度审核:
                <Table bordered={true} rowKey={(text, key) => key} scroll={{ x: 970 }} columns={AnnualData.length > 0 ? Annualcolumns : []} dataSource={AnnualData}
                    pagination={{
                        showTotal: () => `共${AnnualTotal}条`,
                        total: AnnualTotal,
                        showQuickJumper: {
                            goButton: <Button type="link" size={'small'}>
                                跳转
                                </Button>
                        },
                        current: getEvaluateRecordListPageNum,
                        onChange: (page, num) => {
                            this.setState({ getEvaluateRecordListPageNum: page }, () => {
                                this.getEvaluateRecordList()  //年度审核
                            })
                        },
                        pageSize: 10
                    }} />
            ,
            奖惩记录:
                <Table bordered={true} rowKey={(text, key) => key} scroll={{ x: 850 }} columns={Punishmentcolumns} dataSource={PunishmentListData}
                    pagination={false} />
            ,
        };
        return (
            <Modal
                title={<b>查看详情</b>}
                width={960}

                visible={toggleStore.toggles.get(SHOW_ShowArchives_MODEL)}
                footer={
                    <div>
                        <span onClick={this.modification} style={{ cursor: "pointer", 'color': '#3383da', textDecoration: 'underline', marginRight: 20 }}>查看修改记录</span>
                        <Button type="primary" onClick={this.handleCancel}>关闭</Button>
                    </div>
                }
                onOk={this.handleSubmit}
                okText='关闭'
                onCancel={this.handleCancel}
            >
                {
                    //惩奖记录
                    toggleStore.toggles.get(SHOW_Punishment_MODEL) && <Punishment punishmentData={PunishmentData} num={num}></Punishment>
                }
                <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>

                    <Card
                        style={{ width: '100%', minHeight: 550 }}
                        tabList={tabListNoTitle}
                        activeTabKey={this.state.noTitleKey}
                        onTabChange={key => {
                            this.onTabChange(key, 'noTitleKey');
                        }}
                    >
                        {contentListNoTitle[this.state.noTitleKey]}
                    </Card>
                </Form>
            </Modal>
        );
    }
}

export default Form.create({ name: 'SupDetailModel' })(SupDetailModel);;