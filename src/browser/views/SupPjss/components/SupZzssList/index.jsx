import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Upload, Input, Tooltip, message, Select } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import _ from "lodash";
import { SHOW_PJSSJL_MODEL,SHOW_SsDetail_MODEL  ,SHOW_SupZZApply_MODEL,SHOW_ShowSupPJrdSS_MODEL} from "../../../../constants/toggleTypes";
import { supplierAction ,supplierAccepted} from "../../../../actions"
import NewPjrdssModel from "../NewPjrdssModel"
import SsDetailModel from '../SsDetailModel'
import SupZzEvaluation from '../../components/SupZzEvaluation'
import ShowSupPJrdSS from '../ShowSupPJrdSS'
import "./index.less";
const { Search } = Input;

@inject('toggleStore', 'supplierStore')
@observer
//评价认定实施记录
class SupEvaLicence extends Component {
    state = {
        ZzpjList: {
            list: [],
            recordsTotal: 0
        },
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        detail:null,
        applydetail:{},
    };

    // onSelectChange = (selectedRowKeys,selectedRows) => {
    //     console.log(selectedRowKeys,selectedRows)
    //     // console.log('selectedRowKeys changed:', [obj[0].implementId]);
    //     this.setState({ selectedRowKeys });
    // };
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
    async deleteSsjl() {
        let ret = await supplierAccepted.deletePJSS(this.state.selectedRowKeys);
        if (ret.code==200) {
            message.success(ret.message)
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
   async getSsInfo(record){
        const { toggleStore } = this.props;
       let result = await supplierAccepted.getZJSSDeatail(record.id)
       console.log(result)
       if(result.code==200){
            this.setState({
                detail:result.data
            })
            toggleStore.setToggle(SHOW_SsDetail_MODEL)
       }else{

       }
      
    }
    //获取评价认定实施记录详情
    async getPJSSDetail(record){
        const { toggleStore } = this.props;
        let result = await supplierAccepted.getPJSSDetail(record.implementId)
        console.log(result)
        if(result.code==200){
             this.setState({
                 applydetail:result.data
             })
             toggleStore.setToggle(SHOW_ShowSupPJrdSS_MODEL)
        }else{
 
        }
    }
    async newSSHandle(AttachData){
        let newdata = AttachData
        console.log(newdata)
        let result = await supplierAccepted.newPjrdDoQuaEval(newdata)
        console.log(result)
        if(result.code==200){
            message.success(result.message)
            this.loaddata()
        }
        const { toggleStore } = this.props;
       toggleStore.setToggle(SHOW_PJSSJL_MODEL)
    }
    async loaddata(pageNum = 1, rowNum = 20) {
        this.setState({ loading: true });
        let ret = await supplierAccepted.getPjrdDoQuaEval(pageNum, rowNum);
        console.log(ret)
        this.setState({
            ZzpjList: ret.data,
            loading: false,
            selectedRowKeys: []
        })
    }
    //分页查询
    async pageChange(page, num) {
        this.loaddata(page, num)
    }
    componentDidMount() {
         this.loaddata()
    }
    render() {
        const { toggleStore, supplierStore } = this.props;
        const { loading, selectedRowKeys ,detail,applydetail} = this.state;
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
                title: '认定评价名称',
                dataIndex: 'name',
                width: 200,
                align: "center",
                // fixed: "left",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.getPJSSDetail(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '评价时间',
                dataIndex: 'evaluateDate',
                width: 120,
                align: "center",
                // render: (text) => text == 20 ? '已提交' : '未提交'
            },
            {
                title: '评价地点',
                dataIndex: 'evaluatePlace',
                width: 230,
                align: "center",
            },
            {
                title: '参加供应商',
                dataIndex: 'gysNames',
                width: 150,
                align: "center",
            },
            {
                title: '评价专家',
                dataIndex: 'expertNames',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '标准要求',
                dataIndex: 'zrNeedList ',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            }
            // {
            //     title: '操作',
            //     dataIndex: 'modify',
            //     align: "center",
            //     width: 150,
            //     render: (text, redord) => {
            //         return (<div><Button disabled={redord.status == 20} onClick={() => { this.editorSupplierInfo(redord) }} style={{ marginRight: 5 }} type="primary" size={'small'}>编辑</Button>   <Button disabled={redord.status == 20} onClick={() => { this.submitSupplierInfo(redord) }} size={'small'}>提交</Button></div>)
            //     }
            // },
        ];

     
         


        let TableOpterta = () => (
            <div className="table-operations">
                <Button icon="edit" type="primary" onClick={() => { toggleStore.setToggle(SHOW_PJSSJL_MODEL); }}>新建</Button>
                <Button type="danger" disabled={!hasSelected} onClick={() => { this.deleteSsjl() }} >删除</Button>
            </div>
        )
        let TableFilterBtn = () => (
            <div className="table-fileter">
                <Search placeholder="搜索记录名称" onSearch={value => console.log(value)} enterButton />
                {/* <Button icon="edit" type="primary" onClick={() => { toggleStore.setToggle(SHOW_SupZZApply_MODEL)}} >资质申请详情（调试用）</Button> */}
              
            </div>
        )

        return (
            <Card title={<TableOpterta />} extra={<TableFilterBtn />}>
                {  
                    toggleStore.toggles.get(SHOW_PJSSJL_MODEL)&&<NewPjrdssModel newSSHandle={this.newSSHandle.bind(this)} />

                }
                  {  
                    toggleStore.toggles.get(SHOW_SsDetail_MODEL)&&<SsDetailModel detail={detail} />

                }
                {toggleStore.toggles.get(SHOW_ShowSupPJrdSS_MODEL) && <ShowSupPJrdSS 
                detail = {applydetail} refreshData={() => this.loaddata()} />}
                
                 {toggleStore.toggles.get(SHOW_SupZZApply_MODEL) && <SupZzEvaluation refreshData={() => this.loaddata()} />}
                
                <Table size='middle' loading={loading} rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''} bordered={true} rowKey={(text) => text.implementId} rowSelection={rowSelection} scroll={{ x: 500 }} columns={columns} pagination={{ onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: true, total: this.state.ZzpjList.recordsTotal, pageSize: 20 }} dataSource={this.state.ZzpjList.list} />
            </Card>
        )
    }
}

SupEvaLicence.propTypes = {
}
export default SupEvaLicence;