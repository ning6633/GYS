
import React, { Component, Fragment } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, DatePicker, Icon, Button, message, Tooltip, Checkbox, Select, Descriptions } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_AddAdmittance_MODEL, SHOW_ManualInput_MODEL, SHOW_ListSelection_MODEL } from "../../../../../../constants/toggleTypes"
import { supplierTrain } from '../../../../../../actions'
import _ from "lodash";
import ManualInput from '../../../TrainingNotice/components/ManualInput/index'
import ListSelection from '../../../TrainingNotice/components/ListSelection/index'
// 公用选择供应商组件

const { TabPane } = Tabs;
const { Option } = Select;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class AddAdmittance extends React.Component {
    state = {
        persons: [],
        important: [],
        attribute:[]
    }

    handleCancel = () => {
        //点击取消，隐藏model框
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_AddAdmittance_MODEL)
    }
    handleSubmit = () => {
        //点击确定出发的事件
        let { toggleStore ,loaddata} = this.props
        let { persons } = this.state
        if(persons.length > 0 ){
            this.props.form.validateFields(async (err, values) => {
                if (!err) {
                    persons.forEach((item)=>{
                        item.name = item.username
                        item.sex =item.gender
                        item.dept =item.userorg
                        item.post =item.title
                        item.remarks =item.otherinfo
                    }) 
                    values.persons = persons
                    console.log(values)
                    let res = await supplierTrain.trainAccessApply(values)
                    if(res.code == 200 ){
                        loaddata()
                    }
                }
            })
            toggleStore.setToggle(SHOW_AddAdmittance_MODEL)
        }else {
            message.error("参训人员不可为空！")
        }
    }
    manualInput = (data) => {
        //手动添加报名人员信息，回填至Table
        let { persons } = this.state
        let _arr = persons
        _arr.push(data)
        _arr.forEach((item, index) => {
            item.index = index
        })
        this.setState({
            persons: _arr
        })
    }
    getChooseList = (data) => {
        //从列表选择的人员
        let { persons } = this.state
        let _arr = persons
        data.forEach((item) => {
            let _index = _.findIndex(_arr, { id: item.id })
            if (_index == -1) {
                _arr.push(item)
            }
        })
        _arr.forEach((item, index) => {
            item.index = index
        })
        this.setState({
            persons: _arr
        })
    }
    seleteListOne = (record) => {
        //删除添加的报名人员中的一条
        console.log(record)
        let { persons } = this.state
        let _arr = persons
        _arr.splice(record.index, 1)
        _arr.forEach((item, index) => {
            item.index = index
        })
        this.setState({
            persons: _arr
        })
    }

    async important() {
        // 获取拟准入等级的数据字典
        let res = await supplierTrain.getDic("IMPORTANT")
        if (res.code == 200) {
            this.setState({
                important: res.data
            })
        } else {
            return
        }
    }
    
    async attribute(){
        // 获取产品分类的数据字典
        let res = await supplierTrain.getDic("ATTRIBUTE")
        if (res.code == 200) {
            this.setState({
                attribute: res.data
            })
        } else {
            return
        }
    }
    componentDidMount = () => {
        this.important()
        this.attribute()
    }
    render = () => {
        let { toggleStore } = this.props
        let { persons, important ,attribute} = this.state
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span:8},
            wrapperCol: { span: 16},
        };
        const PersonsAll = ()=>{
            return <span><span style = {{color:"red"}}>*</span>参训人员</span>
        }
        const ExtraButton = () => {
            return (
                <Fragment>
                    <Button type="primary" style={{ marginRight: 20 }} onClick={() => {
                        let { toggleStore } = this.props
                        toggleStore.setToggle(SHOW_ListSelection_MODEL)
                    }}>从列表中选择</Button>
                    <Button type="primary" onClick={() => {
                        let { toggleStore } = this.props
                        toggleStore.setToggle(SHOW_ManualInput_MODEL)
                    }}>手动添加</Button>
                </Fragment>
            )
        }
        const columnsList = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                render: (text, index, key) => key + 1
            },

            {
                title: '姓名',
                dataIndex: 'username',
                width: 100,
                align: "center",
            },
            {
                title: '性别',
                dataIndex: 'gender',
                width: 100,
                align: "center",
            },
            {
                title: '所属部门',
                dataIndex: 'userorg',
                width: 200,
                align: "center",
            },
            {
                title: '现任职务/职称',
                dataIndex: 'title',
                width: 100,
                align: "center",
            },
            {
                title: '联系方式',
                dataIndex: 'tel',
                width: 100,
                align: "center",
            },
            {
                title: '备注',
                dataIndex: 'otherinfo',
                width: 100,
                align: "center",
            },
            {
                title: '操作',
                dataIndex: '操作',
                width: 100,
                align: "center",
                render: (text, record) => {
                    return (
                        <Button type="danger" size="small" onClick={() => { this.seleteListOne(record) }}>删除</Button>
                    )
                }
            },
        ]
        return (
            <Modal
                title={<div style={{ width: "100%", textAlign: "center", fontWeight: 900 }}>准入培训申请</div>}
                visible={toggleStore.toggles.get(SHOW_AddAdmittance_MODEL)}
                onOk={(e) => { this.handleSubmit(e) }}
                onCancel={this.handleCancel}
                width={950}
            >

                <Form >
                    <Row gutter={24}>
                        <Col span={18}>
                            <Form.Item {...formItemLayout} label={'拟准入等级'}>
                                {getFieldDecorator(`admittanceGrade`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: '拟准入等级',
                                        },
                                    ],
                                })(<Select placeholder="请选择准入等级">
                                    {important.map((item) => {
                                        return <Option key={item.id} value={item.name}>{item.name}</Option>
                                    })}
                                </Select>)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={18}>
                            <Form.Item {...formItemLayout} label={'产品类别'}>
                                {getFieldDecorator(`productCategory`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: '产品类别',
                                        },
                                    ],
                                })(<Select placeholder="请选择产品类别">
                                    {attribute.map((item) => {
                                        return <Option key={item.id} value={item.name}>{item.name}</Option>
                                    })}
                                </Select>)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={18}>
                            <Form.Item {...formItemLayout} label={'产品范围'}>
                                {getFieldDecorator(`productScope`, {
                                    rules: [
                                        {
                                            required: true,
                                            message: '产品范围',
                                        },
                                    ],
                                })(<Input placeholder="请填写产品范围"/>)}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Card title={<PersonsAll />} extra={<ExtraButton />} bordered={false}>
                    <Table
                        size='middle'
                        // loading={loading}
                        bordered={false}
                        rowKey={(text) => text.index}
                        // rowSelection={userTypeVerty == 'approve' ? rowSelection : null} 
                        scroll={{ x: 845 }}
                        columns={columnsList}
                        pagination={false}
                        dataSource={persons}
                    >

                    </Table>
                </Card>
                {
                    toggleStore.toggles.get(SHOW_ManualInput_MODEL) && <ManualInput manualInput={this.manualInput} />
                }
                {
                    toggleStore.toggles.get(SHOW_ListSelection_MODEL) && <ListSelection getChooseList={this.getChooseList} />
                }
            </Modal>
        )
    }


}

export default Form.create({ name: "addadmittance" })(AddAdmittance);
