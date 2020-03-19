import React, { Component, Fragment } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, DatePicker, Icon, Button, message, Tooltip, Checkbox, Radio } from 'antd';
import { observer, inject, } from 'mobx-react';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment'
import { SHOW_addTrain_MODEL, SHOW_addExpert_MODEL, SHOW_uploadCourseware_MODEL } from "../../../../../../constants/toggleTypes"
import { supplierTrain } from '../../../../../../actions'
import _ from "lodash";
import './index.less'
import ChooseExpert from '../chooseexpert'
import UploadCourseware from '../uploadCourseware'
// 公用选择供应商组件
const { TabPane } = Tabs;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore', 'trainStore')
@observer
class AddTrainingCourse extends React.Component {
    state = {
        parentId: '',
        expertList: [],
        coursewaretList: [],
        coursewaretRecordsTotal: 0,
        expertSelectedRowKeys: [], // 专家选中项
        expertSelectedRows: [], // 专家选中项
        coursewareSelectedRowKeys: [], // 课件选中项
        coursewareSelectedRows: [], // 可见选中项
        details: false,
        pageNum: 1,
        rowNum: 5,
        isvalid:1, //课程是否有一小
    }
    handleSubmit = (e) => {
        let { parentId, expertList, coursewaretList } = this.state
        let { loadInfo, trainStore, toggleStore, flag, info } = this.props
        let { userId } = supplierTrain.pageInfo
        let _now = moment().format("YYYY-MM-DD HH:mm:ss")
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                if (flag == "build") {
                    values.coursetypeId = parentId
                    if(expertList.length == 0) {
                        message.warning("请为课程指派专家")
                        return
                    }
                    // 保存课程名称
                    let res = await supplierTrain.insertcourse(values)
                    let tmp = res.data
                    if (res.code == 200) {
                      
                            let _arr = []
                            expertList.forEach((item) => {
                                item.createuser = userId
                                item.updateuser = userId
                                _arr.push(item.specialistid)
                            })
                            let body = {}
                            body.courseid = tmp.id
                            body.zzpjSpecialist = _arr
                            let res = await supplierTrain.insertspecialist(body)
                            if (res.code == 200) {
                                // 专家添加成功
                            } else {
                                message.error("添加专家失败")
                            }
                        if (coursewaretList.length > 0) {
                            coursewaretList.forEach((item) => {
                                item.createuser = userId
                                item.updateuser = userId
                                item['courseid'] = tmp.id
                                delete item.id
                            })
                            let body = {}
                            body.courseid = tmp.id
                            body.Coursewarelist = coursewaretList
                            let res = await supplierTrain.insertcourseware(body)
                            if (res.code == 200) {
                                //添加课件成功
                            } else {
                                message.error("添加课件失败")
                            }
                        }
                        toggleStore.setToggle(SHOW_addTrain_MODEL)
                        loadInfo(trainStore.oneInfo)
                    }
                } else if (flag == "upload") {
                    //修改
                    let { name, describe ,isvalid} = values
                    let _tmp = JSON.parse(JSON.stringify(info))
                    _tmp.name = name
                    _tmp.describe = describe
                    _tmp.updatedate = _now
                    _tmp.isvalid =isvalid
                    if(expertList.length == 0) {
                        message.warning("请为课程指派专家")
                        return
                    }
                    let res = await supplierTrain.updatecourse(_tmp)
                    // 课程详情修改
                    if (res.code == 200) {

                      
                      
                        let deletespecialistbycourseid = await supplierTrain.deletespecialistbycourseid(info.id)
                        // 专家清空

                            let _arr = []
                            expertList.forEach((item)=>{
                                _arr.push(item.specialistid)
                            })

                            let body = {}
                            body.courseid = info.id
                            body.zzpjSpecialist = _arr
                            let res = await supplierTrain.insertspecialist(body)
                            if (res.code == 200) {
                                // 专家添加成功
                            } else {
                                message.error("修改专家失败")
                            }
                        let deletewarebycourseid = await supplierTrain.deletewarebycourseid(info.id)
                        // 课件清空
                        if (coursewaretList.length > 0) {
                            coursewaretList.forEach((item) => {
                                item.createuser = userId
                                item.updateuser = userId
                                item['courseid'] = info.id
                                delete item.id
                            })
                            let body = {}
                            body.courseid = info.id
                            body.Coursewarelist = coursewaretList
                            let res = await supplierTrain.insertcourseware(body)
                            if (res.code == 200) {
                                //添加课件成功
                            } else {
                                message.error("修改课件失败")
                            }
                        }
                        toggleStore.setToggle(SHOW_addTrain_MODEL)
                        loadInfo(trainStore.oneInfo)
                    }
                }
            }
        })
    }
    handleCancel = () => {
        let { loadInfo, toggleStore, trainStore } = this.props
        toggleStore.setToggle(SHOW_addTrain_MODEL)
        loadInfo(trainStore.oneInfo)
    }
    chooseExpert = (data) => {
        // 选择专家
        let { expertList } = this.state
        let _arr = expertList
        _arr.forEach((item)=>{
            delete item.id
        })
        data.forEach((item)=>{
            item.specialistid = item.id
            delete item.id
        })
        data.forEach((item) => {

            if (_.findIndex(_arr, { specialistid: item.specialistid }) === -1) {
                _arr.push(item)
            } else {
                return
            }
        })
        if (data.length > 0) {
            this.setState({
                expertList: _arr
            })
        }
    }
    async deleteExpertList() {
        //删除专家讲师
        let { expertList, expertSelectedRows } = this.state
        expertSelectedRows.forEach((item) => {
            expertList.splice(_.findIndex(expertList, { id: item.id }), 1)
        })
        let res = await supplierTrain.deletespecialist(expertSelectedRows[0])
        this.setState({
            expertList,
            expertSelectedRowKeys: [],
            expertSelectedRows: []
        })
    }
    onExpertSelect = (selectedRowKeys, selectedRows) => {
        //专家/讲师 新增删除
        // console.log(selectedRowKeys, selectedRows)
        this.setState({
            expertSelectedRowKeys: selectedRowKeys,
            expertSelectedRows: selectedRows
        })

    }



    onCoursewareSelect = (selectedRowKeys, selectedRows) => {
        this.setState({
            coursewareSelectedRowKeys: selectedRowKeys,
            coursewareSelectedRows: selectedRows
        })
    }
    async deleteCourseware() {
        // 删除课件
        let { coursewaretList, coursewareSelectedRowKeys, coursewareSelectedRows } = this.state
        coursewareSelectedRows.forEach((item) => {
            // console.log(_.findIndex(coursewaretList, { id: item.id }))
            coursewaretList.splice(_.findIndex(coursewaretList, { id: item.id }), 1)
        })
        let res = await supplierTrain.deleteware(coursewareSelectedRowKeys)
        this.setState({
            coursewaretList,
            coursewareSelectedRowKeys: [],
            coursewareSelectedRows: []
        })
    }
    uploadCourseware = (data) => {
        // 上传课件
        let _num = Math.random() * 9999999999 + 100000
        let { coursewaretList } = this.state
        let _arr = coursewaretList
        data.id = _num
        if (_arr.length > 20) {
            message.warning("最多可以添加20条课件")
        } else {
            _arr.push(data)
        }
        this.setState({
            coursewaretList: _arr
        })
        // data.forEach((item)=>{
        //     item.courseid = courseid,
        //     item.createuser = createuser
        // })
    }
    downLoad = (record) => {
        window.open(`${supplierTrain.FileBaseURL}${record.fileid}`)
    }
    async getspecialist({ id = "", pageNum = 1, rowNum = 5 }) {
        // 根据课程查询专家
        let res = await supplierTrain.getspecialistByCourse({ id, pageNum, rowNum })
        console.log(res)
        if (res.code == 200) {
            this.setState({
                expertList: res.data.list
            })
        }
    }
    async getcourseware({ id = "", pageNum = 1, rowNum = 20 }) {
        // 根据课程查询课件
        let res = await supplierTrain.getcourseware({ id, pageNum, rowNum })
        if (res.code == 200) {
            this.setState({
                coursewaretList: res.data.list,
                coursewaretRecordsTotal: res.data.recordsTotal
            })
        }
    }
    pageChange = (pageNum, rowNum) => {
        //课件换页
        let { info } = this.props
        this.setState({
            pageNum
        })
        this.getcourseware({ id: info.id, pageNum })
    }
    componentDidMount = () => {
        let { trainStore, flag, updata, info } = this.props
        let { setFieldsValue } = this.props.form
        if (flag == "build") {
            this.setState({
                parentId: trainStore.oneInfo.selectedNodes[0].props.dataRef.id,
            })
            setFieldsValue({
                isvalid:1
            })
        } else if (flag == "upload") {
            this.setState({
                isvalid:Number(info.isvalid)
            })
            setFieldsValue({
                name: info.name,
                describe: info.descri,
                isvalid:Number(info.isvalid)
            })
            this.getspecialist({ id: info.id })
            this.getcourseware({ id: info.id })
        } else if (flag == "details") {
            this.setState({
                details: true,
            })
            setFieldsValue({
                name: info.name,
                describe: info.descri,
                isvalid:Number(info.isvalid)
            })
            this.getspecialist({ id: info.id })
            this.getcourseware({ id: info.id })
        }
    }
    render = () => {
        const { getFieldDecorator } = this.props.form;
        let { toggleStore, flag } = this.props
        let { expertList, coursewaretList, coursewaretRecordsTotal, expertSelectedRowKeys, coursewareSelectedRowKeys, details, pageNum ,isvalid} = this.state
        let handle = expertSelectedRowKeys.length > 0
        let handleTwo = coursewareSelectedRowKeys.length > 0
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 21 },
        };
        const expertSelect = (details || isvalid == 0) ? null : {
            columnWidth: 30,
            expertSelectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.onExpertSelect(selectedRowKeys, selectedRows)
            },

        };
        const coursewareSelect = (details || isvalid == 0) ? null : {
            columnWidth: 30,
            expertSelectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.onCoursewareSelect(selectedRowKeys, selectedRows)
            },

        };
        const expertColumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",

                render: (text, index, key) => key + 1
            },
            {
                title: '专家姓名',
                dataIndex: 'name',
                width: 200,
                align: "center",
            },
            {
                title: '专家领域',
                dataIndex: 'field',
                width: 200,
                align: "center",
            },
            {
                title: '所在单位',
                dataIndex: 'source',
                width: 200,
                align: "center",
            },
            {
                title: '联系方式',
                dataIndex: 'tel',
                width: 200,
                align: "center",
            },
        ]
        const coursewareColumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",

                render: (text, index, key) => key + 1
            },
            {
                title: '名称',
                dataIndex: 'name',
                width: 200,
                align: "center",
            },
            {
                title: '内容简介',
                dataIndex: 'describe',
                width: 200,
                align: "center",
            },
            {
                title: '更新时间',
                dataIndex: 'updatedate',
                width: 200,
                align: "center",
            },
            {
                title: '附件',
                dataIndex: 'fileid',
                width: 200,
                align: "center",
                render: (text, redord) => <Tooltip >{text.length == 0 ? <span>无</span> : <span onClick={(e) => { this.downLoad(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>附件</span>}</Tooltip>
            },
        ]
        return (
            <Modal
                title={flag == "build" ? <b>新建课程</b> : <b>课程修改</b>}
                visible={toggleStore.toggles.get(SHOW_addTrain_MODEL)}
                onOk={(e) => { this.handleSubmit(e) }}
                onCancel={this.handleCancel}
                width={900}
            >
                <Form className="ant-advanced-search-form">
                    <Row className="trainCurr_rowe">
                        <Form.Item {...formItemLayout} label={'课程名称'}>
                            {getFieldDecorator(`name`, {
                                rules: [
                                    {
                                        required: true,
                                        message: '课程名称不能为空',
                                    },
                                ],
                            })(<Input disabled={(details || isvalid == 0)} />)}
                        </Form.Item>
                    </Row>
                    <Row className="trainCurr_rowe">
                        <Form.Item {...formItemLayout} label={'内容描述'}>
                            {getFieldDecorator(`describe`, {
                                rules: [
                                    {
                                        required: false,
                                        message: '内容描述不能为空',
                                    },
                                ],
                            })(<Input.TextArea disabled={(details || isvalid == 0)} autosize={{ minRows: 5, maxRows: 12 }} />)}
                        </Form.Item>
                    </Row>
                    <Row className="trainCurr_rowe">
                        <Form.Item {...formItemLayout} label={'是否有效'}>
                            {getFieldDecorator(`isvalid`, {
                                rules: [
                                    {
                                        required: false,
                                        message: '内容描述不能为空',
                                    },
                                ],
                            })(<Radio.Group  disabled={(details || isvalid == 0)}>
                                <Radio value={1}>有效</Radio>
                                <Radio value={0}>无效</Radio>
                            </Radio.Group>)}
                        </Form.Item>
                    </Row>
                    <Row className="trainCurr_rowe">
                        <Form.Item {...formItemLayout} label={'专家/讲师'}>
                            <Table
                                size='middle'
                                // loading={loading} 
                                title={() => {
                                    return <Fragment>
                                        {(details || isvalid == 0) ? null : <div>
                                            <Tooltip>
                                                <Button type="primary" icon="plus" size="small" style={{ marginRight: 20 }} onClick={() => {
                                                    let { toggleStore } = this.props
                                                    toggleStore.setToggle(SHOW_addExpert_MODEL)
                                                }}>新增</Button>
                                            </Tooltip>
                                            <Button type="danger" size="small" disabled={!handle} onClick={() => { this.deleteExpertList() }}>删除</Button></div>}
                                    </Fragment>
                                }}
                                rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''}
                                bordered={false}
                                rowKey={(text) => text.specialistid}
                                rowSelection={expertSelect}
                                scroll={{ x: 500 }}
                                columns={expertColumns}
                                // pagination={{
                                //     showTotal: () => `共${trainStore.allInfo.recordsTotal}条`,
                                //     onChange: (page, num) => { this.pageChange(page, num) },
                                //     current: pageNum,
                                //     showQuickJumper: true,
                                //     total: trainStore.allInfo.recordsTotal,
                                //     pageSize: 10
                                // }}
                                pagination={false}
                                dataSource={expertList}
                            >

                            </Table>
                        </Form.Item>
                    </Row>
                    <Scrollbars
                        autoHeight
                        autoHide
                        autoHideTimeout={1000}
                        autoHideDuration={200}
                        style={{ width: '100%' }}
                        autoHeightMin={100}
                        autoHeightMax={300}
                    >
                        <Form.Item {...formItemLayout} label={'课件'}>
                            <Table
                                size='middle'
                                // loading={loading}
                                title={() => {
                                    return <Fragment>
                                        {(details || isvalid == 0) ? null : <div>
                                            <Button type="primary" icon="plus" size="small" style={{ marginRight: 20 }} onClick={() => {
                                                let { toggleStore } = this.props
                                                toggleStore.setToggle(SHOW_uploadCourseware_MODEL)
                                            }}>上传课件</Button>
                                            <Button type="danger" size="small" disabled={!handleTwo} onClick={() => { this.deleteCourseware() }}>删除</Button></div>}
                                    </Fragment>
                                }}
                                rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''}
                                bordered={false}
                                rowKey={(text) => text.id}
                                rowSelection={coursewareSelect}
                                scroll={{ x: 500 }}
                                columns={coursewareColumns}
                                // pagination={{
                                //     showTotal: () => `共${coursewaretRecordsTotal}条`,
                                //     onChange: (page, num) => { this.pageChange(page, num) },
                                //     current: pageNum,
                                //     showQuickJumper: true,
                                //     total:coursewaretRecordsTotal,
                                //     pageSize: 5
                                // }}
                                pagination={false}
                                dataSource={coursewaretList}
                            >

                            </Table>
                        </Form.Item>
                    </Scrollbars>
                </Form>
                {toggleStore.toggles.get(SHOW_addExpert_MODEL) && <ChooseExpert chooseExpert={this.chooseExpert} />}
                {toggleStore.toggles.get(SHOW_uploadCourseware_MODEL) && <UploadCourseware uploadCourseware={this.uploadCourseware} />}
            </Modal>
        )
    }


}

export default Form.create({ name: 'addTrainingCourse' })(AddTrainingCourse);;