import React, { Component ,Fragment} from 'react';
import { Modal, Form, Row, Col, Input, Table,Descriptions, Tabs, Card, Select, Icon, Button, message, Tooltip ,Upload ,Radio} from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_NewTrainType_MODEL, SHOW_ChooseListModel_MODEL } from "../../../../../../constants/toggleTypes"
import { supplierTrain,supplierEvalution } from "../../../../../../actions"
// 公用选择供应商组件
import ChooseListModel from "../../../../../../components/ChooseListModel"
import './index.less'
const { TabPane } = Tabs;
const { TextArea} = Input
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const steps = [
    {
        title: '基本信息',
        content: 'First-content',
    },
    {
        title: '报名信息',
        content: 'Second-content',
    },
    {
        title: '其他',
        content: 'Second-content',
    },

];
@inject('toggleStore')
@observer
class NewRecommend extends React.Component {
    state = {
        specialistTypes: {},
        supplierTypes: {},
        choosetype: "",//新增专家范围还是供应商范围
        supData:[],//选择的供应商类别
        specData:[],//选择的专家类别
        attribute:[]
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
        this.attribute()
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
        //上传文件
        setFile(files) {
            console.log(files)
            this.setState({
                trainPlanFileData: files
            })
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
        //下载附件
        async download(record){
            let downlaodUrl = supplierEvalution.FileBaseURL+record.fileId
            window.open(downlaodUrl)
        }
    render() {
        const { toggleStore } = this.props;
        const { specialistTypes, supplierTypes, choosetype,specData,supData,listModelOption ,attribute} = this.state
        const { getFieldDecorator } = this.props.form;
        let that  = this
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const formItemLayout_lg = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        const formItemLayout_md = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
        };
        const uploadProps = {
            name: 'file',
            action: `${supplierTrain.FileBaseURL}`,
            /* headers: {
                authorization: 'authorization-text',
            }, */
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    let _fileArr = [];
                    info.fileList.map((file) => {
                        let tempfile = {
                            name: file.name,
                            fileid: file.response.fileid,
                            fileType: file.response.fileType
                        }
                        _fileArr.push(tempfile)
                    })
                    that.setFile(_fileArr)
                    message.success(`${info.file.name} 文件上传成功`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 文件上传失败.`);
                }
            },
        };
        const typelist = choosetype == "specialist" ? specialistTypes : supplierTypes;
        const disabledData = choosetype == "specialist" ? specData : supData;
        const shcolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '审核结论',
                dataIndex: 'name',
            },
            {
                title: '审核意见',
                dataIndex: 'code',
            },
            {
                title: '审批单位',
                dataIndex: 'level',
            },
            {
                title: '审批人',
                dataIndex: 'shr',
            },
            {
                title: '审批时间',
                dataIndex: 'date',
            },
        ]
        const cppzcolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '所供产品品种',
                dataIndex: 'name',
            },
            {
                title: '执行标准',
                dataIndex: 'code',
            },
            {
                title: '质量等级',
                dataIndex: 'level',
            },
            {
                title: '关键性能参数',
                dataIndex: 'params',
            },
            {
                title: '鉴定或定型时间',
                dataIndex: 'time',
            },
            {
                title: '正常供货周期',
                dataIndex: 'times',
            },
            {
                title: '操作',
                dataIndex: 'cz',
                render: (text, record, key) => {
                    return (<div> <Button type="danger" onClick={() => { this.deleteSpecialistType(record) }} size={'small'}>删除</Button></div>)
                }
            }
        ]
        const columns_vertical = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '认证类别',
                dataIndex: 'name',
            },
            {
                title: '证书覆盖的产品范围',
                dataIndex: 'code',
            },
            {
                title: '证书有效期',
                dataIndex: 'date',
            },
            {
                title: '认证机构',
                dataIndex: 'org',
            },
            {
                title: '附件',
                dataIndex: 'cz',
                align: "center",
                render: (text, record, key) => {
                    
                    return (<div>{record.fileId &&<Button size="small" onClick={() => { this.download(record, key) }} style={{ marginRight: 5 }} type="primary" size={'small'}>下载</Button> }</div>)
                }
            },
        ]
        
        return (
            <div>
                <Modal
                    title="开发新供应商"
                    width={960}
                    visible={toggleStore.toggles.get(SHOW_NewTrainType_MODEL)}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                >
                        <Form className="ant-advanced-search-form" onSubmit={(e) => { }}>
                    <Tabs defaultActiveKey="1" size={'large'}>
                    <TabPane tab="必要性认证" key="1">
            

                        <Card bordered={false} className="new_supplier_form">
                            <Row gutter={24}>
                            
                                    <Col span={18} >
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
                                  <Col span={18}>
                                    <Form.Item {...formItemLayout} label={'配套产品品种系列'}>
                                        {getFieldDecorator(`productScope`, {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '产品范围',
                                                },
                                            ],
                                        })(<Input placeholder="请输入配套产品品种系列"/>)}
                                    </Form.Item>
                              </Col>
                              <Col span={18}>
                                    <Form.Item {...formItemLayout} label={'执行标准'}>
                                        {getFieldDecorator(`productzxbz`, {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '产品范围',
                                                },
                                            ],
                                        })(<Input placeholder="请输入执行标准"/>)}
                                    </Form.Item>
                              </Col>
                              <Col span={18}>
                                    <Form.Item {...formItemLayout} label={'质量等级'}>
                                        {getFieldDecorator(`productzldj`, {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '产品范围',
                                                },
                                            ],
                                        })(<Input placeholder="请输入质量等级"/>)}
                                    </Form.Item>
                              </Col>
                              <Col span={18}>
                                    <Form.Item {...formItemLayout} label={'应用领域'}>
                                        {getFieldDecorator(`productyyly`, {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '产品范围',
                                                },
                                            ],
                                        })(<Input placeholder="请输入应用领域"/>)}
                                    </Form.Item>
                              </Col>
                              <Col span={18}>
                                    <Form.Item {...formItemLayout} label={'产品关键技术指标'}>
                                        {getFieldDecorator(`productjszb`, {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '产品范围',
                                                },
                                            ],
                                        })(      <TextArea rows={3}  />)}
                                    </Form.Item>
                              </Col>
                              <Col span={18}>
                                    <Form.Item {...formItemLayout} label={'产品关键技术指标'}>
                                        {getFieldDecorator(`productjszb`, {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '产品范围',
                                                },
                                            ],
                                        })(      <TextArea rows={3}  />)}
                                    </Form.Item>
                              </Col>
                              <Col span={18}>
                                    <Form.Item {...formItemLayout} label={'开发供应商的必要性'}>
                                        {getFieldDecorator(`productbyx`, {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '产品范围',
                                                },
                                            ],
                                        })(      <TextArea rows={3} placeholder="重点阐述集团公司合格供应商名录内的供应商及其产品不能满足型号配套的原因" />)}
                                    </Form.Item>
                              </Col>
                            </Row>
                        </Card>
                 
                    </TabPane>
                    <TabPane tab="供应商基本信息" key="2">
                
                    <Descriptions column={2} title="" bordered>
                    <Descriptions.Item label="供应商全称">   
                             <Input disabled={true} style={{ width:'250px', }} addonAfter={<Icon style={{cursor: 'pointer' }} onClick={() => {  }} type="plus" />} />
                    </Descriptions.Item>
                    <Descriptions.Item label="社会信用代码">a757270a-472c-4c51-</Descriptions.Item>
                    <Descriptions.Item label="简称">Cloud Database</Descriptions.Item>
                    <Descriptions.Item label="别称">Cloud Database</Descriptions.Item>
                    <Descriptions.Item label="企业性质">Cloud Database</Descriptions.Item>
                    <Descriptions.Item label="法人">Prepaid</Descriptions.Item>
                    <Descriptions.Item label="注册地址">Cloud Database</Descriptions.Item>
                    <Descriptions.Item label="注册资金">Prepaid</Descriptions.Item>
                    <Descriptions.Item label="联系人">Cloud Database</Descriptions.Item>
                    <Descriptions.Item label="联系电话">Prepaid</Descriptions.Item>
                    <Descriptions.Item label="电子邮箱">Cloud Database</Descriptions.Item>
                    <Descriptions.Item label=""></Descriptions.Item>
                    <Descriptions.Item label="企业介绍" span={4}>Prepaid</Descriptions.Item>
                    </Descriptions>
                    <Card bordered={false} title={<b>认证情况</b>}  className="new_supplier_producelist">
                            <Row>
                                <Col span={24}>
                                    <Table rowKey={(text, key) => key} columns={columns_vertical} dataSource={[]} />
                                </Col>
                            </Row>
                        </Card>
                    </TabPane>
                    <TabPane tab="推荐产品情况" key="3">
                    <Row gutter={24}>
                            
                            <Col span={18} >
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
                    <Card bordered={false} title={<b>产品品种</b>} extra={
                        <Fragment>
                                        <Button type="primary" style={{  marginRight: 10 }} onClick={() => {
                                        // toggleStore.setToggle(SHOW_NewBZYQ_MODEL)
                                    }}>
                                        新增
                                    </Button>
                                    <Button type="danger" onClick={() => {
                                        // toggleStore.setToggle(SHOW_NewBZYQ_MODEL)
                                    }}>
                                        删除
                                    </Button>
                        </Fragment>
                                  
                                    
                                } className="new_supplier_producelist">
                                    <Row>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => key} columns={cppzcolumns} dataSource={[]} />
                                        </Col>
                                    </Row>
                                </Card>

                      <Row gutter={24}>
                            
                  
                              <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'鉴定机构'}>
                                                {getFieldDecorator(`jdjg`, {
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: '培训策划',
                                                        },
                                                    ],
                                                })(<Input />)}
                                            </Form.Item>
                               </Col>
                               <Col span={12}>
                                    <Form.Item {...formItemLayout} label={'鉴定时间'}>
                                        {getFieldDecorator(`jdsj`, {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '产品范围',
                                                },
                                            ],
                                        })(<Input />)}
                                    </Form.Item>
                              </Col>
                              <Col span={24}>
                                    <Form.Item {...formItemLayout_lg} label={'产品鉴定结论'}>
                                        {getFieldDecorator(`jdjl`, {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '产品范围',
                                                },
                                            ],
                                        })( <TextArea rows={3} placeholder="产品鉴定结论" />)}
                                    </Form.Item>
                              </Col>
                         
                    </Row>
                    <Row>
                    <Col span={24} >
                    <Form.Item {...formItemLayout_md} label={'鉴定依据标准（待定）'}>
                                        {getFieldDecorator(`jdyj`, {
                                            rules: [
                                                {
                                                    required: false,
                                                },
                                            ],
                                        })(<div style={{ display: "inline-block", marginRight: 8 }}>
                                            <Upload {...uploadProps}>
                                                <Button>
                                                    <Icon type="upload" />上传附件
                                                </Button>
                                            </Upload>
                                        </div>)}
                           </Form.Item>
                    </Col>
                        <Col span={24} >
                            <Form.Item {...formItemLayout_md} label={'产品鉴定试验数据'}>
                                                {getFieldDecorator(`jdsysj`, {
                                                    rules: [
                                                        {
                                                            required: false,
                                                        },
                                                    ],
                                                })(<div style={{ display: "inline-block", marginRight: 8 }}>
                                                    <Upload {...uploadProps}>
                                                        <Button>
                                                            <Icon type="upload" />上传附件
                                                        </Button>
                                                    </Upload>
                                                </div>)}
                                </Form.Item>
                        </Col> 
                        <Col span={24} >
                            <Form.Item {...formItemLayout_md} label={'产品鉴定结论'}>
                                                {getFieldDecorator(`cpjdjl`, {
                                                    rules: [
                                                        {
                                                            required: false,
                                                        },
                                                    ],
                                                })(<div style={{ display: "inline-block", marginRight: 8 }}>
                                                    <Upload {...uploadProps}>
                                                        <Button>
                                                            <Icon type="upload" />上传附件
                                                        </Button>
                                                    </Upload>
                                                </div>)}
                                </Form.Item>
                        </Col>
                        <Col span={24}>
                                    <Form.Item {...formItemLayout_lg} label={'产品历史使用情况'}>
                                        {getFieldDecorator(`colssyqk`, {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '产品范围',
                                                },
                                            ],
                                        })( <TextArea rows={3} placeholder="请输入" />)}
                                    </Form.Item>
                              </Col>
                              <Col span={24}>
                                    <Form.Item {...formItemLayout_lg} label={'推荐理由'}>
                                        {getFieldDecorator(`tuijianliyou`, {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '产品范围',
                                                },
                                            ],
                                        })( <TextArea rows={3} placeholder="从供应商的供货能力、供货质量情况、合同履约情况、供货价格、主要设备等方面进行阐述" />)}
                                    </Form.Item>
                              </Col>
                    </Row>
              
                    </TabPane>
                    {
                        true && 
                        <TabPane tab="审批意见" key="4">
                        {
                            true &&
                             <Card bordered={false} title={<b>各级审核意见记录</b>}  className="new_supplier_producelist">
                                <Row>
                                    <Col span={24}>
                                        <Table rowKey={(text, key) => key} columns={shcolumns} dataSource={[]} />
                                    </Col>
                                </Row>
                            </Card>

                        }
                          
                        <Col span={24}>
                                        <Form.Item {...formItemLayout_lg} label={'审核结论'}>
                                            {getFieldDecorator(`spyj`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '填写审核结论',
                                                    },
                                                ],
                                            })( <Radio.Group>
                                                <Radio value="1">同意</Radio>
                                                <Radio value="0">不同意</Radio>
                                              </Radio.Group>)}
                                        </Form.Item>
                                  </Col>
                                  <Col span={24}>
                                    <Form.Item {...formItemLayout_lg} label={'审核意见'}>
                                        {getFieldDecorator(`shenheyij`, {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '产品范围',
                                                },
                                            ],
                                        })( <TextArea rows={3} placeholder="请输入" />)}
                                    </Form.Item>
                              </Col>  
                        </TabPane>
                    }
                   
                    </Tabs>
                    </Form>
                </Modal>
                {
                    toggleStore.toggles.get(SHOW_ChooseListModel_MODEL) && <ChooseListModel list={typelist} options={listModelOption} comparedList={disabledData} chooseFinishFn={(val) => { this.chooseZzApplyFn(val) }} />
                }
            </div>
        );
    }
}

export default Form.create({ name: 'NewSupplier' })(NewRecommend);;