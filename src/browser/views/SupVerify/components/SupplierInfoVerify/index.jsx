import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Upload, Icon, Tooltip, message, Select, Input } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import _ from "lodash";
import { SHOW_ProductVerify_MODEL } from "../../../../constants/toggleTypes";
import { supplierVerify } from "../../../../actions"
import ProductVerify from "../ProductVerify";
import "./index.less";
const { Search } = Input;

@inject('toggleStore', 'verifyStore')
@observer
class SupplierInfoVerify extends Component {
    state = {
        supplierList: {
            list: [],
            recordsTotal: 0
        },
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
    };
    //分页查询
    async pageChange(page, num) {
        this.loaddata(page, num)
    }
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    editorSupplierProductInfo(redord) {
        const { toggleStore, verifyStore } = this.props;
        let redordData;
        if (!redord) {
            let { supplierList, selectedRowKeys } = this.state;
            redordData = _.find(supplierList.listGysProducts, { id: selectedRowKeys[0] })
        } else {
            redordData = redord;
        }
        verifyStore.setverifyEditProduct(redordData);
        toggleStore.setToggle(SHOW_ProductVerify_MODEL);
    }
    async loaddata(pageNum = 1, rowNum = 20) {
        this.setState({ loading: true });
        let supplierList = await supplierVerify.getSupplierProductinfoList(pageNum, rowNum);
        this.setState({
            supplierList,
            loading: false
        })
    }
    //分页查询
    async pageChange(page, num) {
        this.loaddata(page, num)
    }
    componentDidMount() {
        this.loaddata()
    }
    render() {
        const { toggleStore, verifyStore } = this.props;
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: 'radio',
        };
        const that = this;
        const hasSelected = selectedRowKeys.length > 0;

        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                fixed: "left",
                render: (text, index, key) => key + 1
            },
            {
                title: '供应商名称',
                dataIndex: 'gysname',
                width: 200,
                align: "center",
                fixed:"left",
                render: (text, redord) => <Tooltip title={text}><span >{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '统一社会信用代码',
                dataIndex: 'code',
                width: 250,
                align: "center",
            },
            {
                title: '企业性质',
                dataIndex: 'property_key',
                width: 150,
                align: "center",
            },
            {
                title: '上报单位',
                dataIndex: 'dept_idname',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '上报院',
                dataIndex: 'gysorg_idname',
                width: 200,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '次',
                dataIndex: 'level',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '产品名称',
                dataIndex: 'name',
                width: 230,
                align: "center",
            },
            {
                title: '是否上天',
                dataIndex: 'is_sky',
                width: 200,
                align: "center",
            },
            {
                title: '产品分类',
                dataIndex: 'category',
                width: 200,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '配套领域',
                dataIndex: 'model_area',
                width: 200,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '配套方式',
                dataIndex: 'match_mode',
                width: 200,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '任务甲方',
                dataIndex: 'org_id',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '产品范围',
                dataIndex: 'product_scope',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                width: 150,
                align: "center",
                sorter: (a, b) => (moment(a.update_time).valueOf() - moment(b.update_time).valueOf()),
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '更新时间',
                dataIndex: 'update_time',
                width: 150,
                align: "center",
                sorter: (a, b) => (moment(a.update_time).valueOf() - moment(b.update_time).valueOf()),
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '说明',
                dataIndex: 'is_right',
                width: 230,
                align: "center",
                render: (text) => text == 0 ? "准确" : "不准确"
            },
            {
                title: '操作',
                dataIndex: 'modify',
                align: "center",
                width: 200,
                render: (text, redord) => {
                    return (<div><Button onClick={() => { this.editorSupplierProductInfo(redord) }} style={{ marginRight: 5 }} type="primary" size={'small'}>编辑</Button> </div>)
                }
            },
        ];
        let TableOpterta = () => (
            <div className="table-operations">
                <Button disabled={!hasSelected} icon="edit" type="primary" onClick={() => { this.editorSupplierProductInfo() }} >编辑</Button>
            </div>
        )
        let TableFilterBtn = () => (
            <div className="table-fileter">
                <Search placeholder="搜索产品名称" onSearch={value => console.log(value)} enterButton />
            </div>
        )

        return (
            <Card title={<TableOpterta />} extra={<TableFilterBtn />}>
                {toggleStore.toggles.get(SHOW_ProductVerify_MODEL) && <ProductVerify refreshData={() => this.loaddata()} />}
                <Table size='middle' loading={loading} rowClassName={(text) => text.is_right == 1 ? 'is_diff' : ''} bordered={true} rowKey={(text,key) => key} rowSelection={rowSelection} scroll={{ x: 3300 }} columns={columns} pagination={{ onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: true, total: this.state.supplierList.recordsTotal, pageSize: 20 }} dataSource={this.state.supplierList.listGysProducts} />
            </Card>
        )
    }
}

SupplierInfoVerify.propTypes = {
}
export default SupplierInfoVerify;