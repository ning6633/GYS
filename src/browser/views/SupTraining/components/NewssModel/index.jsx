import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, DatePicker, Icon, Button, message, Tooltip,Checkbox ,Radio} from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_PJSSJL_MODEL,SHOW_ChooseTrainPlan_MODEL,SHOW_Certificate_MODEL ,SHOW_ChooseSpecialist_MODEL ,SHOW_ChooseListModel_MODEL } from "../../../../constants/toggleTypes"
import NewBZYQ from "../NewBZYQ"
import _ from "lodash";
// 公用选择供应商组件
import ChooseSupplier from "../../../../components/ChooseSupplier"
import ChooseSpecialist from "../../../../components/ChooseSpecialist"
import { supplierTrain,specialAction,supplierEvalution, } from "../../../../actions"
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
        PxzsData:[],
        pxmemberData:[],
        PxGysData:[],
        ReferData:[],
        SQList:{},
        PxzsList:{},
        isAccess:true,
        listModelOption:{},
        cerlistModelOption:{},
        paginations:{},
        PlanList:[],
        Pxzspaginations:{},
        currentApplyId:null,
        trainPlanBody:{}
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_PJSSJL_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore,newSSHandle } = this.props;
        const  {PxzsData,pxmemberData,PxGysData,trainPlanBody} = this.state 
        this.props.form.validateFields(async (err, values) => {
            console.log(values)
            if (!err) {
                let AttachData  = {
                    PxzsData,
                    pxmemberData,
                    PxGysData,
                }
            console.log(AttachData)
            values['trainTypeId'] = trainPlanBody.trainTypeId
            values['trainid'] = trainPlanBody.id
         newSSHandle(values,AttachData)
            
            }
        });
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_PJSSJL_MODEL)
    };
  
  //参训人员通过不通过
  onChange(event,record){
      console.log(event)
    const {pxmemberData} =this.state
    pxmemberData.forEach(item=>{
        if(item.id==record.id){
            item['status'] = event.target.value
        }
    })
    this.setState({
        pxmemberData
    })
  }
 
  //选择培训计划
  addTrainPlan(){
    const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ChooseTrainPlan_MODEL)
  }
  //添加证书
  addPxzs(record){
    const { toggleStore } = this.props;
    toggleStore.setToggle(SHOW_Certificate_MODEL)
    this.setState({
        currentApplyId:record.id
    })
  }

  //添加参训人员
  chooseSpecialistFn(data){
    const {pxmemberData } = this.state
    pxmemberData.push(data)
    this.setState({
        pxmemberData
        })
  }
  //选择培训证书fn
  choosePxzsFn(data){
      console.log(data)
      const { currentApplyId , PxzsData} = this.state
      data.forEach(item=>{
        PxzsData.push(item)

      })
      console.log(PxzsData)
      this.setState({
        PxzsData
      })
    //   PxGysData.forEach(item=>{
    //       if(item.id==currentApplyId){
    //         item['certificatename'] = PxzsObj.certificatename
    //         item['type'] = PxzsObj.type
    //         item['create_time'] = PxzsObj.create_time
    //         item['totime'] = PxzsObj.totime
    //         item['certificateid'] = PxzsObj.certificateid
    //       }
    //   })

  }
  //选择培训申请fn
    choosePxApplyFn(data){
        const { PxGysData,ReferData,isType } = this.state
        console.log(data)
        data.forEach(item=>{
            PxGysData.push(item)
           this.getTrainPeople(item.id)
        })
        this.setState({
            PxGysData
            })
       
       
    }
    //选择培训计划
    choosePxPlanFn(data){
          console.log(data)
          if(data.length>0){
              let obj = data[0]
              const { setFieldsValue } = this.props.form;
              setFieldsValue({
                ...obj,
                trainPlace:obj.trainPlace,
                trainname:obj.trainPlanName,
                trainteacher:this.converSpeacialName(obj.trainPlanExpertList)
              })
           this.setState({
            trainPlanBody:obj
           })
          }
    }
    converSpeacialName(arr){
        let _arr = []
        arr.forEach(item=>{
            _arr.push(item.expertName)
        })
        return _arr.join(',')
    }
    //添加未通过供应商原因说明
    setDescription(id,value){
        console.log(id,value)
        const {  ReferData} = this.state
        ReferData.forEach(item=>{
            if(item.id==id){
              item['deception'] = value
            }
        })
        this.setState({
            ReferData
        })
    }
    //移除已经添加的证书
    deletePxzs(value){
        const { PxzsData } = this.state
        let ind = _.findIndex(PxzsData, { id: value.id })
        PxzsData.splice(ind,1)
        this.setState({
            PxzsData
        })
    }
    //移除已通过供应商
    deleteGYSApply(value){
        const { PxGysData,pxmemberData } = this.state
        let ind = _.findIndex(PxGysData, { id: value.id })
        PxGysData.splice(ind,1)
        let filterData =  pxmemberData.filter(people=>{
             return value.id!=people.gystrainapply_id
        })
        this.setState({
            PxGysData,
            pxmemberData:filterData
        })
    }
    //移除参训人员
    deletePxmenmber(value){
        const { pxmemberData } = this.state
        let ind = _.findIndex(pxmemberData, { id: value.id })
        pxmemberData.splice(ind,1)
        this.setState({
            pxmemberData
        })
    }
     
     //培训计划load分页查询
     async trainPlanpageChange(page, num) {
        this.loadtrainPlan(page, num)
    }
    //培训计划搜索
    async trainPlanSearch(value){
        this.loadtrainPlan(1, 10,value)
    }
    //培训计划申请
    async loadtrainPlan(pageNum = 1, rowNum = 10,trainPlanName){
        let params = {
            trainPlanName:trainPlanName||''
        }
        let PlainList = await supplierTrain.gysTrainPlanInfosArgswss(pageNum,rowNum,params)
        console.log(PlainList)
        if(PlainList){
            this.setState({
                planList:PlainList,
                paginations: {search:(value)=>{this.trainPlanSearch(value)}, showTotal:()=>`共${PlainList.recordsTotal}条`, onChange: (page, num) => { this.trainPlanpageChange(page, num) }, showQuickJumper: true, total: PlainList.recordsTotal, pageSize: 10 }

            })
        }
    }
    //通过申请获取参训人员
    async getTrainPeople(applyid){
        const { pxmemberData } = this.state
         let result = await supplierTrain.getPxPeopleByApply(applyid)
         console.log(result)
         if(result.code==200){
             result.data.forEach(item=>{
                item.status='1'
                pxmemberData.push(item)
             })
             this.setState({
                pxmemberData
             })
         }
    }

    //培训申请load分页查询
    async PxpageChange(page, num) {
        this.loadPxApply(page, num)
    }
    //培训申请搜索
    async PxSearch(value){
        this.loadPxApply(1, 10,value)
    }
    //加载培训申请
    async loadPxApply(pageNum = 1, rowNum = 10,keyword){
        const  { trainPlanBody } = this.state
     console.log(trainPlanBody)
     let trainplanid = trainPlanBody.id
     if(!trainplanid){
         message.warning('先选择培训计划')
         return
     }
        let supplierList = await supplierTrain.getPxApplyByTrainPlan(pageNum,rowNum,trainplanid,keyword)
        console.log(supplierList)
        if(supplierList){
            this.setState({
                SQList:supplierList.data,
                paginations: {search:(value)=>{this.PxSearch(value)}, showTotal:()=>`共${supplierList.data.recordsTotal}条`, onChange: (page, num) => { this.PxpageChange(page, num) }, showQuickJumper: true, total: supplierList.data.recordsTotal, pageSize: 10 }

            })
        }
    }

      //培训证书load分页查询
      async PxzspageChange(page, num) {
        this.loadPxzs(page, num)
    }
    //培训证书搜索
    async PxzsSearch(value){
        this.loadPxzs(1, 10,value)
    }
    //加载培训证书
    async loadPxzs(pageNum = 1, rowNum = 10,name){
        let params={
            name
        }
        let PxzsList = await supplierTrain.getTrainCertificateAll(pageNum,rowNum,params)
        console.log(PxzsList)
        if(PxzsList){
            this.setState({
                PxzsList:PxzsList.data,
                Pxzspaginations: {search:(value)=>{this.PxzsSearch(value)}, showTotal:()=>`共${PxzsList.data.recordsTotal}条`, onChange: (page, num) => { this.PxzspageChange(page, num) }, showQuickJumper: true, total: PxzsList.data.recordsTotal, pageSize: 10 }

            })
        }
        
    }
    async componentDidMount(){
    
   
       this.loadtrainPlan()
        //选择培训计划model
        let planlistModelOption={
            model:SHOW_ChooseTrainPlan_MODEL,
            title:'选择培训计划',
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
                    title: '培训计划名称',
                    dataIndex: 'trainPlanName',
                    align: "center",
                
                },
                {
                    title: '培训类型',
                    dataIndex: 'trainTypeName',
                    render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 20)}</span></Tooltip>
                },
                {
                    title: '培训地点',
                    dataIndex: 'trainPlace',
                },
                {
                    title: '培训班次',
                    dataIndex: 'trainShift',
                },
                {
                    title: '发起人',
                    dataIndex: 'createUser',
                },
              
            ],      
        }

        //选择培训申请model
       let listModelOption={
        model:SHOW_ChooseListModel_MODEL,
        title:'选择培训申请',
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
                title: '供应商名称',
                dataIndex: 'gysname',
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 20)}</span></Tooltip>
            },
            {
                title: '培训申请名称',
                dataIndex: 'apply',
                align: "center",
                render: (text, redord) => <span style={{ cursor: "pointer", 'color': '#3383da' }}>{`航天培训申请-${redord.trainplanname}` }</span>
            },
            {
                title: '供应商社会信用代码',
                dataIndex: 'code',
            },
          
        ],      
    }
    //选择培训证书model
    let cerlistModelOption={
        model:SHOW_Certificate_MODEL,
        title:'选择培训证书',
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
                dataIndex: 'authoritied_orgname',
            },
            {
                title: '有效期限',
                dataIndex: 'expiry_months',
            },
        ],      
    }
    this.setState({
        listModelOption,
        cerlistModelOption,
        planlistModelOption
    })
        // let options = {
        //     pageNum:1,
        //     rowNum:20
        // }
        // let specialist = await specialAction.getSpecialist(options)
        // console.log(specialist)
        // if(specialist){
        //     this.setState({
        //         specialist:specialist.listPxSpecialistVO
        //     })
        // }
        let userInfo = await supplierEvalution.getUserInfo()
        if(userInfo.code==200){
            const { setFieldsValue } = this.props.form
            setFieldsValue({
                sponsor:userInfo.data[0].departmentname
            })
        }
    }
    render() {
        const { toggleStore } = this.props;
        const { getFieldDecorator } = this.props.form;
        const {PxzsData,pxmemberData,PxGysData,planlistModelOption,SQList,PxzsList,planList,listModelOption,cerlistModelOption,paginations,Pxzspaginations } =  this.state

        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const trainApplycolumns = [
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
            // {
            //     title: '培训计划',
            //     dataIndex: 'trainplanname',
            // },
            // {
            //     title: '培训类型',
            //     dataIndex: 'traintypename',
            // },
            {
                title: '社会信用代码',
                dataIndex: 'code',
            },
            {
                title: '操作',
                dataIndex: 'cz',
                render: (text, redord, key) => {
                    return (<div> <Button type="danger" onClick={() => { this.deleteGYSApply(redord) }} size={'small'}>删除</Button></div>)
                }
            },
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
         
            {
                title: '操作',
                dataIndex: 'cz',
                render: (text, redord, key) => {
                    return (<div> <Button type="danger" onClick={() => { this.deletePxzs(redord) }} size={'small'}>删除</Button></div>)
                }
            },
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
                dataIndex: 'pass',
                render: (text,record) =>   <Radio.Group onChange={ev =>this.onChange(ev,record)} value={record.status}>
                <Radio value={'0'}>未通过</Radio>
                <Radio value={'1'}>通过</Radio>
              
              </Radio.Group>
                
                
            // <Checkbox onChange={ev =>this.onChange(ev,record)}>是否通过</Checkbox>
                
             
            },
            // {
            //     title: '操作',
            //     dataIndex: 'cz',
            //     render: (text,record) =>   <Button type="danger"  onClick={() => { this.deletePxmenmber(record) }} >删除</Button>
            // },
          
        ]
   

        let TrainApplyTableOpterta = () => (
            <div className="table-operations">
               <b style={{marginRight:20}}>参训单位</b>
                <Button type="primary"
                 onClick={() => {
                    this.loadPxApply()
                    toggleStore.setToggle(SHOW_ChooseListModel_MODEL)}}>新增</Button>
            </div>
        )
        let TrainCerTableOpterta = () => (
            <div className="table-operations">
               <b style={{marginRight:20}}>培训证书</b>
                <Button type="primary"
                 onClick={() => {
                    this.loadPxzs()
                    toggleStore.setToggle(SHOW_Certificate_MODEL)}}>新增</Button>
            </div>
        )
        //参训人员表格事件
        let PeopleTableOpterta = () => (
            <div className="table-operations">
               <b style={{marginRight:20}}>参训人员</b>
                <Button type="primary"
                 onClick={() => {
                  toggleStore.setToggle(SHOW_ChooseListModel_MODEL)}}>新增</Button>
                 <Button type="danger"  >删除</Button>
            </div>
        )
        return (
            <div>
                <Modal
                    title="新建培训实施记录"
                    width={960}
                    visible={toggleStore.toggles.get(SHOW_PJSSJL_MODEL)}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                >
               
                            <Form className="ant-advanced-search-form" onSubmit={(e) => {this.handleSubmit(e) }}>

                                <Card bordered={false} className="new_supplier_form">
                                    <Row gutter={24}>
                                        <Col span={24}>
                                            <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'培训计划'}>
                                            {getFieldDecorator(`trainPlanName`, {
                                                
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '培训计划',
                                                    },
                                                ],
                                            })(<Input disabled={true} addonAfter={<Icon style={{ cursor: 'pointer' }} onClick={() => {  toggleStore.setToggle(SHOW_ChooseTrainPlan_MODEL) }} type="plus" />} />)}
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
                                                <Form.Item {...formItemLayout} label="培训班次">
                                                        {getFieldDecorator('trainShift', {
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
                                                    {getFieldDecorator(`trainteacher`)(<Input  />)}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                                <Form.Item {...formItemLayout} label={'培训课时'}>
                                                    {getFieldDecorator(`trainhour`)(<Input />)}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                                <Form.Item {...formItemLayout} label={'培训地点'}>
                                                    {getFieldDecorator(`trainPlace`)(<Input />)}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                                <Form.Item {...formItemLayout} label={'主办单位'}>
                                                    {getFieldDecorator(`sponsor`)(<Input />)}
                                                </Form.Item>
                                            </Col>
                                        </Col>
                                    </Row>
                                </Card>
                                <Card bordered={false} title={<TrainApplyTableOpterta />} className="new_supplier_producelist">
                                    <Row>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => key} columns={trainApplycolumns} dataSource={PxGysData} />
                                        </Col>
                                    </Row>
                                </Card>
                                <Card bordered={false} title={<TrainCerTableOpterta />} className="new_supplier_producelist">
                                    <Row>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => key} columns={trainCerscolumns} dataSource={PxzsData} />
                                        </Col>
                                    </Row>
                                </Card>
                                <Card bordered={false} title={<PeopleTableOpterta />}  className="new_supplier_producelist">
                                    <Row>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => key} columns={memberColumns} dataSource={pxmemberData} />
                                        </Col>
                                    </Row>
                                </Card>
                            </Form>
                 
                          
                    
                </Modal>
                {/* 选择培训计划 */}
                {
                    toggleStore.toggles.get(SHOW_ChooseTrainPlan_MODEL)&&<ChooseListModel list={planList} pagination={paginations} options={planlistModelOption} comparedList={[...PxGysData]} chooseFinishFn={(val)=>{this.choosePxPlanFn(val)}} />
                }
                {/* 选择申请 */}
                {
                    toggleStore.toggles.get(SHOW_ChooseListModel_MODEL)&&<ChooseListModel list={SQList} pagination={paginations} options={listModelOption} comparedList={[...PxGysData]} chooseFinishFn={(val)=>{this.choosePxApplyFn(val)}} />
                }
                  {/* 选择证书 */}
                {
                    toggleStore.toggles.get(SHOW_Certificate_MODEL)&&<ChooseListModel list={PxzsList} pagination={Pxzspaginations} options={cerlistModelOption}  comparedList={[...PxzsData]} chooseFinishFn={(val)=>{this.choosePxzsFn(val)}} />
                }
                {/* {
                    toggleStore.toggles.get(SHOW_ChooseSpecialist_MODEL)&&<ChooseSpecialist specialist={specialist}  chooseSpecialistFn={(val)=>{this.chooseSpecialistFn(val)}} />
                } */}
                 
            </div>
        );
    }
}

export default Form.create({ name: 'NewZzss' })(NewssModel);;