import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, DatePicker, Icon, Button, message, Tooltip } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_PJSSJL_MODEL,SHOW_NewBZYQ_MODEL,SHOW_Certificate_MODEL ,SHOW_ChooseSpecialist_MODEL ,SHOW_ChooseListModel_MODEL,SHOW_ChooseTrainPlan_MODEL  } from "../../../../constants/toggleTypes"
import NewBZYQ from "../NewBZYQ"
import _ from "lodash";
// 公用选择供应商组件
import ChooseSupplier from "../../../../components/ChooseSupplier"
import ChooseSpecialist from "../../../../components/ChooseSpecialist"
import { supplierAction,specialAction,supplierEvalution,supYearAudit } from "../../../../actions"
import  ChooseListModel from '../../../../components/ChooseListModel'
const { TabPane } = Tabs;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class NewssModel extends React.Component {
    constructor(){
        
        super()
        this.setDescription=  _.debounce(this.setDescription, 200)
    }
    state={
        BzyqData:[],
        PjzjData:[],
        AccessSupData:[],
        ReferData:[],
        SQList:{},
        ZzzsList:{},
        GysList:{},
        BzyqList:{},
        isAccess:true,
        listModelOption:{},
        cerlistModelOption:{},
        paginations:{},
        Zzzspaginations:{},
        fsGyspaginations:{},
        Bzyqpaginations:{},
        currentApplyId:null,
        currentPlanId:null
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_PJSSJL_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore,newSSHandle } = this.props;
        const  {BzyqData,PjzjData,AccessSupData,ReferData ,currentPlanId} = this.state 
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let AttachData  = {
                    BzyqData,
                    PjzjData,
                    AccessSupData,
                    ReferData
                }
                values['annualauditPlanID'] = currentPlanId
            console.log(AttachData)
            newSSHandle(values,AttachData)
            
            }
        });
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_PJSSJL_MODEL)
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
  //添加证书
  addZzzs(record){
    const { toggleStore } = this.props;
    toggleStore.setToggle(SHOW_Certificate_MODEL)
    this.setState({
        currentApplyId:record.id
    })
  }

  //添加专家
  chooseSpecialistFn(data){
    const {PjzjData } = this.state
    console.log(data)
    data.forEach(item=>{
    PjzjData.push(item)
    })
    this.setState({
        PjzjData
        })
  }
  //选择复审证书fn
  chooseZzzsFn(data){
      console.log(data)
      const { currentApplyId , AccessSupData} = this.state
      let ZzzsObj = data[0]
      console.log(AccessSupData)
      AccessSupData.forEach(item=>{
          if(item.id==currentApplyId){
            item['certificatename'] = ZzzsObj.name
            item['type'] = ZzzsObj.type
            item['create_time'] = ZzzsObj.updateTime
            item['toTime'] = ZzzsObj.toTime
            item['certificateid'] = ZzzsObj.id
          }
      })

  }
  //选择复审计划fn
    chooseFsPlan(data){
        const { AccessSupData,ReferData,currentPlanId } = this.state
        console.log(data)
        let planObj = data[0]
        const {setFieldsValue } = this.props.form
        if(planObj){
      
         setFieldsValue({
            reviewName:planObj.annualauditName
          
         })
       
         this.setState({
            currentPlanId:planObj.id
         },()=>  this.loadFsPlanGys())
        }
       

       
       
    }
    //选择供应商
    chooseGysFn(data ){
        const { AccessSupData,ReferData,currentPlanId ,isType} = this.state
  data.forEach(item=>{
            if(isType=='access'){
                item['status'] = '1'
                item['gysID'] = item.id
                AccessSupData.push(item)
                this.setState({
                    AccessSupData
                    })
            }else{
                item['status'] = '0'
                item['gysID'] = item.id
                ReferData.push(item)
                this.setState({
                    ReferData
                    })
            }
        })
    }
    //添加未通过供应商原因说明
    setDescription(id,value){
        console.log(id,value)
        const {  ReferData} = this.state
        ReferData.forEach(item=>{
            if(item.id==id){
              item['result'] = value
            }
        })
        this.setState({
            ReferData
        })
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
  //复审证书load分页查询
  async BzyqpageChange(page, num) {
    this.loadBzyq(page, num)
}
//复审证书搜索
async BzyqSearch(value){
    this.loadBzyq(1, 10,value)
}
//加载复审证书
async loadBzyq(pageNum = 1, rowNum = 10,name){
  
    let BzyqList = await supYearAudit.getReviewCertificates(pageNum,rowNum,name)
    console.log(BzyqList)
    if(BzyqList){
        this.setState({
            BzyqList:BzyqList.data,
            Bzyqpaginations: {search:(value)=>{this.BzyqSearch(value)}, showTotal:()=>`共${ZzzsList.data.recordsTotal}条`, onChange: (page, num) => { this.BzyqpageChange(page, num) }, showQuickJumper: true, total: ZzzsList.data.recordsTotal, pageSize: 10 }

        })
    }
    
}
    //复审计划下供应商load分页查询
    async fspalnGyspageChange(page, num) {
        this.loadFsPlan(page, num)
    }
    //复审计划下供应商搜索
    async fspalnGysSearch(value){
        this.loadFsPlanGys(1, 10,value)
    }
    //加载复审计划下的供应商
    async loadFsPlanGys(pageNum = 1, rowNum = 10){
        const{currentPlanId} =this.state
     
        let supplierList = await supYearAudit.getGYSByReviewPlan(pageNum,rowNum,currentPlanId)
        console.log(supplierList)
        if(supplierList){
            this.setState({
                GysList:supplierList.data,
                fsGyspaginations: {search:(value)=>{this.fspalnGysSearch(value)}, showTotal:()=>`共${supplierList.data.recordsTotal}条`, onChange: (page, num) => { this.fspalnGyspageChange(page, num) }, showQuickJumper: true, total: supplierList.data.recordsTotal, pageSize: 10 }

            })
        }
    }
    //复审计划load分页查询
    async zzpjpageChange(page, num) {
        this.loadFsPlan(page, num)
    }
    //复审计划搜索
    async zzpjSearch(value){
        this.loadFsPlan(1, 10,value)
    }
    //加载复审计划
    async loadFsPlan(pageNum = 1, rowNum = 10,annuaPlanName){
        let  status = '0'
        let params={
            annuaPlanName,
            status
        }
        let supplierList = await supYearAudit.getAnnualExamination(pageNum,rowNum,params)
        console.log(supplierList)
        if(supplierList){
            this.setState({
                SQList:supplierList.data,
                paginations: {search:(value)=>{this.zzpjSearch(value)}, showTotal:()=>`共${supplierList.data.recordsTotal}条`, onChange: (page, num) => { this.zzpjpageChange(page, num) }, showQuickJumper: true, total: supplierList.data.recordsTotal, pageSize: 10 }

            })
        }
    }

      //复审证书load分页查询
      async ZzzspageChange(page, num) {
        this.loadZzzs(page, num)
    }
    //复审证书搜索
    async ZzzsSearch(value){
        this.loadZzzs(1, 10,value)
    }
    //加载复审证书
    async loadZzzs(pageNum = 1, rowNum = 10,name){
      
        let ZzzsList = await supYearAudit.getReviewCertificates(pageNum,rowNum,name)
        console.log(ZzzsList)
        if(ZzzsList){
            this.setState({
                ZzzsList:ZzzsList.data,
                Zzzspaginations: {search:(value)=>{this.ZzzsSearch(value)}, showTotal:()=>`共${ZzzsList.data.recordsTotal}条`, onChange: (page, num) => { this.ZzzspageChange(page, num) }, showQuickJumper: true, total: ZzzsList.data.recordsTotal, pageSize: 10 }

            })
        }
        
    }
          //复审专家load分页查询
          async ZJpageChange(page, num) {
            this.loadZJ(page, num)
        }
        //复审专家搜索
        async ZJSearch(value){
            this.loadZJ(1, 10,value)
        }
        //加载复审专家
        async loadZJ(pageNum = 1, rowNum = 10,zjName){
           let params = {
                pageNum,
                rowNum,
                zjName
            }
            let specialist = await supYearAudit.getAuditSpecial(params)
            console.log(specialist)
            if(specialist){
                this.setState({
                    specialist:specialist.data,
                    ZJpaginations: {search:(value)=>{this.ZJSearch(value)}, showTotal:()=>`共${specialist.data.recordsTotal}条`, onChange: (page, num) => { this.ZJpageChange(page, num) }, showQuickJumper: true, total: specialist.data.recordsTotal, pageSize: 10 }
    
                })
            }
            
        }
    async componentDidMount(){
       this.loadFsPlan()
       this.loadZzzs()
        //选择复审计划model
       let listModelOption={
        model:SHOW_ChooseListModel_MODEL,
        title:'选择复审计划',
        type:'radio',
        columns:[
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '复审计划名称',
                dataIndex: 'annualauditName',
                width: 200,
                align: "center",
               // render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.getAnnualExaminationDetail(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '复审计划类型',
                dataIndex: 'annualauditType',
                width: 100,
                align: "center",
            },
            {
                title: '申请人',
                dataIndex: 'annualauditCreateUser',
                width: 100,
                align: "center",
            },

            {
                title: '复审地点',
                dataIndex: 'annualauditAddress',
                width: 120,
                align: "center",
            },
            {
                title: '复审机构',
                dataIndex: 'annualauditOrg',
                width: 150,
                align: "center",
            },
            {
                title: '复审时间',
                dataIndex: 'annualauditDate',
                width: 120,
                align: "center",
            },
          
        ]
    }
        //选择复审计划下的供应商model
        let gyslistModelOption={
            model:SHOW_ChooseTrainPlan_MODEL,
            title:'选择复审计划下的供应商',
            type:'checkbox',
            columns:[
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
                    align: "center",
                },
                {
                    title: '供应商编号',
                    dataIndex: 'code',
                },
                {
                    title: '产品范围',
                    dataIndex: 'business_scope',
                },
            ],      
        }
    //选择复审证书model
    let cerlistModelOption={
        model:SHOW_Certificate_MODEL,
        title:'选择复审证书',
        type:'radio',
        columns:[
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
            },
            {
                title: '证书类型',
                dataIndex: 'type',
            },
            {
                title: '发证机构',
                dataIndex: 'org',
            },
            {
                title: '有效期限',
                dataIndex: 'toTime',
            },
        ],      
    }
      //选择复审专家model
      let speciallistModelOption={
        model:SHOW_ChooseSpecialist_MODEL,
        title:'选择复审专家',
        type:'checkbox',
        columns: [
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
              //  render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
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
                title: '专家来源',
                dataIndex: 'source',
            },
          
          
        ]
    }
    this.setState({
        listModelOption,
        cerlistModelOption,
        gyslistModelOption,
        speciallistModelOption
    })
        let options = {
            pageNum:1,
            rowNum:20
        }
        let specialist = await supYearAudit.getAuditSpecial(options)
        console.log(specialist)
        if(specialist){
            this.setState({
                specialist:specialist.data
            })
        }
        
    }
    render() {
        const { toggleStore } = this.props;
        const { getFieldDecorator } = this.props.form;
        const {BzyqData,PjzjData,AccessSupData,ReferData,SQList,GysList,ZzzsList,specialist,listModelOption,cerlistModelOption,paginations,ZJpaginations,Zzzspaginations,speciallistModelOption,fsGyspaginations,gyslistModelOption } =  this.state

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
            {
                title: '操作',
                dataIndex: 'cz',
                render: (text, redord, key) => {
                    return (<div> <Button type="danger" onClick={() => { this.deleteBZYQ(key) }} size={'small'}>删除</Button></div>)
                }
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
                dataIndex: 'typename',
            },
            {
                title: '专业领域',
                dataIndex: 'field',
            },
            {
                title: '专家来源',
                dataIndex: 'source',
            },
            {
                title: '操作',
                dataIndex: 'cz',
                render: (text,record) =>   <Button type="danger"  onClick={() => { this.deleteSpecialist(record) }} >删除</Button>
            },
          
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
                dataIndex: 'name',
                align: "center",
         
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 20)}</span></Tooltip>
            },
            {
                title: '供应商社会信用代码',
                dataIndex: 'code',
            },
            {
                title: '产品范围',
                dataIndex: 'business_scope',
            },
          
            {
                title: '准入证书',
                dataIndex: 'certificatename',
            },
            {
                title: '证书类型',
                dataIndex: 'type',
            },
            {
                title: '发证日期',
                dataIndex: 'create_time',
            },
            {
                title: '有效期',
                dataIndex: 'totime',
            },
            {
                title: '操作',
                dataIndex: 'cz',
                align: "center",
                fixed:'right',
                width:150,
                render: (text,record) =>  { 
                    return ( <div><Button type="danger" size={'small'}  onClick={() => { this.deleteAccessSupplierInfo(record) }} >删除</Button> <Button type="primary" size={'small'} onClick={ev=>{this.addZzzs(record)}}  >添加证书</Button></div>
                    )}
            },
          
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
                dataIndex: 'name',
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 20)}</span></Tooltip>
            },
            {
                title: '供应商编号',
                dataIndex: 'code',
            },
            {
                title: '产品范围',
                dataIndex: 'business_scope',
            },
            {
                title: '原因说明',
                dataIndex: 'description',
                render: (text,record) =>  { 
                    return (
                         <div>
                             <Input  onChange={ev=>{this.setDescription(record.id,ev.target.value)}} />
                         </div>
                    )}
            },
            {
                title: '操作',
                dataIndex: 'cz',
                fixed:'right',
                render: (text,record) =>  { 
                    return ( <div><Button type="danger" size={'small'}  onClick={() => { this.deleteReferSupplierInfo(record) }} >删除</Button> 
                    {/* <Button type="primary" size={'small'}  onClick={() => {  }} >添加证书</Button> */}
                    </div>
                    )}
            },
          
        ]

        return (
            <div>
                <Modal
                    title="新建复审实施记录"
                    width={960}
                    visible={toggleStore.toggles.get(SHOW_PJSSJL_MODEL)}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                >
                    <Tabs defaultActiveKey="1" size={'large'}>
                        <TabPane tab="复审信息" key="1">
                            <Form className="ant-advanced-search-form" onSubmit={(e) => {this.handleSubmit(e) }}>

                                <Card bordered={false} className="new_supplier_form">
                                    <Row gutter={24}>
                                        <Col span={24}>
                                        
                                            <Col span={12} >
                                                <Form.Item {...formItemLayout} label={'复审名称'}>
                                                    {getFieldDecorator(`annualauditName`, {
                                                        initValue: "复审名称",
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message: '复审名称',
                                                            },
                                                        ],
                                                    })(<Input />)}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'复审计划'}>
                                            {getFieldDecorator(`reviewName`, {
                                                
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '复审计划',
                                                    },
                                                ],
                                            })(<Input disabled={true} addonAfter={<Icon style={{ cursor: 'pointer' }} onClick={() => {  toggleStore.setToggle(SHOW_ChooseListModel_MODEL) }} type="plus" />} />)}
                                        </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                                <Form.Item {...formItemLayout} label={'认证机构'}>
                                                    {getFieldDecorator(`annualauditOrg`, {
                                                        rules: [
                                                            {
                                                                required: false,
                                                                message: '认证机构',
                                                            },
                                                        ],
                                                    })(<Input />)}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                                <Form.Item {...formItemLayout} label="复审时间">
                                                        {getFieldDecorator('date', {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message: '复审时间',
                                                            },
                                                        ],
                                                    })(<DatePicker format={`YYYY-MM-DD`}  style={{width:'100%'}} />)}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                                <Form.Item {...formItemLayout} label={'复审地点'}>
                                                    {getFieldDecorator(`annualauditAddress`)(<Input />)}
                                                </Form.Item>
                                            </Col>
                                        </Col>
                                    </Row>
                                </Card>
                                <Card bordered={false} title={<b>标准要求</b>} extra={
                                    <Button type="primary" onClick={() => {
                                        toggleStore.setToggle(SHOW_NewBZYQ_MODEL)
                                    }}>
                                        新增
                                    </Button>
                                } className="new_supplier_producelist">
                                    <Row>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => key} columns={Bzyqcolumns} dataSource={BzyqData} />
                                        </Col>
                                    </Row>
                                </Card>
                                <Card bordered={false} title={<b>复审专家</b>} extra={
                                    <Button type="primary"
                                    onClick={() => {
                                        toggleStore.setToggle(SHOW_ChooseSpecialist_MODEL)
                                    }}
                                    >
                                        新增
                                    </Button>
                                } className="new_supplier_producelist">
                                    <Row>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => key} columns={Pjzjcolumns} dataSource={PjzjData} />
                                        </Col>
                                    </Row>
                                </Card>
                            </Form>
                        </TabPane>
                        <TabPane tab="供应商" key="2">
                            <Card bordered={false} title={<b>已通过供应商</b>} extra={
                                <Button type="primary"  onClick={() => {
                                    this.chooseSupType('access')
                                    toggleStore.setToggle(SHOW_ChooseTrainPlan_MODEL)
                                }}>
                                    新增
                                    </Button>
                            } className="new_supplier_producelist">
                                <Row>
                                    <Col span={24}>
                                        <Table rowKey={(text, key) => key} scroll={{x:1000}} columns={AccessSupcolumns} dataSource={AccessSupData} />
                                    </Col>
                                </Row>
                            </Card>
                            <Card bordered={false} title={<b>未通过供应商</b>} extra={
                                <Button type="primary"
                                onClick={() => {
                                    this.chooseSupType('refer')
                                    toggleStore.setToggle(SHOW_ChooseTrainPlan_MODEL)
                                }}
                                >
                                    新增
                                    </Button>
                            } className="new_supplier_producelist">
                                <Row>
                                    <Col span={24}>
                                        <Table rowKey={(text, key) => key} scroll={{x:1000}} columns={ReferSupcolumns} dataSource={ReferData} />
                                    </Col>
                                </Row>
                            </Card>
                        </TabPane>
                    </Tabs>
                </Modal>
                {/* 选择复审计划 */}
                 {
                    toggleStore.toggles.get(SHOW_ChooseListModel_MODEL)&&<ChooseListModel list={SQList} pagination={paginations} options={listModelOption} chooseFinishFn={(val)=>{this.chooseFsPlan(val)}} />
                }
                   {/* 选择计划下的供应商 */}
                   {
                    toggleStore.toggles.get(SHOW_ChooseTrainPlan_MODEL)&&<ChooseListModel list={GysList} pagination={fsGyspaginations} options={gyslistModelOption} comparedList={[...AccessSupData,...ReferData]} chooseFinishFn={(val)=>{this.chooseGysFn(val)}} />
                }
                  {/* 选择证书 */}
                {
                    toggleStore.toggles.get(SHOW_Certificate_MODEL)&&<ChooseListModel list={ZzzsList} pagination={Zzzspaginations} options={cerlistModelOption}  chooseFinishFn={(val)=>{this.chooseZzzsFn(val)}} />
                }
                 {/* 选择专家 */}

                 {
                    toggleStore.toggles.get(SHOW_ChooseSpecialist_MODEL)&&<ChooseListModel list={specialist} pagination={ZJpaginations} options={speciallistModelOption} comparedList={PjzjData} chooseFinishFn={(val)=>{this.chooseSpecialistFn(val)}} />
                }
                  {
                    toggleStore.toggles.get(SHOW_NewBZYQ_MODEL)&&<NewBZYQ addBZYQFn={(obj)=>{this.addBZYQFn(obj)}} />
                }
            </div>
        );
    }
}

export default Form.create({ name: 'NewZzss' })(NewssModel);;