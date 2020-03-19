import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import _ from "lodash";
import { SHOW_CHOOSESUPPLIER_MODEL } from "../../../../constants/toggleTypes"
import { Modal, Form, Button , Row, Input, Table, message, Card, Col, Select, Checkbox, Tag, List } from 'antd';
import { supplierAction, supplierDirectory } from "../../../../actions"
import "./index.less"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Search } = Input;
const { Option } = Select;


@inject('toggleStore')
@observer
class ChooseDirSup extends React.Component {
    state = {
        supplierList: [],
        selectedRowKeys: [], // Check here to configure the default column
        selectedClassMap: {},
        loading: false,
        productCateLog: [], // 当前供应商的产品分类
        curSupplier: {}, // 当前选择的供应商
        chooseAllInfo: [], // 所有选择出来的供应商信息和产品分类信息
        directList:[],// 上级已授权名录
        localDirectList:[],// 本地名录
        isTopOrg:false,
        isShowDIrect:true,
        defaultSelectedValue:'local',
        defaultSelectedDirectValue:''
    };
    handleOk = e => {
        const { toggleStore, selectedSupplier } = this.props;
        const {chooseAllInfo} = this.state
        let pushArr = []
        chooseAllInfo.forEach(item=>{
            let newData = {
                id:item.supplier.provider_id,
                name:item.supplier.name,
                product_category:this.converterString(item.productType).join(',')
            }
            pushArr.push(newData)
        })
     if(pushArr){
         selectedSupplier(pushArr);
     }
         toggleStore.setToggle(SHOW_CHOOSESUPPLIER_MODEL)
    };

