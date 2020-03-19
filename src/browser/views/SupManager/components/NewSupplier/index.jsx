import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Table, Cascader, Card, Select, Icon, Button, message, Tooltip } from 'antd';
import _ from "lodash";
import { toJS } from "mobx"
import { observer, inject } from 'mobx-react';
import { SHOW_LOGIN_MODEL, SHOW_NEWPRODUCT_MODEL, SHOW_ChooseXzqy_MODEL, SHOW_ChooseCompany_MODEL } from "../../../../constants/toggleTypes"
import NewsuProduct from "../NewsuProduct";
import { supplierAction } from "../../../../actions"
import Choosepsupplier from "../Choosepsupplier"
import ChooseXzqy from "../../../../components/ChooseXzqy"
const { Option } = Select;
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore', 'supplierStore')
@observer
class NewSupplier extends React.Component {
    state = {
        supplierId: '',
        productListKey: '',
        supplierPruductlist: [],
        tablesupplierPruductlist: [],
        newSupplierProductList: [],
        compQyxz: [],
        city: [],
        district_keyref: '',
        isBzSup: true,
        supplierInfo: {
            id: "",
            name: "",
            code: "",
            name_other: "",
            another_name: "",
            district_key: "",
            district_keyname: ""
        }
    }
    // 是否允许提交
    isRXTj = true
    async getorg_idFromDept() {
        // 为了去除选择上报院，默认设置上报院
        try {
            let userInfo = await supplierAction.getUserInfo()
            console.log(userInfo)
            let org_id = userInfo.org_id
            if (org_id == '') {
                this.isRXTj = false;
            } else {
                this.setState({
                    org_id
                })
            }
        } catch (error) {
            this.isRXTj = false;
            message.error('无法获取到上报院！请联系管理员')
        }
    }
    async addSupplierInfo() {
        const { getFieldsValue } = this.props.form;
        const { toggleStore, refreshData } = this.props;
        let { supplierId, org_id } = this.state;
        let { name, level, property_key, another_name, code, district_key, name_other } = getFieldsValue(['name', 'level', 'property_key', 'another_name', 'code', 'district_key', 'name_other']);
        let postSuppLierInfo =
        {
            "add_ext_id": "",
            "another_name": another_name,
            "bindid": "",
            "code": code,
            "come_from": 2,
            "come_user_id": supplierAction.pageInfo.userId,
            "create_time": '',
            "createuser": supplierAction.pageInfo.username,
            "delete_status": 0,
            "dept_id": supplierAction.pageInfo.departmentId,
            "district_key": district_key,
            // "gys_create_time": '',
            "gys_data_id": supplierId,
            // "id": "",
            "is_diff": 0,
            "is_new": 0,
            "isend": 0,
            "level": level,
            "name": name,
            "name_other": name_other,
            "org_id": org_id,
            "orgid": "string",
            "processdefid": "string",
            "property_key": property_key.pop(),
            "status": 0,
            "updateuser": supplierAction.pageInfo.username,
            "version": 0
        }
        let ret = await supplierAction.addSupplierinfo(postSuppLierInfo);
        message.success('供应商信息创建成功');
        return ret;
    };
    async remoteEditorInfo(values) {
        let { supplierId, org_id } = this.state;
        let { property_key } = values
        delete values.property_key
        let postSuppLierInfo = {
            "id": supplierId,
            "org_id": org_id,
            property_key: property_key.pop(),
            ...values
        }
        let ret = await supplierAction.remoteEditorInfo(postSuppLierInfo);
        message.success('供应商信息编辑成功');
        return supplierId;
    }
    handleSubmit = e => {
        if (!this.isRXTj) {
            message.error('上报院！请联系管理员')
            return
        }
        e.preventDefault();
        const { toggleStore, refreshData, supplierStore } = this.props;
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let newsupplierinfoid
                if (supplierStore.iseditor) {
                    newsupplierinfoid = await this.remoteEditorInfo(values);
                } else {
                    newsupplierinfoid = await this.addSupplierInfo();
                }
                let ret = await this.addSupplierProductinfo(newsupplierinfoid)
                toggleStore.setToggle(SHOW_LOGIN_MODEL);
                refreshData()
            }
        });
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_LOGIN_MODEL)
    };
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_LOGIN_MODEL)
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
        let { property_key } = data;
        delete data.property_key;
        setFieldsValue({ ...data, property_key: this.getQyxzCodeArr(property_key) })
    }
    chooseBZcompany(data) {
        const { setFieldsValue } = this.props.form;
        this.setState({
            org_id: data.id,
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
        let supplierPruductlistRef = _.cloneDeep(supplierPruductlist)
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
            supplierPruductlistRef.splice(idx, 1);
            this.setState({
                supplierPruductlist: supplierPruductlistRef
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
            tablesupplierPruductlist: [...ret, ...this.state.newSupplierProductList] || [...this.state.newSupplierProductList],
            supplierPruductlist: ret || [],
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

    async componentDidMount() {
        console.log(this.props)
        const { supplierStore } = this.props;
        this.getworldareatree()
        await this.getCompanyTypeTree()
        if (supplierStore.iseditor || supplierStore.islookdetail) {
            let editSupplierInforef = toJS(supplierStore.editSupplierInfo)
            const { setFieldsValue } = this.props.form;
            supplierStore.iseditor && this.getCurSupIsBZ(editSupplierInforef)
            let { property_key } = editSupplierInforef;
            delete editSupplierInforef.property_key;
            this.setState({
                org_id: editSupplierInforef.org_id,
                supplierId: editSupplierInforef.id,
                supplierInfo: editSupplierInforef
            })
            setFieldsValue({ ...editSupplierInforef, property_key: this.getQyxzCodeArr(property_key) })
            this.getSupplierProcductList(editSupplierInforef.id)
        }
        //异步获取上报院ID，不应影响查看，新建，编辑功能
        this.getorg_idFromDept();
    }
    async getCompanyTypeTree() {
        let ret = await supplierAction.getCompanyTypeTree()
        this.setState({
            compQyxz: ret
        })
    }
    getQyxzCodeArr(name) {
        let compQyxz = this.state.compQyxz;
        let CompCodeQyxz = []
        try {
            for (let i = 0; i < compQyxz.length; i++) {
                for (let j = 0; j < compQyxz[i].qyxzZ.length; j++) {
                    let item = compQyxz[i].qyxzZ[j]
                    if (item.name == name) {
                        CompCodeQyxz.push(compQyxz[i].name, item.name)
                        break;
                    }
                }
            }
        } catch (err) {
            console.log("不标准的企业性质信息")
        }
        console.log(CompCodeQyxz)
        return CompCodeQyxz;
    }
    getChooseXzqy(data) {
        console.log(data);
        // 获取选择的 供应商行政区域
        let xzqyName = data.pop().label
        let district_key = data.pop().value
        const { setFieldsValue } = this.props.form;
        setFieldsValue({ district_key: xzqyName })
        this.setState({
            district_keyref: district_key
        })
    }
    async getworldareatree() {
        let ret = await supplierAction.getworldareatree()
        this.city = {
            guonei: ret[0],
            guoji: ret[1]
        }
        this.setState({
            city: ret
        })
    }
    async getCurSupIsBZ(editSupplierInforef) {
        let { name, code, property_key } = editSupplierInforef
        let ret = await supplierAction.getCurSupIsBZ({ name, code, property_key })
        this.setState({
            isBzSup: ret
        })
    }
    render() {
        const { toggleStore, supplierStore } = this.props;
        const { supplierId, tablesupplierPruductlist } = this.state;
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const columns = [
            {
                title: '产品名称',
                dataIndex: 'name',
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
            },
            {
                title: '是否上天',
                dataIndex: 'is_sky',
                align: "center",
                render: (text, record) => record.errorcolumn.indexOf('is_sky') != -1 ? <span style={{ color: 'red' }}>{text}</span> : text
            },
            {
                title: '产品分类',
                dataIndex: 'category',
                align: "center",
                render: (text, record) => record.errorcolumn.indexOf('category') != -1 ? <span style={{ color: 'red' }}>{text}</span> : text
            },
            {
                title: '配套领域',
                dataIndex: 'model_area',
                align: "center",
                render: (text, record) => record.errorcolumn.indexOf('model_area') != -1 ? <span style={{ color: 'red' }}>{text}</span> : text
            },
            {
                title: '配套方式',
                dataIndex: 'match_mode',
                align: "center",
                render: (text, record) => record.errorcolumn.indexOf('match_mode') != -1 ? <span style={{ color: 'red' }}>{text}</span> : text
            },
            {
                title: '任务甲方',
                dataIndex: 'org_id',
                width: 150,
                align: "center",
                render: (text, record) => record.errorcolumn.indexOf('org_id') != -1 ? <span style={{ color: 'red' }}>{text}</span> : text
            },
            {
                title: '产品范围',
                dataIndex: 'product_scope',
                align: "center",
                render: (text, record) => record.errorcolumn.indexOf('product_scope') != -1 ? <span style={{ color: 'red' }}>{text}</span> : text
            },
            {
                title: '重要程度',
                dataIndex: 'importance_name',
                align: "center",
                render: (text, record) => record.errorcolumn.indexOf('importance_name') != -1 ? <span style={{ color: 'red' }}>{text}</span> : text
            },
            {
                title: '操作',
                dataIndex: 'cz',
                fixed: "right",
                align: "center",
                width: 150,
                render: (text, redord, key) => {
                    return (<div><Button disabled={supplierStore.islookdetail} onClick={() => { this.editorSupplierProductInfo(redord, key) }} style={{ marginRight: 5 }} type="primary" size={'small'}>编辑</Button> <Button disabled={supplierStore.islookdetail} type="danger" onClick={() => { this.deleteProductlist(key) }} size={'small'}>删除</Button></div>)
                }
            },
        ];
        return (
            <div>
                <Modal
                    title={!supplierStore.iseditor ? "供应商在线填报" : (supplierStore.islookdetail ? "供应商信息查看" : "供应商信息编辑")}
                    visible={toggleStore.toggles.get(SHOW_LOGIN_MODEL)}
                    width={960}
                    okText="确认"
                    cancelText="取消"
                    onOk={supplierStore.islookdetail ? this.handleOk : this.handleSubmit}
                    onCancel={this.handleCancel}
                >
                    <Form className="ant-advanced-search-form" onSubmit={(e) => { this.handleSubmit(e) }}>

                        <Card bordered={false} title={<span><b>供应商信息</b>{!this.state.isBzSup && <span style={{ color: 'red', fontSize: 12 }}>  (标准库中未找到此供应商，请重新选择供应商)</span>}</span>} className="new_supplier_form">
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'选择供应商次'}>
                                            {getFieldDecorator(`level`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '选择供应商次',
                                                    },
                                                ],
                                            })(
                                                <Select disabled={supplierStore.islookdetail}>
                                                    <Option value="一次">一次</Option>
                                                    <Option value="二次">二次</Option>
                                                    <Option value="三次">三次</Option>
                                                    <Option value="四次">四次</Option>
                                                    <Option value="五次">五次</Option>
                                                    <Option value="六次">六次</Option>
                                                    <Option value="七次">七次</Option>
                                                    <Option value="八次">八次</Option>
                                                    <Option value="九次">九次</Option>
                                                    <Option value="十次">十次</Option>
                                                </Select>)}
                                        </Form.Item>
                                    </Col>
                                    {/* <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'上报院'}>
                                            {getFieldDecorator(`org_id_name`, {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '上报院',
                                                    },
                                                ],
                                            })(<Input disabled={true} addonAfter={!supplierStore.islookdetail ? <Icon style={{ cursor: 'pointer' }} onClick={() => { toggleStore.setToggle(SHOW_ChooseCompany_MODEL); supplierStore.chooseGysCompany = this.chooseBZcompany.bind(this) }} type="plus" /> : null} />)}
                                        </Form.Item>
                                    </Col> */}
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'供应商名称'}>
                                            {getFieldDecorator(`name`, {
                                                initValue: "供应商名称",
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '供应商名称',
                                                    },
                                                ],
                                            })(<Input disabled={true} addonAfter={!supplierStore.islookdetail ? <Choosepsupplier title="选择标准供应商" chooseBZsupplier={(data) => this.chooseBZsupplier(data)} /> : null} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'社会信用代码'}>
                                            {getFieldDecorator(`code`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '统一社会信用代码',
                                                    },
                                                ],
                                            })(<Input disabled={true} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'简称'}>
                                            {getFieldDecorator(`name_other`)(<Input disabled={true} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'别称'}>
                                            {getFieldDecorator(`another_name`)(<Input disabled={true} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'企业性质'}>
                                            {getFieldDecorator(`property_key`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '企业性质',
                                                    },
                                                ],
                                            })(<Cascader placeholder="" fieldNames={{ label: 'name', value: 'name', children: 'qyxzZ' }} disabled={true} showSearch={true} options={this.state.compQyxz} />)}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12} >
                                        <Form.Item {...formItemLayout} label={'行政区域'}>
                                            {getFieldDecorator(`district_key`, {
                                                rules: [
                                                    {
                                                        required: false,
                                                        message: '行政区域',
                                                    },
                                                ],
                                            })(<Input disabled={true} addonAfter={!true ? <Icon style={{ cursor: 'pointer' }} onClick={() => toggleStore.setToggle(SHOW_ChooseXzqy_MODEL)} type="plus" /> : null} />)}
                                        </Form.Item>
                                    </Col>
                                </Col>
                            </Row>
                        </Card>
                        <Card bordered={false} title={<b>供应商产品列表</b>} extra={
                            !supplierStore.islookdetail && <Button type="primary" onClick={() => {
                                let { name } = getFieldsValue(['name']);
                                if (name != undefined && name != '') {
                                    toggleStore.setToggle(SHOW_NEWPRODUCT_MODEL); supplierStore.iseditorproduct = false;
                                } else {
                                    message.error('请先填写供应商名称')
                                }
                            }}>
                                新增产品
                            </Button>
                        } className="new_supplier_producelist">
                            <Row>
                                <Col span={24}>
                                    <Table scroll={{ x: 1100 }} rowKey={(text, key) => key} columns={columns} dataSource={tablesupplierPruductlist} />
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                </Modal>
                {
                    toggleStore.toggles.get(SHOW_ChooseXzqy_MODEL) && <ChooseXzqy getChooseXzqy={this.getChooseXzqy.bind(this)} city={this.state.city} />
                }
                {toggleStore.toggles.get(SHOW_NEWPRODUCT_MODEL) && <NewsuProduct supplierId={supplierId} getProductInfo={(data) => { this.getProductInfo(data) }} />}
            </div>
        );
    }
}

export default Form.create({ name: 'NewSupplier' })(NewSupplier);