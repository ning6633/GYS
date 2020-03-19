import React, { Component, Fragment } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, DatePicker, Radio, Button, message, Tooltip, Icon, Upload, TreeSelect, InputNumber, Steps,Select  } from 'antd';
import { observer, inject, } from 'mobx-react';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import './index.less'
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import { SHOW_NewTrainPlan_MODEL, SHOW_ChooseListModel_MODEL, SHOW_NewBZYQ_MODEL, SHOW_ChooseXzqy_MODEL } from "../../../../../../constants/toggleTypes"
import { supplierTrain, specialAction, supplierAction } from "../../../../../../actions"
// 公用选择供应商组件
import ChooseListModel from "../../../../../../components/ChooseListModel"
import ChooseXzqy from '../../../../../../components/ChooseXzqy'
import NewBZYQ from '../NewBZYQ'
const { RangePicker } = DatePicker;
const { SHOW_PARENT, TreeNode } = TreeSelect;
const { TabPane } = Tabs;
const { TextArea } = Input
const { Step } = Steps;
const { Option } = Select;
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
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class NewTrainPlan extends React.Component {
    state = {
        choosetype: "",//新增课程范围还是供应商范围
        attachlist: {},
        schmelist: {},
        supplierList: {},
        trainTypes: [],
        courseData: [],//课程
        supplierData: [],//供应商
        attachData: [],
        traintypeData:[],
        schmeData: [],//选择的课程类别
        trainSchmeData: [],//选择的培训类型
        trainPlanFileData: [],
        selectedvalue: [],
        defaultValue: [],
        treeData: [],
        pxsj:[],
        bmjzrq:null,
        bdrq:null,
        city: [],
        radioGroup: {
            status: 0,
            sfsf: 1
        },
        current: 0,
        value: [],
        type:'zx',
        mode: ['date', 'date'],
        bmjzrqValue:null,
        bdrqValue:null,
        applylist:[],
      
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
        //选择策划类型树
        async getTrainSchmeTypeTree(type) {
            let result = await supplierTrain.getTrainPlotTypesByType(type)
            let treeData = this.onLoadData(result.data)
            console.log(treeData)
            if (result.code == 200) {
                this.setState({
                    treeData
                })
            }
    
    
    
       
    
        }
    TreeonChange = (value, label) => {
        console.log('onChange ', value);
        console.log(value)
        // const { selectedvalue } = this.state
        // let  _arr = selectedvalue
        // _arr.push(value)
        // this.setState({ selectedvalue:_arr });
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

        const { toggleStore, refreshData, modelType ,info} = this.props;
        const { attachData, courseData, supplierData, traintypeData,selectedvalue ,type, value,pxsj, radioGroup, trainSchmeData,bmjzrqValue ,bdrq ,bmjzrq,bdrqValue } = this.state;
        this.props.form.validateFields(async (err, values) => {
            console.log(info)
            if(modelType==1) {
                toggleStore.setToggle(SHOW_NewTrainPlan_MODEL)
                return
            }
            if (err) {
                var errMessage = []
                err.name.errors.forEach(item => {
                    console.log(item)
                    errMessage.push(item.message)
                })
                console.log(errMessage)
                message.error(errMessage.join(','))
            } else {



                let userId = supplierTrain.pageInfo.userId;
               
             if (values.plotType.length == 0) {
                message.error('策划类型不能为空')
                return
            }
            if (value.length == 0) {
                message.error('培训时间不能为空')
                return
            }
            
                let trainStart = pxsj.length!=0?pxsj[0]:value[0].format('YYYY-MM-DD')
                let trainEnd = pxsj.length!=0?pxsj[1]:value[1].format('YYYY-MM-DD')
               
           
                if(!trainStart||!trainEnd){
                    message.error('培训时间不能为空')
                     return
                 }
                 if(!bdrqValue){
                    message.error('请填写报道日期')
                    return
                 }
                 if(!bmjzrqValue){
                    message.error('请填写报名截止日期')
                    return
                 }
                let trainplottypeArr = []
                let trainploAttachArr = []
                let newTrainPlan_traincourse =[]
                let newtrainplan_gys_base = []
                let  newtrainplan_gys_apply = []
              
                values.plotType.forEach(item => {
                    trainplottypeArr.push({
                        trainPlotTypeId: item.value
                    })
                })
                courseData.forEach(item => {
                    newTrainPlan_traincourse.push({
                        trainCourseId: item.id
                    })
                })
                attachData.forEach(item => {
                    trainploAttachArr.push({
                        "fileId": item.fileid,
                        "fileName": item.fileName,
                        "name": item.name,

                    })
                })
                if(type=='zx'){
                    supplierData.forEach(item => {
                        newtrainplan_gys_base.push({
                            provider_id: item.provider_id
                        })
                    })
                }else{
                    supplierData.forEach(item => {
                        newtrainplan_gys_apply.push(item.id)
                    })
                }
              
                let time = `${trainStart} ~ ${trainEnd}`
                let newvalues = {
                    newTrainPlan: {
                        ...values,
                        bmjzrq:bmjzrq?bmjzrq:bmjzrqValue.format('YYYY-MM-DD'),
                        bdrq:bdrq?bdrq:bdrqValue.format('YYYY-MM-DD HH:mm'),
                        time,
                        type,
                        sfsf: radioGroup.sfsf,
                        trainplotId: trainSchmeData.length>0?trainSchmeData[0].id:info.trainplotId,
                        createUser: userId,
                    },
                    newTrainPlan_TrainPlotType: trainplottypeArr,
                    newTrainPlan_traincourse,
                    newTrainPlan_file: trainploAttachArr,
                    newtrainplan_gys_base

                }
                if (modelType == 0) {
                    console.log(newvalues)
                    let trainPlotResult = await supplierTrain.newTrainPlan(newvalues)
                    if (trainPlotResult.code == 200) {
                        message.success('新建培训计划成功！')
                     if(type=='zr'){
                        let addApplyResult = await supplierTrain.addTrainApplyToPlan(trainPlotResult.data,newtrainplan_gys_apply)
                        console.log(addApplyResult)
                     }
                     
                        refreshData();
                        toggleStore.setToggle(SHOW_NewTrainPlan_MODEL)
                    }
                } else if (modelType == 2) {
                    if (pxsj.length > 0) {
                        let trainStartEdit = pxsj[0]
                        let trainEndEdit = pxsj[1]
                        newvalues.newTrainPlan['time'] = `${trainStartEdit} ~ ${trainEndEdit}`
                    } else {
                        newvalues.newTrainPlan['time'] = info.time
                    }
                    console.log( newvalues.newTrainPlan)
                    newvalues.newTrainPlan['id'] = info.id
                    let trainPlotResult = await supplierTrain.editTrainPlan(newvalues.newTrainPlan)
                    console.log(trainPlotResult)
                    if (trainPlotResult.code == 200) {
                        message.success('修改培训计划成功！')
                        refreshData();
                        toggleStore.setToggle(SHOW_NewTrainPlan_MODEL)
                    }
                }

            }
       
        });
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

    /******************* 供应商子表 ******************/
    //新建培训计划————供应商分页查询
    async gyspageChange(page, num) {
        this.loadGys(page, num)
    }
    //新建培训计划——供应商搜索
    async gysSearch(value) {
        this.loadGys(1, 10, value)
    }
    // //新建培训计划——加载供应商列表
    // async loadGys(pageNum = 1, rowNum = 10, value='') {
    //     let params = {
    //         coursename: value || "",
    //         pageNum,
    //         rowNum
    //     }
    //     let supplierlistret = await supplierTrain.getTrainCourseList(params);
    //     this.setState({
    //         supplierList:supplierlistret.data,
    //         gysPaginations: { search: (value) => { this.gysSearch(value) }, showTotal: () => `共${supplierlistret.recordsTotal}条`, onChange: (page, num) => { this.gyspageChange(page, num) }, showQuickJumper: true, total: supplierlistret.recordsTotal, pageSize: 10 }
    //     })
    // }

    //新建培训计划——加载供应商列表
    async loadGys(pageNum = 1, rowNum = 10, value = '') {
        let searchValue = {
            trainName: value || ""
        }
        let supplierlistret = await supplierAction.searchSupplierInfo(searchValue.trainName);
        console.log(supplierlistret)
        let total = supplierlistret.length;
        this.setState({
            supplierList: {
                list: supplierlistret,
                total: supplierlistret.length
            },
            gysPaginations: { search: (value) => { this.gysSearch(value) }, showTotal: () => `共${total}条`, onChange: (page, num) => { this.gyspageChange(page, num) }, showQuickJumper: true, total: supplierlistret.recordsTotal, pageSize: 10 }
        })
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
            return strarr.join('，')
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
            trainTypeName: this.covertype(typelistret.data)
        })
    }

    async getTrainAccessApply(newtrainplanid,status='2'){
        let result = await supplierTrain.getTrainAccessApply(newtrainplanid,status);//根据选取的培训类型
        if(result.code==200){
            console.log(result.data)
            this.setState({
                supplierData:result.data
            })
        }
    }

    /*************************************/
    async componentDidMount() {
        //获取供应商申请
        this.getTrainApplys()
        //获取gys列表
        this.loadGys()//供应商
      
        this.loadCourses();//获取课程列表
        this.getworldareatree();//城市地区
        this.getTrainSchmeList();//获取策划列表

        const { modelType, info } = this.props
        const { setFieldsValue } = this.props.form;
       console.log(info)
        if(modelType==2 ||modelType==1){
           let trainplottype= info.trainplottype.map(item=>{
               return {
                   value:item.id,
                   label:item.name
               } 
           })
           if(info.type=='zx'){
            this.getNewTrainPlanGysBases(info.id)
            this.getTrainSchmeTypeTree('zx')//培训类型数
           }else{
            this.getTrainAccessApply(info.id)
            this.getTrainSchmeTypeTree('zr')//培训类型数
           }
           const monthFormat = 'YYYY-MM';
           const dateFormat = 'YYYY-MM-DD';
           const timeFormat = 'YYYY-MM-DD HH:mm';
           let times = info.time.split(' ~ ')
           let defaultValue=[moment(times[0], monthFormat),moment(times[1], monthFormat)]
           let bdrq = info.bdrq? moment(info.bdrq, timeFormat):null
           let bmjzrqValue =info.bmjzrq? moment(info.bmjzrq, dateFormat):null
            this.setState({ 
               selectedvalue:trainplottype ,
                value:defaultValue,
                bmjzrqValue,
                type:info.type,
                bdrqValue:bdrq,
                radioGroup:{
                sfsf:parseInt(info.sfsf)
            }
        });

            setFieldsValue({
                ...info
            })
           this.loadAttach(info.id)
           this.getTrainSchmeCourse(info.trainplotId)
         
           
        }else{
            // console.log(selectedvalue)
            // this.setState({
            //     selectedvalue
            // })
            setFieldsValue({ sfsf:1,status:0 })
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
    async getTrainApplys(pageNum = 1, rowNum = 20, queryName) {
   let params = {
    pageNum,
    rowNum,
    queryName,
    status:"1"
   }
        let TrainApply = await supplierTrain.getTrainApplys(params)
        console.log(TrainApply)
        this.setState({
          applylist: TrainApply.data,
          applyPaginations: { search: (value) => { this.getTrainApplys(1, 10, value) }, showTotal: () => `共${TrainApply.data.recordsTotal}条`, onChange: (page, num) => { this.getTrainSchmeList(page, num) }, showQuickJumper: true, total: TrainApply.data.recordsTotal, pageSize: 10 },
            loading: false
        })
    }
    
    async getTrainSchmeList(pageNum = 1, rowNum = 20, name) {

        let trainPlot = await supplierTrain.getTrainSchmeList({ pageNum, rowNum, name })
        console.log(trainPlot)
        this.setState({
            schmelist: trainPlot.data,
            schmePaginations: { search: (value) => { this.getTrainSchmeList(1, 10, value) }, showTotal: () => `共${trainPlot.data.recordsTotal}条`, onChange: (page, num) => { this.getTrainSchmeList(page, num) }, showQuickJumper: true, total: trainPlot.data.recordsTotal, pageSize: 10 },
            loading: false
        })
    }


    

    async getTrainSchmeCourse(trainplotid) {
        let params = {
            trainplotid,
            pageNum:1,
            rowNum:100
        }
        let courseRet = await supplierTrain.getTrainSchmeCourseByZXD(params)
        console.log(courseRet)
        this.setState({
            courseData: courseRet.data.list,

        })
    }
    //根据培训计划获取添加的供应商
    async getNewTrainPlanGysBases(trainId){
     
        let result = await supplierTrain.getNewTrainPlanGysBases(trainId)
        if(result.code==200){
            console.log(result.data)
            this.setState({
                supplierData:result.data
            })
        }
    }
    async loadCourses(pageNum = 1, rowNum = 10, coursename=''){
        let params = {
            coursename,
            pageNum,
            rowNum
        }
        let courselistret = await supplierTrain.getCourses(params);
        console.log(courselistret)
        this.setState({
            courselist:courselistret.data,
            coursePaginations: { search: (value) => { this.loadCourses(1,10,value) }, showTotal: () => `共${courselistret.data.recordsTotal}条`, onChange: (page, num) => { this.loadCourses(page, num) }, showQuickJumper: true, total: courselistret.data.recordsTotal, pageSize: 10 }
        })
    }

   async chooseZzApplyFn(data) {
        const { courseData, schmeData, supplierData, choosetype ,selectedvalue } = this.state
        const { setFieldsValue } = this.props.form;
        let addSUpllierList = []
        const { modelType, info } = this.props

        console.log(data)
        data.forEach( item => {
            if (choosetype == 'schmelist') {
                schmeData.push(item)
                this.setState({
                    schmeData
                })
            } else if (choosetype == 'supplier') {
                if(modelType==2){
                    addSUpllierList.push(item.provider_id)
                    console.log(addSUpllierList)
               
                }else if(modelType==0){
                    supplierData.push(item)
                    this.setState({
                        supplierData
                    })
                }else{

                }
                
              
            } else if (choosetype == 'chooseTrainSchme') {
                let _arr = [];
                let _types = []
                _arr.push(item)

                console.log(item)
                // const monthFormat = 'YYYY-MM';
                // let times = item.time.split(' ~ ')
                // let defaultValue = [moment(times[0], monthFormat), moment(times[1], monthFormat)]
            item.trainplottype.forEach(elem=>{
                _types.push({
                    value:elem.id,
                    label:item.name
                }) 
           })
                this.setState({
                selectedvalue:_types ,
                    trainSchmeData: _arr,
                    // value: defaultValue,
                    type:item.type,
                    traintypeData:item.trainplottype,
                    radioGroup: {
                        status: parseInt(item.status),
                        sfsf: parseInt(item.sfsf)
                    },
                })
                setFieldsValue({
                    trainplotName: item.name,
                    plotType:_types,
                    ...item,
                   // trainTypeName: this.covertype(item.trainplottype)
                })
                this.getTrainSchmeCourse(item.id)
                this.getTrainSchmeTypeTree(item.type)//培训类型数
            }else if(choosetype == 'courselist'){
                courseData.push(item)
                this.setState({
                    courseData
                })
                
            }else if(choosetype == 'apply'){
                if(modelType==2){
                    addSUpllierList.push(item.id)
                    console.log(addSUpllierList)
               
                }else if(modelType==0){
                    supplierData.push(item)
                    this.setState({
                        supplierData
                    })
                }else{

                }
            }
        })
        if(addSUpllierList.length>0){
            let result =  await supplierTrain.addGysToTrainplan(info.id,addSUpllierList)
            if(result.code==200){
            this.getNewTrainPlanGysBases(info.id)
            addSUpllierList = []
            }
        }
     
    }
    chooseType(choosetype) {
        let listModelOption;
        if (choosetype == "courselist") {
            // this.getSpecialistByFiled();//根据选取的培训类型中的课程领域 获取课程列表
        
            listModelOption = {
                model: SHOW_ChooseListModel_MODEL,
                title: '选择课程',
                type: "checkbox",
                columns: [
                    {
                        title: '序号',
                        dataIndex: 'key',
                        width: 60,
                        align: "center",
                        render: (text, index, key) => key + 1
                    },
                    {
                        title: '课程名称',
                        dataIndex: 'name',
                        render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 15)}</span></Tooltip>
                    },
                    {
                        title: '课程描述',
                        dataIndex: 'descri',
                    },
                    {
                        title: '专家/讲师',
                        dataIndex: 'specialistname',
                    },
                    {
                        title: '专业领域',
                        dataIndex: 'specialistfield',
                    },
                    {
                        title: '联系方式',
                        dataIndex: 'specialisttel',
                    },
                ]
            }
        } else if (choosetype == "chooseTrainSchme") {

            listModelOption = {
                model: SHOW_ChooseListModel_MODEL,
                title: '选择计策划',
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
                        title: '编号',
                        dataIndex: 'code',
                        width: 80,
                        align: "center",
                    },
                    {
                        title: '培训策划名称',
                        dataIndex: 'name',
                        width: 250,
                        align: "center",
                        render: (text, redord) => <Tooltip title={text}><span>{text && text.substr(0, 20)}</span></Tooltip>
                    },
                    {
                        title: '培训类型',
                        dataIndex: 'trainTypeName',
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
        } else if (choosetype == "supplier") {
            listModelOption = {
                model: SHOW_ChooseListModel_MODEL,
                type: "checkbox",
                title: '选择供应商',
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
                        render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 20)}</span></Tooltip>
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
        } else if (choosetype == "apply") {
            listModelOption = {
                model: SHOW_ChooseListModel_MODEL,
                type: "checkbox",
                title: '选择供应商准入申请',
                columns: [
                    {
                        title: '序号',
                        dataIndex: 'key',
                        width: 100,
                        align: "center",
                        render: (text, index, key) => key + 1
                    },
                    {
                        title: '拟准入等级',
                        dataIndex: 'admittanceGrade',
                        width: 150,
                        align: "center",
                    },
                    {
                        title: '产品类别',
                        dataIndex: 'productCategory',
                        width: 150,
                        align: "center",
                    },
                    {
                        title: '产品范围',
                        dataIndex: 'productScope',
                        width: 150,
                        align: "center",
                    },
                    {
                        title: '供应商名称',
                        dataIndex: 'gysName',
                        width: 200,
                        align: "center",
                        render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 20)}</span></Tooltip>
                    },
                    {
                        title: '统一社会信用代码',
                        dataIndex: 'gysNumber',
                        width: 200,
                        align: "center",
                    },
                  
                ]
            }
        }
        this.setState({
            listModelOption: listModelOption
        })
        this.setState({
            choosetype
        })
    }

    //移除已经添加的供应商
  async  deleteSupplierlist(value) {
  
        const { modelType, info } = this.props
        const { supplierData } = this.state
        if(modelType==2){
            let result =await supplierTrain.removeGysFromTrainplan(value.id)
            if(result.code==200){
                let ind = _.findIndex(supplierData, { id: value.id })
                supplierData.splice(ind, 1)
                this.setState({
                    supplierData
                })
                this.getNewTrainPlanGysBases(info.id)
            }
        }else if(modelType==0){
            let ind = _.findIndex(supplierData, { id: value.id })
            supplierData.splice(ind, 1)
            this.setState({
                supplierData
            })
        }else{

        }
      
    }
    //移除已添加的附件
    deleteAttach(value) {
        const {modelType} = this.props
        const { attachData } = this.state
        if(modelType==0){
            let ind = _.findIndex(attachData, { id: value.id })
            attachData.splice(ind, 1)
            this.setState({
                attachData
            })
        }else if(modelType==2){
            let ind = _.findIndex(attachData, { id: value.id })
            attachData.splice(ind, 1)
            this.setState({
                attachData
            })
        }else{
            
        }
      
    }
    //上传文件
    setFile(files) {
        console.log(files)
        this.setState({
            trainPlanFileData: files
        })
    }

  //移除已经添加的课程
  deleteCourse(value) {
    const {modelType} = this.props
    const { courseData } = this.state
    if(modelType!=1){
        let ind = _.findIndex(courseData, { id: value.id })
        courseData.splice(ind, 1)
        this.setState({
            courseData
        })
    }
  
}

    timeGap(dataArr){
    let time1 =  Date.parse(dataArr[0])
    let time2 = Date.parse(dataArr[1])
    let timestamp =  Math.abs(time2-time1)
    timestamp =  timestamp / (24 * 3600 * 1000);
    return Math.floor(timestamp)+1;
    }
    handleChange = (value,dateString) => {
        console.log(dateString)
       
        this.setState({
             value: value,
             pxsj:dateString
         });
         if(dateString.length>0){
            const { setFieldsValue } = this.props.form;
            setFieldsValue({
                fqs:this.timeGap(dateString)
            })

       }
    };
    handlePanelChange = (value, mode) => {
        this.setState({
            value,
            mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
        });
    };
   handleBmjzrq = (value,dateString)=>{
       console.log(value,dateString)
    this.setState({
         bmjzrqValue: value,
         bmjzrq:dateString
    });
}

