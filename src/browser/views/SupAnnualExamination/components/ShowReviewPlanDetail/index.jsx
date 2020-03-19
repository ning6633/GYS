import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, DatePicker, Icon, Button, message, Tooltip, Upload } from 'antd';
import { observer, inject, } from 'mobx-react';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import { SHOW_ModelDetail_MODEL, SHOW_ChooseListModel_MODEL } from "../../../../constants/toggleTypes"
import { supplierTrain, specialAction, supplierAction ,supYearAudit} from "../../../../actions"
// 公用选择供应商组件
import ChooseListModel from "../../../../components/ChooseListModel"
const { TabPane } = Tabs;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class ShowReviewPlanDetail extends React.Component {
    state = {
        choosetype: "",//新增专家范围还是供应商范围
        expertlist: {},
        supplierList: {},
        supplierData: [],//选择的供应商类别
     
        trainPlanFileData: []
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ModelDetail_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore, refreshData } = this.props;
        const { expertData, supplierData, traintypeData, trainPlanFileData } = this.state;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let annualauditDate = values.date.format('YYYY-MM-DD')
                let newvalues = {
                    ...values,
                    annualauditDate
                }
                console.log(newvalues)
                //先调用创建复审计划接口,得到复审计划id
                // let TrainTypeVO = {
                //     ...newvalues,
                //     status: 0,
                //     createUser: supplierTrain.pageInfo.username,
                //     updateUser: supplierTrain.pageInfo.username,
                //     trainTypeId: traintypeData[0].id
                // }
                let result = await supYearAudit.newAnnualExamination(newvalues)
                //
                console.log(result)
                let annualauditPlanID = result.code==200?result.data.id:null
                if (annualauditPlanID) {
                    let AuditGys = [];
                
                    supplierData.forEach((item) => {
                        let data = {
                            annualauditPlanID: annualauditPlanID,
                            provider_id: item.provider_id,
                        }
                        AuditGys.push(data)
                    })
                  
                    // //再新增复审计划-专家关联表
                    // await supplierTrain.createTrainExpert(TrainExpertTypeVO)
                    // //再新增复审计划-供应商关联表
                    // await supplierTrain.createTrainGys(AuditGys)
                    // //再新增复审计划-附件关联表
                    // await supplierTrain.createTrainFile(trainPlanFileVO)
                }
                //刷新复审类型列表
                refreshData();
                toggleStore.setToggle(SHOW_ModelDetail_MODEL)
            }
        });
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ModelDetail_MODEL)
    };

    /******************* 复审类型子表 ******************/
    //新建复审计划——复审类型分页查询
    async zzpjpageChange(page, num) {
        this.loadZzpjApply(page, num)
    }
    //新建复审计划——复审类型搜索
    async zzpjSearch(value) {
        this.loadZzpjApply(1, 10, value)
    }
    //新建复审计划——加载复审类型列表
    async loadZzpjApply(pageNum = 1, rowNum = 10, value) {
        let searchValue = {
            trainName: value || ""
        }
        let trainTypeList = await supplierTrain.getTrainingTypes(pageNum, rowNum, searchValue);
        if (trainTypeList) {
            this.setState({
                trainTypes: trainTypeList,
                trainTypePaginations: { search: (value) => { this.zzpjSearch(value) }, showTotal: () => `共${trainTypeList.recordsTotal}条`, onChange: (page, num) => { this.zzpjpageChange(page, num) }, showQuickJumper: true, total: trainTypeList.recordsTotal, pageSize: 10 }
            })
        }
    }
    /*************************************/

    /******************* 供应商子表 ******************/
    //新建复审计划————供应商分页查询
    async gyspageChange(page, num) {
        this.loadGys(page, num)
    }
    //新建复审计划——供应商搜索
    async gysSearch(value) {
        this.loadGys(1, 10, value)
    }
    //新建复审计划——加载供应商列表
    async loadGys(pageNum = 1, rowNum = 10) {
        const { detail  }=this.props
        let supplierlistret = await supYearAudit.getGYSByReviewPlan(pageNum,rowNum,detail.id);
        this.setState({
            supplierList: supplierlistret.data,
        })
    }
    /*************************************/
    /******************* 专家子表 ******************/
    //新建复审计划————专家分页查询
    async expertpageChange(page, num) {
        this.loadExpert(page, num)
    }
    //新建复审计划——专家搜索
    async expertSearch(value) {
        this.loadExpert(1, 10, value)
    }
    //新建复审计划——加载专家列表
    async loadExpert(pageNum = 1, rowNum = 10, value) {
        let searchValue = {
            username: value || ""
        }
        let expertlistret = await this.getSpecialistByFiled(searchValue.username);//根据选取的复审类型中的专家领域 获取专家列表
        let total = expertlistret.length;
        this.setState({
            expertlist: {
                list: expertlistret,
                total: expertlistret.length
            },
            expertPaginations: { search: (value) => { this.expertSearch(value) }, showTotal: () => `共${total}条`, onChange: (page, num) => { this.expertpageChange(page, num) }, showQuickJumper: true, total: expertlistret.recordsTotal, pageSize: 10 }
        })
    }
    /*************************************/
    async componentDidMount() {
        // //获取复审类型列表
        // this.loadZzpjApply()
        //获取供应商列表
        this.loadGys();
        const { detail }=this.props 
        const {setFieldsValue } = this.props.form
        console.log(detail)
        if(detail){
      
         setFieldsValue({
             ...detail
            //  gysname:detail.gys_NAME,
            //  reasion:detail.reasion,
            //  reward_TYPE:detail.reward_TYPE,
            //  time:detail.reward_TIME
         })
      
        }
    }
    //根据选取的复审类型中的专家领域 获取专家列表
    async getSpecialistByFiled(username) {
        const { traintypeData } = this.state
        let expertType = [];
        for (let data of traintypeData[0].trainExpertTypeList) {
            if (data.expertTypeName) {
                expertType.push(data.expertTypeName)
            }
        };
        let expertlistret = await specialAction.getSpecialistByFiled(username, expertType)
        return expertlistret;
        /* if (expertlistret) {
            this.setState({
                expertlist: {
                    list: expertlistret,
                    total: expertlistret.length
                }
            })
        } */
    }
    //
    chooseZzApplyFn(data) {
        const { supplierData, expertData, traintypeData, choosetype } = this.state
        const { setFieldsValue } = this.props.form;
        data.forEach(item => {
            supplierData.push(item)
            this.setState({
                supplierData
            })
            // if (choosetype == 'specialist') {
            //     expertData.push(item)
            //     this.setState({
            //         expertData
            //     })
            // } else if (choosetype == 'supplier') {
            //     supplierData.push(item)
            //     this.setState({
            //         supplierData
            //     })
            // } else if (choosetype == 'chooseTrainType') {
            //     let _arr = [];
            //     _arr.push(item)
            //     this.setState({
            //         traintypeData: _arr
            //     })
            //     setFieldsValue({
            //         trainTypeName: item.trainName
            //     })
            //     let gystype = [];
            //     for (let data of item.trainGysTypeList) {
            //         if (data.gysTypeName) {
            //             gystype.push(data.gysTypeName)
            //         }
            //     };
            //     setFieldsValue({
            //         trainGysScope: gystype.join(",")//复审范围
            //     })
            // }
        })
    }
   
 
    //移除已添加的供应商
    deleteSupplier(value) {
        const { supplierData } = this.state
        let ind = _.findIndex(supplierData, { id: value.id })
        supplierData.splice(ind, 1)
        this.setState({
            supplierData
        })
    }
    //上传文件
    setFile(files) {
        console.log(files)
        this.setState({
            trainPlanFileData: files
        })
    }
    render() {
        const { toggleStore } = this.props;
        const {  supplierList,  listModelOption, } = this.state
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
     
    
        const columns_suplier = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '供应商名称',
                dataIndex: 'name',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '统一社会信用代码',
                dataIndex: 'code',
                width: 130,
                align: "center",
            },
            {
                title: '简称',
                dataIndex: 'name_other',
                width: 100,
                align: "center",
            },
            {
                title: '别称',
                dataIndex: 'another_name',
                width: 100,
                align: "center",
            },
            {
                title: '行政区域名称',
                dataIndex: 'district_key',
                width: 150,
                align: "center",
            },
            // {
            //     title: '操作',
            //     dataIndex: 'cz',
            //     width: 120,
            //     render: (text, record, key) => {
            //         return (<div> <Button type="danger" onClick={() => { this.deleteSupplier(record) }} size={'small'}>删除</Button></div>)
            //     }
            // },
        ]

        return (
            <div>
                <Modal
                    title="复审计划详情"
                    width={900}
                    visible={toggleStore.toggles.get(SHOW_ModelDetail_MODEL)}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                    footer={null}
                >
               
                    <Form className="ant-advanced-search-form" onSubmit={(e) => { }}>

                        <Card bordered={false} className="new_supplier_form">
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'复审计划名称'}>
                                            {getFieldDecorator(`annualauditName`, {
                                                initValue: "复审计划名称",
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '复审计划名称',
                                                    },
                                                ],
                                            })(<Input disabled={true} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'复审时间'}>
                                            {getFieldDecorator(`annualauditDate`, {
                                                initValue: "复审时间",
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '复审班次',
                                                    },
                                                ],
                                            })(<Input disabled={true} />)}
                                        </Form.Item>
                                    </Col>
                                   
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'复审地点'}>
                                            {getFieldDecorator(`annualauditAddress`, {
                                                initValue: '复审地点',
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '复审地点',
                                                    },
                                                ],
                                            })(<Input disabled={true} />)}
                                        </Form.Item>
                                    </Col>
                                  
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'复审机构'}>
                                            {getFieldDecorator(`annualauditOrg`, {
                                                initValue: '复审机构',
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '复审机构',
                                                    },
                                                ],
                                            })(<Input disabled={true} />)}
                                        </Form.Item>
                                    </Col>
                                </Col>
                            </Row>
                        </Card>
                    
                        <Card bordered={false} title={<b>供应商</b>}  className="new_supplier_producelist">
                            <Row>
                                <Col span={24}>
                                    <Table rowKey={(text, key) => key} columns={columns_suplier} dataSource={supplierList.list} />
                                </Col>
                            </Row>
                        </Card>
                        {/* <Card bordered={false}
                            title={traintypeData.length ? <Upload {...uploadProps}><Button type="primary"><Icon type="upload" />上传附件</Button></Upload> : ""}
                            className="new_supplier_producelist">
                        </Card> */}
                    </Form>
                    {/* </TabPane> */}
                    {/* </Tabs> */}
                </Modal>
                {
                    toggleStore.toggles.get(SHOW_ChooseListModel_MODEL) && <ChooseListModel list={typelist} comparedList={disabledData} pagination={paginations} options={listModelOption} chooseFinishFn={(val) => { this.chooseZzApplyFn(val) }} />
                }
            </div >
        );
    }
}

export default Form.create({ name: 'ShowReviewPlanDetail' })(ShowReviewPlanDetail);;