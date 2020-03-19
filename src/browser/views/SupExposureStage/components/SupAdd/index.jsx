import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { Modal, Form, Row, Col, Input, Button,Tooltip , Table, Select,Icon, message } from 'antd';
import { SHOW_AddList_MODEL,SHOW_ChooseSupplierPub_MODEL } from "../../../../constants/toggleTypes";
import { toJS } from "mobx"
import { specialExposure } from "../../../../actions"
// import ChooseTBSupplier from '../../../../components/ChooseTBSupplier'
import ChooseListModel from '../../../../components/ChooseListModel'
import "./index.less"

// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { TextArea } = Input;
const { Option } = Select;

@inject('toggleStore', 'supplierStore')
@observer
class SupAdd extends React.Component {
    state = {
        supplierList: [],
        provider_id: '',
        uploadList: {},
        list: {},
        SupList:{},
        Suppaginations:{},
        searchValue:''
    }
    closed = () => {
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_AddList_MODEL);
    }
    handleSubmit = () => {
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                values.gys_id = this.state.provider_id
                values.status = 0
                values.create_user_id = specialExposure.pageInfo.username
                let res = await specialExposure.addGysmessage(values)
                if (res.code == 200) {
                    message.success(res.message)
                    this.closed()
                    this.props.loaddata({})
                }
            }
        });
    }
    
    // async BZGYS() {
    //     let res = await specialExposure.getGysmessage(name=1,pageNum=1,rowNum=5)
    //     if (res.code == 200) {
    //         this.setState({ supplierList: res.data })
    //     }
    // }
    uploaddata = () => {
        const { setFieldsValue } = this.props.form;
        let { name, type, content } = this.props.uploadInfo
        setFieldsValue({ name, type, content })
    }
    uploadmessage = () => {
        let { uploadInfo } = this.props
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                values.id = uploadInfo.id
                values.status = uploadInfo
                let res = await specialExposure.uploademessage(values)
                if (res.code == 200) {
                    message.success(res.message)
                    this.closed()
                    this.props.loaddata({})
                }
            }
        });
    }
    async chooseSupFn(data){
        const {setFieldsValue } = this.props.form
           if(data){
            let supObj = data[0]
            setFieldsValue({
                name:supObj.name
            })
            this.setState({
                provider_id:supObj.provider_id,
            })
           }
    }
    async SuppageChange(page, num) {
        let {searchValue} = this.state
        this.loadSup({pageNum:page,rowNum:num,name:searchValue})
    }
    //供应商搜索
    async SupSearch(value){
        this.setState({searchValue:value})
        this.loadSup({pageNum:1,rowNum:10,name:value})
    }
    //加载供应商
    async loadSup(body){ 
        let ret = await specialExposure.getGysmessage(body);
        this.setState({
            SupList :{
                list:ret.data.list,
                recordsTotal:ret.data.total
            } ,
            Suppaginations :{search:(value)=>{
                this.SupSearch(value)}, 
                showTotal:()=>`共${ret.data.total}条`, 
                onChange: (page, num) => { this.SuppageChange(page, num) }, 
                showQuickJumper: true, 
                total:ret.data.total, 
                pageSize: 10 }
        })
  
        
    }
    componentDidMount = () => {
        // this.BZGYS()
        this.loadSup({pageNum:1,rowNum:10})
        if (this.props.status == 200) {
            this.uploaddata()
        }
        let listModelOption={
            model:SHOW_ChooseSupplierPub_MODEL,
            title:'选择供应商',
            type:'radio',
            columns:[
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
            ],      
        }
        this.setState({
            listModelOption,
           
        })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const { getFieldDecorator } = this.props.form;
        let { uploadInfo, status ,toggleStore} = this.props
        let { SupList ,Suppaginations,listModelOption } = this.state
        return (
            <div>
                <Modal
                    title={status == 200 ? <b>修改</b> : <b>新建</b>}
                    width={800}
                    visible={true}
                    onCancel={this.closed}
                    onOk={status == 200 ? this.uploadmessage : this.handleSubmit}
                >
                    <div className='BG_box'>
                        <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>
                            <Row gutter={24}>
                                <Col span={24} >
                                    <Form.Item {...formItemLayout} label={<b>供应商名称</b>} labelAlign='right' labelCol={{ span: 3 }}>
                                        {getFieldDecorator('name', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择供应商名称',
                                                },
                                            ],
                                        })(<Input style={{ width: 300 }} 
                                        placeholder='请选择供应商名称' 
                                        disabled addonAfter={status == 200 ? '' : 
                                        <Icon style={{ cursor: 'pointer' }} onClick={() => {  toggleStore.setToggle(SHOW_ChooseSupplierPub_MODEL) }} type="plus" />
                                    } />
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24} style={{ marginTop: 20 }}>
                                <Col span={24} >
                                    <Form.Item {...formItemLayout} label={<b>曝光性质</b>} labelAlign='right' labelCol={{ span: 3 }}>
                                        {getFieldDecorator('type', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择曝光性质',
                                                },
                                            ],
                                        })(<Select style={{ width: 300 }} placeholder='请选择曝光原因'>
                                            <Option value='1'>优秀供应商</Option>
                                            <Option value='2'>劣质供应商</Option>
                                        </Select>)}
                                    </Form.Item>
                                </Col>
                            </Row>


                            <Row gutter={24} style={{ marginTop: 20 }}>
                                <Col span={24} >
                                    <Form.Item {...formItemLayout} label={<b>曝光原因</b>}  labelAlign='right' labelCol={{ span: 3 }} >
                                        {getFieldDecorator('content', {
                                            rules: [
                                                {
                                                    required: false,
                                                    message: '原因',
                                                },
                                            ],
                                        })(<Input.TextArea maxLength = {150} onChange={(e)=>{
                                            if(e.target.value.length>=150){
                                                message.error('输入的内容在150个字符之间')
                                            }
                                        }}  rows={8} />)}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Modal>
                {
                    toggleStore.toggles.get(SHOW_ChooseSupplierPub_MODEL)&&<ChooseListModel list={SupList} pagination={Suppaginations} options={listModelOption}  chooseFinishFn={(val)=>{this.chooseSupFn(val)}} />
                }
            </div>
        )
    }
}

export default Form.create({ name: 'supAdd' })(SupAdd);