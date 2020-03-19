import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import _ from "lodash";
import { SHOW_GetDirectHistory_MODEL } from "../../../../constants/toggleTypes"
import { Modal, Form, Icon, Table, Input, Button, Tooltip, Card, Upload, Select, message, Popconfirm } from 'antd';
import { supplierAction, supplierDirectory } from "../../../../actions"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Search } = Input;
const { Option } = Select;
const ButtonGroup = Button.Group;
const columns = [
    {
        title: '序号',
        dataIndex: 'key',
        width: 60,
        align: "center",
        render: (text, index, key) => key + 1
    },
    {
        title: '修改时间',
        dataIndex: 'modifydate',
        width: 200,
        align: "center",
        render: (text) => {
            return (
                <span>{text.replace(".0", "")}</span>
            )
        }

    },
    {
        title: '事件',
        dataIndex: 'operateevent',
        width: 100,
        align: "center",
    },
    {
        title: '说明',
        dataIndex: 'modifycontent',
        width: 230,
        align: "center",
    },
    {
        title: '修改人',
        dataIndex: 'modifyusername',
        width: 100,
        align: "center",
    },

];

@inject('toggleStore')
@observer
class ShowDirectHistory extends React.Component {
    state = {
        supplierList: [],
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        roleList: [],
        eventType: '全部'
    };
    handleOk = e => {
        console.log(this.state.selectedRowKeys)
        const { toggleStore, nextOrgList } = this.props;
        const { selectedRowKeys } = this.state;
        // selectedSupplier(this.state.selectedRowKeys);
        // let pushArr = []
        // selectedRowKeys.forEach(item=>{
        //     let OrgObject = nextOrgList.find(element=>{
        //         return element.id==item
        //     })
        //     if(OrgObject){
        //         pushArr.push({
        //             departmentname:OrgObject.name,
        //             id:OrgObject.id,
        //             parentid:OrgObject.pid
        //         })
        //     }
        //     console.log(OrgObject)
        // })
        //  console.log(pushArr)

        toggleStore.setToggle(SHOW_GetDirectHistory_MODEL)

    };
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ selectedRowKeys });

    };
    //移除名录授权
    async removeAuthortyDirect() {
        const { selectedRowKeys } = this.state;
        let ret = await supplierDirectory.removeAuthortyDirect(selectedRowKeys)
        if (ret.code == 200) {
            message.success(ret.message)
            this.loaddata(1, 15)
        } else {
            message.error(ret.message)
        }
    }
    async searchSupplierInfo(name) {
        let ret = await supplierAction.searchSupplierInfo(name);
        this.setState({
            supplierList: ret
        })
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_GetDirectHistory_MODEL)
    };
    async componentDidMount() {

        this.loaddata()

    }
    //分页查询
    async pageChange(page, num) {
        let { eventType } = this.state
        this.loaddata(page, num, eventType)
    }
    async loaddata(pageNum = 1, rowNum = 15, eventType = '') {
        this.setState({ loading: true });
        const { detail } = this.props
        let parms = {
            directoryId: detail.id,
            pageNum,
            rowNum,
            eventType
        }
        let result = await supplierDirectory.getDirectHistory(parms)
        console.log(result)
        if (result.code == 200) {
            this.setState({
                roleList: result.data,
                loading: false
            })
        }

    }
    selectValue = (e) => {
        if (e == "全部") {
            this.setState({
                eventType: e
            }, () => {
                this.loaddata(1, 15, '')
            })
        } else {
            this.setState({
                eventType: e
            }, () => {
                this.loaddata(1, 15, e)
            })
        }
    }
    render() {
        const { toggleStore, detail } = this.props;
        const { loading, selectedRowKeys, roleList, eventType } = this.state;
        console.log(roleList)
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };



        let TableFilterBtn = () => (
            <div className="table-fileter">
                <Search placeholder="搜索角色" onSearch={value => { console.log(value) }} enterButton />
            </div>
        )
        let Operateevent = () => {
            return (
                <Select defaultValue={eventType} style={{ width: 100 }} onSelect={(e) => { this.selectValue(e) }}>
                    <Option value="全部">全部</Option>
                    <Option value="移除">移除</Option>
                    <Option value="修改名录">修改名录</Option>
                    <Option value="新增">新增</Option>
                </Select>
            )
        }
        return (
            <div>
                <Modal
                    title={`名录 ${detail.name} 修改记录`}
                    visible={toggleStore.toggles.get(SHOW_GetDirectHistory_MODEL)}
                    width={1000}
                    centered
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Card extra={<Operateevent />}>
                        {/* <Table size='middle' loading={loading} bordered={true} rowKey={(text) => text.id} rowSelection={rowSelection} columns={columns} pagination={false} dataSource={this.state.supplierList} /> */}
                        <Table
                            size='middle'
                            loading={loading}
                            rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''}
                            bordered={true}
                            rowKey={(text) => text.id}
                            columns={columns}
                            pagination={{
                                onChange: (page, num) => { this.pageChange(page, num) },
                                showQuickJumper: true,
                                total: roleList.recordsTotal,
                                pageSize: 10
                            }}
                            dataSource={roleList.list} />
                    </Card>
                </Modal>
            </div>
        );
    }
}

export default ShowDirectHistory