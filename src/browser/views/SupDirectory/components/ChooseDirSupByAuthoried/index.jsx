import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import _ from "lodash";
import { SHOW_ChooseSupplierPub_MODEL} from "../../../../constants/toggleTypes"
import { Modal, Form, Button , Row, Input, Table, message, Card, Col, Select, Checkbox, Tag, List } from 'antd';
import { supplierAction, supplierDirectory } from "../../../../actions"
import "./index.less"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Search } = Input;
const { Option } = Select;


@inject('toggleStore')
@observer
class ChooseDirSupByAuthoried extends React.Component {
    state = {
        supplierList: [],
        selectedRowKeys: [], // Check here to configure the default column
        selectedClassMap: {},
        loading: false,
        productCateLog: [], // 当前供应商的上级名录
        curSupplier: {}, // 当前选择的供应商
        chooseAllInfo: [], // 所有选择出来的供应商信息和上级名录信息
        directList:[],// 上级已授权名录
        localDirectList:[],// 本地名录
        isTopOrg:false,
        isShowDIrect:true,
        defaultSelectedValue:'',
        defaultSelectedDirectValue:'',
        pageNum:1,
        rowNum:5,
        selectValue:"请选择供应商类别"
    };
    handleOk = e => {
        const { toggleStore, selectedSupplier } = this.props;
        const {chooseAllInfo} = this.state
        let pushArr = []
        chooseAllInfo.forEach(item=>{
            let newData = {
                id:item.supplier.gysid,
                name:item.supplier.name,
                product_category:item.productType
            }
            pushArr.push(newData)
        })
     if(pushArr){
         selectedSupplier(pushArr);
     }
         toggleStore.setToggle(SHOW_ChooseSupplierPub_MODEL)
    };

    //提取供应商上级名录方法
    converterString(categoryarr){
        console.log(categoryarr)
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
        toggleStore.setToggle(SHOW_ChooseSupplierPub_MODEL)
    };
    async DirpageChange(pageNum=1, rowNum=5){
        let params = {
            pageNum,
            rowNum
        }
        this.getDirectList(pageNum, rowNum)
    }
    //分页查询
    async pageChange(pageNum, rowNum) {
        console.log(pageNum, rowNum)
        const { isTopOrg,defaultSelectedValue} = this.state
        let params = {
            pageNum,
            rowNum
        }
        this.setState({
            curSupplier: {},
        })
      
        this.getSuppliersByParentAuthoried(defaultSelectedValue,params)
           // this.getDirectList(defaultSelectedValue,pageNum, rowNum)
           // this.loaddata(page, num)
        
        
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

  let ret = await supplierDirectory.getSuppliersByDirect(params)
  console.log(ret)
  if(ret){
    this.setState({
        supplierList:ret
    })
  }

    
 }
    //点击获取已授权名录列表（包含本地、上级）
    async getAuthorizedDirectByParent(options){
        options['status'] = '20'
        let ret = await supplierDirectory.getAuthorizedDirectByParent(options)
        console.log(ret.data.list)
        // this.getSuppliersByParentAuthoried('',options)
        if(ret.code==200){
            this.setState({
                directList:ret.data,
                localDirectList:[]
            })
        }

    }

        //点击获取已授权名录列表（包含本地、上级）
        getDirectList(pageNum,rowNum,options){
           let params = {
               ...options,
               pageNum: pageNum||1, 
               rowNum : rowNum ||5
           }
           console.log(params)
           this.getAuthorizedDirectByParent(params)

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
            //      this. getStandardSuppliers(params)
            // }else if(type=='previous'){
            //     this.setState({
            //         isShowDIrect: true,
            //         defaultSelectedValue:'previous'
            //     });
            // }else{
    
            // }
    
        }

          //搜索供应商列表
    searchSupList(value){
        const {defaultSelectedValue, defaultSelectedDirectValue} = this.state
        let params = {
            pageNum: 1, 
            rowNum : 5,
            keyword:value||''
        }
        this.getSuppliersByParentAuthoried(defaultSelectedDirectValue,params)
      
       }

