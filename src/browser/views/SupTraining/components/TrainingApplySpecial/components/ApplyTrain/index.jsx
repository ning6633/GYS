import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, Select, Icon, Button, message, Tooltip, Upload, Descriptions } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_ApplyTrain_MODEL, SHOW_AddStaff_MODEL, SHOW_Process_MODEL } from "../../../../../../constants/toggleTypes"
import { supplierTrain, supplierEvalution } from "../../../../../../actions"
import ShowProcessModel from "../../../../../../components/ShowProcessModel";

// 公用选择供应商组件
import AddStaffModel from "./components/AddStaffModel"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
@inject('toggleStore')
@observer
class ApplyTrain extends React.Component {
    state = {
        peopleData: [],
        applyInfo: {},
        name: "",
        zt: "",
        time: "",
        pxfy: "",
        pxdd1: "",
        zbdw: "",
        listApplyedGys: [],
        listTrainApplyNewUserVO: [],
        selectedRowKeys: []
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ApplyTrain_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore, editrecord, refreshData } = this.props;
        const { applyInfo, peopleData } = this.state;
        const trainplanid = editrecord.id;
        let { userId } = supplierTrain.pageInfo;
        toggleStore.setToggle(SHOW_ApplyTrain_MODEL)
        // this.props.form.validateFields(async (err, values) => {
        //     if (!err) {
        //         let trainApplyParams = {
        //             "createuserid": userId,
        //             "trainid": trainplanid,
        //             "gysid" :applyInfo.gysId
        //         }
        //         //供应商新建培训申请
        //         let trainApply = await supplierTrain.createTrainApply(trainApplyParams);
        //         let trainApplyId = trainApply.id;
        //         //新建参加培训人员
        //         if(trainApplyId){
        //             let ret = await supplierTrain.createTrainApplyUser(trainApplyId,peopleData);
        //         }
        //         //此处调用流程申请页面
        //         this.chooseTrainApprover(editrecord,trainApplyId,userId);
        //         // toggleStore.setToggle(SHOW_ApplyTrain_MODEL)
        //         refreshData();
        //     }
        // })
    };
    //流程
    async chooseTrainApprover(record, trainApplyId, userId) {
        const { toggleStore } = this.props;
        let result = await supplierTrain.directHandleTask(trainApplyId, 'gystraining')
        console.log(result)
        if (result.code == 200) {
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
    async getApplyGysByPlanId(trainId) {
        let result = await supplierTrain.getPlanApplyDetail(trainId)
        if (result.code == 200) {
            this.setState({
                applyInfo: result.data,

            })
        }
    }

    async getTrainApplyNewUsers(trainId) {
        let result = await supplierTrain.getTrainApplyNewUsers(trainId)
        if (result.code == 200) {
            this.setState({
                listTrainApplyNewUserVO: result.data,

            })
        }
    }

    async approveGysApplyStatus(applyId, status) {
        const { editrecord } = this.props;
        const { selectedRowKeys } = this.state
        let ids = applyId ? [applyId] : selectedRowKeys
        let result = await supplierTrain.approveGysApplyStatus(ids, status)
        if (result.code == 200) {
            message.success('供应商申请已审批')
            this.getTrainApplyedGYS(editrecord.trainid)
            this.getTrainApplyNewUsers(editrecord.trainid)
            this.setState({
                selectedRowKeys: []
            })

        }


    }
    async componentDidMount() {
        const { setFieldsValue } = this.props.form;
        const { editrecord } = this.props;
        this.getApplyGysByPlanId(editrecord.trainid)
        this.getTrainApplyedGYS(editrecord.trainid)
        this.getTrainApplyNewUsers(editrecord.trainid)
        console.log(editrecord)
        
    }
    async getTrainApplyedGYS(trainId,status=''){
        let result = await supplierTrain.getTrainApplyedGYS(trainId,status)
        if (result.code == 200) {
            this.setState({
                listApplyedGys: result.data,
            })
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
    onSelectChange = (selectedRowKeys, ) => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ selectedRowKeys, });
    };

    coverStatus(status) {
        let str = ''
        switch (status) {
            case '0':
                str = '未审批'
                break;
            case '1':
                str = '已退回'
                break;
            case '2':
                str = '已审批'
                break;

            default:
                break;
        }
        return str
    }
    render() {
        const { toggleStore } = this.props;
        const { peopleData, selectedRowKeys,listApplyedGys ,listTrainApplyNewUserVO} = this.state
        const formItemLayout = {
            labelCol: { span: 9 },
            wrapperCol: { span: 15 },
        };
        const rowSelection = {
            columnWidth: 30,
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        let TableOpterta = () => (
            <div className="table-operations">
                <Button type="primary" disabled={!hasSelected} onClick={() => this.approveGysApplyStatus(null, '2')}>同意</Button>
                <Button type="primary" disabled={!hasSelected} onClick={() => this.approveGysApplyStatus(null, '1')}>退回</Button>
                {/* <Popconfirm className="confirm_del" placement="bottom" title={'确认要删除吗？'} onConfirm={() => { this.deleteTrainPlan() }}>
                    <Button type="danger"  >退回</Button>
                </Popconfirm> */}
            </div>
        )

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

        const columnsGYS = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '申请单位',
                dataIndex: 'gysname',
                width: 150,
                align: "center",
            },
            {
                title: '报名人数',
                dataIndex: 'userNum',
                width: 100,
                align: "center",
                render: (text, record) => <span style={{ cursor: "pointer", 'color': '#3283fd', 'textDecoration': 'underline' }}>{text}</span>
            },
            {
                title: '申请时间',
                dataIndex: 'createtime',
                width: 150,
                align: "center",
            },
            {
                title: '申请人',
                dataIndex: 'createusername',
                width: 100,
                align: "center",
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 100,
                align: "center",
                render: (text, record) => <span style={{ 'color': text == 1 ? '#f60' : '#555' }}>{this.coverStatus(text)}</span>
            },
            {
                title: '操作',
                dataIndex: 'modify',
                align: "center",
                // fixed: "right",
                width: 100,
                render: (text, record) => {
                    return (
                        record.status=='0'?
                    <div>
                        <Button type="primary"
                            onClick={() => this.approveGysApplyStatus(record.id, '2')}
                            style={{ marginRight: 5 }} size={'small'}>同意</Button>
                        <Button type="primary"
                            onClick={() => this.approveGysApplyStatus(record.id, '1')}
                            style={{ marginRight: 5,marginTop:10 }} size={'small'}>退回</Button>
                    </div>
                    :
                    null
                    )
                }
            }

        ]
        const columnsPersonnel = [
            {
                title: '姓名',
                dataIndex: 'username',
                width: 100,
                align: "center",
            },
            {
                title: '所属供应商',
                dataIndex: 'gysname',
                width: 200,
                align: "center",
            },
            {
                title: '所属部门',
                dataIndex: 'userorg',
                width: 150,
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
                title: '证书编号',
                dataIndex: 'no',
                width: 100,
                align: "center",
            },

        ]


        let {
            name,
            zt,
            time,
            pxfy,
            pxdx,
            pxdd1,
            pxdd2,
            zbdw,
            rygm,
            pxfzr,
            pxnrfs,
            tel,
            bz,
            bmjzrq,
          //  listApplyedGys, // 已申请供应商
          //  listTrainApplyNewUserVO, // 参训人员

        } = this.state.applyInfo
        return (
            <div>
                <Modal
                    title="培训申请详情"
                    width={960}
                    visible={toggleStore.toggles.get(SHOW_ApplyTrain_MODEL)}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                >
                    <Row>
                        <Card bordered={false}>
                            <Descriptions column={2}>
                                <Descriptions.Item label="培训计划名称">{name}</Descriptions.Item>
                                <Descriptions.Item label="培训主题">{zt}</Descriptions.Item>
                                <Descriptions.Item label="培训日期">{time}</Descriptions.Item>
                                <Descriptions.Item label="培训地点">{pxdd1}</Descriptions.Item>
                                <Descriptions.Item label="培训对象">{pxdx}</Descriptions.Item>
                                <Descriptions.Item label="培训详细地址">{pxdd2}</Descriptions.Item>
                                <Descriptions.Item label="培训费用/人">{pxfy}</Descriptions.Item>
                                <Descriptions.Item label="人员规模">{rygm}</Descriptions.Item>
                                <Descriptions.Item label="主办单位">{zbdw}</Descriptions.Item>
                                <Descriptions.Item label="培训负责人">{pxfzr}</Descriptions.Item>
                                <Descriptions.Item label="培训内容">{pxnrfs}</Descriptions.Item>
                                <Descriptions.Item label="联系电话">{tel}</Descriptions.Item>
                                <Descriptions.Item label="备注">{bz}</Descriptions.Item>
                                <Descriptions.Item label="报名截止日期">{bmjzrq}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Row>
                    <Row>
                        <Card title={<b>已申请供应商</b>} extra={<TableOpterta />} bordered={false}>
                            <Table
                                size='middle'
                                rowSelection={rowSelection}
                                bordered={true}
                                rowKey={(text) => text.id}
                                scroll={{ x: 650 }}
                                columns={columnsGYS}
                                pagination={false}
                                dataSource={listApplyedGys}
                            ></Table>
                        </Card>
                    </Row>
                    <Row>
                        <Card title={<b>报名人员</b>} bordered={false}>
                            <Table
                                size='middle'
                                bordered={true}
                                rowKey={(text) => `${text.username}${text.tel}`}
                                scroll={{ x: 750 }}
                                columns={columnsPersonnel}
                                pagination={false}
                                dataSource={listTrainApplyNewUserVO}
                            ></Table>
                        </Card>
                    </Row>
                </Modal>
                {
                    toggleStore.toggles.get(SHOW_AddStaff_MODEL) && <AddStaffModel chooseFinishFn={(val) => { this.chooseZzApplyFn(val) }} />
                }
                {toggleStore.toggles.get(SHOW_Process_MODEL) && <ShowProcessModel />}
            </div>
        );
    }
}

export default Form.create({ name: 'NewSupplier' })(ApplyTrain);;