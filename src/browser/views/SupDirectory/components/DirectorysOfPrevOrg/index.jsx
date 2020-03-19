import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Empty, Card, Select, Icon, Button, message, Tooltip } from 'antd';
import _ from "lodash";
import { toJS } from "mobx"
import { observer, inject } from 'mobx-react';
import {  SHOW_NEWPRODUCT_MODEL,SHOW_DirectorysOfPrevOrg_MODEL,SHOW_SUPINDIRECTORY_MODEL } from "../../../../constants/toggleTypes"
import { supplierAction ,supplierDirectory} from "../../../../actions"
import SuppliersInDirectory  from "../SuppliersInDirectory"

const { Option } = Select;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore', 'supplierStore')
@observer
class DirectorysOfPrevOrg extends React.Component {
    state = {
        supplierId: '',
        productListKey: '',
        supplierPruductlist: [],
        tablesupplierPruductlist: [],
        newSupplierProductList: [],
        supplierInfo: {
            id: "",
            name: "",
            code: "",
            name_other: "",
            another_name: "",
            district_key: "",
            district_keyname:""
        },
        directList:[],
        loading:true
    }
  

    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_DirectorysOfPrevOrg_MODEL)
    };
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_DirectorysOfPrevOrg_MODEL)
    };
    handleChange(value) {
        console.log(`selected ${value}`);
    }
    chooseBZsupplier(data) {
        const { supplierStore } = this.props;
        const { setFieldsValue } = this.props.form;
        if (!supplierStore.iseditor) {
            // 当不是编辑状态时才会 ，修改供应商名称
            this.setState({
                supplierId: data.id,
                supplierInfo: data
            })
        }
        setFieldsValue({ ...data })
    }
    chooseBZcompany(data) {
        const { setFieldsValue } = this.props.form;
        this.setState({
            companyInfo: data
        })
        setFieldsValue({
            org_id_name: data.name
        })
    }
    async addSupplierProductinfo(supplieridref) {
        const { newSupplierProductList } = this.state;
        if (newSupplierProductList.length > 0) {
            let ret = await supplierAction.addSupplierProductinfo(newSupplierProductList, supplieridref);
            message.success('供应商产品信息创建成功');
        }
        return true;
    }
    getProductInfo(data) {
        const { supplierStore } = this.props;
        let productId = data.id;
        if (productId && supplierStore.iseditorproduct) {
            // 当前是编辑服务端产品
            let { supplierId } = this.state;
            this.getSupplierProcductList(supplierId)
            message.success("产品编辑成功")
        } else if (!productId && supplierStore.iseditorproduct) {
            // 当前是编辑新增产品
            let { productListKey, newSupplierProductList, supplierPruductlist } = this.state;
            let len = supplierPruductlist.length;
            newSupplierProductList[productListKey - len] = data;
            this.setState({
                tablesupplierPruductlist: [...supplierPruductlist, ...newSupplierProductList]
            })
        } else {
            // 当前是新增产品
            let supplierPruductlistref = this.state.supplierPruductlist;
            let newSupplierProductListref = this.state.newSupplierProductList;
            newSupplierProductListref.push(data)
            this.setState({
                tablesupplierPruductlist: [...supplierPruductlistref, ...newSupplierProductListref]
            })
        }
    }
    async deleteProductlist(idx) {
        // 从产品列表中删除产品
        const { supplierStore } = this.props;
        let { tablesupplierPruductlist, newSupplierProductList, supplierPruductlist } = this.state
        let productId = null;
        try {
            productId = tablesupplierPruductlist[idx].id;
        } catch (error) {
            productId = null;
        }
        // 只有存在id 才是删除服务端的产品
        if (productId && supplierStore.iseditor) {
            // 如果时编辑状态需要删除数据库
            let ret = await supplierAction.deleteSupplierProductInfo([productId]);
            supplierPruductlist.splice(idx, 1);
            this.setState({
                supplierPruductlist
            })
            message.info("产品删除成功")
        } else {
            let remotelen = supplierPruductlist.length;
            newSupplierProductList.splice(idx - remotelen, 1);
            this.setState({
                newSupplierProductList
            })
        }
        tablesupplierPruductlist.splice(idx, 1)
        this.setState({
            tablesupplierPruductlist: tablesupplierPruductlist
        })
    }
    async getSupplierProcductList(id) {
        // 当为编辑状态时 获取供应商产品列表
        let ret = await supplierAction.getSupplierProductlist(id)
        this.setState({
            tablesupplierPruductlist: ret||[],
            supplierPruductlist: ret||[],
        })
    }
    async editorSupplierProductInfo(redord, key) {
        const { toggleStore, supplierStore } = this.props;
        supplierStore.iseditorproduct = true;
        this.setState({
            productListKey: key
        })
        supplierStore.setEditSupplierProductInfo(redord);
        toggleStore.setToggle(SHOW_NEWPRODUCT_MODEL)
    }
     
    
    elipsString(str,length){
        let result = ''
       if(str.length>length){
           result= str.substr(0,length) +'...'
       }else{
           result = str
       }
       return result
   }
     //分页查询
     async pageChange(pageNum, rowNum) {
        let params = {
            pageNum,
            rowNum
        }
        this.loaddata(params)
    }
    async loaddata(params,keyword) {
        
        this.setState({ loading: true });
        let options = {
            ...params,
            keyword: keyword||'',
            status:'20'
        }
        let directList = await supplierDirectory.getAuthorizedDirectByParent(options);
        console.log(directList)
        this.setState({
            directList: directList.data,
            loading: false
        })
    }
  
      
        componentDidMount() {
            let params = {
                pageNum:1,
                rowNum:15
            }
            this.loaddata(params)
        }
    render() {
        const { toggleStore, showDetail } = this.props;
        const { directList,loading,currentDirectoryDetail} = this.state;
      
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
            
                render: (text, index, key) => key + 1
            },
            {
                title: '名录',
                dataIndex: 'name',
                width: 150,
                align: "center",
           
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { showDetail(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{ this.elipsString(text,15)}</span></Tooltip>
            },
          
            // {
            //     title: '创建人',
            //     dataIndex: 'createuser',
            //     width: 150,
            //     align: "center",
            // },
            {
                title: '说明',
                dataIndex: 'description',
                width: 230,
                align: "center",
            },
            {
                title: '更新时间',
                dataIndex: 'updatedate',
                width: 150,
                align: "center",
                sorter: (a, b) => (moment(a.create_time).valueOf() - moment(b.create_time).valueOf()),
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            // {
            //     title: '状态',
            //     dataIndex: 'status',
            //     width: 150,
            //     align: "center",
            //     render: (text) => text == 20 ? '已发布' :  <Text type="danger">未发布</Text>
            // }
           
        ];
        return (
            <div>
                <Modal
                    title={`上级授权名录`}
                    visible={toggleStore.toggles.get(SHOW_DirectorysOfPrevOrg_MODEL)}
                    width={960}
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleOk }
                    onCancel={this.handleCancel}
                >
                        <Card bordered={false} className="new_supplier_form">
                        <Table size='middle' loading={loading} rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''} bordered={true} rowKey={(text) => text.id} scroll={{ x: 700 }} columns={columns} pagination={{ showTotal:()=>`共${directList.recordsTotal}条`, onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: true, total: directList.recordsTotal, pageSize: 20 }} dataSource={directList.list} />
                        {/* <SupsInDirInfoByPrevorg  chooseSupplier={this.chooseSupplier} directDetail={detail} refreshData={ (options,keyword)=>{this.loaddata(options,keyword)} } directList={directList}/> */}
                        </Card>
                      
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'DirectorysOfPrevOrg' })(DirectorysOfPrevOrg);