import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Empty, Card, Select, Icon, Button, message, Tooltip } from 'antd';
import _ from "lodash";
import { toJS } from "mobx"
import { observer, inject } from 'mobx-react';
import {  SHOW_NEWPRODUCT_MODEL,SHOW_SUPINDIRECTORY_MODEL } from "../../../../constants/toggleTypes"
import { supplierAction ,supplierDirectory} from "../../../../actions"
import SupsInDirInfo from "../SupsInDirInfo"

const { Option } = Select;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore', 'supplierStore')
@observer
class SuppliersInDirectory extends React.Component {
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
        supplierList:[]
    }
  

    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_SUPINDIRECTORY_MODEL)
    };
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_SUPINDIRECTORY_MODEL)
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
     
    

    async loaddata(params,keyword) {
        
        this.setState({ loading: true });
        const { detail} =this.props
        let options = {
            ...params,
            directoryId:detail.id,
            keyword: keyword||''
        }
        console.log(options)
        let supplierList = await supplierDirectory.getSuppliersByDirect(options);
        console.log(supplierList)
        this.setState({
            supplierList: supplierList,
            loading: false
        })
    }
        //分页查询
        async pageChange(pageNum, rowNum) {
            let params = {
                pageNum,
                rowNum
            }
            this.loaddata(params)
        }
        componentDidMount() {
            let params = {
                pageNum:1,
                rowNum:15
            }
            this.loaddata(params)
        }
    render() {
        const { toggleStore, detail ,userInfo} = this.props;
        const { supplierList} = this.state;
     
      
        return (
            <div>
                <Modal
                    title={`名录 ${detail.name} 下的供应商`}
                    visible={toggleStore.toggles.get(SHOW_SUPINDIRECTORY_MODEL)}
                    width={960}
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleOk }
                    onCancel={this.handleCancel}
                >
                        <Card bordered={false} className="new_supplier_form">
                        <SupsInDirInfo  chooseSupplier={this.chooseSupplier} userInfo={userInfo} directDetail={detail} refreshData={ (options,keyword)=>{this.loaddata(options,keyword)} } supplierList={supplierList}/>
                        </Card>
                </Modal>
            </div>
        );
    }
}

export default Form.create({ name: 'SuppliersInDirectory' })(SuppliersInDirectory);