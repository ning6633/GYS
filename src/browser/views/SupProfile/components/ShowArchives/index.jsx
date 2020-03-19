import React, { Component } from 'react';
import { Card, Button, Table, Upload, Icon, Tooltip, message, Select, Form, Row, Col, Input, Popconfirm } from 'antd';
import { observer, inject, } from 'mobx-react';
import SupDetails from '../ShowDetails'
import supArchives from '../../../../actions/supArchives'
import { SupPa, supContractAct } from "../../../../actions"
import { SHOW_ShowArchives_MODEL, SHOW_Modification_MODEL, SHOW_Punishment_MODEL } from "../../../../constants/toggleTypes"
import Modification from '../Modification/index'

const { Search } = Input



@inject('toggleStore', 'supplierStore')
@observer

class SupArchives extends Component {
    state = {
        supplierList: {
            list: [],
            recordsTotal: 0
        },

        id: '',
        curPage: 1,
        searchValue: '',
        companyInfo: {},
        selectedrecords: [],
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        pageNum: 1,
        rowNum: 20
    };
    isSearch = false;
    async loaddata(pageNum, rowNum, name) {
        //获取当前登录用户角色
        let supplierList
        let userVertyIndex
        const { roleNameKey, userId } = SupPa.pageInfo
        let roles = roleNameKey.split(',')
        this.setState({
            curPage: pageNum,
            loading: true
        })
        //获取角色列表
        let res = await SupPa.getApprovalRoles()
        for (let roleName of roles) {
            userVertyIndex = res.findIndex(item => item.roleKey == roleName)
        }
        if (userVertyIndex >= 0) {
            if (res[userVertyIndex].code == "gys") {
                let res = await supContractAct.getUserInfoByUserId();
                
                if (res.code == 200) {
                    let gysid = res.data.gysId
                    supplierList = await supArchives.getSupArchivesInfoOne(gysid);
                    
                    if (supplierList.code == 200) {
                        let _arr = []
                        _arr.push(supplierList.data.gysmessage)
                        this.setState({
                            supplierList: {
                                list: _arr,
                                recordsTotal: 1
                            },
                            loading: false
                        })
                    }
                }
            } else {
                supplierList = await supArchives.getSupArchivesInfo(pageNum, rowNum, name);
                console.log(supplierList)
                this.setState({
                    supplierList: supplierList.data,
                    loading: false
                })
            }
        } else {
            this.setState({
                supplierList: {
                    list: [],
                    recordsTotal: 0
                },
                loading: false
            })
        }


    }
    suplierGYSinfos(data) {
        let { toggleStore, supplierStore } = this.props
        toggleStore.setToggle(SHOW_ShowArchives_MODEL)
        supplierStore.setEditSupplierArchivesInfo(data)

    }
    pageChange(page, num) {
        let { searchValue } = this.state
        this.setState({
            pageNum: page
        }, () => {
            this.loaddata(page, num, searchValue)
        })

    }
    componentDidMount() {
        let { pageNum, rowNum, searchValue } = this.state
        this.loaddata(pageNum, rowNum, searchValue)
    }
    modification = () => {
        let { toggleStore, supplierStore } = this.props
        toggleStore.setToggle(SHOW_Modification_MODEL)
    }
    search = (e) => {
        this.setState({
            searchValue: e,
            pageNum: 1
        }, () => {
            let { pageNum, rowNum, searchValue } = this.state
            this.loaddata(pageNum, rowNum, e)
        })

    }

    render() {
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
                width: 150,
                align: "center",
                render: (text, redord) => <span>{text}</span>
            },
            {
                title: '供应商名称编号',
                dataIndex: 'number',
                width: 200,
                align: "center"
            },
            {
                title: '企业性质',
                dataIndex: 'property_key',
                width: 100,
                align: "center",
            },
            {
                title: '绩效评价',
                dataIndex: 'gysjjpj',
                width: 100,
                align: "center",
            },
            {
                title: '操作',
                dataIndex: 'providerid',
                align: "center",
                width: 100,
                render: (text, redord) => <Tooltip ><span onClick={(e) => { this.suplierGYSinfos(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>查看文档</span></Tooltip>
            },
        ];
        const SupArchivesSearch = () => (
            <div className="table-fileter">
                <Search placeholder="请输入内容" onSearch={this.search} enterButton />
            </div>
        )
        let { loading, pageNum } = this.state
        let { toggleStore } = this.props
        return (
            <Card extra={<SupArchivesSearch></SupArchivesSearch >}>

                {
                    //修改记录
                    toggleStore.toggles.get(SHOW_Modification_MODEL) && <Modification ></Modification>
                }

                {
                    //查看详情
                    toggleStore.toggles.get(SHOW_ShowArchives_MODEL) && <SupDetails></SupDetails>
                }
                <Table
                    className={'gys_table_height'}
                    scroll={{ x: 760 }}
                    size='middle'
                    // rowSelection={{
                    //     type:'checkbox'
                    // }}
                    loading={loading}
                    rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''} bordered={true} rowKey={(text) => text.id}
                    columns={columns}
                    pagination={{
                        showTotal: () => `共${this.state.supplierList.recordsTotal}条`,
                        onChange: (page, num) => { this.pageChange(page, num) },
                        current: pageNum,
                        showQuickJumper: {
                            goButton: <Button type="link" size={'small'}>
                                跳转
                                </Button>
                        },
                        total: this.state.supplierList.recordsTotal,
                        pageSize: 20
                    }}
                    dataSource={this.state.supplierList.list} />
            </Card>
        )
    }
}

export default SupArchives