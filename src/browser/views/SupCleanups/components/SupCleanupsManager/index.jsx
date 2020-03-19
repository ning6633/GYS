import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Row, Input, Tooltip, message, Col, Form, Select, Popconfirm } from 'antd';
import { SHOW_NewPA_MODEL, SHOW_ShowPJZJ_MODEL, SHOW_ChooseSupplierPub_MODEL } from "../../../../constants/toggleTypes"
import { observer, inject, } from 'mobx-react';
import { SupPa, supplierApproval } from "../../../../actions"
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import NewCleanups from '../NewCleanups'
import ShowCleanupsDetail from '../ShowCleanupsDetail'
const { Search } = Input;
const { Option } = Select;
@inject('toggleStore')
@observer
class SupCleanupsManager extends Component {
    state = {
        cleanupsList: {
            list: [],
            recordsTotal: 0
        },
        selectedRowKeys: [], // Check here to configure the default column
        selectedRow: [],
        loading: false,
        userTypeVerty: 'approve',
        currentRecord: {},
        showType: 'detail',
        statusDict: [],
        keyWord: '',
        status: '',
        pageNum:1,
        rowNum:20
    };
    onSelectChange = (selectedRowKeys, selectedRow) => {
        this.setState({ selectedRowKeys, selectedRow });
    }
    async confirmAndClear(record) {
        let {pageNum,rowNum} = this.state
        let ret = await SupPa.confirmAndClear(record.id);
        if (ret.code == 200) {
            message.success("清退记录审核成功")
            this.loaddata(pageNum,rowNum)
        }
    }
    async  deleteRecord() {
        let { selectedRowKeys, selectedRow } = this.state
        let _arr =[]
        selectedRow.forEach((item,index)=>{
            if(item.status == 0){
                _arr.push(item.id)
            }
        })
        if (_arr.length >0) {
            let ret = await SupPa.revocationClearRecord(_arr.join(","));
            if (ret.code == 200) {
                if(selectedRow.length == _arr.length){
                    message.success("删除成功")
                }else{
                    message.success(`已删除${_arr.length}条记录,${selectedRow.length-_arr.length}条记录已批准,不可删除!`)
                }
                this.setState({ selectedRowKeys: [] }, () => {
                    this.loaddata()
                })
            }
        }else{
            message.error('选中信息包含已批准项,无法删除!')
        }

        // 
        // let ret = await SupPa.removeCleanups(record.id);
        // if (ret.code == 200) {
        //     message.success("清退记录撤回成功")
        //     this.loaddata()
        //     this.setState({ selectedRowKeys: [] })
        // }
    }
    async sysAddClearRecord() {
        let {pageNum,rowNum} = this.state
        let ret = await SupPa.sysAddClearRecord();
        if (ret.code == 200) {
            message.success("系统更新供应商清退记录成功")
            this.setState({ selectedRowKeys: [], selectedRow: [] }, () => { this.loaddata(pageNum,rowNum) })

        }
    }
    async newPafn(data) {
        const { toggleStore } = this.props
        let result = await SupPa.newCleanups(data)
        if (result.code == 200) {
            toggleStore.setToggle(SHOW_NewPA_MODEL)
            this.loaddata()
            message.success(result.message)
        }
        // refreshData(values)
    }
    async editCleanups(newData) {
        const { toggleStore } = this.props
        let result = await SupPa.editCleanups(newData)
        if (result.code == 200) {
            message.success(result.message)
            this.loaddata()
            toggleStore.setToggle(SHOW_ShowPJZJ_MODEL)
        }
    }
    editRecord(record, type) {
        const { toggleStore } = this.props
        record.type = type
        this.setState({
            currentRecord: record,
            showType: type
        }, () => {
            toggleStore.setToggle(SHOW_ShowPJZJ_MODEL)

        })
    }
    async loaddata(pageNum = 1, rowNum = 20) {
        const { userTypeVerty } = this.state
        let { keyWord, status } = this.state
        this.setState({ loading: true });
        let options = {
            keyWord,
            status
        }
        //   let cleanupsList = await (userTypeVerty=='sup'?SupPa.getEvaluateByGYS(pageNum, rowNum):SupPa.getcleanups(pageNum, rowNum,gysName)) ;
        let cleanupsList = await SupPa.getCleanups(pageNum, rowNum, options);
        if(cleanupsList.code == 200){
            this.setState({
                cleanupsList: {
                    list: cleanupsList ? cleanupsList.data.pageList : [],
                    recordsTotal: cleanupsList.data.totalCount,
                },
                loading: false,
                current:1,
                selectedRowKeys: []
            })
        }
    }
    //分页查询
    async pageChange(page, num) {
        this.setState({
            pageNum:page,
            rowNum:num
        },()=>{
            this.loaddata(page, num)
        })
    }
    //获取状态字典
    async getStatusDict() {
        const { setFieldsValue } = this.props.form
        let { keyWord, status } = this.state
        let res = await SupPa.getStatusDict()
        if (res.code == 200) {
            this.setState({
                statusDict: res.data[0].statusDict
            }, () => {
                setFieldsValue({
                    keyWord,
                    status
                })
                this.loaddata()
            })
        }else{
            setFieldsValue({
                keyWord,
                status
            })
        }
    }
    async search(e) {
            this.setState({
                keyWord: e,
                pageNum:1,
                rowNum:20
            }, (() => {
                this.loaddata(1,20)
            }))
        }
    async componentDidMount() {
        const { roleNameKey } = supplierApproval.pageInfo
        //获取所有审核角色名单
        // let ApproveroleLists = await supplierApproval.getCharacter()
        // //获取自身角色信息
        // let roles= roleNameKey.split(',')
        //  //判断是否是审核角色
        //  for(let roleName of roles){
        //   let userVerty = ApproveroleLists.some(item=>item==roleName)
        //      if(userVerty){
        //       this.setState({
        //           userTypeVerty:'approve'
        //         })
        //         break
        //      }
        //  }
        this.getStatusDict()

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
        const { loading, selectedRowKeys, userTypeVerty, currentRecord, showType, statusDict,status,pageNum } = this.state;
        const { getFieldDecorator } = this.props.form;
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
                dataIndex: 'gys_name',
                width: 100,
                align: "center",
                // fixed: "left",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.editRecord(redord, 'detail') }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            // {
            //     title: '供应商编号',
            //     dataIndex: 'gys_number',
            //     width: 100,
            //     align: "center",
            // },
            {
                title: '申请人',
                dataIndex: 'create_user_name',
                width: 80,
                align: "center",
            },
            {
                title: '清退理由',
                dataIndex: 'score_detail',
                width: 80,
                align: "center",
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 80,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
            },
            {
                title: '申请时间',
                dataIndex: 'create_time',
                width: 50,
                align: "center",
                // render:(text,record)=>this.convertStatus(text)
            },
            {
                title: '状态',
                dataIndex: 'status_name',
                width: 50,
                align: "center",
                // render:(text,record)=>this.convertStatus(text)
            },
            {
                title: '操作',
                dataIndex: 'modify',
                width: 150,
                align: "center",
                render: (text, record) => {
                    return (

                        <div>{record.status == 0
                            ?
                            <div>{record.score_type == 'add' ?
                                <Button type="primary" onClick={() => { this.editRecord(record, 'edit') }} size={'small'} style={{ marginRight: 10 }}>编辑</Button>
                                : null}
                                <Button onClick={() => { this.confirmAndClear(record) }} style={{ marginRight: 5 }} type="primary" size={'small'}>审核</Button>
                            </div>
                            :
                            null}</div>)
                }
            },
        ];
        let TableOpterta = () => (
            <div >
                <Button type="primary" onClick={() => { toggleStore.setToggle(SHOW_NewPA_MODEL) }}>新建</Button>
                <Popconfirm disabled={!hasSelected} placement="top" title={'您确定要删除吗？'} onConfirm={() => { this.deleteRecord() }}>
                    <Button type="danger" disabled={!hasSelected} style={{marginLeft:10}}>删除</Button>
                </Popconfirm>
                <Button type="primary" onClick={() => { this.sysAddClearRecord() }} style={{marginLeft:10}}>更新清退记录</Button>
            </div>
        )
        let TableFilterBtn = () => {
            return <div className='sup_exposure_search'>
            状态:
            <Select defaultValue={status} style={{width:200}} onSelect={(e)=>{
                this.setState({status:e})
            }}>
                            <Option value=''>全部</Option>
                            {statusDict.map((item, index) => {
                                return (
                                    <Option key={item.value} value={item.key}>{item.value}</Option>
                                )
                            })}
                        </Select>
            <Search placeholder='请输入查询内容' onSearch={(e) => { this.search(e) }} enterButton style={{ marginLeft: 50 }} />
        </div>
    }
        return (
            <div>
                <Card title={userTypeVerty == 'approve' ? <TableOpterta /> : null} extra={<TableFilterBtn />} >
                    {
                        toggleStore.toggles.get(SHOW_NewPA_MODEL) && <NewCleanups NewPa={(data) => this.newPafn(data)} refreshData={() => this.loaddata()} />
                    }
                    {
                        toggleStore.toggles.get(SHOW_ShowPJZJ_MODEL) && <ShowCleanupsDetail editCleanups={(data) => this.editCleanups(data)} detail={currentRecord} type={showType} NewPa={(data) => this.newPafn(data)} refreshData={() => this.loaddata()} />
                    }

                    {/* <SupInfoManager /> */}
                    <Table 
                    size='middle' 
                    rowSelection={rowSelection} 
                    loading={loading} 
                    bordered={true} 
                    rowKey={(text) => text.id} 
                    columns={columns} 
                    pagination={
                        { 
                            onChange: (page, num) => { 
                                this.pageChange(page, num) 
                                }, 
                                showQuickJumper: {
                                    goButton: <Button type="link" size={'small'}>
                                        跳转
                                            </Button>
                                }, 
                                total: this.state.cleanupsList.recordsTotal, 
                                pageSize: 20 ,
                                current:pageNum
                            }
                        } 
                                dataSource={this.state.cleanupsList.list} />

                </Card>
            </div>
        )
    }
}

SupCleanupsManager.propTypes = {
}
export default Form.create({ name: 'SupCleanupsManager' })(SupCleanupsManager);