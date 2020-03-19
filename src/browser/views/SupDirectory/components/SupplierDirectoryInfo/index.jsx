import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Icon, Tooltip, message, Select, Typography, Popconfirm, Input } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import { SHOW_NEWDIRECT_MODEL, SHOW_SUPINDIRECTORY_MODEL, SHOW_SupInfoManager_MODEL, SHOW_ChooseRoles_MODEL, SHOW_DirectEdit_MODEL, SHOW_GetAuthorizedrole_MODEL, SHOW_GetDirectHistory_MODEL, SHOW_DirectorysOfPrevOrg_MODEL } from "../../../../constants/toggleTypes";
import { supplierAction, supplierDirectory } from "../../../../actions"
import NewDirectoryModel from "../NewDirectoryModel";
import SuppliersInDirectory from "../SuppliersInDirectory";
import ShowAuthorizedrole from "../ShowAuthorizedrole"
import ShowDirectHistory from "../ShowDirectHistory"
import ShowDirectEdit from '../ShowDirectEdit'
import DirectorysOfPrevOrg from '../DirectorysOfPrevOrg'

import ChooseRoles from "../ChooseRoles";
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
        supplierList: {
            list: [],
            recordsTotal: 0
        },
        currentDirectoryDetail: null,
        selectedRowKeys: [], // Check here to configure the default column
        selectedRow: [],
        loading: false,
        nextOrgList: [],
        currDirdetail: null,
        searchValue: null,
        pageInfo: null,
        curPage: 1,
        isStatus: false, // 删除
        isUpGrade: false, // 升版
        idGrant: false //授权
    };

    onSelectChange = (selectedRowKeys, selectedRow) => {
        this.setState({
            isStatus: false,
            isUpGrade: false,
            idGrant: false
        })
        selectedRow.forEach(element => {
            if (element.status == 20) {
                this.setState({
                    isStatus: true,

                })
                return
            }
            if (element.status == 0) {
                this.setState({
                    isUpGrade: true,
                    idGrant: true
                })
            }
        });

        this.setState({ selectedRowKeys, selectedRow });

    };
    async submitSupplierInfo(redord) {
        const { toggleStore, supplierStore } = this.props;
        if (redord.is_diff != 0) {
            toggleStore.setToggle(SHOW_SupInfoManager_MODEL)
        } else {
            let supplierList = await supplierAction.submitSupplierInfo([redord.id]);
            message.success("提交成功")
            this.loaddata()
        }
    }
    //查看已授权组织名单
    async getAuthorizedrole(detail) {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_GetAuthorizedrole_MODEL)
        this.setState({
            currDirdetail: detail
        })
    }
    //查看名录修改记录
    directEditHistory(detail) {
        const { toggleStore } = this.props;
        this.setState({
            currDirdetail: detail
        })
        toggleStore.setToggle(SHOW_GetDirectHistory_MODEL)
    }

    //修改名录
    editDirect(detail) {
        const { toggleStore } = this.props;
        this.setState({
            currDirdetail: detail
        })
        toggleStore.setToggle(SHOW_DirectEdit_MODEL)
    }

    async submitSupplierInfopl() {
        let supplierList = await supplierAction.submitSupplierInfo(this.state.selectedRowKeys);
        message.success("提交成功")
        this.loaddata()
    }
    async deleteDirectpl() {
        const { currentDirectory, refetchData } = this.props
        const { selectedRowKeys, curPage } = this.state
        if (selectedRowKeys.length > 0) {
            let ret = await supplierDirectory.deleteDirectOfClass(this.state.selectedRowKeys);
            if (ret.code == 200) {
                message.success("删除成功")
                refetchData(currentDirectory.id)
                this.setState({ selectedRowKeys: [], curPage: 1, isStatus: true });
            }
        } else {
            message.warning("请选择要删除的名录")
        }

    }


    async getDirectoryDetail(data) {
        const { toggleStore, currentDirectory } = this.props;
        this.setState({
            currentDirectoryDetail: data,
        })
        toggleStore.setToggle(SHOW_SUPINDIRECTORY_MODEL)

    }
    async authortyDirect(pushArr) {
        console.log(pushArr)
        const { toggleStore } = this.props;
        const { selectedRowKeys } = this.state;
        //授权名录到组织
        supplierDirectory.authortyDirect(selectedRowKeys, pushArr).then(res => {
            if (res.code == 200) {
                message.success(res.message)
                toggleStore.setToggle(SHOW_ChooseRoles_MODEL)
            } else {
                message.error(res.message)
            }


        })
    }

    async loaddata(pageNum = 1, rowNum = 10) {
        this.setState({ curPage: pageNum });
        const { clickDirectory, currentDirectory } = this.props;
        console.log(currentDirectory)
        clickDirectory(currentDirectory, pageNum, rowNum)
    }
    //分页查询
    async pageChange(page, num) {

        this.loaddata(page, num)
    }
    //发布名录
    async publishDirect() {
        let ret = await supplierDirectory.publishDirect(this.state.selectedRowKeys);
        if (ret.code == 200) {
            message.success(ret.message)
            const { clickDirectory, currentDirectory } = this.props;
            clickDirectory(currentDirectory, 1, 10)
        }

    }
    //通过名称搜索名录
    async searchByDirName(value) {
        const { clickDirectory, currentDirectory } = this.props;
        clickDirectory(currentDirectory, 1, 10, value)
    }
    //输入框onchange事件
    searchChangeHandle(e) {
        console.log(e.target.value)
        // this.setState({
        //     searchValue:e.target.value
        // })
    }
    elipsString(str, length) {
        let result = ''
        if (str.length > length) {
            result = str.substr(0, length) + '...'
        } else {
            result = str
        }
        return result
    }
    showDetail(data) {
        const { toggleStore } = this.props;
        data['source'] = 'prevOrg'
        this.setState({
            currentDirectoryDetail: data,
        })
        toggleStore.setToggle(SHOW_SUPINDIRECTORY_MODEL)
    }
    //升版
    async upgradeDirectory() {
        let { selectedRow } = this.state
        let { upgradeDirectory } = this.props
        let { userId } = supplierDirectory.pageInfo
        let categoryId = upgradeDirectory()
        selectedRow.forEach((item) => {
            item.createuser = userId
        })
        let res = await supplierDirectory.upgradeDirectory(categoryId, selectedRow)
        console.log(res)
        if (res.code == 200) {
            message.success(res.message)
            this.loaddata()
        }

    }
    async componentDidMount() {
        console.log(this.props)
        let ret = await supplierDirectory.getUserInfo()
        console.log(ret)
        if (ret) {
            this.setState({
                pageInfo: ret
            })
        }
        // this.loaddata()
    }
    //清空已选中的节点
    componentWillReceiveProps(nextProps) {
        if (nextProps.directList) {
            this.setState({
                selectedRowKeys: [],
                selectedRow: []
            })
        }
    }
    render() {
        const { toggleStore, supplierStore, directList } = this.props;
        const { loading, selectedRowKeys, currentDirectoryDetail, nextOrgList, currDirdetail, pageInfo, curPage, isStatus, isUpGrade, idGrant } = this.state;
        const rowSelection = {
            columnWidth: 30,
            selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
                disabled: record.status === '200', // Column configuration not to be checked
                name: record.name,
            }),
        };
        const that = this;
        const hasSelected = selectedRowKeys.length > 0;

        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",

                render: (text, index, key) => key + 1
            },
            {
                title: '名录',
                dataIndex: 'name',
                width: 150,
                align: "center",

                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.getDirectoryDetail(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{this.elipsString(text, 15)}</span></Tooltip>
            },

            // {
            //     title: '创建人',
            //     dataIndex: 'createuser',
            //     width: 150,
            //     align: "center",
            // },
            {
                title: '说明',
                dataIndex: 'description',
                width: 230,
                align: "center",
            },
            {
                title: '更新时间',
                dataIndex: 'updatedate',
                width: 150,
                align: "center",
                sorter: (a, b) => (moment(a.create_time).valueOf() - moment(b.create_time).valueOf()),
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '版本',
                dataIndex: 'version',
                width: 100,
                align: "center",
            },
            {
                title: '状态',
                dataIndex: 'status',
                width: 150,
                align: "center",
                render: (text) => text == 20 ? '已发布' : <Text type="danger">未发布</Text>
            }
            ,
            {
                title: '操作',
                dataIndex: 'modify',
                align: "center",
                width: 270,

                render: (text, redord) => {
                    return (<div><Button type="primary" onClick={() => { this.getAuthorizedrole(redord) }} size={'small'}>查看</Button> {redord.status == 20 ? null : <Button type="primary" onClick={() => { this.editDirect(redord) }} size={'small'}>修改</Button>} <Button type="primary" onClick={() => { this.directEditHistory(redord) }} size={'small'}>修改记录</Button></div>)
                }
            },
        ];

        const uploadProps = {
            name: 'file',
            action: `${supplierAction.BaseURL}files?username=${supplierAction.pageInfo.username}`,
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 文件上传成功，正在等待服务端转换...`);
                    setTimeout(() => {
                        message.success("文件转换成功，开始加载数据...")
                        that.loaddata();
                    }, 3000);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };
        let TableOpterta = () => (
            <div className="table-operations">
                <Button icon="edit" type="primary" disabled={!this.props.currentDirectory} onClick={() => { toggleStore.setToggle(SHOW_NEWDIRECT_MODEL); supplierStore.iseditor = false; }}>新建</Button>
                <Popconfirm
                    title="确定要删除此名录吗？"
                    onConfirm={ev => this.deleteDirectpl()}
                    okText="确定"
                    cancelText="取消"
                    disabled={!hasSelected || isStatus}
                >
                    <Button type="danger" style={{ marginRight: 15 }} disabled={!hasSelected || isStatus}>删除</Button>
                </Popconfirm>


                <Button type="primary" disabled={!hasSelected || isStatus} onClick={() => { this.publishDirect() }}>发布</Button>
                <Button type="primary" disabled={!hasSelected || idGrant} onClick={() => { toggleStore.setToggle(SHOW_ChooseRoles_MODEL) }}>授权</Button>
                <Button type="primary" disabled={!hasSelected || isUpGrade} onClick={() => { this.upgradeDirectory() }}>升版</Button>

            </div>
        )
        let TableFilterBtn = () => (
            <div className="table-fileter">
                {/* 状态：<Select  defaultValue={"全部"} style={{ width: 100, marginRight: 15 }} >
                    <Option value="全部">全部</Option>
                    <Option value="已发布">已发布</Option>
                    <Option value="未发布">未发布</Option>
                </Select> */}

                {
                    pageInfo !== null && pageInfo.usertype != '1' && <Button type="primary" style={{ marginRight: 20 }} onClick={() => { toggleStore.setToggle(SHOW_DirectorysOfPrevOrg_MODEL) }}>上级授权名录</Button>
                }
                <Search placeholder="搜索名录名称" style={{ width: 200 }} onSearch={value => this.searchByDirName(value)} enterButton />
                {/* <Button onClick={() => { }}>重置</Button> */}


            </div>
        )

        return (
            <Card title={<TableOpterta />} style={{ height: '85vh' }} extra={<TableFilterBtn />}>
                {/* 新建名录model */}
                {
                    toggleStore.toggles.get(SHOW_NEWDIRECT_MODEL) && <NewDirectoryModel currentDirectory={this.props.currentDirectory} refreshData={() => this.loaddata()} />
                }
                {/* 选择角色组织 */}
                {
                    toggleStore.toggles.get(SHOW_ChooseRoles_MODEL) && <ChooseRoles nextOrgList={nextOrgList} authortyDirect={this.authortyDirect.bind(this)} currentDirectory={this.props.currentDirectory} refreshData={() => this.loaddata()} />
                }
                {/* 查看名录的下的供应商 */}
                {
                    toggleStore.toggles.get(SHOW_SUPINDIRECTORY_MODEL) && <SuppliersInDirectory userInfo={pageInfo} detail={currentDirectoryDetail} refreshData={() => this.loaddata()} />
                }
                {/* 选择授权角色 */}
                {
                    toggleStore.toggles.get(SHOW_GetAuthorizedrole_MODEL) && <ShowAuthorizedrole detail={currDirdetail} />
                }
                {/* 展示名录修改记录 */}
                {
                    toggleStore.toggles.get(SHOW_GetDirectHistory_MODEL) && <ShowDirectHistory detail={currDirdetail} />
                }
                {/* 名录编辑 */}
                {
                    toggleStore.toggles.get(SHOW_DirectEdit_MODEL) && <ShowDirectEdit refreshData={() => this.loaddata()} detail={currDirdetail} />
                }
                {
                    toggleStore.toggles.get(SHOW_DirectorysOfPrevOrg_MODEL) && <DirectorysOfPrevOrg showDetail={(data) => { this.showDetail(data) }} refreshData={() => this.loaddata()} detail={currDirdetail} />
                }

                <Table
                    size='middle'
                    loading={loading}
                    rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''}
                    bordered={true} rowKey={(text) => text.id}
                    rowSelection={rowSelection}
                    scroll={{ x: 900 }}
                    columns={columns}
                    pagination={{
                        showTotal: () => `共${directList.recordsTotal}条`,
                        onChange: (page, num) => { this.pageChange(page, num) },
                        current: curPage,
                        showQuickJumper: true,
                        total: directList.recordsTotal,
                        pageSize: 10
                    }}
                    dataSource={directList.list} />
            </Card>
        )
    }
}

SupplierDirectoryInfo.propTypes = {
}
export default SupplierDirectoryInfo;