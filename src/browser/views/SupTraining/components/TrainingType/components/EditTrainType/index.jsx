import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, Select, Icon, Button, message, Tooltip } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_EditTrainType_MODEL, SHOW_ChooseListModel_MODEL } from "../../../../../../constants/toggleTypes"
import { supplierTrain } from "../../../../../../actions"
// 公用选择供应商组件
import ChooseListModel from "../../../../../../components/ChooseListModel"
const { TabPane } = Tabs;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class EditTrainType extends React.Component {
    state = {
        specialistTypes: {},
        supplierTypes: {},
        choosetype: "",//新增专家范围还是供应商范围
        supData: [],//选择的供应商类别
        specData: [],//选择的专家类别
        newSpecData: [],//新添加的专家类型
        newSupData: [],//新添加的供应商类型
        listModelOption: {}
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_EditTrainType_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore, refreshData, editrecord } = this.props;
        const { supData, specData, newSpecData, newSupData } = this.state
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log(values);
                //先调用修改培训类型接口
                let editTrainTypeVO = {
                    id: editrecord.id,
                    trainName: values.trainName,
                    status: editrecord.status,
                    createUser: supplierTrain.pageInfo.username,
                    updateUser: supplierTrain.pageInfo.username
                }
                await supplierTrain.editTrainType(editTrainTypeVO)
                //
                if (editrecord.id) {
                    let TrainExpertTypeVO = [];
                    let TrainGysTypeVO = [];
                    newSpecData.forEach((item) => {
                        let data = {
                            trainTypeId: editrecord.id,
                            expertTypeName: item.name,
                            expertTypeCode: item.code,
                        }
                        TrainExpertTypeVO.push(data)
                    })
                    newSupData.forEach((item) => {
                        let data = {
                            trainTypeId: editrecord.id,
                            gysTypeName: item.name,
                            gysTypeCode: item.code,
                        }
                        TrainGysTypeVO.push(data)
                    })
                    //再新增培训类型-专家范围关联表
                    await supplierTrain.createTrainExpertType(TrainExpertTypeVO)
                    //再新增培训类型-供应商范围关联表
                    await supplierTrain.createTrainGysType(TrainGysTypeVO)
                }
                //刷新培训类型列表
                refreshData();
                toggleStore.setToggle(SHOW_EditTrainType_MODEL)
            }
        });
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_EditTrainType_MODEL)
    };
    async componentDidMount() {
        const { setFieldsValue } = this.props.form;
        const { editrecord } = this.props;
        let cureditrecord = this.props.editrecord;
        //获取初始专家类型和供应商类型数据
            //统一字段名 和 处理 id
            cureditrecord.trainExpertTypeList.map((item) => {
                item["name"] = item["expertTypeName"]
                item["code"] = item["expertTypeCode"]
                item["realid"] = item["id"] 
                item["id"] = item["expertTypeCode"]
                // delete item['expertTypeName'];
                // delete item['expertTypeCode'];
            })
            cureditrecord.trainGysTypeList.map((item) => {
                item["name"] = item["gysTypeName"]
                item["code"] = item["gysTypeCode"]
                item["realid"] = item["id"]
                item["id"] = item["gysTypeCode"]
                // delete item['gysTypeName'];
                // delete item['gysTypeCode'];
            })
        this.setState({
            specData: cureditrecord.trainExpertTypeList,
            supData: cureditrecord.trainGysTypeList
        })

        //获取专家类型列表
        let specialistTypes = await supplierTrain.getSpecialistTypes("SPECIALIST")
        specialistTypes.map((item) => {
            item["id"] = item["code"]
            item["realid"] = item["id"]
        })
        this.setState({
            specialistTypes: {
                list: specialistTypes,
                total: specialistTypes.length
            }
        })
        //获取供应商范围列表
        let supplierTypes = await supplierTrain.getSupplierTypes("IMPORTANT")
        supplierTypes.map((item) => {
            item["id"] = item["code"]
            item["realid"] = item["id"]
        })
        this.setState({
            supplierTypes: {
                list: supplierTypes,
                total: supplierTypes.length
            }
        })
        setFieldsValue({ trainName: editrecord.trainName })
    }
    //
    chooseZzApplyFn(data) {
        const { supData, specData, choosetype, newSpecData, newSupData } = this.state
        data.forEach(item => {
            if (choosetype == 'specialist') {
                newSpecData.push(item)
                specData.push(item)
                this.setState({
                    specData,
                    newSpecData
                })
            } else {
                newSupData.push(item)
                supData.push(item)
                this.setState({
                    supData,
                    newSupData
                })
            }
        })
    }
    chooseType(choosetype) {
        let listModelOption;
        if (choosetype == "specialist") {
            listModelOption = {
                model: SHOW_ChooseListModel_MODEL,
                title: '选择专家类型',
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
                        title: '专家类型名称',
                        dataIndex: 'name',
                        render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 20)}</span></Tooltip>
                    },
                    {
                        title: '专家类型编号',
                        dataIndex: 'code',
                    }
                ]
            }
        } else {
            listModelOption = {
                model: SHOW_ChooseListModel_MODEL,
                title: '选择供应商类型',
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
                        title: '供应商类型名称',
                        dataIndex: 'name',
                        render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 20)}</span></Tooltip>
                    },
                    {
                        title: '供应商类型编号',
                        dataIndex: 'code',
                    }
                ]
            }
        }
        this.setState({
            listModelOption: listModelOption
        })
        this.setState({
            choosetype
        })
    }
    //移除已经添加的专家范围
    async deleteSpecialistType(record) {
        const { specData, newSpecData } = this.state
        let trainTypeId;
        try {
            trainTypeId = record.trainTypeId;
        } catch (error) {
            trainTypeId = null;
        }
        //只有trainTypeId存在时，为删除服务端数据，否则为删除本地数据
        if (trainTypeId) {
            //删除服务端数据方法
            await supplierTrain.deleteExpertType(record.realid)
            let idx = _.findIndex(specData, { id: record.id })
            specData.splice(idx, 1)
        } else {
            let ind = _.findIndex(specData, { id: record.id })
            let newind = _.findIndex(newSpecData, { id: record.id })
            newSpecData.splice(newind, 1)
            specData.splice(ind, 1)
        }
        this.setState({
            specData,
            newSpecData
        })
    }
    //移除已添加的供应商范围
    async deleteSupplierType(record) {
        const { supData, newSupData } = this.state;
        let trainTypeId;
        try {
            trainTypeId = record.trainTypeId;
        } catch (error) {
            trainTypeId = null;
        }
        //只有trainTypeId存在时，为删除服务端数据，否则为删除本地数据
        if (trainTypeId) {
            //删除服务端数据方法
            await supplierTrain.deleteSupplierType(record.realid)
            let idx = _.findIndex(supData, { id: record.id })
            supData.splice(idx, 1)
        } else {
            let ind = _.findIndex(supData, { id: record.id })
            let newind = _.findIndex(newSupData, { id: record.id })
            newSupData.slice(newind, 1)
            supData.splice(ind, 1)
        }
        this.setState({
            supData,
            newSupData
        })
    }
    render() {
        const { toggleStore } = this.props;
        const { specialistTypes, supplierTypes, choosetype, specData, supData, listModelOption } = this.state
        const disabledData = choosetype == "specialist" ? specData : supData;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const typelist = choosetype == "specialist" ? specialistTypes : supplierTypes;
        const columns_expert = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '专家类型',
                dataIndex: 'name',
            },
            {
                title: '专家类别编号',
                dataIndex: 'code',
            },
            {
                title: '操作',
                dataIndex: 'cz',
                render: (text, record, key) => {
                    return (<div> <Button type="danger" onClick={() => { this.deleteSpecialistType(record) }} size={'small'}>删除</Button></div>)
                }
            }
        ]
        const columns_suplier = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '供应商类型',
                dataIndex: 'name',
            },
            {
                title: '供应商类型编号',
                dataIndex: 'code',
            },
            {
                title: '操作',
                dataIndex: 'cz',
                render: (text, record, key) => {
                    return (<div> <Button type="danger" onClick={() => { this.deleteSupplierType(record) }} size={'small'}>删除</Button></div>)
                }
            },
        ]
        let options = {
            title: '选择专家类型',
            columns: [
                {
                    title: '序号',
                    dataIndex: 'key',
                    width: 60,
                    align: "center",
                    render: (text, index, key) => key + 1
                },
                {
                    title: '类型名称',
                    dataIndex: 'name',
                    render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 20)}</span></Tooltip>
                },
                {
                    title: '类型编号',
                    dataIndex: 'code',
                }
            ]
        }
        return (
            <div>
                <Modal
                    title="编辑培训类型"
                    width={960}
                    visible={toggleStore.toggles.get(SHOW_EditTrainType_MODEL)}
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
                                        <Form.Item {...formItemLayout} label={'培训类型名称'}>
                                            {getFieldDecorator(`trainName`, {
                                                initValue: "培训类型名称",
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '培训类型名称',
                                                    },
                                                ],
                                            })(<Input />)}
                                        </Form.Item>
                                    </Col>
                                </Col>
                            </Row>
                        </Card>
                        <Card bordered={false} title={<b>专家范围</b>} extra={
                            <Button type="primary" onClick={() => {
                                this.chooseType("specialist")
                                toggleStore.setToggle(SHOW_ChooseListModel_MODEL)
                            }}>
                                新增
                                    </Button>
                        } className="new_supplier_producelist">
                            <Row>
                                <Col span={24}>
                                    <Table rowKey={(text, key) => key} columns={columns_expert} dataSource={specData} />
                                </Col>
                            </Row>
                        </Card>
                        <Card bordered={false} title={<b>供应商范围</b>} extra={
                            <Button type="primary" onClick={() => {
                                this.chooseType("supplier")
                                toggleStore.setToggle(SHOW_ChooseListModel_MODEL)
                            }}>
                                新增
                                    </Button>
                        } className="new_supplier_producelist">
                            <Row>
                                <Col span={24}>
                                    <Table rowKey={(text, key) => key} columns={columns_suplier} dataSource={supData} />
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                    {/* </TabPane> */}
                    {/* </Tabs> */}
                </Modal>
                {
                    toggleStore.toggles.get(SHOW_ChooseListModel_MODEL) && <ChooseListModel list={typelist} comparedList={disabledData} options={listModelOption} chooseFinishFn={(val) => { this.chooseZzApplyFn(val) }} />
                }
            </div>
        );
    }
}

export default Form.create({ name: 'NewSupplier' })(EditTrainType);;