handleTypeChange = (value)=>{
    console.log(value)
    const { setFieldsValue } = this.props.form
    this.setState({ 
        type:value,
    });
    setFieldsValue({
        plotType:[]
    })
  
    this.getTrainSchmeTypeTree(value)
}
    handleBdrq = (value,dateString)=>{
        console.log(value,dateString)
     this.setState({
          bdrqValue: value,
          bdrq:dateString
     });
   }
    render() {
        const { toggleStore, modelType } = this.props;
        const { schmelist, supplierList, choosetype, treeData, schmeData, supplierData, courseData, courselist , applylist, attachData,
            radioGroup, listModelOption, schmePaginations, gysPaginations, applyPaginations,coursePaginations, current, selectedvalue,type, value, mode, bdrqValue,bmjzrqValue  } = this.state
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
        const typelist = choosetype == "chooseTrainSchme" ? schmelist : (choosetype == "supplier" ? supplierList : (choosetype == "apply" ?applylist:courselist) );
  
        //选择弹出框的列表数据中默认选择的数据
        const disabledData = choosetype == "chooseTrainSchme" ? schmeData : (choosetype == "supplier" ? supplierData : courseData);
        //页码
        const paginations = choosetype == "chooseTrainSchme" ? schmePaginations : (choosetype == "supplier" ? gysPaginations : (choosetype == "apply" ?applyPaginations:coursePaginations) );
        let that = this;
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
                            fileId: file.response.fileid,
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

        const columns_course = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '课程名称',
                dataIndex: 'name',
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 15)}</span></Tooltip>
            },
            {
                title: '课程描述',
                dataIndex: 'descri',
            },
            {
                title: '专家/讲师',
                dataIndex: 'specialistname',
            },
            {
                title: '专业领域',
                dataIndex: 'specialistfield',
            },
            {
                title: '联系方式',
                dataIndex: 'specialisttel',
            },
            {
                title: '操作',
                dataIndex: 'cz',
                render: (text, record) => modelType!=1 && <Button type="danger" size={'small'} onClick={() => { this.deleteCourse(record) }} >删除</Button>
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
                title: '供应商名称',
                dataIndex: 'name',
                width: 300,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 15)}</span></Tooltip>
            },
            {
                title: '统一社会信用代码',
                dataIndex: 'code',
                width: 230,
                align: "center",
            },

            {
                title: '操作',
                dataIndex: 'cz',
                render: (text, record) =>modelType!=1 && <Button type="danger" size={'small'} onClick={() => { this.deleteSupplierlist(record) }} >删除</Button>
            },

        ]
        const columns_gyszr = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 100,
                align: "center",
                render: (text, index, key) => key + 1
            },
         
            {
                title: '拟准入等级',
                dataIndex: 'admittanceGrade',
                width: 150,
                align: "center",
            },
            {
                title: '产品类别',
                dataIndex: 'productCategory',
                width: 150,
                align: "center",
            },
            {
                title: '产品范围',
                dataIndex: 'productScope',
                width: 150,
                align: "center",
            },
            {
                title: '供应商名称',
                dataIndex: 'gysName',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 20)}</span></Tooltip>
            },
            {
                title: '统一社会信用代码',
                dataIndex: 'gysNumber',
                width: 200,
                align: "center",
            },
            {
                title: '操作',
                dataIndex: 'cz',
                width: 100,
                render: (text, record) =>modelType!=1 && <Button type="danger" size={'small'} onClick={() => { this.deleteSupplierlist(record) }} >删除</Button>
            },

        ]
        const columns_attach = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 100,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '附件名称',
                dataIndex: 'name',
                width: 300,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },

            {
                title: '附件',
                dataIndex: 'file',
                width: 130,
                align: "center",
                render: (text, redord) => redord.fileId && <span onClick={() => { window.open(`${supplierTrain.FileBaseURL}${redord.fileId}`) }} style={{ cursor: "pointer", 'color': '#3383da' }}>查看附件</span>
            },
            {
                title: '操作',
                width: 130,
                align: "center",
                dataIndex: 'cz',
                render: (text, record, key) => {
                    return ( modelType!=1 &&<div>  <Button type="danger" onClick={() => { this.deleteAttach(record) }} size={'small'}>删除</Button></div>)
                }
            },
        ]

        const TProps = {
            treeData,
            defaultValue:  selectedvalue,
            onSelect: this.TreeonChange,
            treeCheckable: true,
            labelInValue:true,
            multiple: true,
            allowClear: true,
            searchPlaceholder:  type == 'zx'?'请选择专项策划类型':'请选择准入策划类型',
            style: {
                width: '100%',
            },
        };
     
        return (
            <div>
                <Modal
                    title={modelType == 2 ? '修改培训计划' :(modelType == 1?"查看培训计划详情":"新建培训计划") }
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
                                            <Form.Item {...formItemLayout} label={'培训策划'}>
                                                {getFieldDecorator(`trainplotName`, {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '培训策划',
                                                        },
                                                    ],
                                                })(<Input disabled={true} addonAfter={<Icon style={{ cursor: 'pointer' }} onClick={() => { this.chooseType("chooseTrainSchme"); toggleStore.setToggle(SHOW_ChooseListModel_MODEL) }} type="plus" />} />)}
                                            </Form.Item>
                                        </Col>
                                        {/* <Col span={12} >
                                        {
                                           modelType==2?(
                                            <Form.Item {...formItemLayout} label={'类型'}>
                                            <TreeSelect {...tProps} />

                                        </Form.Item>
                                           ):(
                                            <Form.Item {...formItemLayout} label={'培训类型'}>
                                            {getFieldDecorator(`trainTypeName`, {
                                                initValue: "培训类型",
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
                                           
                                           
                                        </Col> */}
                                         <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'名称'} style={{ marginBottom: 20 }}>
                                                {getFieldDecorator(`name`, {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '计划名称不能为空',
                                                        },
                                                    ],
                                                })(<Input  />)}
                                            </Form.Item>
                                        </Col>
                                          <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'培训分类'}>
                                                <Select  value={type}  onChange={this.handleTypeChange}>
                                                <Option value="zx">专项培训</Option>
                                                 <Option value="zr">准入培训</Option>
                                                    </Select>

                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                     
                                           <Form.Item {...formItemLayout} label={'类型'}>
                                           {getFieldDecorator(`plotType`, {
                                                 
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: '名称不能为空',
                                                        },
                                                    ],
                                                })(   <TreeSelect {...TProps} />)}
                                         
                                            </Form.Item>
                                           
                                        </Col>

                                    </Row>
                                    <Row gutter={24}>
                                 
                                        <Col span={24} >
                                            <Form.Item {...formItemLayout_row} label={'培训主题'} style={{ marginBottom: 20 }}>
                                                {getFieldDecorator(`zt`, {
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '培训主题不能为空',
                                                        },
                                                    ],
                                                })(<Input />)}
                                            </Form.Item>
                                        </Col>
                                       
                                        <Col span={24} >
                                            <Form.Item {...formItemLayout_row} label={'培训对象'} style={{ marginBottom: 20 }}>
                                                {getFieldDecorator(`pxdx`, {
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
                        


                              <Card bordered={false} title={<b>培训课程</b>} extra={
                                    <Button type="primary" onClick={() => {
                                        //只有选择培训类型后，才能选择课程
                                            this.chooseType("courselist")
                                            toggleStore.setToggle(SHOW_ChooseListModel_MODEL);
                                      
                                    }}>
                                        新增
                                            </Button>
                                } className="new_supplier_producelist">
                                    <Row style={{ marginBottom: 10 }}>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => key} columns={columns_course} dataSource={courseData} />
                                        </Col>
                                    </Row>
                                </Card>

                            </Form>
                        </TabPane>
                        <TabPane tab="供应商报名信息" key="1">
                            <Form className="ant-advanced-search-form" onSubmit={(e) => { }}>
                            <Card bordered={false} title={<b>供应商</b>} extra={
                                    <Button type="primary" onClick={() => {
                                        //只有选择培训类型后，才能选择课程

                                        this.chooseType(type=='zx'?"supplier":"apply")
                                        toggleStore.setToggle(SHOW_ChooseListModel_MODEL);

                                    }}>
                                        新增
                                            </Button>
                                } className="new_supplier_producelist">
                                    <Row style={{ marginBottom: 10 }}>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => text.id} columns={type=='zx'?columns_gys:columns_gyszr} dataSource={supplierData} />
                                        </Col>
                                    </Row>
                                </Card>
                            <Row gutter={24} style={{ marginBottom: 20 }}>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'培训时间'}>
                                                <RangePicker format={`YYYY-MM-DD`} mode={mode} value ={value} onChange={this.handleChange} onPanelChange={this.handlePanelChange} placeholder={['起始时间', '结束时间']} style={{ width: '100%' }} />
                                            </Form.Item>
                                        </Col>

                                        <Col span={6} >
                                            <Form.Item {...formItemLayout} label={'为期'}>
                                                {getFieldDecorator(`fqs`, {
                                                    initValue: '培训分期数',
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: '培训分期数',
                                                        },
                                                    ],
                                                })(<InputNumber disabled min={0} max={100} />)}
                                                <span className="ant-form-text"> 天</span>
                                            </Form.Item>
                                        </Col>
                                        <Col span={6} >
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
                                    </Row>
                                    <Row gutter={24}>


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
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'是否收费'}>
                                            <Radio.Group onChange={ev => this.radioGroupChange(ev, 'sfsf')} value={radioGroup.sfsf}>
                                                <Radio value={1}>是</Radio>
                                                <Radio value={0}>否</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                    {
                                        radioGroup.sfsf == 1 &&
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
                                    }
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'培训报名截止'}>
                                            {/* {getFieldDecorator(`bmjzrq`, {
                                                initialValue:bmjzrqValue,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '培训报名截止',
                                                    },
                                                ],
                                            })(   )} */}
                                         <DatePicker format={`YYYY-MM-DD`} value={bmjzrqValue} onChange={this.handleBmjzrq} locale={locale} style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'报到日期'}>
                                            {/* {getFieldDecorator(`bmjzrq`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '培训班次',
                                                    },
                                                ],
                                            })()} */}
                                            <DatePicker format={`YYYY-MM-DD HH:mm`}  showTime defaultValue={bdrqValue} onChange={this.handleBdrq} locale={locale} style={{ width: '100%' }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'报名人数限制'}>
                                            {getFieldDecorator(`bmrsxz`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '培训班次',
                                                    },
                                                ],
                                            })(<InputNumber min={0}

                                                max={100000} />)}
                                              <span className="ant-form-text"> 人 / 家</span>
                                        </Form.Item>
                                    </Col>
                                </Row>
                         

                            </Form>
                        </TabPane>
                        <TabPane tab="其他" key="2">
                            <Form className="ant-advanced-search-form" onSubmit={(e) => { }}>
                            <Row gutter={24}  >
                                    <Col span={12}  >
                                        <Form.Item label={'开户户名'} {...formItemLayout} style={{ marginBottom: 20 }}>
                                            {getFieldDecorator(`hkfsyh`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '汇款方式',
                                                    },
                                                ],
                                            })(<Input  />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}  >
                                        <Form.Item label={'开户行地址'} {...formItemLayout} style={{ marginBottom: 20 }}>
                                            {getFieldDecorator(`hkfskhh`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '汇款方式',
                                                    },
                                                ],
                                            })(<Input  />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}  >
                                        <Form.Item label={'汇款方式账号'} {...formItemLayout} style={{ marginBottom: 20 }}>
                                            {getFieldDecorator(`hkfszh`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '汇款方式',
                                                    },
                                                ],
                                            })(<Input  />)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={24}  >
                                        <Form.Item label={'费用说明'} {...formItemLayout_row} style={{ marginBottom: 20 }}>
                                            {getFieldDecorator(`fysm`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '费用说明',
                                                    },
                                                ],
                                            })(<TextArea rows={2} style={{ width: '100%' }} />)}
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={24}>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'主办单位'}>
                                            {getFieldDecorator(`zbdw`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '请填写主办单位',
                                                    },
                                                ],
                                            })(<Input

                                            />)}

                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'培训负责人'}>
                                            {getFieldDecorator(`pxfzr`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '请填写培训负责人',
                                                    },
                                                ],
                                            })(<Input
                                               
                                            />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'联系方式'}>
                                            {getFieldDecorator(`tel`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '请填写联系方式',
                                                    },
                                                ],
                                            })(<Input
                                               
                                            />)}
                                        </Form.Item>
                                    </Col>
                                     
                                </Row>
                                <Row gutter={24}>
                                    <Col span={24}  >
                                        <Form.Item label={'备注'} {...formItemLayout_lg} style={{ marginBottom: 20 }}>
                                            {getFieldDecorator(`bz`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '备注',
                                                    },
                                                ],
                                            })(<TextArea rows={2} />)}
                                        </Form.Item>
                                    </Col>
                                </Row>




                                    <Card bordered={false} title={<b>附件</b>} extra={
                                    <Button type="primary" onClick={() => {
                                        //只有选择培训类型后，才能选择供应商

                                        // this.chooseType("supplier")
                                        toggleStore.setToggle(SHOW_NewBZYQ_MODEL);


                                    }}>
                                        上传
                                            </Button>
                                } className="new_supplier_producelist">
                                    <Row>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => key} columns={columns_attach} dataSource={attachData} />
                                        </Col>
                                    </Row>
                                </Card>

                              {/* <Row gutter={24}>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'是否审批'}>
                                        <Radio.Group onChange={ev=>this.radioGroupChange(ev,'status')} value={radioGroup.status}>
                                                <Radio value={1}>是</Radio>
                                                <Radio value={0}>否</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>

                                </Row> */}
                            </Form>
                        </TabPane>
                    </Tabs>







                </Modal>
                {
                    toggleStore.toggles.get(SHOW_NewBZYQ_MODEL) && <NewBZYQ addBZYQFn={(obj) => { this.addBZYQFn(obj) }} />
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

export default Form.create({ name: 'NewSupplier' })(NewTrainPlan);;