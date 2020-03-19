import React, { Component, Fragment } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, DatePicker, Radio, Button, message, Tooltip, Select , TreeSelect, InputNumber, Steps } from 'antd';
import { observer, inject, } from 'mobx-react';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import './index.less'
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import { SHOW_NewTrainPlot_MODEL, SHOW_ChooseListModel_MODEL ,SHOW_NewBZYQ_MODEL} from "../../../../../../constants/toggleTypes"
import { supplierTrain, specialAction, supplierAction } from "../../../../../../actions"
// 公用选择供应商组件
import ChooseListModel from "../../../../../../components/ChooseListModel"
import NewBZYQ  from '../NewBZYQ'
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
        title: '课程信息',
        content: 'Second-content',
    },

];
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class NewTrainScheme extends React.Component {
    state = {
        choosetype: "",//新增课程范围还是供应商范围
        courselist: {},
        supplierList: {},
        trainTypes: [],
        courseData: [],//选择的供应商类别
        attachData:[],
        expertData: [],//选择的课程类别
        traintypeData: [],//选择的培训类型
        trainPlanFileData: [],
        defaultValue:[],
        selectedvalue:[],
        treeData: [],
        radioGroup: {
            status: 0,
            sfsf: 1
        },
        type:'zx',
        current: 0,
        value:[],
        mode: ['month', 'month'],
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NewTrainPlot_MODEL)
    };
    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }
    radioGroupChange = (e,type) => {
      
        const { radioGroup } = this.state;
        radioGroup[type]=e.target.value
        this.setState({
            // value: e.target.value,
            radioGroup
        });
    }
       //新增标准要求
       addBZYQFn(obj){
        const {attachData} =  this.state
        attachData.push(obj)
        console.log(attachData)
        this.setState({
            attachData
        })
    }

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
    async getTrainSchmeTypeTree(type) {
        let result = await supplierTrain.getTrainPlotTypesByType(type)
        let treeData = this.onLoadData(result.data)
        if (result.code == 200) {
            this.setState({
                treeData:treeData.length!=0 ? treeData[0].children : []
            })
        }



   

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

        const { toggleStore, refreshData ,modelType} = this.props;
        const { attachData , courseData, traintypeData, value,radioGroup, type } = this.state;
        this.props.form.validateFields(async (err, values) => {
            console.log(values)
            if (err) {
                var errMessage = []
                console.log( err)

                for(let key in err){
                    err[key].errors.forEach(item=>{
                        errMessage.push(item.message)
                    })
                }
                // err.name.errors.forEach(item => {
                //     console.log(item)
                //     errMessage.push(item.message)
                // })
                console.log(errMessage)
                message.error(errMessage.join(','))
            }else{
               if(value.length==0){
                   message.error('请选择培训时间')
                   return
               }
               if( values.plotType.length==0){
                message.error('请选择培训类型')
                return
               }
               
                let userId = supplierTrain.pageInfo.userId;
           
                let trainStart = value[0].format('YYYY-MM')
                let trainEnd = value[1].format('YYYY-MM')
                let trainplottypeArr = []
                let trainploAttachArr = []
                let trainplotcourse = []
            
                values.plotType.forEach(item=>{
                    trainplottypeArr.push({
                        trainPlotTypeId :item.value
                    })
                })
                courseData.forEach(item=>{
                    trainplotcourse.push({
                        trainCourseId :item.id.split('T')[0]
                    })
                })
                attachData.forEach(item=>{
                    trainploAttachArr.push({
                        "fileId": item.fileId,
                        "fileName": item.fileName,
                        "name": item.name,
                      
                    })
                })
                let time = `${trainStart} ~ ${trainEnd}`
                     let newvalues = {
                         trainPlot:{
                            ...values,
                            time,
                            type,
                            sfsf:radioGroup.sfsf,
                            status:radioGroup.status,
                            createUser:userId,
                         },
                         trainplot_Trainplottype:trainplottypeArr,
                         trainplot_Traincourse:trainplotcourse,
                         trainPlot_File:trainploAttachArr
                 
                }
                console.log(newvalues)
                if(modelType==0){
                    let trainPlotResult = await supplierTrain.NewTrainSchme(newvalues)
                    console.log(trainPlotResult)
                    if(trainPlotResult.code==200){
                   
                        message.success(trainPlotResult.message)
                            refreshData();
                    toggleStore.setToggle(SHOW_NewTrainPlot_MODEL)
                   }
                }else if(modelType==2){
                    if( value.length>0){
                        let trainStartEdit =value[0].format('YYYY-MM')
                        let trainEndEdit =value[1].format('YYYY-MM')
                        newvalues.trainPlot['time'] =`${trainStartEdit} ~ ${trainEndEdit}`
                    }else{
                        newvalues.trainPlot['time'] = info.time
                    }
                    console.log(newvalues)
                    let trainPlotResult = await supplierTrain.EditTrainSchme(newvalues)
                    console.log(trainPlotResult)
                    if(trainPlotResult.code==200){
                        message.success(trainPlotResult.message)
                            refreshData();
                    toggleStore.setToggle(SHOW_NewTrainPlot_MODEL)
                }
            }
     
        } 
            // if (!err) {
            //     console.log(values)
            //     let trainShift = values.trainShift.format('YYYY-MM-DD HH:mm')
            //     let trainStart = values.trainStartEnd[0].format('YYYY-MM-DD HH:mm')
            //     let trainEnd = values.trainStartEnd[1].format('YYYY-MM-DD HH:mm')
            //     let newvalues = {
            //         ...values,
            //         trainShift
            //     }
            //     //先调用创建培训计划接口,得到培训计划id
            //     let TrainTypeVO = {
            //         ...newvalues,
            //         status: 0,
            //         createUser: supplierTrain.pageInfo.username,
            //         updateUser: supplierTrain.pageInfo.username,
            //         trainTypeId: traintypeData[0].id,
            //         trainStart,
            //         trainEnd
            //     }
            //     console.log(TrainTypeVO)
            //     let trainPlanId = await supplierTrain.createTrainPlan(TrainTypeVO)
            //     //
            //     if (trainPlanId) {
            //         let TrainExpertTypeVO = [];
            //         let TrainGysTypeVO = [];
            //         let trainPlanFileVO = [];
            //         expertData.forEach((item) => {
            //             let data = {
            //                 trainPlanId: trainPlanId,
            //                 expertField: item.fileid,
            //                 expertId: item.id,
            //                 expertName: item.name,
            //                 expertTel: item.tel,
            //             }
            //             TrainExpertTypeVO.push(data)
            //         })
            //         courseData.forEach((item) => {
            //             let data = {
            //                 trainPlanId: trainPlanId,
            //                 provider_id: item.provider_id,
            //             }
            //             TrainGysTypeVO.push(data)
            //         })
            //         trainPlanFileData.forEach((item) => {
            //             let data = {
            //                 trainPlanId: trainPlanId,
            //                 fileId : item.fileid,
            //                 name : item.name ,
            //             }
            //             trainPlanFileVO.push(data)
            //         })
            //         //再新增培训计划-课程关联表
            //         await supplierTrain.createTrainExpert(TrainExpertTypeVO)
            //         //再新增培训计划-供应商关联表
            //         await supplierTrain.createTrainGys(TrainGysTypeVO)
            //         //再新增培训计划-附件关联表
            //         await supplierTrain.createTrainFile(trainPlanFileVO)
            //     }
            //     //刷新培训类型列表
            //     refreshData();
            //     toggleStore.setToggle(SHOW_NewTrainPlot_MODEL)
            // }
        });
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NewTrainPlot_MODEL)
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
   
    async loadCourses(pageNum = 1, rowNum = 10, coursename=''){
        let params = {
            coursename,
            pageNum,
            rowNum
        }
        let courselistret = await supplierTrain.getCourses(params);
        console.log(courselistret)
        if(courselistret.code==200){
            courselistret.data.list.forEach(item=>{
                item['id'] = `${item.id}T${item.specialistfileid}`
            })
            console.log(courselistret.data)
            this.setState({
                courselist:courselistret.data,
                coursePaginations: { search: (value) => { this.loadCourses(1,10,value) }, showTotal: () => `共${courselistret.data.recordsTotal}条`, onChange: (page, num) => { this.loadCourses(page, num) }, showQuickJumper: true, total: courselistret.data.recordsTotal, pageSize: 10 }
            })
        }else{
            this.setState({
                courselist:[],
                coursePaginations: { search: (value) => { this.loadCourses(1,10,value) }, showTotal: () => `共${courselistret.data.recordsTotal}条`, onChange: (page, num) => { this.loadCourses(page, num) }, showQuickJumper: true, total: courselistret.data.recordsTotal, pageSize: 10 }
            })
        }
       
    }


    //根据培训策划ID获取附件信息列表
    async loadAttach(id) {
        let attachlistret = await supplierTrain.getTrainAttach(id);//
        console.log(attachlistret)
        let total = attachlistret.length;
        this.setState({
            attachData:attachlistret.data,
         //   expertPaginations: {  showTotal: () => `共${total}条`, onChange: (page, num) => { this.expertpageChange(page, num) }, showQuickJumper: true, total: total, pageSize: 10 }
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
    /*************************************/
    async componentDidMount() {
        //获取培训类型列表
        this.getTrainSchmeTypeTree('zx')
        //获取供应商列表
        const {modelType,info} = this.props
        const { setFieldsValue } = this.props.form;
        console.log(info)

        if(modelType==2 || modelType==1){
           let trainplottype= info.trainplottype.map(item=>{
               return {
                   value:item.id,
                   label:item.name
               } 
           })
           const monthFormat = 'YYYY-MM';
           let times = info.time.split(' ~ ')
           let defaultValue=[moment(times[0], monthFormat),moment(times[1], monthFormat)]
            this.setState({ 
               selectedvalue:trainplottype ,
                value:defaultValue,
                type:info.type?info.type:'zx',
                defaultValue,
                radioGroup:{
                status:parseInt(info.status) ,
                sfsf:parseInt(info.sfsf)
            }
        });
            setFieldsValue({
                ...info,
                plotType:trainplottype
            })
           this.loadAttach(info.id)
           this.getTrainSchmeCourse(info.id)

        }else{
            setFieldsValue({ sfsf:1,status:0 })
        }
       
    }
    //根据选取的培训类型中的课程领域 获取课程列表
    async getSpecialistByFiled(username) {
        const { traintypeData } = this.state
        console.log(traintypeData)
        let expertType = [];
        for (let data of traintypeData[0].trainExpertTypeList) {
            if (data.expertTypeName) {
                expertType.push(data.expertTypeName)
            }
        };
        let attachlistret = await specialAction.getSpecialistByFiled(username, expertType)
        return attachlistret;
        /* if (attachlistret) {
            this.setState({
                courselist: {
                    list: attachlistret,
                    total: attachlistret.length
                }
            })
        } */
    }
    //

   async chooseZzApplyFn(data) {
        const { courseData, expertData, traintypeData, choosetype } = this.state
        const { info,modelType}=this.props
        const { setFieldsValue } = this.props.form;
        data.forEach( item => {
            if (choosetype == 'specialist') {
                expertData.push(item)
                this.setState({
                    expertData
                })
            }  else if (choosetype == 'chooseTrainType') {
                let _arr = [];
                _arr.push(item)
                this.setState({
                    traintypeData: _arr
                })
                setFieldsValue({
                    trainTypeName: item.trainName
                })
                let gystype = [];
                for (let data of item.trainGysTypeList) {
                    if (data.gysTypeName) {
                        gystype.push(data.gysTypeName)
                    }
                };
                setFieldsValue({
                    trainGysScope: gystype.join(",")//培训范围
                })
            }
        })
        if(choosetype=='courselist'){
            let item = data[0]
            console.log(item)
            if(item==undefined) return
            if(modelType==2){
              let result =  await supplierTrain.addTrainSchmeCourse([
                    {
                       
                        "trainCourseId":item.id.split('T')[0] ,
                        "trainPlotId": info.id,
                        "zjId": item.specialistid
                      }
                ])
                console.log(result)
            }
          
            courseData.push(item)
            this.setState({
                courseData
            })
        }
    }
    chooseType(choosetype) {
        let listModelOption;
        if (choosetype == "courselist") {
            // this.getSpecialistByFiled();//根据选取的培训类型中的课程领域 获取课程列表
            this.loadCourses();//获取课程列表
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
                        align: "center",
                        render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 15)}</span></Tooltip>
                    },
                    {
                        title: '课程描述',
                        align: "center",
                        dataIndex: 'descri',
                    },
                    {
                        title: '专家/讲师',
                        align: "center",
                        width: 100,
                        dataIndex: 'specialistname',
                    },
                    {
                        title: '专业领域',
                        align: "center",
                        width: 100,
                        dataIndex: 'specialistfield',
                    },
                    {
                        title: '联系方式',
                        align: "center",
                        dataIndex: 'specialisttel',
                    },
                ]
            }
        } else if (choosetype == "supplier") {
            listModelOption = {
                model: SHOW_ChooseListModel_MODEL,
                title: '选择供应商',
                type: "checkbox",
                columns: [
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
                        render: (text, record) => record.fileId && <span onClick={() => { window.open(`${supplierTrain.FileBaseURL}${record.fileId}`) }} style={{ cursor: "pointer", 'color': '#3383da' }}>查看附件</span>
                    },
                ]
            }
        } else if (choosetype == "chooseTrainType") {
            listModelOption = {
                model: SHOW_ChooseListModel_MODEL,
                title: '选择培训类型',
                columns: [
                    {
                        title: '序号',
                        dataIndex: 'key',
                        width: 45,
                        align: "center",
                        // fixed: "left",
                        render: (text, index, key) => key + 1
                    },
                    {
                        title: '培训类型名称',
                        dataIndex: 'trainName',
                        width: 200,
                        align: "center",
                        // fixed: "left",
                    },
                    {
                        title: '供应商类别',
                        dataIndex: 'trainGysTypeList',
                        width: 250,
                        align: "center",
                        render: (text, record) => {
                            let gystype = [];
                            for (let data of text) {
                                if (data.gysTypeName) {
                                    gystype.push(data.gysTypeName)
                                }
                            };
                            return <span>{gystype.join(",")}</span>
                        }
                    },
                    {
                        title: '课程类别',
                        dataIndex: 'trainExpertTypeList',
                        width: 150,
                        align: "center",
                        render: (text, record) => {
                            let pxzjtype = [];
                            for (let data of text) {
                                if (data.expertTypeName) {
                                    pxzjtype.push(data.expertTypeName);
                                }
                            };
                            return <span>{pxzjtype.join(",")}</span>
                        }
                    },
                    {
                        title: '创建日期',
                        dataIndex: 'createTime',
                        width: 200,
                        align: "center",
                        sorter: (a, b) => (moment(a.createTime).valueOf() - moment(b.createTime).valueOf()),
                        render: (text) => <Tooltip title={text && text.substr(0, 10)}><span>{text && text.substr(0, 10)}</span></Tooltip>
                    },
                    {
                        title: '更新时间',
                        dataIndex: 'updateTime',
                        width: 200,
                        align: "center",
                        sorter: (a, b) => (moment(a.updateTime).valueOf() - moment(b.updateTime).valueOf()),
                        render: (text) => <span>{text && text.replace(/\.0$/, '')}</span>
                    },
                    {
                        title: '是否有效',
                        dataIndex: 'status',
                        width: 100,
                        align: "center",
                        render: (text) => { return text == "yes" ? '是' : '否' },
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
    //移除已经添加的课程
  async  deleteCourse(value) {
        const {modelType,info} = this.props
        const { courseData } = this.state
        if(modelType==2){
            await  supplierTrain.removeTrainSchmeCourse(value.id)
        }
        let ind = _.findIndex(courseData, { id: value.id })
        courseData.splice(ind, 1)
        this.setState({
            courseData
        })
    }
    //移除已添加的附件
    deleteAttach(value) {
        const { attachData  } = this.state
        let ind = _.findIndex(attachData , { id: value.id })
        attachData .splice(ind, 1)
        this.setState({
            attachData 
        })
    }
    //上传文件
    setFile(files) {
        console.log(files)
        this.setState({
            trainPlanFileData: files
        })
    }


    handleChange = value => {
        this.setState({ value:value });
      };

      TreeonChange = (value, label) => {
        console.log('onChange ', value);
        // const { type, zxSelectedvalue,zrSelectedvalue } = this.state
        // if(type=='zx'){
        //     zxSelectedvalue.push(value.label)
        //     this.setState({ zxSelectedvalue });
        // }else{
        //     zrSelectedvalue.push(value.label)
        //     this.setState({ zrSelectedvalue });
        // }
    
       
    };

      handleTypeChange = (value)=>{
          console.log(value)
          const { type  } = this.state
          const { setFieldsValue } = this.props.form
          if(type=='zx'){
            this.setState({ 
                type:value,
            });
            setFieldsValue({
                plotType:[]
            })
          }else{
            this.setState({ 
                type:value,
            });
            setFieldsValue({
                plotType:[]
            })
          }
          this.getTrainSchmeTypeTree(value)
      }
      handlePanelChange = (value, mode) => {
        this.setState({
          value,
          mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]],
        });
      };
    
    render() {
        const { toggleStore,modelType } = this.props;
        const { courselist, supplierList, choosetype, treeData, expertData, courseData, traintypeData, trainTypes,attachData ,
            radioGroup, listModelOption, expertPaginations, coursePaginations, trainTypePaginations, current,selectedvalue ,zrSelectedvalue,value,mode ,defaultValue,type } = this.state
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
            labelCol: { span: 2 },
            wrapperCol: { span: 16 },
        };
        //选择弹出框的列表数据
        const typelist = choosetype == "courselist" ? courselist : (choosetype == "supplier" ? supplierList : trainTypes);
      
        //选择弹出框的列表数据中默认选择的数据
        const disabledData = choosetype == "courselist" ? courseData : (choosetype == "supplier" ? courseData : traintypeData);
        //页码
        const paginations = choosetype == "courselist" ? coursePaginations : (choosetype == "supplier" ? coursePaginations : trainTypePaginations);
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
                align: "center",
                width: 150,
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 15)}</span></Tooltip>
            },
            {
                title: '课程描述',
                dataIndex: 'descri',
                align: "center",
                width: 200,
            },
            {
                title: '专家/讲师',
                dataIndex: 'specialistname',
                align: "center",
                width: 100,
            },
            {
                title: '专业领域',
                dataIndex: 'specialistfield',
                align: "center",
                width: 100,
            },
            {
                title: '联系方式',
                dataIndex: 'specialisttel',
            },
            {
                title: '操作',
                dataIndex: 'cz',
                render: (text, record) => <Button type="danger" size={'small'} onClick={() => { this.deleteCourse(record) }} >删除</Button>
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
                render: (text, record) => record.fileId && <span onClick={() => { window.open(`${supplierTrain.FileBaseURL}${record.fileId}`) }} style={{ cursor: "pointer", 'color': '#3383da' }}>查看附件</span>
            },
            {
                title: '操作',
                width: 130,
                align: "center",
                dataIndex: 'cz',
                render: (text, record, key) => {
                    return (<div> <Button type="danger" onClick={() => { this.deleteAttach(record) }} size={'small'}>删除</Button></div>)
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
                    title={modelType==2?'修改培训策划':(modelType==1?"培训策划详情":'新建培训策划')}
                    width={960}
                    visible={toggleStore.toggles.get(SHOW_NewTrainPlot_MODEL)}
                    onOk={this.handleSubmit}
                    onCancel={this.handleCancel}
                    footer={
                        modelType!=1?
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
                        </Fragment>:null
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



                    <Tabs activeKey={String(current) }
                    onChange={(key)=>this.setState({
                        current:parseInt(key) 
                    })}
                     tabBarStyle={{cursor:'auto'}}
                    >
                        <TabPane tab="基本信息" key="0">
                            <Form className="ant-advanced-search-form" onSubmit={(e) => { }}>

                                <Card bordered={false} className="new_supplier_form">
                                    <Row gutter={24}>
                                    {modelType !=0 &&
                                        <Col span={24} >
                                        <Form.Item {...formItemLayout_row} label={'编号'}>
                                            {getFieldDecorator(`code`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '名称不能为空',
                                                    },
                                                ],
                                            })(<Input disabled/>)}
                                        </Form.Item>
                                    </Col>
                                    }
                                        <Col span={24} >
                                            <Form.Item {...formItemLayout_row} label={'名称'}>
                                                {getFieldDecorator(`name`, {
                                                    initValue: "名称",
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '名称不能为空',
                                                        },
                                                    ],
                                                })(<Input />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'培训分类'}>
                                                <Select  defaultValue={type}  onChange={this.handleTypeChange}>
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
                                                            required: true,
                                                            message: '类型不能为空',
                                                        },
                                                    ],
                                                })(   <TreeSelect {...TProps} />)}
                                         
                                            </Form.Item>
                                           
                                        </Col>
                                      
                                    </Row>
                                    <Row gutter={24} style={{ marginBottom: 20 }}>
                                        <Col span={12} >
                                            <Form.Item {...formItemLayout} label={'培训时间'}>
                                                {/* {getFieldDecorator(`trainStartEnd`, {
                                                    initValue: "培训起止日期",
                                                    rules: [
                                                        {
                                                            required: true,
                                                            message: '培训起止日期不能为空',
                                                        },
                                                    ],
                                                    value ={modelType==2?defaultValue: value}defaultValue={defaultValue} 
                                                })()} */}
                                                <RangePicker format={`YYYY-MM`}  mode={mode}  value ={value} onChange={this.handleChange}  onPanelChange={this.handlePanelChange} placeholder={['起始时间', '结束时间']}  style={{ width: '100%' }} />
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
                                                })(<InputNumber min={0} max={100} />)}
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
                                    <Col span={24} >
                                            <Form.Item {...formItemLayout_row} label={'培训地点'}>
                                                {getFieldDecorator(`pxdd1`, {
                                                    rules: [
                                                        {
                                                            required: false,
                                                            message: '名称不能为空',
                                                        },
                                                    ],
                                                })(<Input />)}
                                            </Form.Item>
                                        </Col>
                                        <Col span={24} >
                                            <Form.Item {...formItemLayout_row} label={'培训主题'} style={{ marginBottom: 20 }}>
                                                {getFieldDecorator(`zt`, {
                                                    initValue: '培训主题',
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
                                            <Form.Item {...formItemLayout_row} label={'背景'} style={{ marginBottom: 20 }}>
                                                {getFieldDecorator(`bj`, {
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
                                            <Table rowKey={(text, key) =>`${text.id}T${text.specialistid}` } columns={columns_course} dataSource={courseData} />
                                        </Col>
                                    </Row>
                                </Card>
                            </Form>
                        </TabPane>
                        <TabPane tab="其他" key="1">
                            <Form className="ant-advanced-search-form" onSubmit={(e) => { }}>
                              
                                <Row gutter={24}>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'是否收费'}>
                                          <Radio.Group onChange={ev=>this.radioGroupChange(ev,'sfsf')} value={radioGroup.sfsf}>
                                                <Radio value={1}>是</Radio>
                                                <Radio value={0}>否</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                    {
                                        radioGroup.sfsf==1 &&
                                        <Col span={12} >
                                        <Form.Item {...formItemLayout_row} label={'培训费用'}>
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
                                   
                                </Row>
                                <Row gutter={24}>
                                    <Col span={24}  >
                                        <Form.Item label={'其他备注'} {...formItemLayout_lg} style={{ marginBottom: 20 }}>
                                            {getFieldDecorator(`qtbz`, {
                                                initValue: '其他备注',
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '其他备注',
                                                    },
                                                ],
                                            })(<TextArea rows={3} />)}
                                        </Form.Item>
                                    </Col>
                                </Row>


                             

                                {/* <Row gutter={24}>
                                    <Col span={24}  >
                                        <Form.Item label={'培训产出'} {...formItemLayout_lg} style={{ marginBottom: 20 }}>
                                            {getFieldDecorator(`pxcc`, {
                                                initValue: '培训产出',
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '培训产出',
                                                    },
                                                ],
                                            })(<TextArea rows={3} style={{ width: '100%' }} />)}
                                        </Form.Item>
                                    </Col>
                                </Row> */}
                              
                                <Card bordered={false} title={<b>附件</b>} extra={
                                    <Button type="primary" onClick={() => {
                                        //只有选择培训类型后，才能选择供应商
                                        
                                            // this.chooseType("supplier")
                                            toggleStore.setToggle(SHOW_NewBZYQ_MODEL);
                                      

                                    }}>
                                        上传附件
                                            </Button>
                                } className="new_supplier_producelist">
                                    <Row>
                                        <Col span={24}>
                                            <Table rowKey={(text, key) => key} columns={columns_attach} dataSource={ attachData} />
                                        </Col>
                                    </Row>
                                </Card>
                                <Row gutter={24}>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'是否审批'}>
                                        <Radio.Group onChange={ev=>this.radioGroupChange(ev,'status')} value={radioGroup.status}>
                                                <Radio value={1}>是</Radio>
                                                <Radio value={0}>否</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>

                                </Row>
                            </Form>
                        </TabPane>

                    </Tabs>







                </Modal>
                {
                    toggleStore.toggles.get(SHOW_NewBZYQ_MODEL)&&<NewBZYQ addBZYQFn={(obj)=>{this.addBZYQFn(obj)}} />
                }
                
                {
                    toggleStore.toggles.get(SHOW_ChooseListModel_MODEL) && <ChooseListModel list={typelist} comparedList={disabledData} pagination={paginations} options={listModelOption} chooseFinishFn={(val) => { this.chooseZzApplyFn(val) }} />
                }
            </div >
        );
    }
}

export default Form.create({ name: 'NewSupplier' })(NewTrainScheme);;