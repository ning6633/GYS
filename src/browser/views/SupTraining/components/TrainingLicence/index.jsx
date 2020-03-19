import React, { Component } from 'react';
import { Card, Button, Table, Upload, Icon, Tooltip, message, Select, Form, Row, Col, Input, Popconfirm } from 'antd';
import Layout from "../../../../components/Layouts";
import { observer, inject, } from 'mobx-react';
import moment from 'moment'
import _ from "lodash";
import { supplierTrain } from "../../../../actions"
import { SHOW_TrainLicen_MODEL } from "../../../../constants/toggleTypes";
import SupLicence from './components/supLicence'
const { Search } = Input;
// import editTrainPlan from "./components/editTrainPlan";
@inject('toggleStore')
@observer
class TrainingLicence extends Component {
    state = {
        TrainInfo: [],
        recordsTotal: '',
        loading: false,
        curPage: 1,
        selectedRowKeys: [],
        selectedRows: [],
        pageNum: 1,
        rowNum: 20
    }

    async TrainCertificate({ pageNum = 1, rowNum = 20, name = '', expiry_date = '' }) {
        //获取培训证书列表
        this.setState({
            loading: true,
            selectedRowKeys: [],
            selectedRows: [],
        })
        let res = await supplierTrain.getTrainCertificate({ pageNum, rowNum, name, expiry_date })
        if (res.code == 200) {
            this.setState({
                TrainInfo: res.data.list,
                recordsTotal: res.data.recordsTotal,
                selectedRowKeys: [],
                selectedRows: [],
                loading: false
            })
        } else {
            message.error(res.message)

        }
    }
    onChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows })
    }
    async delete() {
        //删除
        let { selectedRowKeys } = this.state
        let { pageNum, rowNum } = this.state
        // console.log(id)
        let res = await supplierTrain.deleteTrainCertificate(selectedRowKeys[0])
        // console.log(res)
        if (res.code == 200) {
            message.success(res.message)
            this.TrainCertificate({ pageNum, rowNum })
        } else {
            message.error(res.message)
        }
    }
    upload = () => {
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_TrainLicen_MODEL)
    }
    async pageChange(page, num) {
        this.setState({ pageNum: page })
        let { pageNum, rowNum } = this.state
        this.TrainCertificate({ pageNum, rowNum })
    }
    deleteALL = () => {
        this.delete()
    }
    async search(e) {
        let { pageNum, rowNum } = this.state
        this.TrainCertificate({ name: e, pageNum, rowNum })
    }
    addTrain = () => {
        this.setState({
            selectedRowKeys: [],
            selectedRows: [],
        })
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_TrainLicen_MODEL)
    }
    loaddata() {
        let { pageNum, rowNum } = this.state
        this.TrainCertificate({ pageNum, rowNum })

    }
    componentDidMount() {
        let { selectedRowKeys, selectedRows } = this.state
        this.loaddata()
    }
    render() {

        const Licence = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 50,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '证书名称',
                dataIndex: 'name',
                width: 100,
                align: "center",
            },
            {
                title: '证书类型',
                dataIndex: 'train_type_id',
                width: 100,
                align: "center"
            },
            {
                title: '发证机构',
                dataIndex: 'authoritied_orgname',
                width: 100,
                align: "center",
            },
            {
                title: '有效期',
                dataIndex: 'expiry_months',
                width: 100,
                align: "center",
                sorter: (a, b) => (moment(a.updatedate).valueOf() - moment(b.updatedate).valueOf()),
            },
        ]

        let { TrainInfo, loading, selectedRowKeys, selectedRows, id, pageNum, curPage, rowNum, recordsTotal } = this.state
        const rowSelection = {
            columnWidth: 30,
            type: 'radio',
            selectedRowKeys,
            onChange: this.onChange
        };
        let TrainHeard = () => {
            return (
                <div>
                    <Button style={{ marginRight: 10 }} type='primary' onClick={this.addTrain}>新建</Button>
                    <Popconfirm placement="topLeft" disabled={!selectedRowKeys.length > 0} title='确定要删除吗？' onConfirm={() => { this.deleteALL() }} okText="是" cancelText="否">
                        <Button disabled={!selectedRowKeys.length > 0} style={{ marginRight: 10 }} type='danger' >删除</Button>
                    </Popconfirm>
                    <Button disabled={!(selectedRowKeys.length == 1)} type='primary' onClick={() => { this.upload() }}>修改</Button>
                </div>
            )
        }
        let { toggleStore } = this.props
        return (
            <Layout title={"供应商培训管理"}>
                <Card title={<TrainHeard></TrainHeard>} extra={<Search placeholder="搜索培训证书" onSearch={(e) => { this.search(e) }} enterButton />}>
                    {
                        //资质证书
                        toggleStore.toggles.get(SHOW_TrainLicen_MODEL) && <SupLicence loaddata={() => { this.loaddata() }} onSelectKey={selectedRows}></SupLicence>
                    }
                    <Table
                        size='middle'
                        className={'gys_table_height'}
                        columns={Licence}
                        width={450}
                        dataSource={TrainInfo}
                        rowKey={(text) => text.id}
                        rowSelection={rowSelection}
                        bordered={true}
                        loading={loading}
                        pagination={{
                            showTotal: () => `共${TrainInfo.length}条`,
                            current: pageNum,
                            onChange: (page, num) => { this.pageChange(page, num) },
                            showQuickJumper: {
                                goButton: <Button type="link" size={'small'}>
                                    跳转
                            </Button>
                            },
                            total: recordsTotal,
                            pageSize: rowNum
                        }}
                    />
                </Card>
            </Layout>
        )
    }
}
TrainingLicence.propTypes = {
}
export default Form.create({ name: 'TrainingLicence' })(TrainingLicence);