    // 点击选择供应商
    chooseSupplierItem(item) {
        console.log(item)
        let { supplierList, chooseAllInfo ,productType,productCateLog} = this.state;
      //  let productCateLog = []; // 初始化当前供应商上级名录为空
        // 将所有的供应商选择状态checked的值设为 false ,取消所有的选择状态
        supplierList.list.map((val, idx) => {
            supplierList.list[idx].checked = false
        })
        // 清除所有没有选择上级名录的供应商 - 为了让下面的table中没有选择上级名录信息的供应商不显示
        // chooseAllInfo.map((val, idx) => {
        //     if (val.productType.length == 0) {
        //         chooseAllInfo.splice(idx, 1)
        //     }
        // })
       
        // 获取当前选择供应商的 index 值
        let idx = _.findIndex(supplierList.list, item);
        // 设置当前选择的供应商为选中状态
        supplierList.list[idx].checked = true;
        // 获取 table 中是否已经存在当前已选择的供应商 - 如果没有选择过，则添加供应商信息
        // 如果已选择过 - 则直接把已有的分类信息 赋值到上级名录中
        let calinfoidx = _.findIndex(chooseAllInfo, { id: item.id });
        let selectedProduct = productCateLog.filter(item=>item.checked==true)
        if (calinfoidx == -1) {
            chooseAllInfo.push({
                id: item.gysid,
                supplierName: item.name,
                supplier: item,
                productType: item.product_category
            })

         
        }
        // 存储供应商及选择的上级名录信息
        // 更新当前选择的供应商信息
        console.log(chooseAllInfo)
        this.setState({
            chooseAllInfo,
            curSupplier: item,
            supplierList,
        })
    }
    // 点击选择供应商 - 上级名录
   async chooseProductItem(item) {
       const { directList} = this.state
        console.log(item)
        let params = {
            pageNum: 1, 
            rowNum : 5,
         
        }
        this.getSuppliersByParentAuthoried(item.id,params)
        
        directList.list.map((val, idx) => {
            directList.list[idx].checked = false
        })
           // 获取当前选择供应商的 index 值
           let idx = _.findIndex(directList.list, item);
           console.log(idx)
           // 设置当前选择的供应商为选中状态
           directList.list[idx].checked = true;
        // let { chooseAllInfo, curSupplier, productCateLog } = this.state;
        // // 解决 修改同一个内存地址中的数据 导致变量联动改变的问题
        // let refproductCateLog = _.cloneDeep(productCateLog);
        // // 获取当前分类的index值
        // let itemidx = _.findIndex(refproductCateLog, { name: item.name });
     
        // // 切换选择状态
        // refproductCateLog[itemidx].checked = !refproductCateLog[itemidx].checked;

        // // // 当前供应商在获取当前所有已选择的供应商中的位置
        // // let idx = _.findIndex(chooseAllInfo, { id: curSupplier.id });
        // // console.log(chooseAllInfo)
        // // // 判断当前是否已经选择了当前上级名录
        // // let typeIdx = _.findIndex(chooseAllInfo[idx].productType, { name: item.name })
        // // if (typeIdx == -1) {
        // //     chooseAllInfo[idx].productType.push(refproductCateLog[itemidx])
        // // } else {
        // //     chooseAllInfo[idx].productType.splice(typeIdx, 1);
        // // }
        // this.setState({
        //     productCateLog: refproductCateLog,
        //   //  chooseAllInfo
        // })


    }

   
    async componentDidMount() {
     
    
            let options = {
                status:'20',
                pageNum: 1, 
                rowNum :5
            }
          let directListRet = await supplierDirectory.getAuthorizedDirectByParent(options)
        //   console.log(directListRet.data)
          if(directListRet.code==200 && directListRet.data.list.length!=0){
          this.getSuppliersByParentAuthoried(directListRet.data.list[0].id,options)

              this.setState({
                  directList:directListRet.data,
                  defaultSelectedValue:directListRet.data.list[0].id
              })
          }else{

          }
         
        
    
    
        }
   
    render() {
        const { toggleStore } = this.props;
        const { loading, selectedRowKeys, supplierList, productCateLog, chooseAllInfo ,
            localDirectList,directList ,isTopOrg,isShowDIrect,defaultSelectedValue,defaultSelectedDirectValue,productType,selectValue} = this.state;
            console.log(directList)
       
        let TableOpterta = () => (
            <div className="table-fileter">
                上级授权名录：  
                { <Select placeholder = {selectValue} style={{width:200}} onSelect = {(e)=>{
                    console.log(e)
                    this.setState({
                        selectValue:directList.list[e].name,
                        defaultSelectedValue:directList.list[e].id
                    })
                    this.chooseProductItem(directList.list[e])
                }}>
                    {directList.list ? directList.list.map((item,index)=>{
                        return (
                        <Option key = {item.id} value = {index}>{item.name}</Option>
                        )
                    }) : null}
                </Select> }
           
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
                render: (text, index, key) =>text && text.split(',').map((val, idx) => <Tag key={idx} style={{ cursor: "pointer" }} color="#108ee9">{val}</Tag>)
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
                    visible={toggleStore.toggles.get(SHOW_ChooseSupplierPub_MODEL)}
                    width={900}
                    centered
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >

                    <Row gutter={24}>
                    {/* <Col span={9} className="chooseSupInfo">
                            <Card title={"选择上级名录"}>
                                <List
                                    itemLayout="horizontal"
                                    size="small"
                                    dataSource={directList.list}
                                    pagination={{
                                        onChange: this.DirpageChange.bind(this),
                                        pageSize: 5,
                                       // showQuickJumper: true,
                                        total: directList.recordsTotal
                                    }}
                                    renderItem={item => (
                                        <List.Item onClick={() => { this.chooseProductItem(item) }} className={(item.checked && 'checked_item') + ' supplierItem'}>
                                            <List.Item.Meta
                                                title={<span>{item.name}</span>}
                                                // description={`所属组织：${item.orgid}`}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col> */}
                        <Col span={24} className="chooseSupInfo">
                            <Card title={<TableOpterta />} extra={<TableFilterBtn />}>
                                <List
                                    itemLayout="horizontal"
                                    size="small"
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
                                                description={`供应商社会信用代码：${item.number}  产品分类：${item.product_category}`}
                                            />
                                            {/* <Button type='danger' size='small'>删除</Button> */}
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>
                      
                        <Col span={24} style={{ marginTop: 20 }}>
                            <Card title={<b>已选择的供应商及分类</b>}>
                                {
                                    chooseAllInfo.length > 0 && <Table size='small' loading={loading} bordered={true} rowKey={(text, key) => key} columns={columns} pagination={false} dataSource={chooseAllInfo} />
                                }</Card>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'ChooseDirSupByAuthoried' })(ChooseDirSupByAuthoried);