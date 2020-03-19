import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, Upload, Icon, Button, message, Tooltip } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_PJSSJL_MODEL, SHOW_NewBZYQ_MODEL, SHOW_ChooseSupplierPub_MODEL, SHOW_AddStaff_MODEL } from "../../../../constants/toggleTypes"
import { supplierAction, supContractAct } from "../../../../actions"
// 公用选择供应商组件
import ChooseListModel from "../../../../components/ChooseListModel"
import AddStaffModel from '../AddStaffModel'
const { TabPane } = Tabs;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class NewssModel extends React.Component {
    state = {
        SupList: [],
        Suppaginations: {},
        listModelOption: {},
        fileData: [],
        formType: "",
        qualityData: [],
        contractQualityData: [],
        defectsData: [],
        contractDefectData: [],
        requirementData:[],
        requirementstData: [],
        contractRequirementsData: []
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_PJSSJL_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore, refreshData } = this.props;
        const { fileData, contractRequirementsData, contractDefectData, contractQualityData } = this.state;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log(values);
                //新建合同信息
                let htxx = {
                    ...values,
                    htsubmit: 0
                }
                let htId = await supContractAct.newContract(htxx);
                let { userId, username } = supContractAct.pageInfo
                //保存合同附件
                if (htId) {
                    let htFileVO = []; //附件
                    contractRequirementsData // 合同要求
                    let htRequirements = {
                        htid: htId,
                        htxxyqlist: []
                    }
                    contractQualityData //质量问题
                    let htQualityData = {
                        htid: htId,
                        contractQualitylist: []
                    }
                    contractDefectData  // 不合格记录
                    let htDefectData = {
                        htid: htId,
                        contractDefectlist: []
                    }
                    //保存合同附件
                    fileData.forEach((item) => {
                        let data = {
                            htId: htId,// 合同ID 
                            fjId: item.fileid,
                            fjName: item.name,
                            createUserId: userId,
                            createUserName: username
                        }
                        htFileVO.push(data)
                    })
                    await supContractAct.createHtFile(htFileVO)


                    // 保存合同要求
                    contractRequirementsData.forEach((item) => {
                        let data = {
                            createuserid: userId,
                            createusername: username,
                            zlyq: item.zlyq // 质量要求
                        }
                        htRequirements.htxxyqlist.push(data)
                    })
                    await supContractAct.contractfjyqInfos(htRequirements)


                    // //保存质量问题
                    // contractQualityData.forEach((item) => {
                    //     let data = {
                    //         situation: item.situation, // 问题现象
                    //         analysis: item.analysis, //机理分析
                    //         reappear_situation: item.reappear_situation, //复现情况
                    //         review_situation: item.review_situation, //评审情况
                    //         createuser: username,
                    //         updateuser: username,
                    //     }
                    //     htQualityData.contractQualitylist.push(data)
                    // })
                    // await supContractAct.insertContractQualityinfo(htQualityData)


                    // //保存不合格记录
                    // contractDefectData.forEach((item) => {
                    //     let data = {
                    //         createuser: username, //创建人
                    //         defect_number: item.defect_number, // 不合格产品编号
                    //         defect_name: item.defect_name, //不合格产品名称
                    //         defect_amount: item.defect_amount,  // 不合格产品数量
                    //         measure: item.measure, // 处理措施
                    //         effect: item.effect, // 产生影响
                    //         type: item.type, // 处理类型
                    //         contact: item.contact, //联系人
                    //         phone: item.phone,//电话号码
                    //         updateuser: username  // 更新人
                    //     }
                    //     htDefectData.contractDefectlist.push(data)
                    // })
                    // await supContractAct.insertContractDefectinfo(htDefectData)
                }
                //刷新培训类型列表
                refreshData();
                toggleStore.setToggle(SHOW_PJSSJL_MODEL)
            }
        });
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_PJSSJL_MODEL)
    };

    async chooseSupFn(data) {
        const { setFieldsValue } = this.props.form
        console.log(data)
        if (data) {
            let supObj = data[0]
            setFieldsValue({
                jfmc: supObj.name,
                jfbh: supObj.code,
            })
        }
    }
    //资质证书load分页查询
    async SuppageChange(page, num) {
        this.loadSup(page, num)
    }
    //资质证书搜索
    async SupSearch(value) {
        this.loadSup(1, 10, value)
    }
    //加载资质证书
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
        // let SupList = await supplierEvalution.getZzpjCertificateAll(pageNum,rowNum,params)
        // console.log(SupList)
        // if(SupList){
        //     this.setState({
        //         SupList:{
        //             list:SupList.data.listZzpjCertificateVO,
        //             recordsTotal:SupList.data.recordsTotal
        //         },
        //         Suppaginations: {search:(value)=>{this.SupSearch(value)}, showTotal:()=>`共${SupList.data.recordsTotal}条`, onChange: (page, num) => { this.SuppageChange(page, num) }, showQuickJumper: true, total: SupList.data.recordsTotal, pageSize: 10 }

        //     })
        // }
    }
    async componentDidMount() {
        this.loadSup()
        //选择乙方供应商model
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
        //根据userid获取供应商信息
        let res = await supContractAct.getUserInfoByUserId()
        let gysinfo = {}
        if(res.code == 200){
            gysinfo = res.data
        }
        // let gysinfo = {
        //     createDate: "2019-11-19 10:58:26",
        //     createUser: "zhangsan",
        //     deptId: "asd",
        //     gysId: "63ae8365-bbe3-42b8-871e-f2917dd06441",
        //     gysName: "B北京艾博唯科技有限公司EG",
        //     gysNumber: "91110000100009176ACDG",
        //     id: "7",
        //     userId: "513399bb35de000"
        // }
        // if (gysinfo == null) {
        //     const { toggleStore } = this.props;
        //     toggleStore.setToggle(SHOW_PJSSJL_MODEL)
        //     message.error('当前账户非供应商账户！')
        //     return
        // }
        const { setFieldsValue } = this.props.form;
        setFieldsValue({
            yfmc: gysinfo.name,
            yfbh: gysinfo.code
        })
    }
    //上传文件
    setFile(files) {
        console.log(files)
        this.setState({
            fileData: files
        })
    }
    chooseZzApplyFn(data) {
        console.log(data)
        const { formType, qualityData, defectsData,requirementData, contractQualityData, contractDefectData, requirementstData, contractRequirementsData } = this.state
        if (formType == "qualityProblem") {
            qualityData.push(data);
            this.setState({
                qualityData
            })
            contractQualityData.push(data)
        } else if (formType == "defectsProblem") {
            defectsData.push(data);
            this.setState({
                defectsData
            })
            contractDefectData.push(data)
        } else if (formType == "requirements") {
            requirementstData.push(data);
            this.setState({
                requirementData
            })
            contractRequirementsData.push(data)
        }
    }
    // 删除质量问题
    // deleteQuality = (index, record) => {
    //     let { contractQualityData } = this.state
    //     let _arr = contractQualityData
    //     _arr.splice(index, 1)
    //     this.setState({
    //         contractQualityData: _arr
    //     })
    // }
    //删除合同要求
    deleteRequirements = (index, record) => {
        let { contractRequirementsData } = this.state
        let _arr = contractRequirementsData
        _arr.splice(index, 1)
        this.setState({
            contractRequirementsData: _arr
        })
    }
    // //删除不合格品记录
    // deleteDefects = (index, record) => {
    //     let { contractDefectData } = this.state
    //     let _arr = contractDefectData
    //     _arr.splice(index, 1)
    //     this.setState({
    //         contractDefectData: _arr
    //     })
    // }
    chooseType(type) {
        this.setState({
            formType: type
        })
    }
    render() {
        const { toggleStore } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { SupList, Suppaginations, listModelOption, formType, contractQualityData, contractDefectData, requirementstData, contractRequirementsData } = this.state
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const columns_standard = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 100,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '质量要求',
                dataIndex: 'zlyq',
                align: 'center'
            },
            {
                title: '操作',
                dataIndex: 'cz',
                width: 80,
                render: (text, record, key) => {
                    return (<div> <Button type="danger" onClick={() => { this.deleteRequirements(key, record) }} size={'small'}>删除</Button></div>)
                }
            },
        ]
        // const columns_quality = [
        //     {
        //         title: '序号',
        //         dataIndex: 'key',
        //         width: 100,
        //         align: "center",
        //         render: (text, index, key) => key + 1
        //     },
        //     {
        //         title: '问题现象',
        //         dataIndex: 'situation',
        //         width: 300,
        //         align: "center",
        //         render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
        //     },
        //     {
        //         title: '机理分析',
        //         dataIndex: 'analysis',
        //         width: 230,
        //         align: "center",
        //     },
        //     {
        //         title: '复现情况',
        //         dataIndex: 'reappear_situation',
        //         width: 230,
        //         align: "center",
        //     },
        //     {
        //         title: '评审情况',
        //         dataIndex: 'review_situation',
        //         width: 230,
        //         align: "center",
        //     },
        //     {
        //         title: '操作',
        //         dataIndex: 'cz',
        //         width: 80,
        //         render: (text, record, key) => {
        //             return (<div> <Button type="danger" onClick={() => { this.deleteQuality(key, record) }} size={'small'}>删除</Button></div>)
        //         }
        //     },
        // ]
        // const columns_defects = [
        //     {
        //         title: '序号',
        //         dataIndex: 'key',
        //         width: 100,
        //         align: "center",
        //         render: (text, index, key) => key + 1
        //     },
        //     {
        //         title: '不合格品编号',
        //         dataIndex: 'defect_number',
        //         width: 300,
        //         align: "center",
        //         render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
        //     },
        //     {
        //         title: '不合格品名称',
        //         dataIndex: 'defect_name',
        //         width: 230,
        //         align: "center",
        //     },
        //     {
        //         title: '不合格品数量',
        //         dataIndex: 'defect_amount',
        //         width: 230,
        //         align: "center",
        //     },
        //     {
        //         title: '处理措施',
        //         dataIndex: 'measure',
        //         width: 230,
        //         align: "center",
        //     },
        //     {
        //         title: '产生影响',
        //         dataIndex: 'effect',
        //         width: 230,
        //         align: "center",
        //     },
        //     {
        //         title: '处理类型',
        //         dataIndex: 'type',
        //         width: 230,
        //         align: "center",
        //     },
        //     {
        //         title: '联系人',
        //         dataIndex: 'contact',
        //         width: 230,
        //         align: "center",
        //     },
        //     {
        //         title: '电话号码',
        //         dataIndex: 'phone',
        //         width: 230,
        //         align: "center",
        //     },
        //     {
        //         title: '操作',
        //         dataIndex: 'cz',
        //         width: 80,
        //         render: (text, record, key) => {
        //             return (<div> <Button type="danger" onClick={() => { this.deleteDefects(key, record) }} size={'small'}>删除</Button></div>)
        //         }
        //     },
        // ]
        let that = this;
        const uploadProps = {
            name: 'file',
            action: `${supContractAct.FileBaseURL}`,
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
        return (
            <div>
                <Modal
                    title="合同录入"
                    width={960}
                    visible={toggleStore.toggles.get(SHOW_PJSSJL_MODEL)}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                >
                    <Form className="ant-advanced-search-form" onSubmit={(e) => { }}>
                        <Card bordered={false} className="new_supplier_form">
                            <Row gutter={12}>
                                <Col span={24}>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'合同编码'}>
                                            {getFieldDecorator(`htbm`, {
                                                initValue: "合同编码",
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '合同编码',
                                                    },
                                                ],
                                            })(<Input />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'合同标的'}>
                                            {getFieldDecorator(`htbd`, {
                                                initValue: "合同标的",
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '合同标的',
                                                    },
                                                ],
                                            })(<Input />)}
                                        </Form.Item>

                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'甲方名称'}>
                                            {getFieldDecorator(`jfmc`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '甲方名称',
                                                    },
                                                ],
                                            })(<Input addonAfter={<Icon style={{ cursor: 'pointer' }} onClick={() => { toggleStore.setToggle(SHOW_ChooseSupplierPub_MODEL) }} type="plus" />}/>)}
                                        </Form.Item>

                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'乙方名称'}>
                                            {getFieldDecorator(`yfmc`, {
                                                initValue: "乙方名称",
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '乙方名称',
                                                    },
                                                ],
                                            })(<Input disabled={true}  />)}
                                        </Form.Item>

                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'甲方单位编号'}>
                                            {getFieldDecorator(`jfbh`)(<Input />)}
                                        </Form.Item>

                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'乙方单位编号'}>
                                            {getFieldDecorator(`yfbh`)(<Input />)}
                                        </Form.Item>


                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'甲方签署人'}>
                                            {getFieldDecorator(`jfqsr`)(<Input />)}
                                        </Form.Item>

                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'乙方签署人'}>
                                            {getFieldDecorator(`yfqsr`)(<Input />)}
                                        </Form.Item>

                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'过程范围'}>
                                            {getFieldDecorator(`gcfw`)(<Input />)}
                                        </Form.Item>

                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'产品范围'}>
                                            {getFieldDecorator(`cpfw`)(<Input />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >

                                        <Form.Item {...formItemLayout} label={'合同周期'}>
                                            {getFieldDecorator(`htzq`)(<Input />)}
                                        </Form.Item>
                                    </Col>

                                </Col>
                            </Row>
                        </Card>
                        <Card bordered={false}
                            title={<Upload {...uploadProps}><Button type="primary"><Icon type="upload" />上传附件</Button></Upload>}
                            className="new_supplier_producelist">
                        </Card>
                        <Card bordered={false} title={<b>合同要求</b>} extra={
                            <Button type="primary" onClick={() => {
                                this.chooseType("requirements")
                                toggleStore.setToggle(SHOW_AddStaff_MODEL)
                            }}>
                                新增
                            </Button>
                        } className="new_supplier_producelist">
                            <Row>
                                <Col span={24}>
                                    <Table rowKey={(text, key) => key} columns={columns_standard} dataSource={contractRequirementsData} />
                                </Col>
                            </Row>
                        </Card>
                        {/* <Card bordered={false} title={<b>质量问题</b>} extra={
                            <Button type="primary" onClick={() => {
                                this.chooseType("qualityProblem")
                                toggleStore.setToggle(SHOW_AddStaff_MODEL)
                            }}>
                                新增
                            </Button>
                        } className="new_supplier_producelist">
                            <Row>
                                <Col span={24}>
                                    <Table rowKey={(text, key) => key} columns={columns_quality} dataSource={contractQualityData} />
                                </Col>
                            </Row>
                        </Card>
                        <Card bordered={false} title={<b>不合格品记录</b>} extra={
                            <Button type="primary" onClick={() => {
                                this.chooseType("defectsProblem")
                                toggleStore.setToggle(SHOW_AddStaff_MODEL)
                            }}>
                                新增
                            </Button>
                        } className="new_supplier_producelist">
                            <Row>
                                <Col span={24}>
                                    <Table rowKey={(text, key) => key} columns={columns_defects} dataSource={contractDefectData} />
                                </Col>
                            </Row>
                        </Card> */}
                    </Form>


                </Modal>
                {/* 选择乙方供应商 */}
                {
                    toggleStore.toggles.get(SHOW_ChooseSupplierPub_MODEL) && <ChooseListModel list={SupList} pagination={Suppaginations} options={listModelOption} chooseFinishFn={(val) => { this.chooseSupFn(val) }} />
                }
                {
                    toggleStore.toggles.get(SHOW_AddStaff_MODEL) && <AddStaffModel formType={formType} chooseFinishFn={(val) => { this.chooseZzApplyFn(val) }} />
                }
            </div>
        );
    }
}

export default Form.create({ name: 'NewSupplier' })(NewssModel);;