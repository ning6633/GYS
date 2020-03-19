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
         const { setFieldsValue } = this.props.form;
        setFieldsValue({
            name: detail?detail.name:null,
            doquaevalorg: detail?detail.doquaevalorg:null,
            quaplace:detail?detail.quaplace:null,
            create_time:detail?detail.create_time:null,
            satisfaction:detail?detail.satisfaction:null,
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
        const { toggleStore } = this.props;
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
        const Pjzjcolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '专家名称',
                dataIndex: 'specialistname',
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
            },
            {
                title: '专家职称',
                dataIndex: 'specialisttitle',
            },
            {
                title: '专家类型',
                dataIndex: 'specialisttype',
            },
            {
                title: '专业领域',
                dataIndex: 'specialistfield',
            },
            {
                title: '专家来源',
                dataIndex: 'source',
            },
            // {
            //     title: '操作',
            //     dataIndex: 'cz',
            //     render: (text,record) =>   <Button type="danger"  onClick={() => { this.deleteSpecialist(record) }} >删除</Button>
            // },
          
        ]
        const AccessSupcolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '供应商名称',
                dataIndex: 'gysname',
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 20)}</span></Tooltip>
            },
            {
                title: '供应商编号',
                dataIndex: 'is_sky',
            },
            {
                title: '产品范围',
                dataIndex: 'product_scope',
            },
            {
                title: '产品类别',
                dataIndex: 'model_area',
            },
            {
                title: '资质等级',
                dataIndex: 'apply_level',
            },
            {
                title: '资质证书',
                dataIndex: 'mail',
            },
            {
                title: '证书类型',
                dataIndex: 'licensetype',
            },
            {
                title: '签发日期',
                dataIndex: 'date',
            },
            // {
            //     title: '操作',
            //     dataIndex: 'cz',
            //     render: (text,record) =>   <Button type="danger"  onClick={() => { this.deleteAccessSupplierInfo(record) }} >删除</Button>
            // },
          
        ]
        const ReferSupcolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '供应商名称',
                dataIndex: 'gysname',
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
            },
            {
                title: '供应商编号',
                dataIndex: 'is_sky',
            },
            {
                title: '产品范围',
                dataIndex: 'product_scope',
            },
            {
                title: '产品类别',
                dataIndex: 'model_area',
            },
            {
                title: '申请资质等级',
                dataIndex: 'number',
            },
            {
                title: '原因说明',
                dataIndex: 'mail',
            },
            // {
            //     title: '操作',
            //     dataIndex: 'cz',
            //     render: (text,record) =>   <Button type="danger"  onClick={() => { this.deleteReferSupplierInfo(record) }} >删除</Button>
            // },
          
        ]
        return (
            <div>
                <Modal
                    title="资质评价实施记录详情"
                    width={960}
                    visible={toggleStore.toggles.get(SHOW_SsDetail_MODEL)}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                >
                    <Tabs defaultActiveKey="1" size={'large'}>
                        <TabPane tab="评价信息" key="1">
                            <Form className="ant-advanced-search-form" onSubmit={(e) => {this.handleSubmit(e) }}>

                                <Card bordered={false} className="new_supplier_form">
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            <Col span={12} >
                                                <Form.Item {...formItemLayout} label={'资质评价名称'}>
                                                    {getFieldDecorator(`name`, {
                                                        initValue: "资质评价名称",
                                                        rules: [
                                                            {
                                                                required: false,
                                                                message: '资质评价名称',
                                                            },
                                                        ],
                                                    })(<Input disabled />)}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                                <Form.Item {...formItemLayout} label={'认证机构'}>
                                                    {getFieldDecorator(`doquaevalorg`, {
                                                        rules: [
                                                            {
                                                                required: false,
                                                                message: '认证机构',
                                                            },
                                                        ],
                                                    })(<Input disabled />)}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                                <Form.Item {...formItemLayout} label="评价时间">
                                                        {getFieldDecorator('create_time')(<Input disabled />)}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                                <Form.Item {...formItemLayout} label={'评价地点'}>
                                                    {getFieldDecorator(`quaplace`)(<Input disabled />)}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                                <Form.Item {...formItemLayout} label={'满意度'}>
                                                    {getFieldDecorator(`satisfaction`)(<Input disabled/>)}
                                                </Form.Item>
                                            </Col>
                                        </Col>
                                    </Row>
                                </Card>
                                <Card bordered={false} title={<b>标准要求</b>} className="new_supplier_producelist">
                                    <Row>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => key} columns={Bzyqcolumns} dataSource={BzyqData} />
                                        </Col>
                                    </Row>
                                </Card>
                                <Card bordered={false} title={<b>评价专家</b>}
                               
                                className="new_supplier_producelist">
                                    <Row>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => key} columns={Pjzjcolumns} dataSource={PjzjData} />
                                        </Col>
                                    </Row>
                                </Card>
                            </Form>
                        </TabPane>
                        <TabPane tab="供应商" key="2">
                            <Card bordered={false} title={<b>已通过供应商</b>}  className="new_supplier_producelist">
                                <Row>
                                    <Col span={24}>
                                        <Table rowKey={(text, key) => key} scroll={{x:1100}} columns={AccessSupcolumns} dataSource={AccessSupData} />
                                    </Col>
                                </Row>
                            </Card>
                            <Card bordered={false} title={<b>未通过供应商</b>} className="new_supplier_producelist">
                                <Row>
                                    <Col span={24}>
                                        <Table rowKey={(text, key) => key} scroll={{x:1100}} columns={ReferSupcolumns} dataSource={ReferData} />
                                    </Col>
                                </Row>
                            </Card>
                        </TabPane>
                    </Tabs>
                </Modal>
             
            </div>
        );
    }
}

export default Form.create({ name: 'SsDetailModel' })(SsDetailModel);;