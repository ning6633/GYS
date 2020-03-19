
import React, { Component, Fragment } from 'react';
import { Modal, Form, Row, Col, Input, Table, Tabs, Card, DatePicker, Icon, Button, message, Tooltip, Checkbox, Radio, Descriptions } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_NoticeDetails_MODEL, SHOW_NoticeSignUp_MODEL, SHOW_ManualInput_MODEL, SHOW_ListSelection_MODEL } from "../../../../../../constants/toggleTypes"
import { supplierTrain } from '../../../../../../actions'
import { Scrollbars } from 'react-custom-scrollbars';
import _ from "lodash";
import ManualInput from '../ManualInput/index'
import ListSelection from '../ListSelection/index'
// 公用选择供应商组件

const { TabPane } = Tabs;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class SignUp extends React.Component {
    state = {
        addList: [],
        gysId:null,
        planId:null,
        addedList:[]
    }
   async componentDidMount(){
        let res = await supplierTrain.comfgysInfo()
        //let ret = await 
        this.setState({
            gysId:res.data.gysId,
            planId:this.props.id,
          
        },()=>{
            this.getAddedList()

        })
    }
    handleCancel = () => {
        //点击取消，隐藏model框
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_NoticeSignUp_MODEL)
    }
    async handleSubmit() {
        //点击确定出发的事件
        let { toggleStore,  } = this.props
        let { planId ,gysId} = this.state
      
        this.trainApplyNewTrainId({ gysid:gysId, trainid: planId })

        toggleStore.setToggle(SHOW_NoticeSignUp_MODEL)
    }
    async trainApplyNewTrainId(body) {
        let { addList } = this.state
        if(addList.length > 0){
            let ret = await supplierTrain.trainApplyNewTrainId(body)
            if (ret.code == 200) {
                this.trainApplyNew(ret.data.id, addList)
            }
        }
    }
    async trainApplyNew(id,data) {
        console.log(id, data)
        const { loaddata} = this.props
        let _arr = []
        data.forEach(item=>{
            _arr.push({
                "gender": item.gender,
                "otherinfo": item.otherinfo ,
                "tel":item.tel ,
                "title":item.title ,
                "username": item.username,
                "userorg": item.userorg
            })
        })
      
        let res = await supplierTrain.trainApplyNewversion(id, _arr)
        if(res.code == 200){
            loaddata()
             message.success(res.message)
        }
    }
    async getAddedList(){
        let { planId ,gysId ,addList} = this.state
      
        let res = await supplierTrain.getTrainAddedUsers(gysId,planId)
       
        if(res.code==200){
            let _arr =res.data
          let allArr =  _arr.concat(addList)
            this.setState({
                addedList:allArr
            })
        }

    }
    manualInput = async(data) => {
        // if(data){
              
        //     let res = await supplierTrain.trainApplyNewversion(id, [data])
        //     if(res.code==200){
        //         message.success(res.message)
        //     }
        //     this.getAddedList()
        // }
        // //手动添加报名人员信息，回填至Table
        let { addList } = this.state
           let _arr = addList
        _arr.push(data)
        _arr.forEach((item, index) => {
            item['index'] = index
            item['status'] = 'unAdd'
        })
        console.log(_arr)
        this.setState({
            addList: _arr
        })
    }
    getChooseList = (data) => {
        //从列表选择的人员
        let { addList,addedList } = this.state
        let allArr= addedList.concat(addList)
        let _arr = addList
        data.forEach((item) => {
            let _index = _.findIndex(allArr, { id: item.id })
            if (_index == -1) {
                _arr.push(item)
            }
        })
        _arr.forEach((item, index) => {
            item['index'] = index
            item['status'] = 'unAdd'
            item['differentKey'] = `${item.username}${item.tel}`
        })
        console.log(_arr)
        this.setState({
            addList: _arr,
           // addedList:addedList.concat(_arr),
        })
    }
   deleteListOne = async (record)=>  {
       if(record.status==undefined){
let res = await supplierTrain.deleteTrainApplyNewUsers([record.id])
        if(res.code==200){
            message.success(res.message)
            this.getAddedList()
        }
       }else{
        // //删除添加的报名人员中的一条
        let { addList } = this.state
        let _arr = addList
        let _index = _.findIndex(_arr, { username: record.username })
        console.log(_index)
        if(_index>-1){
            _arr.splice(record.index, 1)
        }
        _arr.forEach((item, index) => {
            item.index = index
        })
        this.setState({
            addList: _arr
        })
       }
    
    
     

    }
    render = () => {
        let { toggleStore } = this.props
        let { addedList ,addList } = this.state
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        const ExtraButton = () => {
            return (
                <Fragment>
                    <Button type="primary" style={{ marginRight: 20 }} onClick={() => {
                        let { toggleStore } = this.props
                        toggleStore.setToggle(SHOW_ListSelection_MODEL)
                    }}>从列表中选择</Button>
                    <Button type="primary" onClick={() => {
                        let { toggleStore } = this.props
                        toggleStore.setToggle(SHOW_ManualInput_MODEL)
                    }}>手动添加</Button>
                </Fragment>
            )
        }
        const columnsList = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                render: (text, index, key) => key + 1
            },

            {
                title: '姓名',
                dataIndex: 'username',
                width: 100,
                align: "center",
            },
            {
                title: '性别',
                dataIndex: 'gender',
                width: 55,
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
                width: 100,
                align: "center",
            },
            {
                title: '联系方式',
                dataIndex: 'tel',
                width: 100,
                align: "center",
            },
            {
                title: '备注',
                dataIndex: 'otherinfo',
                width: 100,
                align: "center",
            }, {
                title: '状态',
                dataIndex: 'status',
                width: 60,
                align: "center",
                render: (text, index, key) =><span style={{color:text?'red':'inherit'}}>{text?'未报名':'已报名'}</span>
            },
            {
                title: '操作',
                dataIndex: '操作',
                width: 100,
                align: "center",
                render: (text,record) => {
                    return (
                        <Button type="danger" size="small" onClick={() => { this.deleteListOne(record) }}>删除</Button>
                    )
                }
            },
        ]
        return (
            <Modal
                title={<div style={{ width: "100%", textAlign: "center", fontWeight: 900 }}>添加报名人员</div>}
                visible={toggleStore.toggles.get(SHOW_NoticeSignUp_MODEL)}
                onOk={(e) => { this.handleSubmit(e) }}
                onCancel={this.handleCancel}
                width={900}
            >


                <Card extra={<ExtraButton />}>
                    <Scrollbars
                        autoHeight
                        autoHide
                        autoHideTimeout={1000}
                        autoHideDuration={200}
                        style={{ width: '100%' }}
                        autoHeightMin={100}
                        autoHeightMax={500}
                    >
                        <Table
                            size='middle'
                            // loading={loading}
                            bordered={false}
                            rowKey={(text,key) => key}
                            // rowSelection={userTypeVerty == 'approve' ? rowSelection : null} 
                            scroll={{ x: 800 }}
                            columns={columnsList}
                            pagination={false}
                            dataSource={addedList.concat(addList)}
                        />
                    </Scrollbars>
                    {
                        toggleStore.toggles.get(SHOW_ManualInput_MODEL) && <ManualInput manualInput={this.manualInput} />
                    }
                    {
                        toggleStore.toggles.get(SHOW_ListSelection_MODEL) && <ListSelection getChooseList={this.getChooseList} />
                    }

                </Card>
            </Modal>
        )
    }


}

export default Form.create({ name: "signUp" })(SignUp);
