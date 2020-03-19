import React, { Component } from 'react';
import { Modal, Select  , Card, Form, Row, Col, Input, Tooltip , Icon, message ,DatePicker } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_NewPA_MODEL,SHOW_ChooseSupplierPub_MODEL } from "../../../../constants/toggleTypes"

import { supplierEvalution ,supplierAction,SupPa} from "../../../../actions"
import ChooseListModel  from "../../../../components/ChooseListModel"
const { TextArea } = Input;
const { Option} = Select 
// 新建一年一评价
@inject('toggleStore')
@observer
class NewCleanups extends Component {
    constructor(){
        super()
        this.handleUploadChange = this.handleUploadChange.bind(this)
    }
    state={
        fileList:[],
        SupList:[],
        Suppaginations :{},
        listModelOption:{},
        currentGys:{},
        importantlist:[],
        rewordTypes:[]
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NewPA_MODEL)
        this.props.form.validateFields((err, values) => {
        })
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NewPA_MODEL)
    };
  async  handleSubmit () {
        const { toggleStore,refreshData,NewPa } = this.props;
        const { currentGys} = this.state

        this.props.form.validateFields((err, values) => {
            if(!err){
                let newData = {
                    ...values,
                    // confirm_time:values.time.format('YYYY-MM-DD'),
                    gys_id:currentGys.provider_id,
                 
                }
              NewPa(newData)
            }
            // fileList.length>0? values['fileid'] = fileList[0].response.fileid:null
            // console.log(fileList)
            // console.log(values)
            // refreshData(values)
         
            // let result = await SupPa.newPa(newData)
            // refreshData(values)
           
        })
    }
    handleUploadChange(info) {
        // if (info.file.status !== 'uploading') {
        //     console.log(info.file, info.fileList);
        // }
        // if (info.file.status === 'done') {
        //     message.success(`${info.file.name} 文件上传成功，正在等待服务端转换...`);
        //     setTimeout(() => {
        //         message.success("文件转换成功，开始加载数据...")
        //         // that.loaddata();
        //     }, 3000);
        // } else if (info.file.status === 'error') {
        //     message.error(`${info.file.name} 文件上传失败.`);
        // }
        let fileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-1);
    
        // 2. Read from response and show file link
        fileList = fileList.map(file => {
          if (file.response) {
            // Component will show file.url as link
            file.url = file.response.url;
          }
          return file;
        });
        this.setState({ fileList });
    }
    async chooseSupFn(data){
        const {setFieldsValue } = this.props.form
           if(data){
            let supObj = data[0]
            setFieldsValue({
                gysname:supObj.name,
                code:supObj.code,
            })
            this.setState({
                currentGys:supObj
            })
           }
    }

      //供应商load分页查询
      async SuppageChange(page, num) {
        this.loadSup(page, num)
    }
    //供应商搜索
    async SupSearch(value){
        this.loadSup(1, 10,value)
    }
    //加载供应商
    async loadSup(pageNum = 1, rowNum = 10,name=''){
      
        let ret = await supplierAction.searchSupplierInfo(name);
        this.setState({
            SupList :{
                list:ret,
                recordsTotal:ret.length
            } ,
            Suppaginations :{search:(value)=>{this.SupSearch(value)}, showTotal:()=>`共${ret.length}条`, onChange: (page, num) => { this.SuppageChange(page, num) }, showQuickJumper: true, total: ret.length, pageSize: 10 }
        })
  
        
    }
    async componentDidMount() {
        this.loadSup()
        //选择供应商model
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
      let result = await supplierEvalution.getDic('IMPORTANT')
      let rewordsResult = await supplierEvalution.getDic('TYPE_REWARDS')
          this.setState({
              importantlist:result.data || [],
              rewordTypes:rewordsResult.data || []
          })
    }
    handleChange(value) {
    }
    onChange(value){
        
    }

    render() {
        const { toggleStore } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { SupList ,Suppaginations,listModelOption,importantlist ,rewordTypes} = this.state
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 16 },
        };
        const TypeOptions = (list)=>{
            return list.length>0? list.map(item=><Option key={item.name}>{item.name}</Option>):null
          }
          const CodeOptions = (list)=>{
            return list.length>0? list.map(item=><Option key={item.code}>{item.name}</Option>):null
          }
          
           //重要程度
         const children = [TypeOptions(importantlist)]
         //奖惩类型
         const rewordchildren = [CodeOptions(rewordTypes)]
        return (
            <div>
                <Modal
                    width={900}
                    title="新建供应商清退记录"
                    visible={toggleStore.toggles.get(SHOW_NewPA_MODEL)}
                    onOk={(e) => { this.handleSubmit(e) }}
                    onCancel={this.handleCancel}
                    okText="提交"
                >
                    <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>
                    <Card bordered={false} className="new_supplier_form">
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Col span={24} >
                                    <Form.Item {...formItemLayout} label={'供应商名称'}>
                                            {getFieldDecorator(`gysname`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '选择供应商名称',
                                                    },
                                                ],
                                            })(<Input disabled={true} addonAfter={<Icon style={{ cursor: 'pointer' }} onClick={() => {  toggleStore.setToggle(SHOW_ChooseSupplierPub_MODEL) }} type="plus" />} />)}
                                        </Form.Item>
                                  
                                    </Col>
                                    {/* <Col span={12} >
                                    <Form.Item {...formItemLayout} label={'申请单位'}>
                                        {getFieldDecorator(`apply_org`, {
                                            rules: [
                                                {
                                                    required: false,
                                                    message:'申请类型不能为空'
                                                },
                                            ],
                                        })(<Select>
                                           {rewordchildren}
                                        </Select>)}
                                    </Form.Item>
                                   
                                    </Col> */}
                              
                                    {/* <Col span={12} >
                                    <Form.Item {...formItemLayout} label={'申请时间'}>
                                    {getFieldDecorator('time', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message:'申请时间不能为空'
                                                },
                                            ],
                                        })(<DatePicker format={`YYYY-MM-DD`}  style={{width:'100%'}} />)}
                                        </Form.Item>
                                  
                                  
                                    </Col> */}
                                   
                                </Col>
                              
                            </Row>
                            <Row>
                            <Col span={24} >
                                <Form.Item {...formItemLayout} label={'清退理由'}>
                                            {getFieldDecorator(`score_detail`)(  <TextArea rows={4} />)}
                                </Form.Item>
                             </Col>
                            </Row>
                        </Card>
                    </Form>
                </Modal>
                   {/* 选择供应商 */}
                   {
                    toggleStore.toggles.get(SHOW_ChooseSupplierPub_MODEL)&&<ChooseListModel list={SupList} pagination={Suppaginations} options={listModelOption}  chooseFinishFn={(val)=>{this.chooseSupFn(val)}} />
                }

                
            </div>
        );
    }
}

export default Form.create({ name: 'NewCleanups' })(NewCleanups);;