    //提取供应商产品分类方法
    converterString(categoryarr){
        let arr = []
        categoryarr.forEach(item=>{
            if(item.checked==true){
                arr.push(item.name)
            }
         })
         return arr
    }
   

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    async searchSupplierInfo(name) {
        let ret = await supplierAction.searchSupplierInfo(name);
        this.setState({
            supplierList: ret
        })
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_CHOOSESUPPLIER_MODEL)
    };
    async componentDidMount() {
     //  let ret=await supplierDirectory.getUserInfo()
       //console.log(ret)
       //判断是否是集团账户ret.usertype=='1'
    //    if(ret.usertype=='1'){
    //        this.setState({
    //         isTopOrg:true
    //        })

    //    }else{
    //     this.setState({
    //         isTopOrg:false
    //        })
    //        this.getDirectList('local')
    //    }
       this.getDirectList('standard')
      let productResult = await supplierDirectory.getDic('ATTRIBUTE')
      console.log(productResult)
      if(productResult.code==200){
           productResult.data.forEach(item=>{
              item.checked = false
          })
          let productCateLog = _.cloneDeep(productResult.data)
          console.log(productCateLog)
          this.setState({
            productType:productResult.data,
            productCateLog
          })
      }
    }
    //分页查询
    async pageChange(pageNum=1, rowNum=5) {

        const { isTopOrg,defaultSelectedValue } = this.state
        let params = {
            pageNum,
            rowNum
        }
        this.setState({
            curSupplier: {},
        })
        this. getStandardSuppliers(params)
        // if(isTopOrg){
         
        // }else{
            
        //     this.getDirectList(defaultSelectedValue,pageNum, rowNum)
        //    // this.loaddata(page, num)
        // }
        
    }
  
     //获取标准供应商
   async getStandardSuppliers(options){
    this.setState({ loading: true });
       let params={
        ...options,
       }
    let ret = await supplierDirectory.getStandardSupplierList(params)
    console.log(ret)
    this.setState({
        supplierList: ret,
        loading: false
    })
   }

   //获取本地名录列表
  async getLocalDirectList(options){
  //  let ret = await supplierDirectory.getLocalDirectList(options);
    this.getLocalDirectSupsList('',options)
    this.setState({
        loading: false
    })
  }
    //获取本地名录供应商列表
   async getLocalDirectSupsList(value,options){
        let params = {
            ...options,
            directoryId:value ||''
        }
        params['pageNum'] = options? options.pageNum :1
        params['rowNum'] = options? options.rowNum:5
      let ret = await supplierDirectory.getgysInfosByOrgId(params)
      if(ret.code==200){
        this.setState({
            supplierList:ret.data
        })
      }
    
    }
    deleteChooseInfo(idx){
        let { chooseAllInfo } = this.state;
        chooseAllInfo.splice(idx,1)
        this.setState({
            chooseAllInfo
        })
    }
    //处理本地名录选项
    async handleLocalSelected(value){
        this.getLocalDirectSupsList(value)
        this.setState({
            defaultSelectedDirectValue:value
        })
    }
    //上级名录列表选择项
    async handlePriviousSelected(value){

        this.getSuppliersByParentAuthoried(value)
        this.setState({
            defaultSelectedDirectValue:value
        })
    }
  //获取上级授权名录下的供应商列表
 async getSuppliersByParentAuthoried(value,options){
    let params = {
        ...options,
        directoryId:value ||''
    }
    params['pageNum'] = options? options.pageNum :1
    params['rowNum'] = options? options.rowNum:5

  let ret = await supplierDirectory.getSuppliersByParentAuthoried(params)
  if(ret.code==200){
    this.setState({
        supplierList:ret.data
    })
  }

    
 }
    //点击获取已授权名录列表（包含本地、上级）
    async getAuthorizedDirectByParent(options){
      
        let ret = await supplierDirectory.getAuthorizedDirectByParent(options)
        this.getSuppliersByParentAuthoried('',options)
        if(ret.code==200){
            this.setState({
                directList:ret.data.list,
                localDirectList:[]
            })
        }

    }

        //点击获取已授权名录列表（包含本地、上级）
        getDirectList(type,pageNum,rowNum,options){
           let params = {
               ...options,
               pageNum: pageNum||1, 
               rowNum : rowNum ||5
           }
            // if(type=='local'){
            //     this.setState({ 
            //         isShowDIrect: false,
            //         defaultSelectedValue:'local'
            //     });
            // this.getLocalDirectList(params)
            // }else if(type=='standard'){
            //     this.setState({ 
            //         isShowDIrect: false,
            //         defaultSelectedValue:'standard'
            //     });
              
            // }else if(type=='previous'){
            //     this.setState({
            //         isShowDIrect: true,
            //         defaultSelectedValue:'previous'
            //     });
            //  this.getAuthorizedDirectByParent(params)
            // }else{
    
            // }
            this. getStandardSuppliers(params)
        }

          //搜索供应商列表
    searchSupList(value){
        const {defaultSelectedValue, defaultSelectedDirectValue} = this.state
        let params = {
            pageNum: 1, 
            rowNum : 5,
            keyword:value||''
        }
        this. getStandardSuppliers(params)
        // switch (defaultSelectedValue) {
        //         case 'local':
        //         this.getLocalDirectSupsList('',params)
        //         break;
        //         case 'previous':
        //         this.getSuppliersByParentAuthoried(defaultSelectedDirectValue,params)
        //         break;
        //         case 'standard':
           
        //         break;
                
        //     default:
        //         break;
        // }
       }

    // 点击选择供应商
    chooseSupplierItem(item) {
        console.log(item)
        let { supplierList, chooseAllInfo ,productType,productCateLog} = this.state;
      //  let productCateLog = []; // 初始化当前供应商产品分类为空
        // 将所有的供应商选择状态checked的值设为 false ,取消所有的选择状态
        supplierList.list.map((val, idx) => {
            supplierList.list[idx].checked = false
        })
        // 清除所有没有选择产品分类的供应商 - 为了让下面的table中没有选择产品分类信息的供应商不显示
        chooseAllInfo.map((val, idx) => {
            if (val.productType.length == 0) {
                chooseAllInfo.splice(idx, 1)
            }
        })
        let nullfalg = productCateLog.every(cate=>cate.checked==false)
        if(nullfalg){
            message.warning('请先选择产品分类')
            return
        }
        // 获取当前选择供应商的 index 值
        let idx = _.findIndex(supplierList.list, item);
        // 设置当前选择的供应商为选中状态
        supplierList.list[idx].checked = true;
        // 获取 table 中是否已经存在当前已选择的供应商 - 如果没有选择过，则添加供应商信息
        // 如果已选择过 - 则直接把已有的分类信息 赋值到产品分类中
        let calinfoidx = _.findIndex(chooseAllInfo, { id: item.id });
        let selectedProduct = productCateLog.filter(item=>item.checked==true)
        if (calinfoidx == -1) {
            chooseAllInfo.push({
                id: item.provider_id,
                supplierName: item.name,
                supplier: item,
                productType: selectedProduct
            })

         
        } else {
            // 解决 修改同一个内存地址中的数据 导致变量联动改变的问题 - 需要 clone 一下

           console.log(productCateLog)
            productCateLog.forEach((val, idx) => {
                let cateIdx = _.findIndex(chooseAllInfo[calinfoidx].productType, { name: val.name })
                if (cateIdx >-1) {
                    val.checked = true
                 
                }else{
                    val.checked = false
                }
            })
          
        }
        console.log(chooseAllInfo)
        // 存储供应商及选择的产品分类信息
        // 更新当前选择的供应商信息
        this.setState({
            chooseAllInfo,
            curSupplier: item,
            supplierList,
            productCateLog
        })
    }
    // 点击选择供应商 - 产品分类
    chooseProductItem(item) {
        console.log(item)
        let { chooseAllInfo, curSupplier, productCateLog } = this.state;
        // 解决 修改同一个内存地址中的数据 导致变量联动改变的问题
        let refproductCateLog = _.cloneDeep(productCateLog);
        // 获取当前分类的index值
        let itemidx = _.findIndex(refproductCateLog, { name: item.name });
     
        // 切换选择状态
        refproductCateLog[itemidx].checked = !refproductCateLog[itemidx].checked;

        // // 当前供应商在获取当前所有已选择的供应商中的位置
        // let idx = _.findIndex(chooseAllInfo, { id: curSupplier.id });
        // console.log(chooseAllInfo)
        // // 判断当前是否已经选择了当前产品分类
        // let typeIdx = _.findIndex(chooseAllInfo[idx].productType, { name: item.name })
        // if (typeIdx == -1) {
        //     chooseAllInfo[idx].productType.push(refproductCateLog[itemidx])
        // } else {
        //     chooseAllInfo[idx].productType.splice(typeIdx, 1);
        // }
        this.setState({
            productCateLog: refproductCateLog,
          //  chooseAllInfo
        })
    }

   

   
    render() {
        const { toggleStore } = this.props;
        const { loading, selectedRowKeys, supplierList, productCateLog, chooseAllInfo ,
            localDirectList,directList ,isTopOrg,isShowDIrect,defaultSelectedValue,defaultSelectedDirectValue,productType} = this.state;
        const hasSelected = selectedRowKeys.length > 0;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        let TableOpterta = () => (
            <div className="table-fileter">
                来源：标准供应商
                {/* 名录：<Select value={defaultSelectedDirectValue} disabled={!isShowDIrect} style={{ width: 100, marginRight: 2 }}
                //根据本地名录和授权名录的长度判断取得是哪个名录下的供应商
                 onChange={this.handlePriviousSelected.bind(this)}
                >
                     <Option value="">全部</Option>
                    {
                          //本地名录列表
                        localDirectList && localDirectList.map(item=>{
                            return (
                                    <Option key={item.id} value={item.id}>{item.name+1}</Option>
                            )
                        })
                        } 
                       
                          //上级名录列表
                          directList && directList.map(item=>{
                            return (
                                    <Option key={item.id} value={item.id}>{item.name}</Option>
                            )
                        })
                       
                </Select> */}
           
            </div>
        )
        let TableFilterBtn = () => (
            <div className="table-fileter">
                <Search placeholder="搜索供应商" onSearch={value => {this.searchSupList(value) }} enterButton />
            </div>
        )
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 80,
                align: "center",
                fixed: "left",
                render: (text, index, key) => key + 1
            },
            {
                title: '供应商名称',
                dataIndex: 'supplierName',
                width: 200,
                align: "center",
            },
            {
                title: '产品分类',
                dataIndex: 'productType',
                align: "center",
                render: (text, index, key) =>text&& text.map((val, idx) => <Tag key={idx} style={{ cursor: "pointer" }} color="#108ee9">{val.name}</Tag>)
            },
            {
                title: '操作',
                dataIndex: 'cz',
                align: "center",
                width: 80,
                render: (text, index, key) =>{
                    return (
                        <div>
                            <Button type="danger" size="small" onClick={ev=>{this.deleteChooseInfo(index)}}>删除</Button>
                        </div>
                    )
                }
            },
        ];
        return (

            <div>
                <Modal
                    title="选择供应商"
                    visible={toggleStore.toggles.get(SHOW_CHOOSESUPPLIER_MODEL)}
                    width={900}
                    centered
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >

                    <Row gutter={8}>
                    <Col span={7} className="chooseSupInfo">
                            <Card title={"选择产品分类"}>
                                <List
                                    itemLayout="horizontal"
                                    size="small"
                                    dataSource={productCateLog}
                                    renderItem={item => (
                                        <List.Item onClick={() => { this.chooseProductItem(item) }} actions={[<Checkbox checked={item.checked} />]} className="supplierItem">
                                            <List.Item.Meta
                                                title={<span>{item.name}</span>}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>
                        <Col span={17} className="chooseSupInfo">
                            <Card title={<TableOpterta />} extra={<TableFilterBtn />}>
                                <List
                                    itemLayout="horizontal"
                                    size="small"
                                    loading={loading}
                                    pagination={{
                                        onChange: this.pageChange.bind(this),
                                        pageSize: 5,
                                        showQuickJumper: true,
                                        total: supplierList.recordsTotal
                                    }}
                                    dataSource={supplierList.list}
                                    renderItem={item => (
                                        <List.Item onClick={() => { this.chooseSupplierItem(item) }} className={(item.checked && 'checked_item') + ' supplierItem'}>
                                            <List.Item.Meta
                                                title={<span>{item.name}</span>}
                                                description={`供应商社会信用代码：${item.code}`}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>
                      
                        <Col span={24} style={{ marginTop: 20 }}>
                            <Card title={<b>已选择的供应商及分类</b>}>
                                {
                                    chooseAllInfo.length > 0 && <Table size='small'  bordered={true} rowKey={(text, key) => key} columns={columns} pagination={false} dataSource={chooseAllInfo} />
                                }</Card>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'ChooseDirSup' })(ChooseDirSup);