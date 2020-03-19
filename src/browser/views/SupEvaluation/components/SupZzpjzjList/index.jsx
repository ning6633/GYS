import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Select, Input, Tooltip, message, Popconfirm, Row, Col } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import _ from "lodash";
import { SHOW_NewPJZS_MODEL, SHOW_ShowPJZJ_MODEL } from "../../../../constants/toggleTypes";
import { supplierAction, specialAction } from "../../../../actions"
import NewPJZJ from "../NewPJZJ"
import ShowPJZJ from '../ShowPJZJ'
const ButtonGroup = Button.Group;
import "./index.less";
const { Search } = Input;
const { Option } = Select

@inject('toggleStore', 'specialistStore')
@observer
class SupZzpjzsList extends Component {
    state = {
        specialist: {
            listZzpjSpecialistVO: [],
            recordsTotal: 0
        },
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        specialType: '',
        speciaName: '',
        specialistTypes: [],
    };

    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    async submitSupplierInfo(redord) {
        const { toggleStore, } = this.props;
        if (redord.is_diff != 0) {
            toggleStore.setToggle(SHOW_SupInfoManager_MODEL)
        } else {
            let specialist = await supplierAction.submitSupplierInfo([redord.id]);
            message.success("提交成功")
            this.loaddata()
        }
    }
    async submitSupplierInfopl() {
        let specialist = await supplierAction.submitSupplierInfo(this.state.selectedRowKeys);
        message.success("提交成功")
        this.loaddata()
    }
    //删除专家
    async deleteSpecialist() {
        const { selectedRowKeys } = this.state
        let ret = await specialAction.deleteSpecialist(selectedRowKeys);
        if (ret.code = 200) {
            message.success("删除成功")
            this.loaddata()
        }
    }
    // 查看详情
    editorSupplierInfo(redord, ) {
        const { toggleStore, specialistStore } = this.props;
        console.log(redord)
        specialistStore.setspecialistDetail(redord);
        toggleStore.setToggle(SHOW_ShowPJZJ_MODEL);



    }
    async loaddata(pageNum = 1, rowNum = 20, options) {
        this.setState({ loading: true });
        let params = {
            ...options,
            pageNum,
            rowNum
        }
        let specialist = await specialAction.getSpecialist(params);
        this.setState({
            specialist: specialist,
            loading: false
        })
    }
    //分页查询
    async pageChange(page, num) {
        const { specialType, speciaName } = this.state
        let options = {
            username: speciaName,
            usertype: specialType
        }
        this.loaddata(page, num, options)
    }
    async componentDidMount() {

        let ret = await specialAction.getSpecialDIc();
        if (ret.code == 200) {
            this.loaddata(1, 20)
            this.setState({
                specialistTypes: ret.data,
            })
        }
    }
    async addZJFn(values) {
        console.log(values)
        let ret = await specialAction.newSpecialist(values)
        if (ret.code == 200) {
            this.loaddata()
            message.success(ret.message)
        } else {
            message.error(ret.message)
        }
    }
    //处理选择专家分类事件
    async handleTypeChange(value) {
        console.log(value)
        this.setState({
            specialType: value
        })
        let params = {
            usertype: value
        }
        this.loaddata(1, 20, params)
    }
    //处理搜索事件
    async handleSearch(value) {
        const { specialType } = this.state
        let params = {
            usertype: specialType,
            username: value
        }
        this.loaddata(1, 20, params)
    }
    render() {
        const { toggleStore, specialistStore } = this.props;
        const { loading, selectedRowKeys, specialistTypes, specialType } = this.state;
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
                render: (text, index, key) => key + 1
            },
            {
                title: '专家名称',
                dataIndex: 'name',
                width: 150,
                align: "center",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.editorSupplierInfo(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '专家职称',
                dataIndex: 'title',
                width: 120,
                align: "center"

            },
            {
                title: '专家分类',
                dataIndex: 'typename',
                width: 150,
                align: "center",
            },
            {
                title: '专家领域',
                dataIndex: 'field',
                width: 150,
                align: "center",
            },
            {
                title: '专家来源',
                dataIndex: 'source',
                width: 150,
                align: "center",
            },
            {
                title: '联系电话',
                dataIndex: 'tel',
                width: 150,
                align: "center",
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                width: 150,
                align: "center",
            },
            /* {
                title: '操作',
                dataIndex: 'modify',
                align: "center",
                width: 200,
                render: (text, redord) => {
                    return (<div><Button disabled={redord.status == 20} onClick={() => { this.editorSupplierInfo(redord) }} style={{ marginRight: 5 }} type="primary" size={'small'}>编辑</Button></div>)
                }
            }, */
        ];

        let TableOpterta = () => (
            <div className="table-operations">
                <Button icon="edit" type="primary" onClick={() => { toggleStore.setToggle(SHOW_NewPJZS_MODEL); }}>添加</Button>
                <Popconfirm
                    title="确定要移除此专家吗？"
                    onConfirm={ev => this.deleteSpecialist()}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button type="danger" disabled={!hasSelected} >删除</Button>
                </Popconfirm>

            </div>
        )
        let TableFilterBtn = () => (
            <Row >
                <Col span={12}>选择分类：<Select defaultValue={specialType} onChange={this.handleTypeChange.bind(this)} style={{ width: 120}} >
                    {
                        specialistTypes.map(item => {
                            return (
                                <Option key={item.id} value={item.code}>{item.name}</Option>
                            )
                        })
                    }
                    <Option value="">全部</Option>
                </Select></Col>
                <Col span={12}><Search placeholder="搜索专家名称" onSearch={value => this.handleSearch(value)} enterButton /></Col>
            </Row>
        )
        return (
            <Card title={<TableOpterta />} extra={<TableFilterBtn />}>
                {
                    toggleStore.toggles.get(SHOW_NewPJZS_MODEL) && <NewPJZJ specialistTypes={specialistTypes} addZJFn={(values) => { this.addZJFn(values) }} />
                }
                {
                    toggleStore.toggles.get(SHOW_ShowPJZJ_MODEL) && <ShowPJZJ />
                }

                <Table size='middle' loading={loading} rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''} bordered={true} rowKey={(text) => text.id} rowSelection={rowSelection} columns={columns} pagination={{ showTotal:()=>`共${this.state.specialist.recordsTotal}条`,onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: true, total: this.state.specialist.recordsTotal, pageSize: 20 }} dataSource={this.state.specialist.listZzpjSpecialistVO} />
            </Card>
        )
    }
}

SupZzpjzsList.propTypes = {
}
export default SupZzpjzsList;