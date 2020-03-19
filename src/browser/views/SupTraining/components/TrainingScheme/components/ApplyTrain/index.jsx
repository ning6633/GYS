import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, Select, Icon, Button, message, Tooltip, Upload } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_ApplyTrain_MODEL, SHOW_AddStaff_MODEL,SHOW_Process_MODEL } from "../../../../../../constants/toggleTypes"
import { supplierTrain,supplierEvalution } from "../../../../../../actions"
import ShowProcessModel from "../../../../../../components/ShowProcessModel";

// 公用选择供应商组件
import AddStaffModel from "./components/AddStaffModel"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
@inject('toggleStore')
@observer
class ApplyTrain extends React.Component {
    state = {
        peopleData: [],
        gysinfo:{}
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ApplyTrain_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore, editrecord,refreshData } = this.props;
        const { gysinfo,peopleData } = this.state;
        const trainplanid = editrecord.id;
        let {userId} = supplierTrain.pageInfo;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let trainApplyParams = {
                    "createuserid": userId,
                    "trainid": trainplanid,
                    "gysid" :gysinfo.gysId
                }
                //供应商新建培训申请
                let trainApply = await supplierTrain.createTrainApply(trainApplyParams);
                let trainApplyId = trainApply.id;
                //新建参加培训人员
                if(trainApplyId){
                    let ret = await supplierTrain.createTrainApplyUser(trainApplyId,peopleData);
                }
                //此处调用流程申请页面
                this.chooseTrainApprover(editrecord,trainApplyId,userId);
                // toggleStore.setToggle(SHOW_ApplyTrain_MODEL)
                refreshData();
            }
        })
    };
    //流程
   async chooseTrainApprover(record,trainApplyId,userId) {
        const { toggleStore } = this.props;
        let result = await supplierTrain.directHandleTask(trainApplyId,'gystraining')
        console.log(result)
        if(result.code==200){
            toggleStore.setToggle(SHOW_ApplyTrain_MODEL)
        }
     //   let openurl = supplierTrain.processUrl + `&businessInstId=${trainApplyId}&userId=${userId}`
        // toggleStore.setModelOptions({
        //     detail:record,
        //     modelOptions:{
        //         title:'申请培训',
        //         url:openurl
        //     },
        //     model:SHOW_Process_MODEL
        //   })
        //     toggleStore.setToggle(SHOW_Process_MODEL)
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ApplyTrain_MODEL)
    };
    async componentDidMount() {
        const { setFieldsValue } = this.props.form;
        const { editrecord } = this.props;
        setFieldsValue({ ...editrecord })
        let gysinfo = await supplierEvalution.getGYSInfoById()
        console.log(gysinfo)
        if(gysinfo.data==null){
            message.error('该用户不属于供应商')
            return
          
        }else{
            this.setState({gysinfo:gysinfo.data})
            setFieldsValue({gysname:gysinfo.data.name,gyscode:gysinfo.data.code})//供应商编号？？？
        }
  
     
    }
    //
    chooseZzApplyFn(data) {
        const { peopleData } = this.state
        peopleData.push(data);
        this.setState({
            peopleData
        })
    }
    //移除已添加的供应商
    async deleteStaff(record) {
        const { peopleData } = this.state;
        let ind = _.findIndex(peopleData, { tel: record.tel })
        peopleData.splice(ind, 1)
        this.setState({
            peopleData,
        })
    }
    render() {
        const { toggleStore } = this.props;
        const { peopleData } = this.state
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 },
        };
        const columns_people = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '姓名',
                dataIndex: 'username',
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
            },
            {
                title: '联系方式',
                dataIndex: 'tel',
            },
            {
                title: '证件类型',
                dataIndex: 'identitytype',
            },
            {
                title: '证件号码',
                dataIndex: 'identitycode',
            },
            {
                title: '操作',
                dataIndex: 'cz',
                render: (text, record) => <Button type="danger" size={'small'} onClick={(() => { this.deleteStaff(record) })} >删除</Button>
            }
        ]
        return (
            <div>
                <Modal
                    title="申请培训"
                    width={960}
                    visible={toggleStore.toggles.get(SHOW_ApplyTrain_MODEL)}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                >
                    <Form className="ant-advanced-search-form" onSubmit={(e) => { }}>
                        <Card bordered={false} className="new_supplier_form">
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'供应商名称'}>
                                            {getFieldDecorator(`gysname`, {
                                                initValue: "供应商名称",
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '供应商名称',
                                                    },
                                                ],
                                            })(<Input disabled={true} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'供应商社会信用代码'}>
                                            {getFieldDecorator(`gyscode`, {
                                                initValue: "供应商社会信用代码",
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '供应商社会信用代码',
                                                    },
                                                ],
                                            })(<Input disabled={true} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'培训计划'}>
                                            {getFieldDecorator(`trainPlanName`, {
                                                initValue: "培训计划",
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '培训计划',
                                                    },
                                                ],
                                            })(<Input disabled={true} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'培训类型'}>
                                            {getFieldDecorator(`trainTypeName`, {
                                                initValue: '培训类型',
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '培训类型',
                                                    },
                                                ],
                                            })(<Input disabled={true} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'培训班次'}>
                                            {getFieldDecorator(`trainShift`, {
                                                initValue: '培训班次',
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '培训班次',
                                                    },
                                                ],
                                            })(<Input disabled={true} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'培训地点'}>
                                            {getFieldDecorator(`trainPlace`, {
                                                initValue: '培训地点',
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '培训地点',
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
                                                        required: false,
                                                        message: '培训主题',
                                                    },
                                                ],
                                            })(<Input disabled={true} />)}
                                        </Form.Item>
                                    </Col>
                                </Col>
                            </Row>
                        </Card>
                        <Card bordered={false} title={<b>参加人员</b>} extra={
                            <Button type="primary" onClick={() => {
                                toggleStore.setToggle(SHOW_AddStaff_MODEL)
                            }}>
                                新增
                            </Button>
                        } className="new_supplier_producelist">
                            <Row>
                                <Col span={24}>
                                    <Table rowKey={(text, key) => key} columns={columns_people} dataSource={peopleData} />
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                </Modal>
                {
                    toggleStore.toggles.get(SHOW_AddStaff_MODEL) && <AddStaffModel chooseFinishFn={(val) => { this.chooseZzApplyFn(val) }} />
                }
                { toggleStore.toggles.get(SHOW_Process_MODEL) && <ShowProcessModel />}
            </div>
        );
    }
}

export default Form.create({ name: 'NewSupplier' })(ApplyTrain);;