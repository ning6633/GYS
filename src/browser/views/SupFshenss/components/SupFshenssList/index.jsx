import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Upload, Input, Tooltip, message, Select } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import _ from "lodash";
import { SHOW_PJSSJL_MODEL, SHOW_NewBZYQ_MODEL,SHOW_SsDetail_MODEL } from "../../../../constants/toggleTypes";
import { supplierAction ,supYearAudit} from "../../../../actions"
import NewssModel from "../NewssModel"
import NewBZYQ from "../NewBZYQ"
import SsDetailModel from '../SsDetailModel'

import "./index.less";
const { Search } = Input;

@inject('toggleStore', 'supplierStore')
@observer
class SupplierInfo extends Component {
    state = {
        ssList: {
            list: [],
            recordsTotal: 0
        },
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        detail:{}
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
            let ssList = await supplierAction.submitSupplierInfo([redord.id]);
            message.success("提交成功")
            this.loaddata()
        }
    }
    async getSsInfo(record){
        const { toggleStore } = this.props;
       let result = await supYearAudit.getSsDetail(record.id)
       console.log(result)
       if(result.code==200){
            this.setState({
                detail:result.data
            })
            toggleStore.setToggle(SHOW_SsDetail_MODEL)
       }else{

       }
     
    }
    async newSSHandle(data,AttachData){
        const { toggleStore } = this.props;
        const {PjzjData,AccessSupData,ReferData,BzyqData} =AttachData
       let create_time = data.date.format('YYYY-MM-DD')
       let newSSData = {
           ...data,
           annualauditDate:create_time,
       }
       let specialist = [] //评价专家
       let supArr = [...AccessSupData,...ReferData] //供应商
    
    //    console.log(supArr)
    //    console.log(newSSData)
       console.log(data)
       let result = await supYearAudit.newAnnualaudit(data.currentPlanId,newSSData)
       console.log(result)
    if(result.code==200){
     
     //处理全部供应商
       let arr = []
       supArr.forEach(item=>{
           arr.push({
              result:item.result||'',
              annualauditRecordID:result.data.id,
              status:item.status,
              gysID:item.id,
              certificateid:item.certificateid||'',
           })
       })
       console.log(arr)
       let ret = await supYearAudit.addGYSToSs(result.data.id,arr)
       console.log(ret)
       if(ret.code==200){
           message.success('年度复审计划新建成功')
       }else{
           message.error('添加供应商失败')
       }
       //添加专家到实施记录
   
       if(PjzjData.length>0){
        PjzjData.forEach(item=>{
            specialist.push({
                specialistid: item.id,
               annualauditrecordid:result.data.id
            })
        })
           console.log(specialist)
           let addSpecialist = await  supYearAudit.addSpecialToSs(result.data.id,specialist)
           console.log(addSpecialist)
       }

       //处理标准要求
       if(BzyqData.length>0){
             //添加专家到实施记录
             BzyqData.forEach(item=>{
                specialist.push({
                    specialistid: item.id,
                annualauditrecordid:result.data.id
                })
            })
           // let addSpecialist = await  supplierEvalution.addBZYQToSs(result.data.id,specialist)
           // console.log(addSpecialist)
       }
       this.loaddata()
       toggleStore.setToggle(SHOW_PJSSJL_MODEL)
    }
    }
  
    async deleteAnnualaudit() {
        let ssList = await supYearAudit.deleteAnnualaudit(this.state.selectedRowKeys);
        if (ssList) {
            message.success("删除成功")
            this.setState({
                selectedRowKeys:[]
            })
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
    async loaddata(pageNum = 1, rowNum = 20,fsName) {
        this.setState({ loading: true });
        let ssList = await supYearAudit.getAnnualaudit(pageNum, rowNum,fsName);
        console.log(ssList)
        this.setState({
            ssList: ssList.data,
            loading: false
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
        const { loading, selectedRowKeys ,detail } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type:'radio'
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
                dataIndex: 'annualauditName',
                width: 200,
                align: "center",
                // fixed: "left",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.getSsInfo(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '复审时间',
                dataIndex: 'annualauditDate',
                width: 120,
                align: "center",
               // render: (text) => text == 20 ? '已提交' : '未提交'
            },
            {
                title: '复审地点',
                dataIndex: 'annualauditAddress',
                width: 230,
                align: "center",
            },
            {
                title: '复审机构',
                dataIndex: 'annualauditOrg',
                width: 150,
                align: "center",
            },
            {
                title: '复审专家',
                dataIndex: 'zjsname',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 20)}</span></Tooltip>
            },
            {
                title: '参加供应商',
                dataIndex: 'gysname',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 20)}</span></Tooltip>
            },
            // {
            //     title: '标准要求',
            //     dataIndex: 'standard_requset',
            //     width: 150,
            //     align: "center",
            //     render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            // }
        ];

     
        let TableOpterta = () => (
            <div className="table-operations">
                <Button icon="edit" type="primary" onClick={() => { toggleStore.setToggle(SHOW_PJSSJL_MODEL); }}>新建</Button>
                <Button type="danger" disabled={!hasSelected} onClick={() => { this.deleteAnnualaudit() }} >删除</Button>
            </div>
        )
        let TableFilterBtn = () => (
            <div className="table-fileter">
                <Search placeholder="搜索复审名称" onSearch={value =>this.loaddata(1,20,value)} enterButton />
            </div>
        )

        return (
            <Card title={<TableOpterta />} extra={<TableFilterBtn />}>
                {
                    toggleStore.toggles.get(SHOW_PJSSJL_MODEL) && <NewssModel newSSHandle={this.newSSHandle.bind(this)} />
                }
                 {  
                    toggleStore.toggles.get(SHOW_SsDetail_MODEL)&&<SsDetailModel detail={detail} />
                }
                {
                    toggleStore.toggles.get(SHOW_NewBZYQ_MODEL) && <NewBZYQ />
                }

                <Table size='middle' loading={loading} rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''} bordered={true} rowKey={(text) => text.id} rowSelection={rowSelection}  columns={columns} pagination={{ onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: true, total: this.state.ssList.recordsTotal, pageSize: 20 }} dataSource={this.state.ssList.list} />
            </Card>
        )
    }
}

SupplierInfo.propTypes = {
}
export default SupplierInfo;