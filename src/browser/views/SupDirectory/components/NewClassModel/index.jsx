import React, { Component } from 'react';
import { Modal, Button ,Card ,Form , Row, Col,Input ,message  } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_NEWCLASS_MODEL } from "../../../../constants/toggleTypes"
import _ from "lodash";
import { supplierDirectory } from "../../../../actions"
const { TextArea } = Input;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
let initClassData={
 
        "children": null,
        "createdate": "",
        "createuser": "",
        "id": "",
        "name": "",
        "orgid": "",
        "parentid": "",
        "updatedate": "",
        "updateuser": ""
    
}
@inject('toggleStore','directoryStore')
@observer
class NewClassModel extends React.Component {
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NEWCLASS_MODEL)
        this.props.form.validateFields((err,values)=>{
          
            console.log(values)
        })
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_NEWCLASS_MODEL)
    };
    handleSubmit = e =>{
    
        let { currentDirectory ,refreshData,toggleStore ,currCategory,directoryStore} = this.props
        this.props.form.validateFields((err,values)=>{
            //编辑提交
            if( directoryStore.isClassEditor){
                currentDirectory['name'] = values.name
                currentDirectory['description'] = values.description
                supplierDirectory.editCategory(currentDirectory).then(res=>{
                    if(res.code==200){
                        toggleStore.setToggle(SHOW_NEWCLASS_MODEL)
                    }
           })
            //新建根节点
            }else if(directoryStore.isNewRootClass){
                let newRootData = _.defaults(initClassData)
                newRootData['name'] = values.name
                newRootData['description'] = values.description
                newRootData['parentid'] = null
                
                supplierDirectory.newCategory(newRootData).then(res=>{
                    if(res.code==200){
                        toggleStore.setToggle(SHOW_NEWCLASS_MODEL)
                        refreshData(res.data.id,true)
                    }
                })
            }
            //新建子节点提交
             else if( !directoryStore.isClassEditor && currentDirectory){
                let newChildData = _.defaults(currentDirectory)
                newChildData['name'] = values.name
                newChildData['description'] = values.description
                newChildData['parentid'] = currentDirectory.id
                supplierDirectory.newCategory(newChildData).then(res=>{
                    console.log(res)
                    if(res.code==200){
                        toggleStore.setToggle(SHOW_NEWCLASS_MODEL)
                       refreshData(currCategory)
                    }
           })

           }else{
console.log(111)
            }
        })

     
    }
    componentDidMount(){
        const { setFieldsValue } = this.props.form;
        const { currentDirectory,directoryStore,toggleStore} = this.props
        console.log(currentDirectory)
        if(currentDirectory){
            setFieldsValue({
                parentName:directoryStore.isNewClass? currentDirectory.name:null,
                name: directoryStore.isClassEditor?currentDirectory.name:null,
                description: directoryStore.isClassEditor?currentDirectory.description:null
            })
        }else if(directoryStore.isNewRootClass==true){
            console.log('isNewRootClass')
        }
        else{
            message.warning('请选择父级目录')
            // directoryStore.isClassEditor = false
            // directoryStore.isNewClass = true
            // directoryStore.isNewRootClass = false
            toggleStore.setToggle(SHOW_NEWCLASS_MODEL)
        }
       
    }
    render() {
        const { toggleStore,currentDirectory,directoryStore } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        return (
            <div>
                <Modal
                    title={directoryStore.isClassEditor?"编辑名录类别":"新建名录类别"}
                    visible={toggleStore.toggles.get(SHOW_NEWCLASS_MODEL)}
                    onOk={(e) => { this.handleSubmit(e) }}
                    onCancel={this.handleCancel}
                >
                  <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>
                          <Card bordered={false}  className="new_supplier_form">
                             <Row gutter={24}>
                                <Col span={24}>
                                {
                                    directoryStore.isNewClass && 
                                    <Form.Item {...formItemLayout} label={'所属名录类别'}>
                                    {getFieldDecorator(`parentName`, {
                                        rules: [
                                            {
                                                required: false,
                                                message: '名录类别不能为空',
                                            },
                                        ],
                                    })(<Input   disabled />)}
                                  </Form.Item>
                                }
                              
                                 <Form.Item {...formItemLayout} label={'名录类型名称'}>
                                            {getFieldDecorator(`name`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '名录类型名称不能为空',
                                                    },
                                                ],
                                            })(<Input  />)}
                                 </Form.Item>
                                 <Form.Item {...formItemLayout} label={'说明'}>
                                            {getFieldDecorator(`description`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '说明',
                                                    },
                                                ],
                                            })(  <TextArea rows={4} />)}
                                 </Form.Item>
                               
                                </Col>
                             </Row>
                          </Card>
                  </Form>
                  
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'NewClass' })(NewClassModel);;