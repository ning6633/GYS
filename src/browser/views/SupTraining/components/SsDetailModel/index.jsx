import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, DatePicker, Icon, Button, message, Tooltip } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_SsDetail_MODEL,SHOW_NewBZYQ_MODEL,SHOW_ChooseSupplierPub_MODEL ,SHOW_ChooseSpecialist_MODEL } from "../../../../constants/toggleTypes"
import NewBZYQ from "../NewBZYQ"
import _ from "lodash";
// 公用选择供应商组件
import ChooseSupplier from "../../../../components/ChooseSupplier"
import ChooseSpecialist from "../../../../components/ChooseSpecialist"
import { supplierAction,specialAction } from "../../../../actions"
const { TabPane } = Tabs;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class SsDetailModel extends React.Component {
    state={
        BzyqData:[],
        PjzjData:[],
        AccessSupData:[],
        ReferData:[],
        supplierList:[],
        isAccess:true
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_SsDetail_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore,newSSHandle } = this.props;
        const  {BzyqData,PjzjData,AccessSupData,ReferData} = this.state 
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let postData  = {
                    ...values,
                    BzyqData,
                    PjzjData,
                    AccessSupData,
                    ReferData
                }
                newSSHandle(postData)
            
            }
        });
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_SsDetail_MODEL)
    };
    //新增标准要求
    addBZYQFn(obj){
        const {BzyqData} =  this.state
        BzyqData.push(obj)
        console.log(BzyqData)
        this.setState({
            BzyqData
        })
    }
    //删除已选标准要求
    deleteBZYQ(key){
        const {BzyqData} =  this.state
        BzyqData.splice(key,1)
        this.setState({
            BzyqData
        })
    }
  //选择新增供应商类型
  chooseSupType(type){
      this.setState({
        isType:type
      })
    
  }
  //新增专家
  addSpecialist(){
    const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ChooseSpecialist_MODEL)
  }
  chooseSpecialistFn(data){
    const {PjzjData } = this.state
    PjzjData.push(data)
    this.setState({
        PjzjData
        })
  }
    chooseBZsupplierFn(data){
        const { AccessSupData,ReferData,isType } = this.state
        if(isType=='access'){
            AccessSupData.push(data)
            this.setState({
                AccessSupData
                })
        }else{
            ReferData.push(data)
            this.setState({
                ReferData
                })
        }
       
    }
    //移除已经添加的专家
    deleteSpecialist(value){
        const { PjzjData } = this.state
        let ind = _.findIndex(PjzjData, { id: value.id })
        PjzjData.splice(ind,1)
        this.setState({
            PjzjData
        })
    }
    //移除已通过供应商
    deleteAccessSupplierInfo(value){
        const { AccessSupData } = this.state
        let ind = _.findIndex(AccessSupData, { id: value.id })
        AccessSupData.splice(ind,1)
        this.setState({
            AccessSupData
        })
    }
    //移除未通过供应商
    deleteReferSupplierInfo(value){
        const { ReferData } = this.state
        let ind = _.findIndex(ReferData, { id: value.id })
        ReferData.splice(ind,1)
        this.setState({
            ReferData
        })
    }
    async componentDidMount(){
        const { detail } = this.props
        console.log(detail)
         const { setFieldsValue } = this.props.form;
        setFieldsValue({
            ...detail,
            // name: detail?detail.name:null,
            // doquaevalorg: detail?detail.doquaevalorg:null,
            // quaplace:detail?detail.quaplace:null,
            // create_time:detail?detail.create_time:null,
            // satisfaction:detail?detail.satisfaction:null,
        })
        this.setState({
            AccessSupData:detail?detail.passGyss:[],
            ReferData:detail?detail.noPassGyss:[],
            BzyqData:[],
            PjzjData:detail?detail.specialists:[]
        })
        // let supplierList = await supplierAction.getSupplierList(1,20)
        // console.log(supplierList)
        // if(supplierList){
        //     this.setState({
        //         supplierList:supplierList.list
        //     })
        // }
        // let options = {
        //     pageNum:1,
        //     rowNum:20
        // }
        // let specialist = await specialAction.getSpecialist(options)
        // console.log(specialist)
        // if(specialist){
        //     this.setState({
        //         specialist:specialist.listZzpjSpecialistVO
        //     })
        // }
       
    }
    render() {
        const { toggleStore ,detail } = this.props;
        const { getFieldDecorator } = this.props.form;
        const {BzyqData,PjzjData,AccessSupData,ReferData,supplierList,specialist} =  this.state
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const Bzyqcolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '要求名称',
                dataIndex: 'name',
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
            },
            {
                title: '要求类型',
                dataIndex: 'type',
            },
            {
                title: '标准文件编号',
                dataIndex: 'number',
            },
            {
                title: '标准文件附件',
                dataIndex: 'fileid',
            },
            // {
            //     title: '操作',
            //     dataIndex: 'cz',
            //     render: (text, redord, key) => {
            //         return (<div> <Button type="danger" onClick={() => { this.deleteBZYQ(key) }} size={'small'}>删除</Button></div>)
            //     }
            // },
        ]
        const trainCerscolumns = [
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
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 20)}</span></Tooltip>
            
            },
            {
                title: '证书类型',
                dataIndex: 'type',
             
            },
            {
                title: '发证机构',
                dataIndex: 'authoritied_orgname',
            },
            {
                title: '有效时间',
                dataIndex: 'expiry_months',
            },
         
            // {
            //     title: '操作',
            //     dataIndex: 'cz',
            //     render: (text, redord, key) => {
            //         return (<div> <Button type="danger" onClick={() => { this.deletePxzs(redord) }} size={'small'}>删除</Button></div>)
            //     }
            // },
        ]
        const memberColumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '参训人员',
                dataIndex: 'username',
                width: 150,
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
            },
            {
                title: '所属供应商',
                dataIndex: 'gysname',
            },
            {
                title: '联系方式',
                dataIndex: 'tel',
            },
            {
                title: '是否通过',
                dataIndex: 'status',
                render: (text, index, key) =>text=='0'?'未通过':'通过'
                
             
            },
            // {
            //     title: '操作',
            //     dataIndex: 'cz',
            //     render: (text,record) =>   <Button type="danger"  onClick={() => {  }} >删除</Button>
            // },
          
        ]
   
        return (
            <div>
                <Modal
                    title="培训实施记录详情"
                    width={960}
                    visible={toggleStore.toggles.get(SHOW_SsDetail_MODEL)}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                >
                    <Tabs defaultActiveKey="1" size={'large'}>
                        <TabPane tab="培训信息" key="1">
                            <Form className="ant-advanced-search-form" onSubmit={(e) => {this.handleSubmit(e) }}>

                                <Card bordered={false} className="new_supplier_form">
                                <Row gutter={24}>
                                        <Col span={24}>
                                            <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'培训计划'}>
                                            {getFieldDecorator(`trainname`, {
                                                
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '培训计划',
                                                    },
                                                ],
                                            })(<Input disabled={true}  />)}
                                        </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                                <Form.Item {...formItemLayout} label={'培训类型'}>
                                                    {getFieldDecorator(`trainTypeName`, {
                                                        rules: [
                                                            {
                                                                required: false,
                                                                message: '培训类型',
                                                            },
                                                        ],
                                                    })(<Input disabled={true}/>)}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'培训班次'}>
                                                    {getFieldDecorator(`trainShift`, {
                                                        rules: [
                                                            {
                                                                required: false,
                                                                message: '培训班次',
                                                            },
                                                        ],
                                                    })(<Input disabled={true}/>)}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                                <Form.Item {...formItemLayout} label={'培训专家'}>
                                                    {getFieldDecorator(`trainteacher`)(<Input disabled={true} />)}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                                <Form.Item {...formItemLayout} label={'培训课时'}>
                                                    {getFieldDecorator(`trainhour`)(<Input disabled={true}/>)}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                                <Form.Item {...formItemLayout} label={'培训地点'}>
                                                    {getFieldDecorator(`trainPlace`)(<Input disabled={true}/>)}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                                <Form.Item {...formItemLayout} label={'主办单位'}>
                                                    {getFieldDecorator(`sponsor`)(<Input disabled={true}/>)}
                                                </Form.Item>
                                            </Col>
                                            {
                                                detail.score!=''&& 
                                                 <Col span={12} >
                                                <Form.Item {...formItemLayout} label={'满意度'}>
                                                    {getFieldDecorator(`score`)(<Input disabled={true}/>)}
                                                </Form.Item>
                                            </Col>
                                            }
                                          
                                        </Col>
                                    </Row>
                                </Card>
                                <Card bordered={false} title={<b>培训证书</b>} className="new_supplier_producelist">
                                    <Row>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => text.id} columns={trainCerscolumns} dataSource={detail.trainImplementCertificateList} />
                                        </Col>
                                    </Row>
                                </Card>
                                {/* <Card bordered={false} title={<b>评价专家</b>}
                               
                                className="new_supplier_producelist">
                                    <Row>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => text.dsid} columns={Pjzjcolumns} dataSource={PjzjData} />
                                        </Col>
                                    </Row>
                                </Card> */}
                            </Form>
                        </TabPane>
                        <TabPane tab="参训人员" key="2">
                            <Card bordered={false}  className="new_supplier_producelist">
                                <Row>
                                    <Col span={24}>
                                        <Table rowKey={(text, key) => text.id}  columns={memberColumns} dataSource={detail.trainImplementUserList} />
                                    </Col>
                                </Row>
                            </Card>
                            {/* <Card bordered={false} title={<b>未通过供应商</b>} className="new_supplier_producelist">
                                <Row>
                                    <Col span={24}>
                                        <Table rowKey={(text, key) => text.daid} scroll={{x:1100}} columns={ReferSupcolumns} dataSource={ReferData} />
                                    </Col>
                                </Row>
                            </Card> */}
                        </TabPane>
                    </Tabs>
                </Modal>
             
            </div>
        );
    }
}

export default Form.create({ name: 'SsDetailModel' })(SsDetailModel);;