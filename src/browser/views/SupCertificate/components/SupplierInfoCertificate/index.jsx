import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Tag, Table, Input, Tooltip, message, Select, Button } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import { SHOW_SupCertificatedetail_MODEL, SHOW_SupCertificateInfo_MODEL, SHOW_SupInfoManager_MODEL } from "../../../../constants/toggleTypes";
import { supplierAction, supplierApproval } from "../../../../actions"
import SupCertificateInfo from "../SupCertificateInfo";
import "./index.less";
const { Option } = Select;
const { Search } = Input;

@inject('toggleStore', 'supplierStore')
@observer
class SupplierInfoCertificate extends Component {
    state = {
        flowURL: "",
        cerInfo: {},
        supplierList: {
            list: [],
            recordsTotal: 0
        },
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        ProductCategory: [],//产品类别
        ProductScope: [],//产品范围
        ProductCategoryInfo: '',
        ProductScopeInfo: '',
        pageNum: 1,
        rowNum: 20,
        defaultValueScope: '全部',
        defaultValueCategory: '全部'

    };
    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };
    async submitSupplierInfo(redord) {
        const { toggleStore, supplierStore } = this.props;
        if (redord.is_diff != 0) {
            toggleStore.setToggle(SHOW_SupInfoManager_MODEL)
        } else {
            let supplierList = await supplierAction.submitSupplierInfo([redord.id]);
            message.success("提交成功")
            this.loaddata({})
        }
    }
    async submitSupplierInfopl() {
        let supplierList = await supplierAction.submitSupplierInfo(this.state.selectedRowKeys);
        message.success("提交成功")
        this.loaddata({})
    }
    async deleteSupplierInfo() {
        let supplierList = await supplierAction.deleteSupplierInfo(this.state.selectedRowKeys);
        if (supplierList) {
            message.success("删除成功")
            this.loaddata({})
        }
    }
   async dic(type){
       //获取产品类别
       let res = await supplierApproval.dic(type);
       if(res.code == 200){
           if(type == 'PRODUCT_SCOPE' ){
               this.setState({ProductScope:res.data})
           }
           if(type == 'LEVEL' ){
               this.setState({ProductCategory:res.data})
           }
       }
   }
    async loaddata(body) {
        //页面初始化
        let { ProductCategory, ProductScope } = this.state
        let { pageNum, rowNum } = this.state
        this.dic('PRODUCT_SCOPE')
        this.dic('LEVEL')
        body.pageNum = pageNum
        body.rowNum = rowNum
        this.setState({ loading: true });
        let supplierList = await supplierApproval.getSuppliercredentialList(body);
        this.setState({
            supplierList: supplierList,
            loading: false,defaultValueCategory: '全部', defaultValueScope: '全部' 
        })
    }
    // 申请编辑供应商信息流程
    async approvalSupplierinfo(redord) {
        const { toggleStore } = this.props;
        this.setState({
            cerInfo: redord
        })
        toggleStore.setToggle(SHOW_SupCertificateInfo_MODEL)
    }
    //分页查询
    async pageChange(pageNum, rowNum) {
        this.loaddata({ pageNum, rowNum })
    }
    // getType(list, _type) {
    //     let tmp = []
    //     for (let i = 0; i < list.length; i++) {
    //         tmp = tmp.concat(list[i][_type].split(','))
    //         tmp = Array.from(new Set(tmp))
    //     }
    //     tmp.unshift('全部')
    //     return tmp
    // }
    selectOnChange = (num, e) => {
        switch (num) {
            case 1:
                this.setState({ defaultValueScope: e})
                break;
            case 2:
                this.setState({ defaultValueCategory: e})
                break; 
            default:
                break;
        }

    }
    search = (e) => {
        let {defaultValueCategory,defaultValueScope}=this.state
        this.loaddata({ supplierName: e ,category:defaultValueCategory == '全部' ? '':defaultValueCategory,scope:defaultValueScope == '全部' ? '' :defaultValueScope})
    }
    componentDidMount = () => {
        const { toggleStore } = this.props;
        window.closeModel = (modelname) => {
            toggleStore.setToggle(modelname)
            this.loaddata({})
        }
        this.loaddata({})

    }
    render() {
        const { toggleStore, supplierStore } = this.props;
        const { loading, selectedRowKeys, ProductCategory, ProductScope, defaultValueCategory, defaultValueScope } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const that = this;
        const hasSelected = selectedRowKeys.length > 0;
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '供应商名称',
                dataIndex: 'name',
                width: 200,
                align: "center",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.approvalSupplierinfo(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '供应商编号',
                dataIndex: 'number',
                width: 200,
                align: "center",
            },
            {
                title: '产品类别',
                dataIndex: 'category',
                width: 230,
                align: "center",
            },
            {
                title: '产品范围',
                dataIndex: 'scope',
                width: 300,
                align: "center",
            },
            {
                title: '拥有资质',
                dataIndex: 'certificateName',
                width: 500,
                align: "center",
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                width: 150,
                align: "center",
                sorter: (a, b) => (moment(a.create_time).valueOf() - moment(b.create_time).valueOf()),
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '更新时间',
                dataIndex: 'update_time',
                width: 150,
                align: "center",
                sorter: (a, b) => (moment(a.update_time).valueOf() - moment(b.update_time).valueOf()),
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            }
        ];
        let TableOpterta = () => (
            <div className="table-operations">
                产品类别：<Select placeholder='全部' defaultValue={defaultValueCategory} style={{ width: 150 , marginRight: 10 }} onChange={this.selectOnChange.bind(this, 2)}>
                    {ProductCategory.map((item, index) => {
                        return (
                            <Option key={index} value={item.name}>{item.name}</Option>
                        )
                    })}
                </Select>
                产品范围：<Select placeholder='全部' defaultValue={defaultValueScope} style={{ width: 150}} onChange={this.selectOnChange.bind(this, 1)}>
                    {ProductScope.map((item, index) => {
                        return (
                            <Option key={index} value={item.name}>{item.name}</Option>
                        )
                    })}
                </Select>
                {/* 配套领域：<Select placeholder='全部' style={{ width: 150 }} onChange={this.selectOnChange}>

                </Select> */}
            </div>
        )
        let TableFilterBtn = () => (
            <div className="table-fileter">
                <Search placeholder="搜索供应商名称" onSearch={this.search} enterButton />
            </div>
        )

        return (
            <Card title={<TableOpterta />} extra={<TableFilterBtn />}>
                {
                    toggleStore.toggles.get(SHOW_SupCertificateInfo_MODEL) && <SupCertificateInfo cerInfo={this.state.cerInfo} />
                }

                <Table
                    size='middle'
                    loading={loading}
                    rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''}
                    bordered={true}
                    rowKey={(text) => text.id}
                    // rowSelection={rowSelection} 
                    scroll={{ x: 1800 }}
                    columns={columns}
                    pagination={{
                        showTotal: () => `共${this.state.supplierList.recordsTotal}条`,
                        onChange: (page, num) => {
                            this.pageChange(page, num)
                        },
                        showQuickJumper: {
                            goButton: <Button type="link" size={'small'}>
                                跳转
                                    </Button>
                        },
                        total: this.state.supplierList.recordsTotal,
                        pageSize: 20
                    }}
                    dataSource={this.state.supplierList.list}
                />
            </Card>
        )
    }
}

SupplierInfoCertificate.propTypes = {
}
export default SupplierInfoCertificate;