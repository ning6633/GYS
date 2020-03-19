import React, { Component, Fragment } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, message, Table, Button, Input, Tooltip, Popconfirm } from 'antd';
import { SHOW_NewPA_MODEL, SHOW_ModelDetail_MODEL, SHOW_ChooseSupplierPub_MODEL } from "../../../../constants/toggleTypes"
import { observer, inject, } from 'mobx-react';
import { SupPa, supplierApproval } from "../../../../actions"
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import NewPa from '../NewPa'
import ShowPaDetail from '../ShowPaDetail'
const { Search } = Input;
@inject('toggleStore')
@observer
class SupPaInfo extends Component {
    state = {
        supplierList: {
            list: [],
            recordsTotal: 0
        },
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        showType: null,
        userTypeVerty: 'gys',
        pageNum: 1,
        rowNum: 20,
        gysName:null
    };
    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };
    //系统自动评价
    async evaluateBySys() {
        let result = await SupPa.evaluateBySys()
        if (result.code == 200 && result != undefined) {
            message.success('系统自动评价完成')
            let { pageNum, rowNum, gysName } = this.state
            this.loaddata(pageNum, rowNum, gysName)
        } else {
            message.error('删除失败')
        }
    }
    async deletePa() {
        const { selectedRowKeys } = this.state
        let result = await SupPa.delEvaluateByCenter(selectedRowKeys)
        if (result.code == 200 && result != undefined) {
            message.success(result.message)
            this.setState({ selectedRowKeys: [] }, () => {
                let { pageNum, rowNum, gysName } = this.state
                this.loaddata(pageNum, rowNum, gysName)
            });

        } else {
            message.error('删除失败')
        }
    }
    async getInfo(record, type) {
        const { toggleStore } = this.props
        let result = await SupPa.getDisciplinarysDetail(record.id)
        if (result.code == 200) {
            this.setState({
                detail: result.data,
                showType: type
            })
            toggleStore.setToggle(SHOW_ModelDetail_MODEL)
        } else {
            this.setState({
                detail: null
            })
        }
    }
    async editPa(data) {
        const { toggleStore } = this.props
        let result = await SupPa.editEvaluate(data)
        if (result.code == 200) {
            toggleStore.setToggle(SHOW_ModelDetail_MODEL)
            message.success(result.message)
            let { pageNum, rowNum, gysName } = this.state
            this.loaddata(pageNum, rowNum, gysName)
        }
    }
    async newPafn(data) {
        const { toggleStore } = this.props
        // data.gys_ID = '2b864f54-eaed-4dbe-b1e4-4625776aace6'
        let result = await SupPa.newPa(data)
        if (result.code == 200) {
            toggleStore.setToggle(SHOW_NewPA_MODEL)
            message.success(result.message)
            let { pageNum, rowNum, gysName } = this.state
            this.loaddata(pageNum, rowNum, gysName)
        } else if (result.code == 204) {
            message.error(result.message)
            toggleStore.setToggle(SHOW_NewPA_MODEL)
        }
        // refreshData(values)
    }
    async confirmRecord(ids, type) {
        let result
        if (type == 'confirm') {
            result = await SupPa.confirmEvaluate(ids)
        } else {
            result = await SupPa.cancleEvaluate(ids)
        }
        if (result.code == 200) {
            message.success(result.message)
        } else {
            message.danger(result.message)
        }
        let { pageNum, rowNum, gysName } = this.state
        this.loaddata(pageNum, rowNum, gysName)
    }
    async loaddata(pageNum = 1, rowNum = 20, gysName = null) {
        const { userTypeVerty } = this.state
        this.setState({ loading: true });
        let supplierList = {
            list: [],
            recordsTotal: 0
        }
        console.log(userTypeVerty)
        switch (userTypeVerty) {
            case 'gys':
                supplierList = await SupPa.getEvaluateByGYS(pageNum, rowNum, gysName)
                break;
            case 'pingjia':
                supplierList = await SupPa.getEvaluateByCenter(pageNum, rowNum, gysName)
                break;
            case 'teshu':
                supplierList = await SupPa.getEvaluateByCenter(pageNum, rowNum, gysName)
                break;
            case 'jichu':
                supplierList = await SupPa.getEvaluateByCenter(pageNum, rowNum, gysName)
                break;
            case 'jituan':
                supplierList = await SupPa.getEvaluateByCom(pageNum, rowNum, gysName)
                break;
            default:
                break;
        }
        //  let supplierList = await (userTypeVerty=='sup'?SupPa.getEvaluateByGYS(pageNum, rowNum):SupPa.getEvaluateByCenter(pageNum, rowNum,gysName)) ;
        console.log(supplierList)
        this.setState({
            supplierList: supplierList.data,
            loading: false,
            selectedRowKeys: []
        })
    }
    //分页查询
    async pageChange(page, num) {
        let { gysName } = this.state
        console.log(gysName)
        this.setState({
            pageNum: page
        }, () => {
            this.loaddata(page, num, gysName)
        })
    }
    onSearchValue = (value) => {
        let { rowNum } = this.state
        this.setState({
            pageNum: 1,
            gysName: value
        }, () => {
            this.loaddata(1, rowNum, value)
        })
    }
    async componentDidMount() {
        const { roleNameKey } = supplierApproval.pageInfo
        //获取所有审核角色名单
        let ApproveroleLists = await SupPa.getApprovalRoles()
        //获取自身角色信息
        console.log(ApproveroleLists)
        let roles = roleNameKey.split(',')
        //判断是否是审核角色
        for (let roleName of roles) {
            let userVertyIndex = ApproveroleLists.findIndex(item => item.roleKey == roleName)
            if (userVertyIndex > -1) {
                this.setState({
                    userTypeVerty: ApproveroleLists[userVertyIndex].code
                })
                break
            }
        }
        this.loaddata()
    }
    convertStatus(score) {
        let str = ''
        switch (score) {
            case '0':
                str = '待确认'
                break
            case '10':
                str = '已确认'
                break
            case '20':
                str = '已退回'
                break
        }
        return str
    }
    render() {
        const { toggleStore, supplierStore } = this.props;
        const { loading, selectedRowKeys, userTypeVerty, detail, showType, pageNum ,gysName} = this.state;
        const rowSelection = {
            columnWidth: 30,
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const that = this;
        const hasSelected = selectedRowKeys.length > 0;

        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                // fixed: "left",
                render: (text, index, key) => key + 1
            },
            {
                title: '供应商名称',
                dataIndex: 'name',
                width: 100,
                align: "center",
                // fixed: "left",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.getInfo(redord, 'detail') }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '供应商编号',
                dataIndex: 'code',
                width: 100,
                align: "center",
            },
            {
                title: '评价结果',
                dataIndex: 'score',
                width: 80,
                align: "center",
            },
            {
                title: '一年一评状态',
                dataIndex: 'statusname',
                width: 50,
                align: "center",
                //  render:(text,record)=>this.convertStatus(text)
            },
            {
                title: '操作',
                dataIndex: 'modify',
                width: 50,
                align: "center",
                render: (text, record) => {
                    return (
                        <div>
                            {userTypeVerty == 'jituan' && record.status == '0' && <Fragment>
                                <Button style={{ marginRight: 5 }} type="primary" onClick={() => { this.getInfo(record, 'edit') }} size={'small'}>编辑</Button>
                                <Button style={{ marginRight: 5 }} type="primary" onClick={() => { this.confirmRecord(record.id, 'confirm') }} size={'small'}>确认</Button>
                                <Button style={{ marginRight: 5 }} type="primary" onClick={() => { this.confirmRecord(record.id, 'cancel') }} size={'small'}>否定</Button>
                            </Fragment>
                            }
                        </div>
                    )
                }
            }
        ];
        let TableOpterta = () => (
            <div className="table-operations">
                <Button type="primary" onClick={() => { toggleStore.setToggle(SHOW_NewPA_MODEL) }}>新建</Button>

                <Button type="primary" onClick={() => { this.evaluateBySys() }}>系统自动评价</Button>
                <Popconfirm
                    title="确定要删除此记录吗？"
                    onConfirm={ev => this.deletePa()}
                    placement="bottom"
                    okText="确定"
                    cancelText="取消"
                    disabled={!hasSelected}
                >
                    <Button type="danger" disabled={!hasSelected}  >删除</Button>
                </Popconfirm>

                {/* <Button type="primary"  >修改</Button> */}
            </div>
        )
        let TableFilterBtn = () => (
            <div className="table-fileter">
                {userTypeVerty == 'pingjia' ? '' : <Search  placeholder="请输入内容" onSearch={(value) => { this.onSearchValue(value) }} enterButton />}
            </div>
        )
        return (
            <div>
                <Card title={userTypeVerty == 'jituan' ? <TableOpterta /> : null} extra={userTypeVerty == 'gys' ? '' : <TableFilterBtn />} >
                    {
                        toggleStore.toggles.get(SHOW_NewPA_MODEL) && <NewPa NewPa={(data) => this.newPafn(data)} refreshData={() => this.loaddata()} />
                    }
                    {
                        toggleStore.toggles.get(SHOW_ModelDetail_MODEL) && <ShowPaDetail showType={showType} editPa={data => this.editPa(data)} detail={detail} />
                    }
                    {/* {
                    toggleStore.toggles.get(SHOW_LOGIN_MODEL) && <ShowPaDetail detail={detail} refreshData={() => this.loaddata()} />
                }
                {
                    toggleStore.toggles.get(SHOW_FeedBack_MODEL) && <FeedBack />
                } */}
                    {/* <SupInfoManager /> */}
                    <Table size='middle'
                        loading={loading}
                        bordered={true}
                        scroll={{x:1350}}
                        rowKey={(text) => text.id}
                        rowSelection={userTypeVerty == 'jituan' ? rowSelection : null}
                        columns={columns}
                        pagination={{
                            onChange: (page, num) => { this.pageChange(page, num) },
                            showQuickJumper: true,
                            total: this.state.supplierList.recordsTotal,
                            current: pageNum,
                            pageSize: 20
                        }}
                        dataSource={this.state.supplierList.list} />
                    {/* <Table size='middle'   bordered={true} rowKey={(text) => text.id} rowSelection={rowSelection}  columns={columns} pagination={{ onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: true, total: 100, pageSize: 20 }}  > */}

                    {/* </Table> */}
                </Card>
            </div>
        )
    }
}

SupPaInfo.propTypes = {
}
export default SupPaInfo;