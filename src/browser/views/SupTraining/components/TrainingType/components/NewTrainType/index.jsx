import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, Select, Icon, Button, message, Tooltip } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_NewTrainType_MODEL, SHOW_ChooseListModel_MODEL } from "../../../../../../constants/toggleTypes"
import { supplierTrain } from "../../../../../../actions"
// 公用选择供应商组件
import ChooseListModel from "../../../../../../components/ChooseListModel"
const { TabPane } = Tabs;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class NewTrainType extends React.Component {
    state = {
        specialistTypes: {},
        supplierTypes: {},
        choosetype: "",//新增专家范围还是供应商范围
        supData:[],//选择的供应商类别
        specData:[],//选择的专家类别
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NewTrainType_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore ,refreshData} = this.props;
        const  {supData,specData} = this.state 
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log(values);
                //先调用创建培训类型接口,得到培训类型id
                let TrainTypeVO = {
                    trainName : values.trainName,
                    status :"yes",
                    createUser :supplierTrain.pageInfo.username,
                    updateUser :supplierTrain.pageInfo.username
                }
                let trainTypeId  = await supplierTrain.createTrainType(TrainTypeVO)
                //
                if(trainTypeId){
                    let TrainExpertTypeVO =[];
                    let TrainGysTypeVO  =[];
                    
                    specData.forEach((item)=>{
                        let data = {
                            trainTypeId:trainTypeId,
                            expertTypeName:item.name,
                            expertTypeCode:item.code,
                        }
                        TrainExpertTypeVO.push(data)
                    })
                    supData.forEach((item)=>{
                        let data = {
                            trainTypeId:trainTypeId,
                            gysTypeName :item.name,
                            gysTypeCode :item.code,
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
                toggleStore.setToggle(SHOW_NewTrainType_MODEL)
            }
        });
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NewTrainType_MODEL)
    };
    async componentDidMount() {
        //获取专家类型列表
        let specialistTypesref = await supplierTrain.getSpecialistTypes("SPECIALISTFIELD")
        let specialistTypes = {
            list:specialistTypesref,
            total:specialistTypesref.length
        }
        this.setState({
            specialistTypes: specialistTypes
        })
        //获取供应商范围列表
        let supplierTypesref = await supplierTrain.getSupplierTypes("IMPORTANT")
        let supplierTypes = {
            list:supplierTypesref,
            total:supplierTypesref.length
        }
        this.setState({
            supplierTypes: supplierTypes
        })
    }
    //
    chooseZzApplyFn(data) {
        const { supData,specData,choosetype } = this.state
        console.log(data)
        data.forEach(item=>{
            if(choosetype=='specialist'){
                specData.push(item)
                   this.setState({
                    specData
                       })
               }else{
                   supData.push(item)
                   this.setState({
                       supData
                       })
               }
        })
        
    }
    chooseType(choosetype) {
        let listModelOption;
        if(choosetype == "specialist"){
            listModelOption = {
                model:SHOW_ChooseListModel_MODEL,
                title: '选择专家类型',
                type:"checkbox",
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
        }else{
            listModelOption = {
                model:SHOW_ChooseListModel_MODEL,
                title: '选择供应商类型',
                type:"checkbox",
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
            listModelOption:listModelOption
        })
        this.setState({
            choosetype
        })
    }
    //移除已经添加的专家范围
    deleteSpecialistType(value){
        const { specData } = this.state
        let ind = _.findIndex(specData, { id: value.id })
        specData.splice(ind,1)
        this.setState({
            specData
        })
    }
    //移除已添加的供应商范围
    deleteSupplierType(value){
        const { supData } = this.state
        let ind = _.findIndex(supData, { id: value.id })
        supData.splice(ind,1)
        this.setState({
            supData
        })
    }
    render() {
        const { toggleStore } = this.props;
        const { specialistTypes, supplierTypes, choosetype,specData,supData,listModelOption } = this.state
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const typelist = choosetype == "specialist" ? specialistTypes : supplierTypes;
        const disabledData = choosetype == "specialist" ? specData : supData;
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
        
        return (
            <div>
                <Modal
                    title="新建培训类型"
                    width={960}
                    visible={toggleStore.toggles.get(SHOW_NewTrainType_MODEL)}
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
                    toggleStore.toggles.get(SHOW_ChooseListModel_MODEL) && <ChooseListModel list={typelist} options={listModelOption} comparedList={disabledData} chooseFinishFn={(val) => { this.chooseZzApplyFn(val) }} />
                }
            </div>
        );
    }
}

export default Form.create({ name: 'NewSupplier' })(NewTrainType);;