import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, Select, Icon, Button, message, Tooltip, Upload,Radio } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_TrainApplyDetail_MODEL } from "../../../../../../constants/toggleTypes"
import { supplierTrain, specialAction, supplierAction } from "../../../../../../actions"
// 公用选择供应商组件
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
@inject('toggleStore')
@observer
class ApplyTrain extends React.Component {
    state = {
        peopleData: [],
        trainApplyDetail: {},
        evaluated: false,
        value: 2,
        score:"",
        certificateData:[]
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_TrainApplyDetail_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore, refreshData } = this.props;
        const { } = this.state;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                //此处应调用流程的页面
            }
        })
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_TrainApplyDetail_MODEL)
    };
    covertScore(str){
        let score = 0
        switch (str) {
            case '0':
            score = 0
                break;
                case '50':
                score = 1 
                break;
                case '100':
                score = 2
                break;
        
            default:
                break;
        }
       return score
    }
    async componentDidMount() {
        const { setFieldsValue } = this.props.form;
        const { editrecord } = this.props;
        let trainApplyDetail = await supplierTrain.checkApplyDetail(editrecord.id);
        setFieldsValue({ ...trainApplyDetail })
      
        this.setState({
            trainApplyDetail,
            value:trainApplyDetail.score==''?2:this.covertScore(trainApplyDetail.score),
            peopleData: trainApplyDetail.listTrainApplyUserVO,
            certificateData: trainApplyDetail.listTrainCertificate
        })
      
    }
    onChange = e => {
        this.setState({
            value: e.target.value,
        });
    };
    //为培训打分
    async evaluateTrain(id, value) {
       let result =  await supplierTrain.evaluateTrain(id, value)
       if(result.code==200){
         message.success('满意度打分成功！')
       }
        this.setState({
            evaluated: true,
            score:value,
            value
        })
    }
    render() {
        const { toggleStore,userTypeVerty  } = this.props;
        const { peopleData, trainApplyDetail, evaluated,certificateData } = this.state
     
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
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
                title: '是否通过',
                dataIndex: 'pass',
                render: (text, record, key) =>record.status=='1'?'通过':'未通过'
            },
        ]
        const columns_certificate = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '证书名称',
                dataIndex: 'name',
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
            },
            {
                title: '证书类型',
                dataIndex: 'type',
            },
            {
                title: '认证机构',
                dataIndex: 'authoritied_orgname',
            },
            {
                title: '证书有效期',
                dataIndex: 'expiry_months',
            },
        ]
        console.log(this.state.value)
        return (
            <div>
                <Modal
                    title={trainApplyDetail.score==''?`实施满意度打分`:'申请详情'}
                    width={960}
                    visible={toggleStore.toggles.get(SHOW_TrainApplyDetail_MODEL)}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                    footer={null}
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
                                                        required: false,
                                                        message: '供应商名称',
                                                    },
                                                ],
                                            })(<Input disabled={true} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'供应商社会信用代码'}>
                                            {getFieldDecorator(`gyscode`, {
                                                initValue: "供应商编号",
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '供应商编号',
                                                    },
                                                ],
                                            })(<Input disabled={true} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'培训计划'}>
                                            {getFieldDecorator(`trainplanname`, {
                                                initValue: "培训计划",
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '培训计划',
                                                    },
                                                ],
                                            })(<Input disabled={true} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'培训类型'}>
                                            {getFieldDecorator(`traintypename`, {
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
                                            {getFieldDecorator(`trainshift`, {
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
                                            {getFieldDecorator(`trainplace`, {
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
                                    <Col span={trainApplyDetail.score == '' && trainApplyDetail.status == '3' && userTypeVerty == 'sup' && !evaluated ? 10 : 12} >
                                        <Form.Item {...formItemLayout} label={'满意度'}>
                                            {
                                                trainApplyDetail.score == ''&&  trainApplyDetail.status == '3' && userTypeVerty == 'sup' && !evaluated ?
                                                    <Radio.Group onChange={this.onChange} value={this.state.value}>
                                                        <Radio value={2}>满意</Radio>
                                                        <Radio value={1}>一般</Radio>
                                                        <Radio value={0}>不满意</Radio>
                                                    </Radio.Group> :
                                                    (<Input disabled value={this.state.value == 0?"不满意":(this.state.value == 1?"一般":"满意")} />)
                                            }
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        {
                                            trainApplyDetail.score == '' &&trainApplyDetail.status == '3'  && userTypeVerty == 'sup' && !evaluated ? <Button type="primary" onClick={() => {
                                                this.evaluateTrain(trainApplyDetail.id, this.state.value)
                                            }}>
                                                确定
                                        </Button> : null
                                        }
                                    </Col>
                                </Col>
                            </Row>
                        </Card>
                        <Card bordered={false} title={<b>证书</b>} className="new_supplier_producelist">
                            <Row>
                                <Col span={24}>
                                    <Table rowKey={(text, key) => key} columns={columns_certificate} dataSource={certificateData} />
                                </Col>
                            </Row>
                        </Card>
                        <Card bordered={false} title={<b>参加人员</b>} className="new_supplier_producelist">
                            <Row>
                                <Col span={24}>
                                    <Table rowKey={(text, key) => key} columns={columns_people} dataSource={peopleData} />
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'NewSupplier' })(ApplyTrain);;