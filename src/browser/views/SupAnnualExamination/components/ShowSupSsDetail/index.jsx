import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { toJS } from "mobx"
import { Modal, Form, Row, Col, Input, Button, Card, Select, Radio, message, Table, Tooltip } from 'antd';
import { SHOW_Process_MODEL, SHOW_ChooseListModel_MODEL, SHOW_ShowSupApply_MODEL } from "../../../../constants/toggleTypes"
import Choosepsupplier from '../../../SupManager/components/Choosepsupplier'
import { supYearAudit, supplierEvalution, supplierApproval } from "../../../../actions"
import ChooseListModel from '../../../../components/ChooseListModel'
import ShowRecommendDetail from '../../../SupRecommend/components/ShowRecommendDetail'
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Option } = Select;
const { TextArea } = Input;



let options = {
    title: '选择培训证书',
    columns: [
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
            title: '证书编号',
            dataIndex: 'number',
        },
        {
            title: '发证机构',
            dataIndex: 'authoritied_orgname',
        },
        {
            title: '有效期(月)',
            dataIndex: 'expiry_months',
        },

    ]
}

@inject('toggleStore', 'supplierStore')
@observer
class ShowSupSsDetail extends React.Component {
    state = {
        productid: "",
        supplierId: "",
        verifyEditProduct: {},
        selectField: {
            "zycd": [

            ],
            "cpfl": [

            ],
            "ptfs": [

            ],
            "ptly": [

            ],
            "sfst": [

            ]
        },
        PXZSData: [],
        ZSList: [],
        value: 0,
        satisfacted: false,
        userTypeVerty: 'sup',
        isScore:''
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ShowSupApply_MODEL)
    };
    deleteZs(key) {
        const { PXZSData } = this.state
        PXZSData.splice(key, 1)
        this.setState({
            PXZSData
        })
    }
    onChange = e => {
        this.setState({
            value: e.target.value,
        });
    };
    async handleSubmit(type) {
        //  e.preventDefault();
        // const { toggleStore,refreshData } = this.props;
        // const { PXZSData,supplierId} = this.state
        // this.props.form.validateFields(async (err, values) => {
        //     console.log(values)
        //     if(!err){
        //         let postData = {
        //             ...values,
        //             product_category:values.product_category.join(','),
        //             gysid:supplierId,
        //             gys_train_certificate_rel_ids:this.converIds(PXZSData)|| ''
        //         }
        //        console.log(postData) 
        //        let ret = await supplierEvalution.newZzpjApply(postData)
        //        console.log(ret)
        //        if(ret.code==200){
        //         refreshData()
        //         toggleStore.setToggle(SHOW_ShowSupApply_MODEL)
        //            if(type=='submit'){
        //             let instanceId = ret.data.id
        //             console.log(instanceId)
        //             let applyResult = await supplierEvalution.editApplyStatus(instanceId)
        //             console.log(applyResult)
        //            }else{

        //            }


        //        }
        //     }

        // });
    };

   



    //为实施评价打分
    async markSsju(record, score) {
        console.log(record)
        let params = {
            satisfaction:score,
            gysid:record.gysInfo.gysId,
            annualauditrecordid:record.id,
            result:'',
            pass:''
        }
        console.log(params)
        let result = await supYearAudit.markSs(params)
        console.log(result)
        if (result.code == 200) {
            this.setState({
                satisfacted: true,
                isScore:this.converDF(score)
            })
            message.success(result.message)
        } else {
            message.error('评分失败')
        }
    }
    converIds(arr) {
        let _arr = []
        arr.forEach(item => {
            _arr.push(item.id)
        })
        return _arr.join(',')
    }

    converDF(score) {
        let str = ''
        switch (Number(score)) {
            case 2:
                str = '满意'
                break;
            case 1:
                str = '一般'
                break;
            case 0:
                str = '不满意'

            default:
                break;
        }
        return str
    }


    handleChange(value) {
        console.log(`Selected: ${value}`);
    }

  




  
    async componentDidMount() {
        const { detail } = this.props;
        const { setFieldsValue } = this.props.form;
        const { roleNameKey } = supplierEvalution.pageInfo
        //获取所有审核角色名单
        let ApproveroleLists = await supplierApproval.getCharacter()
        console.log(ApproveroleLists)
        //获取自身角色信息
        let roles = roleNameKey.split(',')
        console.log(roles)
        //判断是否是审核角色
        for (let roleName of roles) {
            let userVerty = ApproveroleLists.some(item => item == roleName)
            if (userVerty) {
                this.setState({
                    userTypeVerty: 'approve'
                })
                break
            }
        }



        setFieldsValue({
            ...detail,
            status: detail.status != '' ? (detail.status == '1' ? '通过' : '未通过') : null,
        })
        // if (detail.zrCertId) {
        //     this.setState({
        //         ZSList:detail.zrCertId?[detail.zrCertificate]:[],// arr.push(detail.zrCertificate),
        //         speacialist: detail.zjList
        //     })
        // }
        this.setState({
            // ZSList:detail.zrCertId?[detail.zrCertificate]:[],// arr.push(detail.zrCertificate),
            speacialist: detail.zjList || []
        })
        if (detail.status == '') {
            message.error('该申请没有参加任何评价')
        }
     
        if (detail.score != '') {
            this.setState({
            isScore:this.converDF(detail.score),
            satisfacted:true
            })
        }
        if(detail.certificateid){
            let certificateRet = await supYearAudit.getcertificatesbyID(detail.certificateid) 
            console.log(certificateRet)
            let arr = []
            arr.push(certificateRet.data)
            this.setState({
                ZSList:arr
            })
        }
        // let SpecialResult = await supYearAudit.getAuditSpecial()
        
        // console.log(certificateRet)
        console.log(detail)
      

        // 获取 下拉框字段
        // let ret = await supplierAction.getSupplierPuductSelect();
        // let verifyEditProduct = toJS(verifyStore.verifyEditProduct)
        // verifyEditProduct = this.handelValuesadddunhao(verifyEditProduct)
        // this.setState({
        //     selectField: ret
        // })
        // this.setState({
        //     productid: verifyEditProduct.id,
        //     supplierId: verifyEditProduct.gysid,
        //     verifyEditProduct
        // })
        // setFieldsValue({ ...verifyEditProduct })

    }
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const CPFLoptions = () => <Option key={'火工品'}>{'火工品'}</Option>
        const { getFieldDecorator } = this.props.form;
        const { toggleStore, supplierStore, detail } = this.props;
        const { satisfacted, ZSList, speacialist, userTypeVerty,isScore } = this.state
        const children = [CPFLoptions()]
        const PXZScolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 55,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '证书名称',
                dataIndex: 'name',
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
            },
            {
                title: '证书编号',
                dataIndex: 'code',
            },
            {
                title: '发证机构',
                dataIndex: 'org',
            },
            // {
            //     title: '发证日期',
            //     dataIndex: 'expiry_months',
            //  },
            {
                title: '有效期',
                dataIndex: 'toTime',
            },
            {
                title: '证书附件',
                dataIndex: 'file',
                width: 130,
                align: "center",
                render: (text, redord) => redord.fileid && <span onClick={() => { window.open(`${supplierEvalution.FileBaseURL}${redord.fileid}`) }} style={{ cursor: "pointer", 'color': '#3383da' }}>查看附件</span>
            },
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
                dataIndex: 'name',
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
            },
            {
                title: '专家职称',
                dataIndex: 'title',
            },
            {
                title: '专家类型',
                dataIndex: 'type',
            },
            {
                title: '专业领域',
                dataIndex: 'field',
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
        console.log(ZSList)
        return (
            <div>
                {
                    toggleStore.toggles.get(SHOW_ShowSupApply_MODEL) && <Modal
                        title={`年度审核实施详情`}
                        visible={toggleStore.toggles.get(SHOW_ShowSupApply_MODEL)}
                        width={960}
                        centered
                        footer={null}
                        okText="确认"
                        cancelText="取消"
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >
                        <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>
                          
                            <Card bordered={false}>
                                <Row gutter={24}>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'复审名称'}>
                                            {getFieldDecorator(`annualauditName`, {
                                                initialValue: "",
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '供应商名称',
                                                    },
                                                ],
                                            })(<Input disabled />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'认证机构'}>
                                            {getFieldDecorator(`evaluateOrg`, {
                                                initialValue: "",
                                            })(<Input disabled />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'复审地点'}>
                                            {getFieldDecorator(`annualauditAddress`, {
                                                initialValue: "",
                                                rules: [{ required: false, message: '请选择产品范围' }],
                                            })(<Input disabled />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'复审时间'}>
                                            {getFieldDecorator(`annualauditDate`, {
                                                initialValue: "",
                                                rules: [{ required: false, message: '请选择产品类别' }],
                                            })(
                                                <Input disabled />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'产品范围'}>
                                            {getFieldDecorator(`productScope`, {
                                                initialValue: "",
                                            })(<Input disabled />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'产品类别'}>
                                            {getFieldDecorator(`productType`, {
                                                initialValue: "",
                                            })(<Input disabled />)}
                                        </Form.Item>
                                    </Col>

                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'拟准入等级'}>
                                            {getFieldDecorator(`importLevel`, {
                                                initialValue: "",
                                                rules: [{ required: false, message: '请选择拟准入等级' }],
                                            })(
                                                <Input disabled />
                                            )}
                                        </Form.Item>
                                    </Col>

                                    {/* <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'推荐码'}>
                                                {getFieldDecorator(`referral_code`,{
                                                       rules: [{ required: false, message: '请输入推荐码' }],
                                                })(   <Input disabled />)}
                                            </Form.Item>
                                        </Col> */}

                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'评价结果'}>
                                            {getFieldDecorator(`status`, {
                                                initialValue: "",
                                            })(<Input disabled />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={detail.score == '' && userTypeVerty == 'sup' && !satisfacted ? 10 : 12} >
                                        <Form.Item {...formItemLayout} label={'满意度'}>
                                            {
                                                detail.score == '' && userTypeVerty == 'sup' && !satisfacted ?
                                                    <Radio.Group onChange={this.onChange} value={this.state.value}>
                                                        <Radio value={2}>满意</Radio>
                                                        <Radio value={1}>一般</Radio>
                                                        <Radio value={0}>不满意</Radio>
                                                    </Radio.Group> :
                                                 (   <Input disabled  value={isScore}/>)
                                            }

                                        </Form.Item>

                                    </Col>

                                    <Col span={12} >
                                        {
                                            detail.score == '' && userTypeVerty == 'sup' && !satisfacted ? <Button type="primary" onClick={() => {
                                                this.markSsju(detail, this.state.value)
                                            }}>
                                                确定
                                        </Button> : null
                                        }

                                    </Col>

                                </Row>
                            </Card>

                            {
                                //判断是否有实施记录
                                detail.status != '' ? (
                                    detail.certificateid != '' ?
                                        <Card bordered={false} title={<b>复审证书</b>}
                                            className="new_supplier_producelist">
                                            <Row>
                                                <Col span={24}>
                                                    <Table rowKey={(text, key) => key} columns={PXZScolumns} dataSource={ZSList} />
                                                </Col>
                                            </Row>
                                        </Card>
                                        :

                                        <Card bordered={false} title={<b>不通过原因</b>}
                                            className="new_supplier_producelist">
                                            <Row>
                                                <Col span={24}>

                                                    <TextArea rows={3} value={detail.result} disabled />
                                                </Col>
                                            </Row>
                                        </Card>
                                ) : null

                            }
                            <Card bordered={false} title={<b>评价专家</b>}
                                className="new_supplier_producelist">
                                <Row>
                                    <Col span={24}>
                                        <Table rowKey={(text, key) => key} columns={Pjzjcolumns} dataSource={speacialist} />
                                    </Col>
                                </Row>
                            </Card>

                        </Form>

                    </Modal>
                }


            </div>
        );
    }
}

export default Form.create({ name: 'ShowSupSsDetail' })(ShowSupSsDetail);