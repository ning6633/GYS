import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, DatePicker, Icon, Button, message, Tooltip } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_PJSSJL_MODEL,SHOW_NewBZYQ_MODEL,SHOW_Certificate_MODEL  ,SHOW_ChooseSpecialist_MODEL ,SHOW_ChooseListModel_MODEL } from "../../../../constants/toggleTypes"
import NewBZYQ from "../NewBZYQ"
import _ from "lodash";
// 公用选择供应商组件
import ChooseSupplier from "../../../../components/ChooseSupplier"
import ChooseSpecialist from "../../../../components/ChooseSpecialist"
import { supplierAction,specialAction,supplierEvalution,supplierAccepted } from "../../../../actions"
import  ChooseListModel from '../../../../components/ChooseListModel'
const { TabPane } = Tabs;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class NewPjrdssModel extends React.Component {
    constructor(){
        super()
        this.setDescription=  _.debounce(this.setDescription, 200)
    }
    state={
        BzyqData:[],
        PjzjData:[],
        AccessSupData:[],
        ReferData:[],
        SQList:[],
        isAccess:true,
        listModelOption:{},
        cerlistModelOption:{},
        paginations:{},
        Zrzspaginations:{},
        currentApplyId:null
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_PJSSJL_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore,newSSHandle } = this.props;
        const  {BzyqData,PjzjData,AccessSupData,ReferData} = this.state 
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let AttachData  = {
                    // BzyqData,
                    // PjzjData,
                    // AccessSupData,
                    // ReferData
                    "evaluateDate": values.evaluateDate.format('YYYY-MM-DD'),
                    "evaluateOrg": values.evaluateOrg,
                    "evaluatePlace": values.evaluatePlace,
                    "name": values.name,
                    "applyNoPassList": ReferData,
                    "applyPassList": AccessSupData,
                    "zjList": PjzjData,
                    "zrNeedList": BzyqData
                }
                console.log(AttachData)
              newSSHandle(AttachData)
            
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
   addZrzs(record){
    const { toggleStore } = this.props;
    toggleStore.setToggle(SHOW_Certificate_MODEL)
    this.setState({
        currentApplyId:record.id
    })
  }

  chooseSpecialistFn(data){
    let newData = JSON.parse(JSON.stringify(data).replace(/id/g,"zjId"));
    console.log(newData)
    const {PjzjData } = this.state
    PjzjData.push(newData)
    this.setState({
        PjzjData
        })
  }
    //选择资质证书fn
    chooseZrzsFn(data){
        console.log(data)
        const { currentApplyId , AccessSupData} = this.state
        let ZrzsObj = data[0]
        console.log(AccessSupData)
        AccessSupData.forEach(item=>{
            if(item.id==currentApplyId){
              item['certificatename'] = ZrzsObj.name
              item['type'] = ZrzsObj.type
              item['create_time'] = ZrzsObj.createTime
              item['totime'] = ZrzsObj.toTime
              item['zrCertId'] = ZrzsObj.id
            }
        })
  
    }
    // chooseZzApplyFn(data){
    //     console.log(data)
    //     let newData = JSON.parse(JSON.stringify(data).replace(/id/g,"applyId"));
    //     console.log(newData)
    //     const { AccessSupData,ReferData,isType } = this.state
    //     newData.forEach(item=>{
    //         if(isType=='access'){
    //             item['pass'] = '1'
    //             AccessSupData.push(item)
    //             this.setState({
    //                 AccessSupData
    //                 })
    //         }else{
    //             item['pass'] = '2'
    //             ReferData.push(item)
    //             this.setState({
    //                 ReferData
    //                 })
    //         }
    //     })
       
    // }
      //选择资质申请fn
      chooseZzApplyFn(data){
        const { AccessSupData,ReferData,isType } = this.state
        console.log(data)
        data.forEach(item=>{
            if(isType=='access'){
                item['isPass'] = '1'
                item['applyId'] = item.id
                item['zrCertId'] = item.zrCertId
             
                AccessSupData.push(item)
                this.setState({
                    AccessSupData
                    })
            }else{
                item['isPass'] = '0'
                item['applyId'] = item.id
                item['reason'] = item.reason
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
                  item['reason'] = value
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
       //资质证书load分页查询
       async ZrzspageChange(page, num) {
        this.loadZrzs(page, num)
    }
    //资质证书搜索
    async ZrzsSearch(value){
        this.loadZrzs(1, 10,value)
    }
    //加载资质证书
    async loadZrzs(pageNum = 1, rowNum = 10,keyword){
        let params={
            keyword
        }
        let ZrzsList = await supplierAccepted.getZrCertificate(pageNum,rowNum,params)
        console.log(ZrzsList)
        if(ZrzsList){
            this.setState({
                ZrzsList:ZrzsList.data,
                Zrzspaginations: {search:(value)=>{this.ZrzsSearch(value)}, showTotal:()=>`共${ZrzsList.data.recordsTotal}条`, onChange: (page, num) => { this.ZrzspageChange(page, num) }, showQuickJumper: true, total: ZrzsList.data.recordsTotal, pageSize: 10 }

            })
        }
        
    }



    //资质准入认定申请load分页查询
    async PjrdzrpageChange(page, num) {
        this.loadPjrdzrApply(page, num)
    }
    //资质准入认定搜索
      async PjrdzrSearch(value){
        this.loadPjrdzrApply(1, 10,value)
    }
    //加载资质准入认定申请
    async loadPjrdzrApply(pageNum = 1, rowNum = 10,keyword){
        let supplierList = await supplierAccepted.getPjrdzrApply4Pass(pageNum,rowNum,keyword)
        console.log(supplierList)
        if(supplierList){
            this.setState({
                SQList:{
                    list:supplierList.data.applyVOs,
                    recordsTotal:supplierList.data.recordsTotal
                },
                paginations: {search:(value)=>{this.PjrdzrSearch(value)}, showTotal:()=>`共${supplierList.data.recordsTotal}条`, onChange: (page, num) => { this.PjrdzrpageChange(page, num) }, showQuickJumper: true, total: supplierList.data.recordsTotal, pageSize: 10 }
            })
        }
    }
    async componentDidMount(){
      this.loadPjrdzrApply()
      this.loadZrzs()
        let listModelOption={
            model:SHOW_ChooseListModel_MODEL,
            type:'checkbox',
            title:'选择供应商',
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
                    width: 60,
                    align: "center",
                },
                {
                    title: '产品类别',
                    dataIndex: 'productType',
                },
                {
                    title: '重要程度',
                    dataIndex: 'importLevel',
                }
               
            ]
        }
    
         //选择准入证书model
    let cerlistModelOption={
        model:SHOW_Certificate_MODEL,
        title:'选择准入证书',
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
    this.setState({
        listModelOption,
        cerlistModelOption
    })
        //获取专家列表
        let options = {
            usertype:101,
            pageNum:1,
            rowNum:10
        }

        let specialist = await specialAction.getSpecialist(options)
        console.log(specialist)
        if(specialist){
            this.setState({
                specialist:specialist.listZzpjSpecialistVO
            })
        }
        let userInfo = await supplierEvalution.getUserInfo()
        if(userInfo.code==200){
            const { setFieldsValue } = this.props.form
            setFieldsValue({
                evaluateOrg:userInfo.data[0].departmentname
            })
        }
    }
    render() {
        const { toggleStore } = this.props;
        const { getFieldDecorator } = this.props.form;
        const {BzyqData,PjzjData,AccessSupData,ReferData,SQList,ZrzsList ,specialist,cerlistModelOption,listModelOption,paginations,Zrzspaginations} =  this.state
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
                dataIndex: 'gysName',
                align: "center",
         
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
                    return ( <div><Button type="danger" size={'small'}  onClick={() => { this.deleteAccessSupplierInfo(record) }} >删除</Button> <Button type="primary" size={'small'} onClick={ev=>{this.addZrzs(record)}}  >添加证书</Button></div>
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
                title: '资质等级',
                dataIndex: 'importLevel',
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
                    title="新建评价认定实施记录"
                    width={960}
                    visible={toggleStore.toggles.get(SHOW_PJSSJL_MODEL)}
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
                                                <Form.Item {...formItemLayout} label={'评价认定名称'}>
                                                    {getFieldDecorator(`name`, {
                                                        initValue: "评价认定名称",
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message: '评价认定名称',
                                                            },
                                                        ],
                                                    })(<Input />)}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                                <Form.Item {...formItemLayout} label={'评价认定机构'}>
                                                    {getFieldDecorator(`evaluateOrg`, {
                                                        rules: [
                                                            {
                                                                required: false,
                                                                message: '评价认定机构',
                                                            },
                                                        ],
                                                    })(<Input disabled={true} />)}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                                <Form.Item {...formItemLayout} label="评价时间">
                                                        {getFieldDecorator(`evaluateDate`, {
                                                        rules: [
                                                            {
                                                                required: true,
                                                                message: '评价时间',
                                                            },
                                                        ],
                                                    })(<DatePicker format={`YYYY-MM-DD`}  style={{width:'100%'}} />)}
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} >
                                                <Form.Item {...formItemLayout} label={'评价地点'}>
                                                    {getFieldDecorator(`evaluatePlace`)(<Input />)}
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
                                <Card bordered={false} title={<b>评价专家</b>} extra={
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
                                    toggleStore.setToggle(SHOW_ChooseListModel_MODEL)
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
                                    toggleStore.setToggle(SHOW_ChooseListModel_MODEL)
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
                {/* 选择供应商 */}
                {
                    toggleStore.toggles.get(SHOW_ChooseListModel_MODEL)&&<ChooseListModel list={SQList} pagination={paginations} options={listModelOption} comparedList={[...AccessSupData,...ReferData]} chooseFinishFn={(val)=>{this.chooseZzApplyFn(val)}} />
                }
                  {/* 选择证书 */}
                {
                    toggleStore.toggles.get(SHOW_Certificate_MODEL)&&<ChooseListModel list={ZrzsList} pagination={Zrzspaginations} options={cerlistModelOption}  chooseFinishFn={(val)=>{this.chooseZrzsFn(val)}} />
                }
                 {/* 选择专家 */}
                  {
                    toggleStore.toggles.get(SHOW_ChooseSpecialist_MODEL)&&<ChooseSpecialist specialist={specialist}  chooseSpecialistFn={(val)=>{this.chooseSpecialistFn(val)}} />
                }
                  {
                    toggleStore.toggles.get(SHOW_NewBZYQ_MODEL)&&<NewBZYQ addBZYQFn={(obj)=>{this.addBZYQFn(obj)}} />
                }
            </div>
        );
    }
}

export default Form.create({ name: 'NewPjrdssModel' })(NewPjrdssModel);;