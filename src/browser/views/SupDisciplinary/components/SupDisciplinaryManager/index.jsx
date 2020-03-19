import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, message, Table, Button, Input, Tooltip, Select, Popconfirm } from 'antd';
import { SHOW_NewPA_MODEL, SHOW_ShowPJZJ_MODEL, SHOW_ChooseSupplierPub_MODEL } from "../../../../constants/toggleTypes"
import { observer, inject, } from 'mobx-react';
import { SupPa, supplierApproval, supplierEvalution } from "../../../../actions"
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import NewDisciplinary from '../NewDisciplinary'
import ShowDisciplinaryDetail from '../ShowDisciplinaryDetail'
const { Search } = Input;
const { Option } = Select
@inject('toggleStore')
@observer
class SupDisciplinaryManager extends Component {
    state = {
        disciplinarysList: {
            list: [],
            recordsTotal: 0
        },
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        userTypeVerty: '',
        currentRecord: {},
        rewordTypes: [],
        rewardType: "0",
        gysName: '',
        pageNum: 1,
        rowNum: 20
    };
    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };
    async newPafn(data) {
        const { toggleStore } = this.props
        let result = await SupPa.newDisciplinary(data)
        if (result.code == 200) {
            toggleStore.setToggle(SHOW_NewPA_MODEL)
            this.loaddata(1, 20)
            message.success(result.message)
        }
        // refreshData(values)
    }
    //删除奖惩记录
    async deleteDisciplinary() {
        const { selectedRowKeys } = this.state
        let result = await SupPa.deleteDisciplinary(selectedRowKeys)
        if (result.code == 200) {
            message.success(result.message)
            this.setState({ selectedRowKeys: [] });
            this.loaddata(1, 20)
        }

    }
    editRecord(record) {
        const { toggleStore } = this.props
        this.setState({
            currentRecord: record
        })
        toggleStore.setToggle(SHOW_ShowPJZJ_MODEL)
    }
    disSearch(value) {
        this.setState({
            gysName: value,
            pageNum:1
        }, () => { this.loaddata(1,20) })

    }
    selectOnChange = (num) => {
        this.setState({ rewardType: num })
    }
    async loaddata(pageNum = 1, rowNum = 20) {
        const { userTypeVerty, gysName, rewardType } = this.state
        this.setState({ loading: true });
        let options = {
            gysName,
            rewardType: rewardType != '0' ? rewardType : ""
        }
        //   let disciplinarysList = await (userTypeVerty=='sup'?SupPa.getEvaluateByGYS(pageNum, rowNum):SupPa.getDisciplinarys(pageNum, rowNum,gysName)) ;
        let disciplinarysList = await SupPa.getDisciplinarys(pageNum, rowNum, options);
        this.setState({
            disciplinarysList: disciplinarysList.data,
            loading: false,
            selectedRowKeys: []
        })
    }
    //分页查询
    async pageChange(page, num) {
        this.setState({
            pageNum: page,
            rowNum: num
        }, () => {
            this.loaddata(page, num)
        })
    }
    async componentDidMount() {
        // 获取自身角色
        const { roleNameKey } = supplierApproval.pageInfo
        //获取所有角色信息
        let ApproveroleLists = await SupPa.getApprovalRoles()

        let roles= roleNameKey.split(',')
         //判断是否是审核角色
         for(let roleName of roles){
          let userVerty = ApproveroleLists.findIndex(item => item.roleKey == roleName)
            console.log(userVerty)

             if(userVerty > -1){
              this.setState({
                  userTypeVerty:ApproveroleLists[userVerty].code
                })
                break
             }
         }

        let rewordsResult = await supplierEvalution.getDic('TYPE_REWARDS') || []
        rewordsResult.data.unshift({
            code: "0",
            id: "0",
            name: "全部",
            qyxzZ2: null
        })
        this.setState({
            rewordTypes: rewordsResult.data || []
        })
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
        const { loading, selectedRowKeys, userTypeVerty, currentRecord, rewordTypes, rewardType, pageNum } = this.state;
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
                dataIndex: 'gys_NAME',
                width: 100,
                align: "center",
                // fixed: "left",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.editRecord(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '供应商编号',
                dataIndex: 'gys_NUMBER',
                width: 100,
                align: "center",
            },
            {
                title: '奖惩类型',
                dataIndex: 'reward_TYPE',
                width: 80,
                align: "center",
            },
            {
                title: '奖惩时间',
                dataIndex: 'reward_TIME',
                width: 80,
                align: "center",
            },
            {
                title: '奖惩说明',
                dataIndex: 'reasion',
                width: 50,
                align: "center",
                // render:(text,record)=>this.convertStatus(text)
            }
        ];
        let TableOpterta = () => (
            <div className="table-operations">
                <Button type="primary" onClick={() => { toggleStore.setToggle(SHOW_NewPA_MODEL) }}>新建</Button>


                <Popconfirm
                    title="确定要删除此记录吗？"
                    onConfirm={ev => this.deleteDisciplinary()}
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

                <Search placeholder="请输入内容" onSearch={value => this.disSearch(value)} style={{ width: 250, marginRight: 10, float: 'right' }} enterButton />
                <Select defaultValue={rewardType} style={{ width: 150, marginRight: 10, float: 'right' }} onChange={this.selectOnChange}>
                    {rewordTypes && rewordTypes.map(item => <Option key={item.code} value={item.code}>{item.name}</Option>)}
                </Select>
            </div>
        )
        return (
            <div>
                <Card title={userTypeVerty == 'jituan' ? <TableOpterta /> : <b>奖惩记录详情</b>} extra={<TableFilterBtn />} >
                    {
                        toggleStore.toggles.get(SHOW_NewPA_MODEL) && <NewDisciplinary NewPa={(data) => this.newPafn(data)} refreshData={() => this.loaddata()} />
                    }
                    {
                        toggleStore.toggles.get(SHOW_ShowPJZJ_MODEL) && <ShowDisciplinaryDetail detail={currentRecord} NewPa={(data) => this.newPafn(data)} refreshData={() => this.loaddata()} />
                    }

                    {/* <SupInfoManager /> */}
                    <Table
                        size='middle'
                        loading={loading}
                        bordered={true}
                        rowKey={(text) => text.id}
                        rowSelection={userTypeVerty == 'jituan' ? rowSelection : null}
                        columns={columns}
                        pagination={
                            {
                                onChange: (page, num) => {
                                    this.pageChange(page, num)
                                },
                                showQuickJumper: true,
                                total: this.state.disciplinarysList.recordsTotal,
                                current:pageNum,
                                pageSize: 20
                            }
                        }
                        dataSource={this.state.disciplinarysList.list} />

                </Card>
            </div>
        )
    }
}

SupDisciplinaryManager.propTypes = {
}
export default SupDisciplinaryManager;