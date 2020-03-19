import React, { Component } from 'react';
import { Modal, InputNumber , Card, Form, Row, Col, Input, Tooltip , Icon, message } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_ModelDetail_MODEL,SHOW_ChooseSupplierPub_MODEL } from "../../../../constants/toggleTypes"

import { supplierEvalution ,supplierAction,SupPa} from "../../../../actions"
import ChooseListModel  from "../../../../components/ChooseListModel"
const { TextArea } = Input;
// 查看一年一评价
@inject('toggleStore')
@observer
class ShowPaDetail extends Component {
    constructor(){
        super()
        this.handleUploadChange = this.handleUploadChange.bind(this)
    }
    state={
        fileList:[],
        SupList:[],
        Suppaginations :{},
        listModelOption:{},
        currentGys:{}
    }
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ModelDetail_MODEL)
        this.props.form.validateFields((err, values) => {
        })
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ModelDetail_MODEL)
    };
  async  handleSubmit () {
        const { toggleStore,detail,editPa,showType } = this.props;
       
      if(showType=='detail'){
        toggleStore.setToggle(SHOW_ModelDetail_MODEL)
        return 
      }
        this.props.form.validateFields((err, values) => {
            if(!err){
                let newData = {
                    ...detail,
                    ...values,
                    // status: 10,
                }
              console.log(newData)
                editPa(newData)
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
           console.log(data)
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
        console.log(ret)
        this.setState({
            SupList :{
                list:ret,
                recordsTotal:ret.length
            } ,
            Suppaginations :{search:(value)=>{this.SupSearch(value)}, showTotal:()=>`共${ret.length}条`, onChange: (page, num) => { this.SuppageChange(page, num) }, showQuickJumper: true, total: ret.length, pageSize: 10 }
        })
  
        
    }
    componentDidMount() {
    
        //选择供应商model
        let listModelOption={
          model:SHOW_ChooseSupplierPub_MODEL,
          title:'乙方供应商',
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

      const { detail} = this.props
      const { setFieldsValue} = this.props.form
      if(detail){
          let {
            name,
            score,
            code,
            score_CONTENT,
            score_DETAIL
          } = detail
        setFieldsValue({
            name,
            score,
            code,
            score_CONTENT,
            score_DETAIL
           
        })
      }
    }
    handleChange(value) {
    }
    onChange(value){
        
    }
    render() {
        const { toggleStore ,showType} = this.props;
        const { getFieldDecorator } = this.props.form;
        const { SupList ,Suppaginations,listModelOption } = this.state
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const uploadProps = {
            name: 'file',
            action:supplierEvalution.FileBaseURL,
            multiple: false,
            onChange:this.handleUploadChange
        };
        return (
            <div>
                <Modal
                    width={900}
                    title="供应商绩效评价详情"
                    title={showType=='edit'?<b>供应商绩效评价修改</b> : <b>供应商绩效评价详情</b>}
                    visible={toggleStore.toggles.get(SHOW_ModelDetail_MODEL)}
                   
                    onOk={(e) => { this.handleSubmit(e) }}
                    onCancel={this.handleCancel}
                    okText={showType=='edit'?'修改':'确定'}
                >
                    <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>
                    <Card bordered={false} className="new_supplier_form">
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Col span={12} >
                                    <Form.Item {...formItemLayout} label={'供应商名称'}>
                                            {getFieldDecorator(`name`, {
                                                initValue: "供应商名称",
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '选择供应商名称',
                                                    },
                                                ],
                                            })(<Input disabled={true}  />)}
                                        </Form.Item>
                                  
                                    </Col>
                                    <Col span={12} >
                                    <Form.Item {...formItemLayout} label={'打分'}>
                                            {getFieldDecorator(`score`)(<InputNumber max={100} disabled={showType=='edit'?false:true}  />)}
                                        </Form.Item>
                                   
                                    </Col>
                                    <Col span={12} >
                                      
                                        <Form.Item {...formItemLayout} label={'供应商编号'}>
                                            {getFieldDecorator(`code`)(<Input disabled={true} />)}
                                        </Form.Item>
                                      
                                    </Col>
                                    <Col span={12} >
                                    <Form.Item {...formItemLayout} label={'评语'}>
                                            {getFieldDecorator(`score_CONTENT`)(  <TextArea disabled={showType=='edit'?false:true} rows={4} />)}
                                        </Form.Item>
                                  
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'得分原因'}>
                                            {getFieldDecorator(`score_DETAIL`)(  <TextArea disabled={showType=='edit'?false:true} rows={4} />)}
                                        </Form.Item>
                                     
                                    </Col>
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                </Modal>
                

                
            </div>
        );
    }
}

export default Form.create({ name: 'ShowPaDetail' })(ShowPaDetail);;