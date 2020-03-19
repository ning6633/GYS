import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { toJS } from "mobx"
import { Modal, Form, Row, Col, Input, Button, Card, Select, Tooltip  } from 'antd';
import { SHOW_RecommendApply_MODEL ,SHOW_CHOOSESUPPLIER_MODEL} from "../../../../constants/toggleTypes"
import Choosepsupplier from '../../../SupManager/components/Choosepsupplier'
import ChooseListModel from '../../../../components/ChooseListModel'
import { supplierAction, supplierRecommend ,supplierEvalution} from "../../../../actions"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Option } = Select;
const { TextArea } = Input;
 

@inject('toggleStore', 'verifyStore','supplierStore')
@observer
class SupRecommendApply extends React.Component {
    state = {
        SQList:[],
        listModelOption:{},
        paginations:{}
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_RecommendApply_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore,refreshData } = this.props;
        this.props.form.validateFields(async (err, values) => {
            console.log(err)
            if(!err){
                console.log(values)

            }
         
        });
    };
    chooseFinishFn(data){
        console.log(data)
        window.callbackRecom(data)
      
    }
  

    async PxpageChange(page,num){
   this.loadPxApply(page,num)
    }
   //加载推荐供应商
   async loadPxApply(pageNum = 1, rowNum = 10,keyword=''){

    let supplierList = await supplierEvalution.gysInfoAll(pageNum,rowNum,keyword)
    console.log(supplierList)
    if(supplierList){
        this.setState({
            SQList:supplierList,
            paginations: {search:(value)=>{this.loadPxApply(1,10,value)}, showTotal:()=>`共${supplierList.recordsTotal}条`, onChange: (page, num) => { this.PxpageChange(page, num) }, showQuickJumper: true, total: supplierList.recordsTotal, pageSize: 10 }

        })
    }
}
    async componentDidMount() {
        const { toggleStore } = this.props;
        this.loadPxApply()
      
   window.callbackRecom = (data)=>{
    const newRecommend = document.getElementById("newRecommend").contentWindow; 
  
    let subdata = {
        name:data[0].gysname,
        code:data[0].code,
        product_scope:data[0].product_scope,
        id:data[0].id
    }
    console.log(data)
    newRecommend.callbackrecommend(subdata)
   }
   window.showModel = (modelname)=>{
       //show
    toggleStore.setToggle(modelname)
    console.log(modelname)
   }


           //选择供应商model
           let listModelOption={
            model:SHOW_CHOOSESUPPLIER_MODEL,
            title:'选择供应商',
            type:'radio',
            columns:[
                {
                    title: '序号',
                    dataIndex: 'key',
                    width: 60,
                    align: "center",
                    render: (text, index, key) => key + 1
                },
                // {
                //     title: '资质申请名称',
                //     dataIndex: 'gysname',
                //     align: "center",
                //     render: (text, redord) => <span style={{ cursor: "pointer", 'color': '#3383da' }}>{text} </span>
                // },
                {
                    title: '供应商名称',
                    dataIndex: 'gysname',
                    render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 20)}</span></Tooltip>
                },
                {
                    title: '供应商编号',
                    dataIndex: 'code',
                },
                {
                    title: '产品范围',
                    dataIndex: 'product_scope',
                },
                {
                    title: '产品类别',
                    dataIndex: 'product_category',
                },
                {
                    title: '资质等级',
                    dataIndex: 'importance_name',
                },
            ],      
        }
        this.setState({
            listModelOption
        })
    }
  
    render() {
      
        const { toggleStore } = this.props;
        const { listModelOption,paginations,SQList} = this.state;
        const { userId} =supplierRecommend.pageInfo
        let style = {
            width:'100%',
            height:'67vh',
            border:'none'
        }
        return (
            <div>
                {
                    toggleStore.toggles.get(SHOW_RecommendApply_MODEL) && <Modal
                        title={`新建推荐`}
                        visible={toggleStore.toggles.get(SHOW_RecommendApply_MODEL)}
                       width={1000}
                        //  height={700}
                        bodyStyle={{
                          
                             height:'700px'
                         }}
                        centered
                        okText="确认"
                        cancelText="取消"
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                        footer={null}
                    >
                    {  console.log(supplierRecommend.newRecommendUrl)}
                  
                       <iframe style={style} name="newRecommend" id="newRecommend" src={supplierRecommend.newRecommendUrl+`&userId=${userId}`} ></iframe>
                    </Modal>

                }
                {/* 选择供应商 */}
                {
                    toggleStore.toggles.get(SHOW_CHOOSESUPPLIER_MODEL)&&<ChooseListModel list={SQList} pagination={paginations} options={listModelOption} comparedList={[]} chooseFinishFn={(val)=>{this.chooseFinishFn(val)}} />
                }
            </div>
        );
    }
}

export default Form.create({ name: 'NewsupRecommendApply' })(SupRecommendApply);