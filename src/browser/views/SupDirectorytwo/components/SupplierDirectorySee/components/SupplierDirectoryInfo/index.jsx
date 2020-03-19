import React, { Component, Fragment } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Icon, Tooltip, message, Select, Typography, Popconfirm, Input, Form, Row, Col } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import { SHOW_NewGYS_MODEL } from "../../../../../../constants/toggleTypes";
import { supplierAction, supplierDirectory } from "../../../../../../actions"
import NewGYS from '../NewGYS'
import "./index.less";

const { Option } = Select;
const { Search } = Input;

const { Text } = Typography;
const ButtonGroup = Button.Group;
const calcTime = () => {
    let times = {}
    let t = window.performance.timing
    //重定向时间
    times.redirectTime = t.redirectEnd - t.redirectStart
    return times
}

@inject('toggleStore', 'supplierStore')
@observer
class SupplierDirectoryInfo extends Component {
    state = {
        infoSelectedRowKeys: [],
        infoSelectedRows: [],
        // status: '',
        // treeData:[],
        yuansuo: [],
        orgids: '',
        typecodes: '5',
        keywords: '',
    }
    pageChange = (pageNum, rowNum) => {
        let { pageChange } = this.props
        pageChange(pageNum, rowNum)
    }


    // 表格复选框
    onSelectChange = (selectedRowKeys, selectedRows) => {
        let { onSelectedRowKeys } = this.props
        onSelectedRowKeys(selectedRowKeys, selectedRows)
        this.setState({
            infoSelectedRowKeys: selectedRowKeys,
            infoSelectedRows: selectedRows
        })
    }

    // 弹出初始化modal框
    // initialization = () => {
    //     const { toggleStore } = this.props;
    //     this.setState({
    //         status:0
    //     },()=>{
    //         toggleStore.setToggle(SHOW_NewGYS_MODEL)
    //     })
    // }

    // 搜索供应商
    onSearchValue = (value) => {
        let { searchValue ,selectSearchValue} = this.props
        this.setState({
            keywords: value
        }, () => {
            let { orgids,typecodes,keywords } = this.state
            searchValue(orgids, typecodes == 5 ? '' : typecodes, keywords)
            selectSearchValue(orgids,typecodes,value)
        })

    }

    // 获取登录用户下属企业
    async getaAllSubOrgdepartment() {
        let res = await supplierDirectory.getaAllSubOrgdepartment()
        if (res.code == 200) {
            let _arr = []
            this.jiexi(res.data, _arr)
            _arr.sort()
            this.setState({
                yuansuo: _arr,
                orgids: _arr[0].deptid
            })
        }
    }

    jiexi = (data, _arr) => {
        data.forEach((item, index) => {
            let _tmp = JSON.parse(JSON.stringify(item))
            _tmp.children = null
            _arr.push(_tmp)
            if (item.children == null) {
                return;
            }
            this.jiexi(item.children, _arr)
        })
    }



    componentDidMount = () => {
        this.getaAllSubOrgdepartment()
    }
    componentWillReceiveProps = (nextProps, nextState) => {
        if (nextProps.point) {
            this.setState({
                infoSelectedRowKeys: [],
                infoSelectedRows: []
            })
        }
    }

    render() {
        let { infoSelectedRowKeys, infoSelectedRows, yuansuo,orgids,typecodes,keywords} = this.state
        let { pageNum, rowNum, tableData, upload, loading, selectNode, toggleStore, producttype ,selectSearchValue,orgid,typecode,keyword} = this.props
        let sign = !(infoSelectedRowKeys.length > 0)
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 4 },
        };
        // 表格复选框配置项
        const rowSelection = {
            columnWidth: 30,
            selectedRowKeys: infoSelectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.onSelectChange(selectedRowKeys, selectedRows)
            }
        };
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",

                render: (text, index, key) => key + 1
            },
            {
                title: '供应商名称',
                dataIndex: 'name',
                width: 150,
                align: "center",

                // render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.getDirectoryDetail(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{this.elipsString(text, 15)}</span></Tooltip>
            },
            {
                title: '统一社会信用代码',
                dataIndex: 'number',
                width: 230,
                align: "center",
            },
            {
                title: '产品范围',
                dataIndex: 'product_scope',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '产品类别',
                dataIndex: 'product_category',
                width: 100,
                align: "center",
            },
            {
                title: '配套领域',
                dataIndex: 'model_area',
                width: 150,
                align: "center",
            },
            {
                title: '所属名录',
                dataIndex: 'from',
                align: "center",
                width: 270,
            }
        ];

        const SearchValue = () => {
            const { getFieldDecorator } = this.props.form;
            return (
                <div className="search_value_div">
                    <Search className="search_value_search" placeholder="搜索供应商" width={100} onSearch={value => { this.onSearchValue(value) }} enterButton />
                    <div className="search_value">
                        供应商性质：<Select style={{ width: "100px" }} defaultValue={typecode} value={typecode} onSelect={
                            (e) => {
                                this.setState({
                                    typecodes: e
                                })
                                selectSearchValue(orgids,e,keywords)
                            }
                        }>
                            <Option value="5">全部</Option>
                            <Option value="0">限用</Option>
                            <Option value="1">合格</Option>
                            <Option value="2">自增</Option>
                            <Option value="3">上级授权</Option>
                        </Select>
                    </div>
                    <div className="search_value">
                        院所：<Select style={{ width: "200px" }} value={orgid} onSelect={
                            (e) => {
                                this.setState({
                                    orgids: e
                                })
                                selectSearchValue(e,typecodes,keywords)
                            }
                        }>
                            {yuansuo.map((item) => {
                                return (
                                    <Option key={item.id} value={item.deptid}>{item.name}</Option>
                                )
                            })}
                        </Select>
                    </div>

                </div>
            )
        }
        return (
            <Fragment>


                <Card extra={<SearchValue />}>

                    <Table
                        size='middle'
                        loading={loading}
                        rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''}
                        bordered={true}
                        rowKey={(text) => text.flag}
                        // rowSelection={rowSelection}
                        scroll={{ x: 900 }}
                        columns={columns}
                        pagination={{
                            showTotal: () => `共${tableData.recordsTotal}条`,
                            onChange: (page, num) => { this.pageChange(page, num) },
                            current: pageNum,
                            showQuickJumper: true,
                            total: tableData.recordsTotal,
                            pageSize: rowNum
                        }}
                        dataSource={tableData.list}
                    />
                </Card>
                {/* 查看新增供应商 */}
                {
                    toggleStore.toggles.get(SHOW_NewGYS_MODEL) && <NewGYS />
                }

            </Fragment >
        )
    }
}

SupplierDirectoryInfo.propTypes = {
}
export default Form.create({ name: 'supplierdirectoryInfo' })(SupplierDirectoryInfo);