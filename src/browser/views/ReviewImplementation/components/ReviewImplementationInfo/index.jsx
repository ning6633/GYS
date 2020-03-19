import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Icon,Table,Button,Input } from 'antd';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
// import ChangeRouter from "../../components/ChangeRouter";
const { Search } = Input;
class ReviewImplementationInfo extends Component {
    state = {
        supplierList: {
            list: [],
            recordsTotal: 0
        },
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
    };
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
                title: '复审时间',
                dataIndex: 'time',
                width: 120,
                align: "center",
            },
            {
                title: '复审地点',
                dataIndex: 'place',
                width: 230,
                align: "center",
            },
            {
                title: '参加供应商',
                dataIndex: 'attend_supplier',
                width: 150,
                align: "center",
            },
            {
                title: '复审专家',
                dataIndex: 'expert',
                width: 150,
                align: "center",
            },
            {
                title: '标准要求',
                dataIndex: 'standard_request',
                width: 150,
                align: "center",
            }
        ];
        let TableOpterta = () => (
            <div className="table-operations">
                <Button icon="edit" type="primary" onClick={() => { toggleStore.setToggle(SHOW_LOGIN_MODEL); supplierStore.iseditor = false; }}>新建</Button>
                {/* <Button type="primary" disabled={!hasSelected} onClick={() => { this.feedbackQus() }}>供应商问题反馈</Button>
                <Button icon="download">下载模板</Button>
                <div style={{ display: "inline-block", marginRight: 8 }}>
                    <Upload {...uploadProps}>
                        <Button>
                            <Icon type="upload" />上传Excel文件
                        </Button>
                    </Upload>
                </div> */}
                {/* <Button type="primary" disabled={!hasSelected} onClick={() => { this.submitSupplierInfopl() }}>提交</Button> */}
                {/* <Button type="danger" disabled={!hasSelected} onClick={() => { this.deleteSupplierInfo() }} >删除</Button> */}
                <Button type="danger"  >删除</Button>
            </div>
        )
        let TableFilterBtn = () => (
            <div className="table-fileter">
                <Search placeholder="请输入内容" onSearch={value => console.log(value)} enterButton />
            </div>
        )
        return (
            <div>
                <Card title={<TableOpterta />} extra={<TableFilterBtn />} >
                {/* {
                    toggleStore.toggles.get(SHOW_LOGIN_MODEL) && <NewSupplier refreshData={() => this.loaddata()} />
                }
                {
                    toggleStore.toggles.get(SHOW_FeedBack_MODEL) && <FeedBack />
                } */}
                {/* <SupInfoManager /> */}
                {/* <Table size='middle' loading={loading}  bordered={true} rowKey={(text) => text.id} rowSelection={rowSelection} scroll={{ x: 2450 }} columns={columns} pagination={{ onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: true, total: this.state.supplierList.recordsTotal, pageSize: 20 }} dataSource={this.state.supplierList.list} /> */}
                <Table size='middle'   bordered={true} rowKey={(text) => text.id} rowSelection={rowSelection}  columns={columns} pagination={{ onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: true, total: 100, pageSize: 20 }}  >

                </Table>
                </Card> 
            </div>
        )
    }
}

ReviewImplementationInfo.propTypes = {
}
export default ReviewImplementationInfo;