import React, { Component, Fragment } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, DatePicker, Radio, Button, message, Tooltip, Icon, Upload, TreeSelect, InputNumber, Steps } from 'antd';
import { observer, inject, } from 'mobx-react';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import './index.less'
import 'moment/locale/zh-cn';
// import XLSX from 'xlsx';
moment.locale('zh-cn');
import { SHOW_NewTrainPlan_MODEL, SHOW_ChooseListModel_MODEL, SHOW_ManualInput_MODEL, SHOW_ChooseXzqy_MODEL } from "../../../../../../constants/toggleTypes"
import { supplierTrain, specialAction, supplierAction } from "../../../../../../actions"
// 公用选择供应商组件
import ChooseListModel from "../../../../../../components/ChooseListModel"
import ChooseXzqy from '../../../../../../components/ChooseXzqy'
import ManualInput from '../ManualInput'
const { RangePicker } = DatePicker;
const { SHOW_PARENT, TreeNode } = TreeSelect;
const { TabPane } = Tabs;
const { TextArea } = Input
const { Step } = Steps;
const steps = [
    {
        title: '基本信息',
        content: 'First-content',
    },
    {
        title: '参训人员',
        content: 'Second-content',
    },
    // {
    //     title: '其他',
    //     content: 'Second-content',
    // },

];

// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class NewTrainSS extends React.Component {
    state = {
        choosetype: "",//新增课程范围还是供应商范围
        attachlist: {},
        planlist: {},
        supplierList: {},
        trainPlanInfo:{},
        trainTypes: [],
        licenseData: [],//证书
        peopleData: [],//参训人员
        attachData: [],
        traintypeData:[],
        schmeData: [],//选择的课程类别、
        licenselist:[],
        trainSchmeData: [],//选择的培训类型
        trainPlanFileData: [],
        selectedvalue: [],
        defaultValue: [],
        pxsj:[],
        treeData: [],
        city: [],
        radioGroup: {
            status: 0,
            sfsf: 1
        },
        current: 0,
        type:'zx',
        value: [],
        mode: ['date', 'date'],
        bmjzrqValue:null,
        bdrqValue:null
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NewTrainPlan_MODEL)
    };
    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }
    radioGroupChange = (e, type) => {

        const { radioGroup } = this.state;
        radioGroup[type] = e.target.value
        this.setState({
         
            radioGroup
        });
    }
    //新增标准要求
    addBZYQFn(obj) {
        const { attachData } = this.state
        attachData.push(obj)
        console.log(attachData)
        this.setState({
            attachData
        })
    }
    TreeonChange = (value, label) => {
        console.log('onChange ', value);
        console.log(value)
        const { selectedvalue } = this.state
        selectedvalue.push(value)
        this.setState({ selectedvalue });
    };
    gettreenode(tree, key = 0) {
        return tree.map((treenode, idx) => {

            return (
                <TreeNode dataRef={treenode} disableCheckbox={key == 0 ? true : false} title={treenode.name} key={key + '-' + idx}>
                    {

                        treenode.children !== null && treenode.children.length > 0 ? (

                            this.gettreenode(treenode.children, key + '-' + idx)
                        ) : null
                    }</TreeNode>
            )
        })
    }
    //选择策划类型树
    async getTrainSchmeTypeTree() {
        let result = await supplierTrain.getTrainSchmeTypeTree()
        let treeData = this.onLoadData(result.data)
        if (result.code == 200) {
            this.setState({
                treeData
            })
        }



        // console.log(  this.onLoadData(result.data))

    }
    manualInput = (data) => {
        console.log(data)
        //手动添加报名人员信息，回填至Table
    data['identitycode'] = data.number
        let { peopleData ,SSInfo,type} = this.state
        const {modelType}=this.props
        if(modelType==2){
            this.singleAddPeople(SSInfo.id,data,type)
         }
       
        let _arr = peopleData
        _arr.push(data)
        // _arr.forEach((item, index) => {
        //     item.index = index
        // })
        this.setState({
            peopleData: _arr
        })
    }
    onLoadData(treeData, level = 0) {
        // console.log(treeNode)
        treeData.forEach((item, index) => {
            item.title = item.name

            item['key'] = level + '-' + index
            item.value = item.id
            item['disableCheckbox'] = level == 0 ? true : false

            if (item.children.length > 0) {
                // item.children = item.children
                item.children = this.onLoadData(item.children, level + '-' + index)
            } else {
                item.children = []
            }
        })
        return treeData
    }
    handleSubmit = e => {

        const { toggleStore, refreshData, modelType } = this.props;
        const { attachData, licenseData, peopleData, traintypename,SSInfo, value, trainPlanInfo,trainSchmeData,bmjzrqValue ,type,pxsj } = this.state;

        this.props.form.validateFields(async (err, values) => {
            if(modelType==1){
                toggleStore.setToggle(SHOW_NewTrainPlan_MODEL)
                return
            }
            if (err) {
                var errMessage = []
                err.name.errors.forEach(item => {
                    errMessage.push(item.message)
                })
                console.log(errMessage)
                message.error(errMessage.join(','))
                return
            }
         console.log(values)
         console.log(trainPlanInfo)
                let trainStart = pxsj.length!=0?pxsj[0]:value[0].format('YYYY-MM-DD')
                let trainEnd = pxsj.length!=0?pxsj[1]:value[1].format('YYYY-MM-DD')
               
           
                if(!trainStart||!trainEnd){
                    message.error('培训时间不能为空')
                     return
                 }
              
                 let time = `${trainStart} ~ ${trainEnd}`
                 console.log(time)
                 let newTrainPlan_trainlicense =[]
                 let listTrainImplementUserNew = []

                 licenseData.forEach(item => {
                                newTrainPlan_trainlicense.push({
                                    trainCourseId: item.id
                                })
                 })
                 if(type=='zx'){
                    peopleData.forEach(item =>{
                        listTrainImplementUserNew.push({
                            "identitycode":item.identitycode,
                            "gysname":item.gysname,
                            "gender":item.gender,
                            "tel":item.tel,
                            "title": item.title,
                            "username":item.username,
                            "userorg":item.userorg
                        })
                     })
                 }else{
                    peopleData.forEach(item =>{
                        listTrainImplementUserNew.push({
                            "identitycode":item.identitycode,
                            "gysname":item.gysname,
                            "gender":item.sex,
                            "tel":item.tel,
                            "title": item.post,
                            "username":item.name,
                            "userorg":item.dept
                        })
                     })
                 }
               
          let  newTrainPlan= {
                        ...values,
                        type,
                        time,
                        trainplotId: trainSchmeData.length>0?trainSchmeData[0].id:trainPlanInfo.trainplotId,
                  
                    }
                    console.log(newTrainPlan)
               
                    if (modelType == 0) {
                        newTrainPlan['trainid'] = trainPlanInfo.trainid
                        let newSSRecordResult = await supplierTrain.newTrainSSRecord(newTrainPlan)
                        console.log(newSSRecordResult)
                        if(newSSRecordResult.code==200){
                            message.success('新建实施记录成功')
                             refreshData();
                            toggleStore.setToggle(SHOW_NewTrainPlan_MODEL)
                            if(licenseData.length>0){
                                supplierTrain.addCertificateToSSRecord(licenseData[0].id,newSSRecordResult.data.id)

                            }
                            supplierTrain.addUserToSSRecord(newSSRecordResult.data.id,listTrainImplementUserNew)
                        }else{

                        }
                    }else{
                         newTrainPlan['trainid'] = SSInfo.trainid
                         newTrainPlan['traintypename'] = SSInfo.traintypename
                         
                       let result =   await supplierTrain.editTrainSSRecord(SSInfo.id,newTrainPlan)
                       console.log(result)
                       if(result.code==200){
                        message.success('修改实施记录成功')
                        refreshData();
                       toggleStore.setToggle(SHOW_NewTrainPlan_MODEL)
                       }
                    }

        })




  
    };
    //选择行政区域模块
    getChooseXzqy(data) {
        console.log(data);
        // 获取选择的 供应商行政区域
        let len = data.length
        let _arr = []
        for (let i = 1; i < len; i++) {
            _arr.push(data[i].field1)
        }
        let district_key = _arr.join("\\")
        const { setFieldsValue } = this.props.form;
        setFieldsValue({ pxdd1: district_key })
        // this.setState({
        //     district_keyref: district_key
        // })
    }
    async getworldareatree() {
        let ret = await supplierAction.getworldareatree()

        this.setState({
            city: ret
        })
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NewTrainPlan_MODEL)
    };

    /******************* 培训类型子表 ******************/
    //新建培训计划——培训类型分页查询
    async zzpjpageChange(page, num) {
        this.loadZzpjApply(page, num)
    }
    //新建培训计划——培训类型搜索
    async zzpjSearch(value) {
        this.loadZzpjApply(1, 10, value)
    }
    //新建培训计划——加载培训类型列表
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

    /******************* 课程子表 ******************/
    //新建培训计划————课程分页查询
    async expertpageChange(page, num) {
        this.loadCourse(page, num)
    }
    //新建培训计划——课程搜索
    async expertSearch(value) {
        this.loadCourse(1, 10, value)
    }
    covertype(arr) {
        let strarr = []
        if(arr){
            arr.forEach(item => {
                strarr.push(item.name)
            })
            return strarr.join(',')
        }else{
            return null
        }
       
    }

    //根据培训策划ID获取附件信息列表
    async loadAttach(id) {
        let attachlistret = await supplierTrain.getTrainAttach(id);//根据选取的培训类型中的课程领域 获取课程列表
        console.log(attachlistret)
        let total = attachlistret.length;
        this.setState({
            attachData: attachlistret.data,
            //   schmePaginations: {  showTotal: () => `共${total}条`, onChange: (page, num) => { this.expertpageChange(page, num) }, showQuickJumper: true, total: total, pageSize: 10 }
        })
    }
    async getTypeByPlanId(id){
        let typelistret = await supplierTrain.getTypeByPlanId(id);//根据选取的培训类型
        this.setState({
            traintypename: this.covertype(typelistret.data)
        })
    }

    clearPeoples(){
        this.setState({
            peopleData:[]
        })
    }

    timeGap(dataArr){
        let time1 =  Date.parse(dataArr[0])
        let time2 = Date.parse(dataArr[1])
        let timestamp =  Math.abs(time2-time1)
        timestamp =  timestamp / (24 * 3600 * 1000);
        return Math.floor(timestamp)+1;
        }
     async getTrainDetailToSS(trainid){
         let result  = await supplierTrain.getTrainDetailToSS(trainid)
         console.log(result)
     }
    async getTrainSSRecordDetail(ofgti){
        const { setFieldsValue } = this.props.form;
    
        let result = await supplierTrain.getTrainSSRecordDetail(ofgti)
        if(result.code==200){
            let info = result.data
            const { name,bj,pxdd1,pxdd2,pxdx,pxfy,pxmd,pxnrfs,rygm,traintypename,zbdw,zt,}=info
       console.log(info)

            const monthFormat = 'YYYY-MM-DD';
            let times = info.time.split(' ~ ')
            
            let defaultValue=[moment(times[0], monthFormat),moment(times[1], monthFormat)]
            let bmjzrq = info.bmjzrq?info.bmjzrq.split('T')[0]:''
            let bmjzrqValue = moment(times[0], monthFormat)
             this.setState({ 
                 // selectedvalue:trainplottype ,
                 licenseData:info.trainCertificates,
                 peopleData:info.trainImplementUserNewVO.listTrainImplementUserNewVO1,
                 value:defaultValue,
                 bmjzrqValue,
                 type:info.type,
                 defaultValue,
                 SSInfo:info

             
         });
    
         setFieldsValue({
            trainname:name,
            bj,
            pxdd1,
            pxdd2,
            pxdx,
            pxfy,
            pxmd,
            pxnrfs,
            rygm,
            traintypename,
            zbdw,
            zt,
            fqs:times.length!=0?this.timeGap(times):null
        })
          //  this.loadAttach(info.id)
           // this.getTrainSchmeCourse(info.trainplotId)
        }else{

        }
     


    }
    /*************************************/
    async componentDidMount() {
        //获取gys列表
        //this.loadLicense();//获取课程列表
        this.getTrainPlan();//获取计划列表
        this.loadLicense()

      this.getworldareatree();
        const { modelType, info } = this.props
        if(modelType!=0){
          this.getTrainSSRecordDetail(info.id)

        }
     
      

    }
    //根据选取的培训类型中的课程领域 获取课程列表
    async getSpecialistByFiled(username) {
        const { trainSchmeData } = this.state
        let expertType = [];
        for (let data of trainSchmeData[0].trainExpertTypeList) {
            if (data.expertTypeName) {
                expertType.push(data.expertTypeName)
            }
        };
        let attachlistret = await specialAction.getSpecialistByFiled(username, expertType)
        return attachlistret;
        /* if (attachlistret) {
            this.setState({
                attachlist: {
                    list: attachlistret,
                    total: attachlistret.length
                }
            })
        } */
    }
    //根据选取的培训类型中的策划领域 获取策划列表
    async getTrainPlan(pageNum = 1, rowNum = 20, name) {
   let params = {
    pageNum,
    rowNum,
    name,
    status:'2'
   }
        let trainPlan = await supplierTrain.getTrainPlanToSS(params)
        
        this.setState({
            planlist: trainPlan.data,
            schmePaginations: { search: (value) => { this.getTrainPlan(1, 10, value) }, showTotal: () => `共${trainPlan.data.recordsTotal}条`, onChange: (page, num) => { this.getTrainPlan(page, num) }, showQuickJumper: true, total: trainPlan.data.recordsTotal, pageSize: 10 },
            loading: false
        })
    }
    async getTrainSchmeCourse(trainplotid) {
        let params = {
            trainplotid,
            pageNum:1,
            rowNum:100
        }
        let licenseRet = await supplierTrain.getTrainSchmeCourseByZXD(params)
      
        this.setState({
            licenseData: licenseRet.data.list,

        })
    }
    async loadLicense(pageNum = 1, rowNum = 10, name=''){
        let params = {
            name,
            pageNum,
            rowNum
        }
        let licenselistret = await supplierTrain.getTrainCertificate(params);
    
        this.setState({
            licenselist:licenselistret.data,
            licensePaginations: { search: (value) => { this.loadLicense(1,10,value) }, showTotal: () => `共${licenselistret.data.recordsTotal}条`, onChange: (page, num) => { this.loadLicense(page, num) }, showQuickJumper: true, total: licenselistret.data.recordsTotal, pageSize: 10 }
        })
    }
    async singleAddPeople(ssid,item,type){
        let listTrainImplementUserNew = []
      
                listTrainImplementUserNew.push({
                    "identitycode":item.number,
                    "gysname":item.gysname,
                    "tel":item.tel,
                    "title": item.title,
                    "username":item.username,
                    "userorg":item.userorg
                })
     
         let result = await supplierTrain.addUserToSSRecord(ssid,listTrainImplementUserNew)
         console.log(result)
    }
  async  chooseZzApplyFn(data) {
        const { licenseData, schmeData, peopleData,SSInfo, trainPlanInfo, choosetype ,type} = this.state
        const { modelType }=this.props
        const { setFieldsValue } = this.props.form;
        console.log(data)
        data.forEach(item => {
            if (choosetype == 'planlist') {
                schmeData.push(item)
                this.setState({
                    schmeData
                })
            } else if (choosetype == 'people') {
              
              
                peopleData.push(item)
                this.setState({
                    peopleData
                })
            } else if (choosetype == 'chooseTrainPlan') {
              
            }else if(choosetype == 'licenselist'){
                if((modelType==2 || modelType==0) && licenseData.length==0){
                  supplierTrain.addCertificateToSSRecord(item.id, modelType==0?trainPlanInfo.id :SSInfo.id)
                }else{
                 message.warning('一次培训只能添加一个证书，请先将已添加的证书移除')
                 return
                }
              let newLicenseArr = []  
              newLicenseArr.push(item)
                this.setState({
                    licenseData:newLicenseArr
                })
                
            }
        })

        if(data.length>0 && choosetype == 'chooseTrainPlan' ){
            let item = data[0]
            let _arr = [];
            _arr.push(item)
            let info={}
            let result  = await supplierTrain.getTrainDetailToSS(item.id)
            console.log(result)
            if(result.code==200){
                info = result.data
            }else{
                message.error('查询计划详情失败，请联系管理员')
                return 
            }
            console.log(info)
            const { name,bj,pxdd1,pxdd2,pxdx,pxfy,pxmd,pxnrfs,rygm,traintypename,zbdw,zt,}=info
            const monthFormat = 'YYYY-MM-DD';
            let times = info.time.split(' ~ ')
           let defaultValue = [moment(times[0], monthFormat), moment(times[1], monthFormat)]
           if(info.type=='zr'){
              this.getZRApplyUsers(info.trainid)
           }else{
           let peoples = info.listTrainApplyNewUserVO
               this.setState({
                peopleData:peoples,
               })
           }
            this.setState({
                trainPlanInfo:info,
                trainSchmeData: _arr,
                 value: defaultValue,
                 type:info.type,
                traintypeData:info.trainplottype,
                // radioGroup: {
                //     status: parseInt(item.status),
                //     sfsf: parseInt(item.sfsf)
                // },
            })
            setFieldsValue({
                trainname: item.name,
                name,
                bj,
                pxdd1,
                pxdd2,
                pxdx,
                pxfy,
                pxmd,
                pxnrfs,
                rygm,
                zbdw,
                zt,
                traintypename: this.covertype(item.trainplottype),
                fqs:times.length!=0?this.timeGap(times):null
            })
            this.getTrainSchmeCourse(item.id)
        }
    }

   async getZRApplyUsers(trainId){
        let result = await supplierTrain.getTrainAccessApply(trainId,'4')
        let userList = []
        if(result.code==200){
            result.data.forEach(item=>{
                userList = userList.concat(item.persons)
            })
        }
        console.log(userList)
        this.setState({
            peopleData:userList
        })
    }
    chooseType(choosetype) {
        const {info} = this.props
        
        let listModelOption;
        if (choosetype == "licenselist") {
            // this.getSpecialistByFiled();//根据选取的培训类型中的课程领域 获取课程列表
       
            listModelOption = {
                model: SHOW_ChooseListModel_MODEL,
                title: '选择证书',
                type: "radio",
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
                        render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 15)}</span></Tooltip>
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
                        title: '有效日期',
                        dataIndex: 'expiry_months',
                    },
                  
                ]
            }
        } else if (choosetype == "chooseTrainPlan") {

       
            listModelOption = {
                model: SHOW_ChooseListModel_MODEL,
                title: '选择计划',
                type: "radio",
                columns: [
                    {
                        title: '序号',
                        dataIndex: 'key',
                        width: 50,
                        align: "center",
                        render: (text, index, key) => key + 1
                    },
                 
                    {
                        title: '培训计划名称',
                        dataIndex: 'name',
                        width: 250,
                        align: "center",
                        render: (text, redord) => <Tooltip title={text}><span>{text && text.substr(0, 20)}</span></Tooltip>
                    },
                    {
                        title: '培训类型',
                        dataIndex: 'trainplottype',
                        width: 200,
                        align: "center",
                        render: (text, record) => this.covertype(record.trainplottype)
                    },
                    {
                        title: '人员规模',
                        dataIndex: 'rygm',
                        width: 100,
                        align: "center",
                    },
                    {
                        title: '培训主题',
                        dataIndex: 'zt',
                        width: 230,
                        align: "center",
                    },
                    {
                        title: '培训时间',
                        dataIndex: 'time',
                        width: 170,
                        align: "center",
                        // sorter: (a, b) => (moment(a.trainShift).valueOf() - moment(b.trainShift).valueOf()),
                        // render: (text) => <Tooltip title={text && text.substr(0, 10)}><span>{text && text.substr(0, 10)}</span></Tooltip>
                    },
                    {
                        title: '培训对象',
                        dataIndex: 'pxdx',
                        width: 120,
                        align: "center",
                    },
                    {
                        title: '发布时间',
                        dataIndex: 'createTime',
                        width: 150,
                        align: "center",
                        sorter: (a, b) => (moment(a.createTime).valueOf() - moment(b.createTime).valueOf()),
                        render: (text) => <Tooltip title={text && text.substr(0, 10)}><span>{text && text.substr(0, 10)}</span></Tooltip>
                    },

                ]
            }
        } else if (choosetype == "people") {
            listModelOption = {
                model: SHOW_ChooseListModel_MODEL,
                title: '选择',
                columns: [
                    {
                        title: '序号',
                        dataIndex: 'key',
                        width: 100,
                        align: "center",
                        render: (text, index, key) => key + 1
                    },
                    {
                        title: '供应商名称',
                        dataIndex: 'name',
                        width: 300,
                        align: "center",
                        render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
                    },
                    {
                        title: '统一社会信用代码',
                        dataIndex: 'code',
                        width: 230,
                        align: "center",
                    },
                    {
                        title: '简称',
                        dataIndex: 'name_other',
                        width: 150,
                        align: "center",
                    },
                    {
                        title: '别称',
                        dataIndex: 'another_name',
                        width: 150,
                        align: "center",
                    },
                    {
                        title: '行政区域名称',
                        dataIndex: 'district_key',
                        width: 230,
                        align: "center",
                    },
                ]
            }
        } else if (choosetype == "trainplanfile") {

        }
        this.setState({
            listModelOption: listModelOption
        })
        this.setState({
            choosetype
        })
    }
  
    //移除已经添加的参训人员
  async  deletePeoplelist(value) {
       const { modelType} = this.props
        const { peopleData } = this.state
        if(modelType==2 && value.id){
            let result =await supplierTrain.removeTrainSSUser(value.id)
            if(result.code==200){
            //   let ind = _.findIndex(peopleData, { id: value.id })
            //   peopleData.splice(ind, 1)
            //   this.setState({
            //       peopleData
            //   })
            }else{
                message.error(result.message)
            }
                
        }else{
         
        }
        let ind = _.findIndex(peopleData, { id: value.id })
        peopleData.splice(ind, 1)
        this.setState({
            peopleData
        })
    }
 
    //上传文件
    setFile(files) {
        console.log(files)
        this.setState({
            trainPlanFileData: files
        })
    }

  //移除已经添加的证书
 async deleteLicense(value) {
    const { licenseData ,SSInfo} = this.state
    const {modelType } = this.props
    if(modelType==2){
        console.log(value,SSInfo)
        let result  = await supplierTrain.removeCertificateFromSSRecord(value.id,SSInfo.id)
    }
    
    let ind = _.findIndex(licenseData, { id: value.id })
    licenseData.splice(ind, 1)
    this.setState({
        licenseData
    })
}
importExcel(e){
    var files = e.target.files;
    var name = files.name;
    const reader = new FileReader();
    reader.onload = (evt) => {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, {type:'binary'});
        
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_csv(ws, {header:1});
        console.log("Data>>>"+data);

    };
    reader.readAsBinaryString(files[0]);
   }
   //添加培训人员证书
   setNumber(id,value){
    const {  peopleData} = this.state

    peopleData.forEach(item=>{
        if(`${item.username}${item.tel}`==id){
          item['identitycode'] = value
        }
    })
    this.setState({
        peopleData
    })
}
    handleChange = (value,dateString) => {
        this.setState({ 
            value: value,
            pxsj:dateString
        });
    };
    handlePanelChange = (value, mode) => {
        this.setState({
            value,
            mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
        });
    };

    render() {
        const { toggleStore, modelType } = this.props;
        const { planlist, supplierList, choosetype, treeData, schmeData, peopleData, licenseData, licenselist, traintypeData, attachData,
            radioGroup, listModelOption, schmePaginations, gysPaginations, trainTypePaginations,type, current, selectedvalue, value, mode, bdrqValue,bmjzrqValue  } = this.state
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const formItemLayout_row = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        const formItemLayout_lg = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        };
        //选择弹出框的列表数据
        const typelist = choosetype == "chooseTrainPlan" ? planlist : (choosetype == "people" ? supplierList : licenselist);
        //选择弹出框的列表数据中默认选择的数据
        const disabledData = choosetype == "chooseTrainPlan" ? schmeData : (choosetype == "people" ? licenseData : licenseData);
        //页码
        const paginations = choosetype == "chooseTrainPlan" ? schmePaginations : (choosetype == "people" ? gysPaginations : trainTypePaginations);
        let that = this;

        const columns_license = [
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
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 15)}</span></Tooltip>
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
                title: '有效日期',
                dataIndex: 'expiry_months',
            },
            {
                title: '操作',
                dataIndex: 'cz',
                render: (text, record) => modelType!=1 && <Button type="danger" size={'small'} onClick={() => { this.deleteLicense(record) }} >删除</Button>
            },

        ]

        const columns_gys = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 100,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '姓名',
                dataIndex: 'username',
                width: 100,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 15)}</span></Tooltip>
            },
            {
                title: '性别',
                dataIndex: 'gender',
                width: 80,
                align: "center",
            },
            {
                title: '所属供应商',
                dataIndex: 'gysname',
                width: 150,
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
                width: 150,
                align: "center",
            },
            
            {
                title: '联系方式',
                dataIndex: 'tel',
                width: 150,
                align: "center",
            },
          
            {
                title: '证件编号',
                dataIndex: 'number',
                width: 150,
                render: (text,record) =>  { 
                    return (
                         <div>
                            
                             <Input  value={modelType!=0?record.identitycode: record.identitycode } onChange={ev=>{this.setNumber(`${record.username}${record.tel}`,ev.target.value)}} />
                         </div>
                    )}
            },
            {
                title: '操作',
                dataIndex: 'cz',
                width: 150,
                render: (text, record) =>modelType!=1 && <Button type="danger" size={'small'} onClick={() => { this.deletePeoplelist(record) }} >删除</Button>
            },

        ]
        const columns_gys_zr = 
       
        [
            {
                title: '序号',
                dataIndex: 'key',
                width: 100,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '姓名',
                dataIndex: 'name',
                width: 100,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 15)}</span></Tooltip>
            },
            {
                title: '性别',
                dataIndex: 'sex',
                width: 80,
                align: "center",
            },
            {
                title: '所属供应商',
                dataIndex: 'gysname',
                width: 150,
                align: "center",
            },
            
            {
                title: '所属部门',
                dataIndex: 'dept',
                width: 150,
                align: "center",
            },
            {
                title: '现任职务/职称',
                dataIndex: 'post',
                width: 150,
                align: "center",
            },
            
            {
                title: '联系方式',
                dataIndex: 'tel',
                width: 150,
                align: "center",
            },
          
            {
                title: '证件编号',
                dataIndex: 'number',
                width: 150,
                render: (text,record) =>  { 
                    return (
                         <div>
                            
                             <Input  value={modelType==1?record.identitycode: record.identitycode} onChange={ev=>{this.setNumber(`${record.username}${record.tel}`,ev.target.value)}} />
                         </div>
                    )}
            },
            {
                title: '操作',
                dataIndex: 'cz',
                width: 150,
                render: (text, record) =>modelType==0 && <Button type="danger" size={'small'} onClick={() => { this.deletePeoplelist(record) }} >删除</Button>
            },

        ]

      const colums_peoples = modelType ==0 ?(type=='zx'?columns_gys:columns_gys_zr): columns_gys
        const tProps = {
            treeData,
            defaultValue: selectedvalue,
            onSelect: this.TreeonChange,
            treeCheckable: true,
            multiple: true,
            // showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: '请选择策划类型',
            style: {
                width: '100%',
            },
        };
      
        const uploadProps = {
            name: 'file',
            action: `${supplierAction.BaseURL}trainImplementUserNew/excel2`,
            // headers: {
            //     authorization: 'authorization-text',
            // },
            showUploadList:false,
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    // console.log(info.file, info.fileList);
                    message.loading('loading', 3)
                }
                if (info.file.status === 'done') {
                    console.log(info.file);
                   // message.info(`${info.file.name} 文件上传成功，正在等待服务端转换...`);
                  const { peopleData,type} = that.state
                  let resData = info.file.response.data
                  let people = []
                  if(type=='zr'){
                    resData.forEach(item =>{
                        people.push({
                            "identitycode":item.identitycode,
                            "gysname":item.gysname,
                            "tel":item.tel,
                            "sex":item.gender,
                            "post": item.title,
                            "name":item.username,
                            "dept":item.userorg
                        })
                     })
                 }else{
                    people = resData
                 }
                   that.setState({
                    peopleData:peopleData.concat(people)     
                   })
                   message.success('导入参训人员成功')
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 文件上传失败`);
                }
            },
        };
        const dateFormat = 'YYYY-MM-DD';
        return (
            <div>
                <Modal
                    title={modelType == 1 ? '培训实施记录详情' : "新建培训实施记录"}
                    width={960}
                    visible={toggleStore.toggles.get(SHOW_NewTrainPlan_MODEL)}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                    footer={
                        <Fragment>
                            {current < steps.length - 1 && (
                                <Button type="primary" onClick={() => this.next()}>
                                    下一步
                                </Button>
                            )}

                            {current > 0 && (
                                <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                                    上一步
                                </Button>
                            )}
                            {current === steps.length - 1 && (
                                <Button type="primary" onClick={this.handleSubmit.bind(this)}>
                                 确定
                                </Button>
                            )}
                        </Fragment>
                    }
                >

                    {/* <Steps 
                     type="default"
                     size="default"
                 current={ current}
                 style={stepStyle}
              
                 >
                 
                        {steps.map(item => (
                            <Step key={item.title} title={item.title} />
                        ))}
                 </Steps> */}



                    <Tabs activeKey={String(current)}
                        onChange={(key) => this.setState({
                            current: parseInt(key)
                        })}
                        tabBarStyle={{ cursor: 'auto' }}
                    >
                        <TabPane tab="基本信息" key="0">
                            <Form className="ant-advanced-search-form" onSubmit={(e) => { }}>

                                <Card bordered={false} className="new_supplier_form">
                                    <Row gutter={24}>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'培训计划'}>
                                                {getFieldDecorator(`trainname`, {
                                                    initValue: "培训类型",
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '培训计划',
                                                        },
                                                    ],
                                                })(<Input disabled={true} addonAfter={<Icon style={{ cursor: 'pointer' }} onClick={() => { this.chooseType("chooseTrainPlan"); toggleStore.setToggle(SHOW_ChooseListModel_MODEL) }} type="plus" />} />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                        {
                                           modelType==2?(
                                            <Form.Item {...formItemLayout} label={'类型'}>
                                            <TreeSelect {...tProps} />

                                        </Form.Item>
                                           ):(
                                            <Form.Item {...formItemLayout} label={'培训类型'}>
                                            {getFieldDecorator(`traintypename`, {
                                                initValue:this.covertype(traintypeData),
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '培训类型',
                                                    },
                                                ],
                                            })(<Input disabled />)}
                                        </Form.Item>
                                           )
                                        }
                                           
                                        </Col>

                                    </Row>
                                    <Row gutter={24}>
                                       <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'培训时间'}>
                                                <RangePicker format={`YYYY-MM-DD`} mode={mode}    value={value} onChange={this.handleChange} onPanelChange={this.handlePanelChange} placeholder={['起始时间', '结束时间']} style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>

                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'为期'}>
                                                {getFieldDecorator(`fqs`, {
                                                    initValue: '培训分期',
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: '培训分期数',
                                                        },
                                                    ],
                                                })(<InputNumber min={0} max={100} />)}
                                                <span className="ant-form-text"> 天</span>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'人员规模'}>
                                                {getFieldDecorator(`rygm`, {
                                                    initValue: '人员规模',
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: '人员规模',
                                                        },
                                                    ],
                                                })(<InputNumber min={0}

                                                    max={1000} />)}
                                                <span className="ant-form-text"> 人</span>
                                            </Form.Item>
                                        </Col>
                                            <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'培训费用'}>
                                                {getFieldDecorator(`pxfy`, {
                                                    initValue: '人员规模',
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: '培训费用',
                                                        },
                                                    ],
                                                })(<InputNumber min={0}

                                                    max={100000} />)}
                                                <span className="ant-form-text"> 元 / 人</span>
                                            </Form.Item>
                                        </Col>
                                        
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'培训地点'}>
                                            {getFieldDecorator(`pxdd1`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '行政区域',
                                                    },
                                                ],
                                            })(<Input disabled={true} addonAfter={<Icon style={{ cursor: 'pointer' }} onClick={() => toggleStore.setToggle(SHOW_ChooseXzqy_MODEL)} type="plus" />} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'详细地址'}>
                                            {getFieldDecorator(`pxdd2`, {
                                                initValue: "名称",
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '名称不能为空',
                                                    },
                                                ],
                                            })(<Input />)}
                                        </Form.Item>
                                    </Col>
                                    </Row>
                                    <Row gutter={24}>
                                    {/* <Col span={24} >
                                            <Form.Item {...formItemLayout_row} label={'名称'} style={{ marginBottom: 20 }}>
                                                {getFieldDecorator(`name`, {
                                              
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '计划名称不能为空',
                                                        },
                                                    ],
                                                })(<Input  />)}
                                            </Form.Item>
                                        </Col> */}
                                           <Col span={24} >
                                            <Form.Item {...formItemLayout_row} label={'培训主题'} style={{ marginBottom: 20 }}>
                                                {getFieldDecorator(`zt`, {
                                                    initValue: '培训主题',
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: '培训主题不能为空',
                                                        },
                                                    ],
                                                })(<Input />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={24} >
                                            <Form.Item {...formItemLayout_row} label={'培训背景'} style={{ marginBottom: 20 }}>
                                                {getFieldDecorator(`bj`, {
                                                    initValue: '培训背景',
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: '培训主题不能为空',
                                                        },
                                                    ],
                                                })(<Input />)}
                                            </Form.Item>
                                        </Col>
                                       
                                        <Col span={24} >
                                            <Form.Item {...formItemLayout_row} label={'培训对象'} style={{ marginBottom: 20 }}>
                                                {getFieldDecorator(`pxdx`, {
                                                    initValue: '培训对象',
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: '培训对象',
                                                        },
                                                    ],
                                                })(<TextArea rows={2} />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={24} >
                                            <Form.Item {...formItemLayout_row} label={'培训目的'} style={{ marginBottom: 20 }}>
                                                {getFieldDecorator(`pxmd`, {
                                                    initValue: '培训对象',
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: '培训对象',
                                                        },
                                                    ],
                                                })(<TextArea rows={2} />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={24} >
                                            <Form.Item {...formItemLayout_row} label={'培训内容和方式'} style={{ marginBottom: 20 }}>
                                                {getFieldDecorator(`pxnrfs`, {
                                                    initValue: '培训内容和方式',
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: '培训内容和方式',
                                                        },
                                                    ],
                                                })(<TextArea rows={2} />)}
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                  
                                </Card>
                        


                              <Card bordered={false} title={<b>培训证书</b>} extra={  modelType!=1&&
                                    <Button type="primary" onClick={() => {
                                        //只有选择培训类型后，才能选择课程
                                            this.chooseType("licenselist")
                                            toggleStore.setToggle(SHOW_ChooseListModel_MODEL);
                                      
                                    }}>
                                        新增
                                            </Button>
                                } className="new_supplier_producelist">
                                    <Row style={{ marginBottom: 10 }}>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => key} columns={columns_license} dataSource={licenseData} />
                                        </Col>
                                    </Row>
                                </Card>

                            </Form>
                        </TabPane>
                        <TabPane tab="参训人员" key="1">
                            <Form className="ant-advanced-search-form" onSubmit={(e) => { }}>
                            <Card bordered={false} title={<b>参训人员</b>} extra={ modelType!=1&&
                            <Fragment>
                                      
                                    <Button type="primary" onClick={() => {
                                        //选择参训人员

                                        let { toggleStore } = this.props
                                        toggleStore.setToggle(SHOW_ManualInput_MODEL)

                                    }}>
                                        手工录入
                                            </Button>
                                            <div style={{ display: "inline-block", marginLeft: 10,marginRight:10 }}>
                                                <Upload {...uploadProps}>
                                                    <Button type="primary">
                                                        <Icon type="upload" />导入
                                                    </Button>
                                                </Upload>
                                            </div>
                                            <Button type="danger"  onClick={() => {
                                        //清空

                                    this.clearPeoples()

                                    }}>
                                       清空
                                            </Button>
                                        </Fragment>

                                } className="new_supplier_producelist">
                                    <Row style={{ marginBottom: 10 }}>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => `${text.username}${text.tel}`} columns={colums_peoples} dataSource={peopleData} />
                                        </Col>
                                    </Row>
                                </Card>
                   
                            </Form>
                        </TabPane>
                       
                    </Tabs>







                </Modal>
                {
                        toggleStore.toggles.get(SHOW_ManualInput_MODEL) && <ManualInput manualInput={this.manualInput} />
                    }
                {
                    toggleStore.toggles.get(SHOW_ChooseXzqy_MODEL) && <ChooseXzqy getChooseXzqy={this.getChooseXzqy.bind(this)} city={this.state.city} />
                }
                {
                    toggleStore.toggles.get(SHOW_ChooseListModel_MODEL) && <ChooseListModel list={typelist} comparedList={disabledData} pagination={paginations} options={listModelOption} chooseFinishFn={(val) => { this.chooseZzApplyFn(val) }} />
                }
            </div >
        );
    }
}

export default Form.create({ name: 'NewSupplier' })(NewTrainSS);;