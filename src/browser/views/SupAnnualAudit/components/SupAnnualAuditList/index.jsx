import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Upload, Input, Tooltip, message, Select } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import _ from "lodash";
import { SHOW_PJSSJL_MODEL, SHOW_NewBZYQ_MODEL } from "../../../../constants/toggleTypes";
import { supplierAction } from "../../../../actions"
import NewssModel from "../NewssModel"
import NewBZYQ from "../NewBZYQ"

import "./index.less";
const { Search } = Input;

@inject('toggleStore', 'supplierStore')
@observer
class SupplierInfo extends Component {
    state = {
        supplierList: {
            list: [],
            recordsTotal: 0
        },
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
    };

    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ selectedRowKeys });
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
    async submitSupplierInfopl() {
        let supplierList = await supplierAction.submitSupplierInfo(this.state.selectedRowKeys);
        message.success("提交成功")
        this.loaddata()
    }
    async deleteSupplierInfo() {
        let supplierList = await supplierAction.deleteSupplierInfo(this.state.selectedRowKeys);
        if (supplierList) {
            message.success("删除成功")
            this.loaddata()
        }
    }
    editorSupplierInfo(redord, islookdetail = false) {
        const { toggleStore, supplierStore } = this.props;
        if (islookdetail) {
            // 查看详情
            supplierStore.setEditSupplierInfo(redord)
            supplierStore.iseditor = true;
            supplierStore.islookdetail = true;
            toggleStore.setToggle(SHOW_LOGIN_MODEL)
        } else {
            supplierStore.islookdetail = false;
            if (redord.status == !20) {
                supplierStore.setEditSupplierInfo(redord)
                supplierStore.iseditor = true;
                toggleStore.setToggle(SHOW_LOGIN_MODEL)
            } else {
                message.error("已提交供应商记录，无法编辑")
            }
        }
    }
    async loaddata(pageNum = 1, rowNum = 20) {
        this.setState({ loading: true });
        let supplierList = await supplierAction.getSupplierList(pageNum, rowNum);
        this.setState({
            supplierList: supplierList,
            loading: false
        })
    }
    //分页查询
    async pageChange(page, num) {
        this.loaddata(page, num)
    }
    componentDidMount() {
        // this.loaddata()
    }
    render() {
        const { toggleStore, supplierStore } = this.props;
        const { loading, selectedRowKeys } = this.state;
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
                // fixed: "left",
                render: (text, index, key) => key + 1
            },
            {
                title: '复审名称',
                dataIndex: 'name',
                width: 200,
                align: "center",
                // fixed: "left",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.editorSupplierInfo(redord, redord.status == 20) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '复审类型',
                dataIndex: 'category',
                width: 120,
                align: "center",
                render: (text) => text == 20 ? '已提交' : '未提交'
            },
            {
                title: '复审时间',
                dataIndex: 'time',
                width: 120,
                align: "center",
                render: (text) => text == 20 ? '已提交' : '未提交'
            },
            {
                title: '复审地点',
                dataIndex: 'place',
                width: 230,
                align: "center",
            },
            {
                title: '复审结果',
                dataIndex: 'result',
                width: 150,
                align: "center",
            }
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
                <Button icon="edit" type="primary" onClick={() => { toggleStore.setToggle(SHOW_PJSSJL_MODEL); }}>新建</Button>
                <Button type="danger" disabled={!hasSelected} onClick={() => { this.deleteSupplierInfo() }} >删除</Button>
            </div>
        )
        let TableFilterBtn = () => (
            <div className="table-fileter">
                <Search placeholder="请输入内容" onSearch={value => console.log(value)} enterButton />
            </div>
        )

        return (
            <Card extra={<TableFilterBtn />}>
                {
                    toggleStore.toggles.get(SHOW_PJSSJL_MODEL) && <NewssModel />
                }
                {/* {
                    toggleStore.toggles.get(SHOW_NewBZYQ_MODEL) && <NewBZYQ />
                } */}

                <Table size='middle' loading={loading} rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''} bordered={true} rowKey={(text) => text.id} rowSelection={rowSelection}  columns={columns} pagination={{ onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: true, total: this.state.supplierList.recordsTotal, pageSize: 20 }} dataSource={this.state.supplierList.list} />
            </Card>
        )
    }
}

SupplierInfo.propTypes = {
}
export default SupplierInfo;