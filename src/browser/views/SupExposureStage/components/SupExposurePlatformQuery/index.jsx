import React, { Component, Fragment } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Row, Input, Tooltip, message, Col, Form, Select } from 'antd';
import Layout from "../../../../components/Layouts";
import { observer, inject, } from 'mobx-react';
import { specialExposure } from "../../../../actions"
import moment from "moment";
import _ from "lodash";
import { SHOW_Exposure_MODEL } from "../../../../constants/toggleTypes";
import SupQuery from '../SupQuery/index'
import './index.less'
const { Option } = Select;
const { Search } = Input;

@inject('toggleStore', 'supplierStore')
@observer
class SupExposurePlatformQuery extends Component {
    state = {
        exposureList: {
            list: [],
            recordsTotal: 0
        },
        info: {},
        loading: false,
        pageNum: 1,
        rowNum: 20,
        selectedRowKeys: [],
        selectedRows: [],
        providerName: '',
        isExcellent: 0
    }
    showDetails = (data) => {
        this.setState({ info: data })
        let { toggleStore } = this.props
        toggleStore.setToggle(SHOW_Exposure_MODEL);
    }
    async loaddata({ isManage = false, rowNum = 20, pageNum = 1, providerName = null, isExcellent = '' }) {
        this.setState({ loading: true })
        let res = await specialExposure.getExposure({ isManage, rowNum, pageNum, providerName, isExcellent })
        if (res.code == 200) {
            console.log(res.data)
            this.setState({
                exposureList: res.data,
                loading: false,
                selectedRowKeys: []
            })
        }
    }
    onChange = (selectedRowKeys, selectedRows) => {
        let { providerName } = this.state
        this.setState({ selectedRowKeys, selectedRows, providerName })
    }
    pageChange = (page, num) => {
        let { providerName } = this.state
        this.loaddata({ pageNum: page, rowNum: num, providerName })
    }
    search = (e) => {
        let { pageNum, rowNum, isExcellent } = this.state
        isExcellent = isExcellent == 0 ? '' : isExcellent
        this.setState({ providerName: e })
        this.loaddata({ pageNum, rowNum, providerName: e, isExcellent })
    }
    onSelectChange = (value) => {
        this.setState({ isExcellent: value })
    }
    componentDidMount = () => {
        let { state } = this.props.location
        this.setState({ isExcellent: state || 0 })
        let { pageNum, rowNum } = this.state
        this.loaddata({ pageNum, rowNum, isExcellent: state })
    }

    render() {
        const ExposureList = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: 'center',
                render: (text, index, key) => key + 1
            },
            {
                title: '供应商名称',
                dataIndex: 'name',
                width: 200,
                align: 'center',
                render: (text, redord) => <Tooltip title={text}><span onClick={this.showDetails.bind(this, redord)} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '曝光性质',
                dataIndex: 'type',
                width: 230,
                align: 'center',
                render: (text) => {
                    if (text == 1) {
                        return (
                            <span>优质供应商</span>
                        )
                    }
                    if (text == 2) {
                        return (
                            <span>劣质供应商</span>
                        )
                    }
                }
            },
            {
                title: '曝光原因',
                dataIndex: 'content',
                onCell: () => {
                    return {
                        style: {
                            maxWidth: 230,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer'
                        }
                    }
                },
                width: 230,
                align: 'center',
            },
            {
                title: '曝光时间',
                dataIndex: 'update_time',
                width: 230,
                align: 'center',
                sorter: (a, b) => (moment(a.updatedate).valueOf() - moment(b.updatedate).valueOf()),
                render: (text, record) => {
                    return (
                        <span>{text && text.substring(0, text.length - 2)}</span>
                    )

                }
            },
            {
                title: '是否有效',
                dataIndex: 'status',
                width: 230,
                align: 'center',
                render: (text) => {
                    if (text == 0) {
                        return (<span>未确认</span>)
                    }
                    if (text == 10) {
                        return (<span>已确认</span>)
                    }
                }
            },
        ]
        let { loading, exposureList, selectedRowKeys, info, pageNum, rowNum, isExcellent } = this.state
        const rowSelection = {
            columnWidth: 30,
            type: 'checkbox',
            selectedRowKeys,
            onChange: this.onChange
        };
        const CardSearch = () => {
            return (
                <div className='sup_exposure_search'>
                    性质:
                     <Select style={{ width: 200 }} defaultValue={isExcellent.toString()} onChange={(value) => { this.onSelectChange(value) }}>
                        <Option value='0'>全部</Option>
                        <Option value='1'>优质供应商</Option>
                        <Option value='2'>劣质供应商</Option>
                    </Select>
                    <Search placeholder='请输入查询内容' onSearch={(e) => { this.search(e) }} enterButton style={{ marginLeft: 50 }} />
                </div>
            )
        }
        let { toggleStore } = this.props
        return (
            <Layout title={"供应商关系管理"}>
                {
                    toggleStore.toggles.get(SHOW_Exposure_MODEL) && <SupQuery info={info}></SupQuery>
                }

                <Card title={<b>曝光台查询</b>} extra={<CardSearch></CardSearch>}>
                    <Table
                        size='middle'
                        className={'gys_table_height'}
                        columns={ExposureList}
                        width={1180}
                        dataSource={exposureList.list}
                        rowKey={(text) => text.id}
                        // rowSelection={rowSelection}
                        bordered={true}
                        loading={loading}
                        pagination={{
                            showTotal: () => `共${exposureList.recordsTotal}条`,
                            // current: pageNum, 
                            onChange: (page, num) => { this.pageChange(page, num) },
                            showQuickJumper: {
                                goButton: <Button type="link" size={'small'}>
                                    跳转
                        </Button>
                            },
                            total: exposureList.recordsTotal,
                            pageSize: 20
                        }}
                    />
                </Card>
            </Layout>
        )
    }
}

export default Form.create({ name: 'supExposurePlatformQuery' })(SupExposurePlatformQuery);