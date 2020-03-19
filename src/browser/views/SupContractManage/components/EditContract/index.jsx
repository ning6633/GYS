import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, Upload, Icon, Button, message, Tooltip, InputNumber } from 'antd';
import { observer, inject, } from 'mobx-react';
import { toJS } from 'mobx';
import { SHOW_EditContract_MODEL, SHOW_AddStaff_MODEL, SHOW_NewBZYQ_MODEL, SHOW_ChooseSupplierPub_MODEL } from "../../../../constants/toggleTypes"
import { supplierAction, supContractAct } from "../../../../actions"
// 公用选择供应商组件
import ChooseListModel from "../../../../components/ChooseListModel"
import AddStaffModel from "../AddStaffModel"
const { TabPane } = Tabs;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore', 'contractStore')
@observer
class EditContract extends React.Component {
    state = {
        SupList: [],
        Suppaginations: {},
        listModelOption: {},
        fileData: [],
        contractFileData: [],
        isA: false,
        qualityData: [],
        defectsData: [],
        requirementData: [],
        formType: "",
        contractRequirementsData: [],
        contractQualityData: [],
        contractDefectData: [],
        isOver: false,
        listContractPerformances: [],
        gynlpj: 0,
        zlaqpj: 0,
        ptfwpj: 0,
        qtpj: 0,
        score: 0
    }
    handleOk = e => {
        const { toggleStore, changeIsDelay } = this.props;
        changeIsDelay()
        toggleStore.setToggle(SHOW_EditContract_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore, refreshData, editrecord, isdelay, changeIsDelay } = this.props;
        const { fileData, qualityData, defectsData, requirementData } = this.state;
        this.props.form.validateFields(async (err, values) => {
            let htId = editrecord.htId;
            const { userId, username } = supContractAct.pageInfo;
            if (!err) {
                if (isdelay) {
                    await supContractAct.delayContract(htId);
                }
                //修改合同基本信息

                let htxx = {
                    ...values,
                    htId: htId,// 合同ID 
                    updateUserId: userId,
                    updateUserName: username,
                };
                // 合同要求
                let htRequirements = {
                    htid: htId,
                    htxxyqlist: []
                }
                //质量问题
                let htQualityData = {
                    htid: htId,
                    contractQualitylist: []
                }
                // 不合格记录
                let htDefectData = {
                    htid: htId,
                    contractDefectlist: []
                }
                await supContractAct.updateHtinfo(htxx)


                // 修改合同信息
                if (editrecord.htsubmit == 2 && !(editrecord.status == 2)) {
                    if (qualityData.length) {
                        //保存质量问题
                        qualityData.forEach((item) => {
                            let data = {
                                contract_id: htId,
                                createuser: username,
                                analysis: item.analysis,
                                reappear_situation: item.reappear_situation,
                                review_situation: item.review_situation,
                                situation: item.situation,
                                updateuser: username
                            }
                            htQualityData.contractQualitylist.push(data)
                        })
                        await supContractAct.insertContractQualityinfo(htQualityData)
                    }
                    //保存不合格品记录
                    if (defectsData.length) {
                        defectsData.forEach((item) => {
                            let data = {
                                contract_id: htId,
                                createuser: username,
                                contact: item.contact,
                                defect_amount: item.defect_amount,
                                defect_name: item.defect_name,
                                defect_number: item.defect_number,
                                effect: item.effect,
                                measure: item.measure,
                                phone: item.phone,
                                type: item.type,
                                updateuser: username
                            }
                            htDefectData.contractDefectlist.push(data)
                        })
                        await supContractAct.insertContractDefectinfo(htDefectData)
                    }
                } else {

                    if (fileData.length) {
                        //保存合同附件
                        let htFileVO = [];
                        fileData.forEach((item) => {
                            let data = {
                                htId: htId,// 合同ID 
                                fjId: item.fileid,
                                fjName: item.name,
                                createUserName: username,
                                createUserId: userId
                            }
                            htFileVO.push(data)
                        })
                        await supContractAct.createHtFile(htFileVO)
                    }
                    if (requirementData.length) {
                        // 保存合同要求

                        requirementData.forEach((item) => {
                            let data = {
                                createuserid: userId,
                                createusername: username,
                                zlyq: item.zlyq // 质量要求
                            }
                            htRequirements.htxxyqlist.push(data)
                        })
                        await supContractAct.contractfjyqInfos(htRequirements)
                    }
                }


                // 刷新培训类型列表
                refreshData();
                toggleStore.setToggle(SHOW_EditContract_MODEL)
            }
        });
        changeIsDelay()
    };
    handleCancel = e => {
        const { toggleStore, changeIsDelay } = this.props;
        changeIsDelay()
        toggleStore.setToggle(SHOW_EditContract_MODEL)
    };
    //
    async chooseSupFn(data) {
        const { setFieldsValue } = this.props.form
        if (data) {
            let supObj = data[0]
            setFieldsValue({
                yfmc: supObj.name,
                yfbh: supObj.code,
            })
        }
    }
    //
    chooseZzApplyFn(data) {
        let _num = 0
        _num ++
        data.num = _num
        const { formType, qualityData, defectsData, requirementData, contractRequirementsData, contractQualityData, contractDefectData } = this.state
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
            requirementData.push(data);
            this.setState({
                requirementData
            })
            contractRequirementsData.push(data)
        }
    }
    async componentDidMount() {
        this.loadSup()
        let { editrecord, contractStore, isdelay, listContractPerformances } = this.props;
        console.log(editrecord)
        if (editrecord.htsubmit == 0) {
            this.setState({
                isOver: true
            })
        }
        let htId = editrecord.htId;
        const { setFieldsValue } = this.props.form;
        let { htbm,
            htbd,
            jfmc,
            yfmc,
            jfbh,
            yfbh,
            jfqsr,
            yfqsr,
            gcfw,
            cpfw,
            htzq,
            htyqyy } = editrecord
        setFieldsValue({
            htbm,
            htbd,
            jfmc,
            yfmc,
            jfbh,
            yfbh,
            jfqsr,
            yfqsr,
            gcfw,
            cpfw,
            htzq,
            htyqyy
        })
        //根据合同ID获取合同附件
        let contractFileData = await supContractAct.getFJbyId(htId, 1, 10)
        this.setState({
            contractFileData
        })
        //判断该合同,本账号是乙方还是甲方
        const gyscode = contractStore.gyscode;
        if (gyscode == editrecord.jfbh) {
            console.log("我是甲方")
            // 根据合同ID 获取履约评价
            if (editrecord.status == 2) {
                let res = await supContractAct.getContractPerformanceBycontractId(htId)
                if (res.code == 200) {
                    if (res.data.recordsTotal > 0) {
                        this.setState({
                            listContractPerformances: res.data.listContractPerformances[0],

                        }, () => {
                            let { listContractPerformances } = this.state
                            if (listContractPerformances.evaluatecontent.length > 0) {
                                let {
                                    gynlpj,
                                    zlaqpj,
                                    ptfwpj,
                                    qtpj,
                                } = JSON.parse(listContractPerformances.evaluatecontent)
                                let { score } = listContractPerformances
                                setFieldsValue({
                                    gynlpj,
                                    zlaqpj,
                                    ptfwpj,
                                    qtpj,
                                    score
                                })
                            }
                        })
                    }
                    else {
                        let {
                            gynlpj,
                            zlaqpj,
                            ptfwpj,
                            qtpj,
                            score
                        } = this.state
                        setFieldsValue({
                            gynlpj,
                            zlaqpj,
                            ptfwpj,
                            qtpj,
                            score
                        })
                    }
                }
            }
            this.setState({
                isA: true
            })
        } else if (gyscode == editrecord.yfbh) {
            console.log("我是乙方")
            if (editrecord.status == 2) {
                let res = await supContractAct.getContractPerformanceBycontractId(htId)
                if (res.data.recordsTotal > 0) {
                    this.setState({
                        listContractPerformances: res.data.listContractPerformances[0],
                    }, () => {
                        let { listContractPerformances } = this.state
                        if (listContractPerformances.evaluatecontent.length > 0) {
                            let {
                                gynlpj,
                                zlaqpj,
                                ptfwpj,
                                qtpj,
                            } = JSON.parse(listContractPerformances.evaluatecontent)
                            let { score } = listContractPerformances
                            setFieldsValue({
                                gynlpj,
                                zlaqpj,
                                ptfwpj,
                                qtpj,
                                score
                            })
                        }
                    })

                } else {
                    console.log("甲方未评价")
                    let {
                        gynlpj,
                        zlaqpj,
                        ptfwpj,
                        qtpj,
                        score
                    } = this.state
                    setFieldsValue({
                        gynlpj,
                        zlaqpj,
                        ptfwpj,
                        qtpj,
                        score
                    })
                }
            }
            this.setState({
                isA: false
            })
        }
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



        // 根据合同ID查询合同要求
        let requirements = await supContractAct.getContractInfosYQ(htId, 1, 10)
        this.setState({
            contractRequirementsData: requirements.list
        })
        //GET /1.0/getContractZLWTInfos根据合同ID获取合同质量要求记录
        let qualityret = await supContractAct.getQualitybyId(htId, 1, 10)
        console.log(qualityret)
        this.setState({
            contractQualityData: qualityret.listContractQualitys
        })
        //GET /1.0/getContractDefectInfos根据合同ID查询不合格品的记录
        let defectret = await supContractAct.getDefectbyId(htId, 1, 10)
        this.setState({
            contractDefectData: defectret.listContractDefects
        })
    }
    //上传文件
    setFile(files) {
        this.setState({
            fileData: files
        })
    }
    chooseType(type) {
        this.setState({
            formType: type
        })
    }
    // 加载资质证书
    async loadSup(pageNum = 1, rowNum = 10, name = '') {
        let ret = await supplierAction.searchSupplierInfo(name);
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
    //删除质量问题
    async deleteQuality(key, record) {
        const { contractQualityData ,qualityData} = this.state;
        if (record.id) {
            //存在id，即删除服务端数据
            let _arr = [];
            _arr.push(record.id)
            await supContractAct.deleteQuality(_arr)
            let idx = _.findIndex(contractQualityData, { id: record.id })
            contractQualityData.splice(idx, 1)
        } else {
            //删除新增数据
            contractQualityData.splice(key, 1)
            let idx = _.findIndex(qualityData, { num: record.num })
            qualityData.splice(idx, 1)
            this.setState({})


        }
        this.setState({
            contractQualityData,
            qualityData
        })
    }
    // 删除合同要求
    async deleteRequirement(index, record) {
        let { requirementData, contractRequirementsData } = this.state
        let { editrecord } = this.props;
        let htId = editrecord.htId;
        if (record.htyqid) {
            //删除服务器存在的数据
            let res = await supContractAct.deleteHtyq(record.htyqid)
            if (res.code == 200) {
                contractRequirementsData.splice(index, 1)
                this.setState(
                    {
                        contractRequirementsData
                    }
                )
            }
        } else {
            //删除新增数据
            contractRequirementsData.splice(index, 1)
            let idx = _.findIndex(requirementData, { num: record.num })
            requirementData.splice(idx, 1)
            this.setState(
                {
                    contractRequirementsData,
                    requirementData
                }
            )
        }
    }
    //履约评价
    async LYPJ() {
        let {
            score,
            gynlpj,
            zlaqpj,
            ptfwpj,
            qtpj
        } = this.state
        let { editrecord } = this.props
        let body = {}
        body.contract_id = editrecord.htId
        body.evaluatecontent = JSON.stringify({
            score: (gynlpj + zlaqpj + ptfwpj + qtpj) / 4,
            gynlpj,
            zlaqpj,
            ptfwpj,
            qtpj
        })
        body.gysid = editrecord.createUserId
        body.score = (gynlpj + zlaqpj + ptfwpj + qtpj) / 4
        let res = await supContractAct.performance(body)
        if (res.code == 200) {
            message.success("履约评分完成")
            this.setState({ listContractPerformances: body })
        }
    }
    //删除不合格品
    async deleteDefects(key, record) {
        const { contractDefectData ,defectsData} = this.state;
        if (record.id) {
            //存在id，即删除服务端数据
            let _arr = [];
            _arr.push(record.id)
            await supContractAct.deleteDefects(_arr)
            let idx = _.findIndex(contractDefectData, { id: record.id })
            contractDefectData.splice(idx, 1)
        } else {
            //删除新增数据
            contractDefectData.splice(key, 1)
            let idx = _.findIndex(defectsData, { num: record.num })
            defectsData.splice(idx, 1)
            this.setState(
                {
                    contractDefectData,
                    defectsData
                }
            )

        }
        this.setState({
            contractDefectData,
            defectsData
        })
    }
    //删除合同附件
    async deletePlanFile(record) {
        let { editrecord } = this.props;
        let htId = editrecord.htId;
        let res = await supContractAct.contractyqInfos(record.htfjId)
        if (res.code == 200) {
            let contractFileData = await supContractAct.getFJbyId(htId, 1, 10)
            this.setState({
                contractFileData
            })
        }
    }
    onBlur(name, e) {
        let { gynlpj,
            zlaqpj,
            ptfwpj,
            qtpj } = this.state
        const { setFieldsValue } = this.props.form;
        if (name == 'gynlpj') {
            this.setState({
                gynlpj: e,
                score: (gynlpj + zlaqpj + ptfwpj + qtpj) / 4
            }, () => {
                let { gynlpj, zlaqpj, ptfwpj, qtpj } = this.state
                setFieldsValue({
                    score: (gynlpj + zlaqpj + ptfwpj + qtpj) / 4
                })
            })
        }
        if (name == 'zlaqpj') {
            this.setState({
                zlaqpj: e,
                score: (gynlpj + zlaqpj + ptfwpj + qtpj) / 4
            }, () => {
                let { gynlpj, zlaqpj, ptfwpj, qtpj } = this.state
                setFieldsValue({
                    score: (gynlpj + zlaqpj + ptfwpj + qtpj) / 4
                })
            })
        }
        if (name == 'ptfwpj') {
            this.setState({
                ptfwpj: e,
                score: (gynlpj + zlaqpj + ptfwpj + qtpj) / 4
            }, () => {
                let { gynlpj, zlaqpj, ptfwpj, qtpj } = this.state
                setFieldsValue({
                    score: (gynlpj + zlaqpj + ptfwpj + qtpj) / 4
                })
            })
        }
        if (name == 'qtpj') {
            this.setState({
                qtpj: e,
                score: (gynlpj + zlaqpj + ptfwpj + qtpj) / 4
            }, () => {
                let { gynlpj, zlaqpj, ptfwpj, qtpj } = this.state
                setFieldsValue({
                    score: (gynlpj + zlaqpj + ptfwpj + qtpj) / 4
                })
            })
        }
    }
    render() {
        const { toggleStore, editrecord, isdelay } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { contractFileData, contractQualityData, SupList, Suppaginations, listModelOption, contractDefectData, isA, formType, isOver, contractRequirementsData, listContractPerformances, score } = this.state;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
            bordered: false
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
                    return (<div> <Button type="danger" disabled={!(isA && editrecord.htsubmit == 0)} onClick={() => { this.deleteRequirement(key, record) }} size={'small'}>删除</Button></div>)
                }
            },
        ]
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
        const columns_files = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 100,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '文件名称',
                dataIndex: 'fjName',
                width: 300,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                width: 230,
                align: "center",
            },
            {
                title: '创建人',
                dataIndex: 'createUserName',
                width: 230,
                align: "center",
            },
            {
                title: '操作',
                dataIndex: 'cz',
                width: 80,
                render: (text, record, key) => {
                    return (<div> <Button type="danger" disabled={!(isA && editrecord.htsubmit == 0)} onClick={() => { this.deletePlanFile(record) }} size={'small'}>删除</Button></div>)
                }
            },
        ]
        const columns_quality = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 100,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '问题现象',
                dataIndex: 'situation',
                width: 300,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '机理分析',
                dataIndex: 'analysis',
                width: 230,
                align: "center",
            },
            {
                title: '复现情况',
                dataIndex: 'reappear_situation',
                width: 230,
                align: "center",
            },
            {
                title: '评审情况',
                dataIndex: 'review_situation',
                width: 230,
                align: "center",
            },
            {
                title: '操作',
                dataIndex: 'cz',
                width: 80,
                render: (text, record, key) => {
                    return (!isA ? <div> <Button disabled={editrecord.status == 2} type="danger" onClick={() => { this.deleteQuality(key, record) }} size={'small'}>删除</Button></div> : "")
                }
            },
        ]
        const columns_defects = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 100,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '不合格品编号',
                dataIndex: 'defect_number',
                width: 300,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '不合格品名称',
                dataIndex: 'defect_name',
                width: 230,
                align: "center",
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 230,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
            },
            {
                title: '不合格品数量',
                dataIndex: 'defect_amount',
                width: 230,
                align: "center",
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 230,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
            },
            {
                title: '处理措施',
                dataIndex: 'measure',
                width: 230,
                align: "center",
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 230,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
            },
            {
                title: '产生影响',
                dataIndex: 'effect',
                width: 230,
                align: "center",
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 230,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
            },
            {
                title: '处理类型',
                dataIndex: 'type',
                width: 230,
                align: "center",
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 230,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
            },
            {
                title: '联系人',
                dataIndex: 'contact',
                width: 230,
                align: "center",
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 230,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
            },
            {
                title: '电话号码',
                dataIndex: 'phone',
                width: 230,
                align: "center",
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 230,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
            },
            {
                title: '操作',
                dataIndex: 'cz',
                width: 80,
                render: (text, record, key) => {
                    return (!isA ? <div> <Button type="danger" disabled={editrecord.status == 2 } onClick={() => { this.deleteDefects(key, record) }} size={'small'}>删除</Button></div> : "")
                }
            },
        ]
        return (
            <div>
                <Modal
                    title="合同详情"
                    width={960}
                    visible={toggleStore.toggles.get(SHOW_EditContract_MODEL)}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                >
                    <Form className="ant-advanced-search-form" onSubmit={(e) => { }}>
                        <Card bordered={false} >
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
                                            })(<Input disabled={!isA ? (editrecord.htsubmit == 0 ? false : true) : (editrecord.htsubmit == 1 ? false : true)} />)}
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
                                            })(<Input disabled={!isA ? (editrecord.htsubmit == 0 ? false : true) : (editrecord.htsubmit == 1 ? false : true)} />)}
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
                                            })(<Input disabled={true} addonAfter={editrecord.htsubmit == 0 ? <Icon style={{ cursor: 'pointer' }} onClick={() => { toggleStore.setToggle(SHOW_ChooseSupplierPub_MODEL) }} type="plus" /> : null} />)}
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
                                            {getFieldDecorator(`jfbh`)(<Input disabled={true} />)}
                                        </Form.Item>

                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'乙方单位编号'}>
                                            {getFieldDecorator(`yfbh`)(<Input disabled={true} />)}
                                        </Form.Item>


                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'甲方签署人'}>
                                            {getFieldDecorator(`jfqsr`)(<Input disabled={isA ? (editrecord.htsubmit == 0 ? false : true) : (editrecord.htsubmit == 1 ? false : true)} />)}
                                        </Form.Item>

                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'乙方签署人'}>
                                            {getFieldDecorator(`yfqsr`)(<Input disabled={isA ? (editrecord.htsubmit == 0 ? false : true) : (editrecord.htsubmit == 1 ? false : true)} />)}
                                        </Form.Item>

                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'过程范围'}>
                                            {getFieldDecorator(`gcfw`)(<Input disabled={isA ? (editrecord.htsubmit == 0 ? false : true) : (editrecord.htsubmit == 1 ? false : true)} />)}
                                        </Form.Item>

                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'产品范围'}>
                                            {getFieldDecorator(`cpfw`)(<Input disabled={isA ? (editrecord.htsubmit == 0 ? false : true) : (editrecord.htsubmit == 1 ? false : true)} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'合同周期'}>
                                            {getFieldDecorator(`htzq`)(<Input disabled={isA ? ((editrecord.htsubmit == 0 ? false : !isdelay)) : (editrecord.htsubmit == 1 ? false : true)} />)}
                                        </Form.Item>
                                    </Col>
                                    {
                                        isdelay ? <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'延期原因'}>
                                                {getFieldDecorator(`htyqyy`)(<Input disabled={isdelay ? false : true} />)}
                                            </Form.Item>
                                        </Col> : ""
                                    }
                                </Col>
                            </Row>
                        </Card>

                        <Card bordered={false}
                            title={isA && editrecord.htsubmit == 0 ? <Upload {...uploadProps}><Button type="primary"><Icon type="upload" />上传附件</Button></Upload> : <b>附件</b>}
                            className="new_supplier_producelist">
                            <Row>
                                <Col span={24}>
                                    <Table rowKey={(text, key) => key} pagination={false} columns={columns_files} dataSource={contractFileData} />
                                </Col>
                            </Row>
                        </Card>
                        <Card bordered={false} title={<b>合同要求</b>} extra={isA && editrecord.htsubmit == 0 ?
                            <Button type="primary" onClick={() => {
                                this.chooseType("requirements")
                                toggleStore.setToggle(SHOW_AddStaff_MODEL)
                            }} >
                                新增
                            </Button> : ""
                        } className="new_supplier_producelist">
                            <Row>
                                <Col span={24}>
                                    <Table rowKey={(text, key) => key} pagination={false} columns={columns_standard} dataSource={contractRequirementsData} />
                                </Col>
                            </Row>
                        </Card>
                        {
                            (editrecord.htsubmit == 2) ? <Card bordered={false} title={<b>质量问题</b>} extra={!isA ?
                                <Button disabled={isA || (editrecord.status == 2)} type="primary" onClick={() => { this.chooseType("qualityProblem"); toggleStore.setToggle(SHOW_AddStaff_MODEL) }}>
                                    新增
                                </Button> : ""
                            } className="new_supplier_producelist">
                                <Row>
                                    <Col span={24}>
                                        <Table rowKey={(text, key) => key} pagination={false} columns={columns_quality} dataSource={contractQualityData} />
                                    </Col>
                                </Row>
                            </Card> : ''
                        }
                        {(editrecord.htsubmit == 2) ? <Card bordered={false} title={<b>不合格品处理</b>} extra={!isA ?
                            <Button disabled={isA || (editrecord.status == 2)} type="primary" onClick={() => { this.chooseType("defectsProblem"); toggleStore.setToggle(SHOW_AddStaff_MODEL) }}>
                                新增
                            </Button> : ""
                        } className="new_supplier_producelist">
                            <Row>
                                <Col span={24}>
                                    <Table rowKey={(text, key) => key} scroll={{ x: 1200 }} pagination={false} columns={columns_defects} dataSource={contractDefectData} />
                                </Col>
                            </Row>
                        </Card> : ''}

                        {editrecord.htsubmit == 2 && (editrecord.status == 2) ?
                            <Card bordered={false} title={<b>履约评价</b>}>
                                <Row gutter={24}>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'供应能力评价'}>
                                            {getFieldDecorator(`gynlpj`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '供应能力评价',
                                                    },
                                                ],
                                            })(<InputNumber min={0} max={100} onChange={(e) => { this.onBlur('gynlpj', e) }} disabled={listContractPerformances.score > 0 || !isA} addonAfter='分' />)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'质量安全评价'}>
                                            {getFieldDecorator(`zlaqpj`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '质量安全评价',
                                                    },
                                                ],
                                            })(<InputNumber min={0} max={100} onChange={(e) => { this.onBlur('zlaqpj', e) }} disabled={listContractPerformances.score > 0 || !isA} addonAfter='分' />)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'配套服务评价'}>
                                            {getFieldDecorator(`ptfwpj`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '配套服务评价',
                                                    },
                                                ],
                                            })(<InputNumber min={0} max={100} onChange={(e) => { this.onBlur('ptfwpj', e) }} disabled={listContractPerformances.score > 0 || !isA} addonAfter='分' />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'综合履约评价'}>
                                            {getFieldDecorator(`score`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '综合履约评价',
                                                    },
                                                ],
                                            })(<InputNumber disabled={true} addonAfter='分' />)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'其他评价'}>
                                            {getFieldDecorator(`qtpj`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '其他评价',
                                                    },
                                                ],
                                            })(<InputNumber min={0} max={100} onChange={(e) => { this.onBlur('qtpj', e) }} disabled={listContractPerformances.score > 0 || !isA} addonAfter='分' />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Button type='primary' style={{ float: "right" }} disabled={listContractPerformances.score > 0 || !isA} onClick={() => { this.LYPJ() }}>确定</Button>
                                    </Col>
                                </Row>
                            </Card>
                            : ''}
                    </Form>
                </Modal>
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

export default Form.create({ name: 'NewSupplier' })(EditContract);;