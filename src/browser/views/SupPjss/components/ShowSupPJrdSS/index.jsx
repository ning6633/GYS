import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { toJS } from "mobx"
import { Modal, Form, Row, Col, Input, Button, Card, Select,Radio, message,Table ,Tooltip,Tabs} from 'antd';
import { SHOW_RecommendApply_MODEL,SHOW_ChooseListModel_MODEL,SHOW_ShowSupPJrdSS_MODEL } from "../../../../constants/toggleTypes"
import Choosepsupplier from '../../../SupManager/components/Choosepsupplier'
import { supplierAction, supplierEvalution,supplierTrain,supplierAccepted } from "../../../../actions"
import ChooseListModel from '../../../../components/ChooseListModel'
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs; 




@inject('toggleStore', 'verifyStore','supplierStore')
@observer
class ShowSupZzApply extends React.Component {
    state = {
        productid: "",
        supplierId: "",
        verifyEditProduct:{},
        BZYQData:[],
        ZJData:[],
        AgysData:[],
        UNgysData:[],
        value:0,
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ShowSupPJrdSS_MODEL)
    };
    onChange = e => {
        this.setState({
          value: e.target.value,
        });
      };
   async handleSubmit(type){
      
    };
     handleChange(value) {
        console.log(`Selected: ${value}`);
      }
      //标准要求
    async getPJSSBzyq(implementId,pageNum = 1, rowNum = 20){
        let supplierList = await supplierAccepted.getPJSSBzyq(implementId,pageNum,rowNum);
        this.setState({
            BZYQData:supplierList.data
        })
    }
    //评价专家
    async getPJSSPjzj(implementId,pageNum = 1, rowNum = 20){
        let supplierList = await supplierAccepted.getPJSSPjzj(implementId,pageNum,rowNum);
        console.log(supplierList.data)
        this.setState({
            ZJData:supplierList.data
        })
    }
    //已通过的供应商
    async getPJSSAsup(implementId,pageNum = 1, rowNum = 20){
        let supplierList = await supplierAccepted.getPJSSAsup(implementId,pageNum,rowNum);
        this.setState({
            AgysData:supplierList.data
        })
    }
    //未通过的供应商
    async getPJSSUNsup(implementId,pageNum = 1, rowNum = 20){
        let supplierList = await supplierAccepted.getPJSSUNsup(implementId,pageNum,rowNum);
        this.setState({
            UNgysData:supplierList.data
        })
    }
    async componentDidMount() {
        const { detail } = this.props;
        const { setFieldsValue } = this.props.form;     
        setFieldsValue({
            ...detail
        })
        this.getPJSSBzyq(detail.implementId)
        this.getPJSSPjzj(detail.implementId)
        this.getPJSSAsup(detail.implementId)
        this.getPJSSUNsup(detail.implementId)
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };

        const { getFieldDecorator } = this.props.form;
        const { toggleStore,supplierStore,detail  } = this.props;
        const  {userId} = supplierEvalution.pageInfo
        const { BZYQData,ZJData,AgysData,UNgysData } = this.state
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
                dataIndex: 'gysName',
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 20)}</span></Tooltip>
            },
            {
                title: '供应商编号',
                dataIndex: 'gysCode',
            },
            {
                title: '产品范围',
                dataIndex: 'productScope',
            },
            {
                title: '产品类别',
                dataIndex: 'productType',
            },
            {
                title: '重要程度',
                dataIndex: 'importLevel',
            },
            {
                title: '准入证书',
                dataIndex: 'zrCertName',
            },
            {
                title: '证书类型',
                dataIndex: 'zrCertType',
            },
           
            {
                title: '有效期',
                dataIndex: 'zrCertToTime',
            }
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
                dataIndex: 'gysName',
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 20)}</span></Tooltip>
            },
            {
                title: '供应商编号',
                dataIndex: 'gysCode',
            },
            {
                title: '产品范围',
                dataIndex: 'productScope',
            },
            {
                title: '产品类别',
                dataIndex: 'productType',
            },
            {
                title: '重要程度',
                dataIndex: 'importLevel',
            },
            {
                title: '原因说明',
                dataIndex: 'reason',
            }
        ]
        const BZYQcolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
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
                dataIndex: 'code',
            },
            {
                title: '标准文件附件',
                dataIndex: 'fileId',
            }
        ]
        const PJZJcolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '专家名称',
                dataIndex: 'name',
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
            },
            {
                title: '专家职称',
                dataIndex: 'title',
            },
            {
                title: '专家类型',
                dataIndex: 'typename',
            },
            {
                title: '专业领域',
                dataIndex: 'field',
            },
            {
                title: '电话',
                dataIndex: 'tel',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            }
        ]
        return (
            <div>
                {
                    toggleStore.toggles.get(SHOW_ShowSupPJrdSS_MODEL) && <Modal
                        title={`准入认定实施详情`}
                        visible={toggleStore.toggles.get(SHOW_ShowSupPJrdSS_MODEL)}
                        width={960}
                        centered
                        footer={null}
                        okText="确认"
                        cancelText="取消"
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >
                    <Tabs defaultActiveKey="1" size={'large'}>
                    <TabPane tab="评价信息" key="1">
                        <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>
                            <Card  bordered={false}>
                                <Row gutter={24}>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'评价实施名称'}>
                                                {getFieldDecorator(`name`, {
                                                    initValue: "评价实施名称",
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '评价实施名称',
                                                        },
                                                    ],
                                                })(<Input disabled />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'认证机构'}>
                                                {getFieldDecorator(`evaluateOrg`)(<Input disabled />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'评价时间'}>
                                                {getFieldDecorator(`evaluateDate`)( <Input disabled />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'评价地点'}>
                                                {getFieldDecorator(`evaluatePlace`)(
                                                    <Input disabled />
                                                )}
                                            </Form.Item>
                                        </Col> 
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'满意度'}>
                                                {getFieldDecorator(`satisfaction`)(
                                                    <Input disabled />
                                                )}
                                            </Form.Item>
                                        </Col> 
                                </Row>
                            </Card>
                            <Card bordered={false} title={<b>已通过供应商</b>} 
                                className="new_supplier_producelist">
                                    <Row>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => key} columns={AccessSupcolumns} dataSource={AgysData.applyVOs} />
                                        </Col>
                                    </Row>
                            </Card>
                            <Card bordered={false} title={<b>未通过供应商</b>} 
                                className="new_supplier_producelist">
                                    <Row>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => key} columns={ReferSupcolumns} dataSource={UNgysData.applyVOs} />
                                        </Col>
                                    </Row>
                            </Card>
                        </Form>
                        </TabPane>
                        <TabPane tab="其他" key="2">
                            <Card bordered={false} title={<b>标准要求</b>} 
                                className="new_supplier_producelist">
                                    <Row>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => key} columns={BZYQcolumns} dataSource={BZYQData.needs} />
                                        </Col>
                                    </Row>
                            </Card>
                            <Card bordered={false} title={<b>评价专家</b>} 
                                className="new_supplier_producelist">
                                    <Row>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => key} columns={PJZJcolumns} dataSource={ZJData.listZzpjSpecialistVO} />
                                        </Col>
                                    </Row>
                            </Card>
                        </TabPane>
                        </Tabs> 
                    </Modal>
                }
                 
            </div>
        );
    }
}

export default Form.create({ name: 'ShowSupZzApply' })(ShowSupZzApply);