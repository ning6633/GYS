import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Upload, Input, Tooltip, message, Popconfirm } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import _ from "lodash";
import { SHOW_PJSSJL_MODEL,SHOW_SsDetail_MODEL  ,SHOW_SupZZApply_MODEL} from "../../../../constants/toggleTypes";
import { supplierAction ,supplierEvalution} from "../../../../actions"
import NewssModel from "../NewssModel"
import SsDetailModel from '../SsDetailModel'
import SupZzEvaluation from '../../components/SupZzEvaluation'

import "./index.less";
const { Search } = Input;

@inject('toggleStore', 'supplierStore')
@observer
//资质实施记录
class SupEvaLicence extends Component {
    state = {
        ZzpjList: {
            list: [],
            recordsTotal: 0
        },
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        detail:null
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
    //删除实施记录
    async deleteSsjl() {
        let ret = await supplierEvalution.deleteZJSS(this.state.selectedRowKeys);
        if (ret.code==200) {
            message.success("删除成功")
            this.loaddata()
            this.setState({ selectedRowKeys:[]})
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
       let result = await supplierEvalution.getZJSSDeatail(record.id)
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
         const {PjzjData,AccessSupData,ReferData,BzyqData} =AttachData
        let create_time = data.date.format('YYYY-MM-DD')
        let newSSData = {
            ...data,
            create_time,
        }
        let specialist = [] //评价专家
        let supArr = [...AccessSupData,...ReferData] //供应商
        PjzjData.forEach(item=>{
            specialist.push(item.id)
        })
        let result = await supplierEvalution.newZzpjDoQuaEval(newSSData)
        console.log(result)
     if(result.code==200){
        this.loaddata()
      //处理全部供应商
        let arr = []
        supArr.forEach(item=>{
            arr.push({
               deception:item.deception||'',
               pass:item.pass,
               zzpjapplyid:item.id,
               zzpjcertificateid:item.certificateid||'',
            })
        })
        console.log(arr)
        let ret = await supplierEvalution.addGYSToSs(result.data.id,arr)
        console.log(ret)
        if(ret.code==200){

        }else{
            message.danger('添加供应商失败')
        }
        //添加专家到实施记录
        console.log(specialist)
        if(specialist.length>0){
            let addSpecialist = await  supplierEvalution.addSpecialToSs(result.data.id,specialist)
            console.log(addSpecialist)
        }

        //处理标准要求
        if(BzyqData.length>0){
            console.log(BzyqData)
            let addBzyqData = await  supplierEvalution.addBZYQToSs(result.data.id,BzyqData)
            console.log(addBzyqData)
        }
      
     }
     
        const { toggleStore } = this.props;

       toggleStore.setToggle(SHOW_PJSSJL_MODEL)
    }
    async loaddata(pageNum = 1, rowNum = 20,name) {
        this.setState({ loading: true });
        let ret = await supplierEvalution.getZzpjDoQuaEval(pageNum, rowNum,{name});
        console.log(ret)

        this.setState({
            ZzpjList: ret.data,
            loading: false
        })
    }
    //分页查询
    async pageChange(page, num) {
        this.loaddata(page, num)
    }
    async  componentDidMount() {
         this.loaddata()
    }
    render() {
        const { toggleStore, supplierStore } = this.props;
        const { loading, selectedRowKeys ,detail} = this.state;
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
                title: '资质评价名称',
                dataIndex: 'name',
                width: 160,
                align: "center",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.getSsInfo(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '评价时间',
                dataIndex: 'create_time',
                width: 120,
                align: "center",
             
            },
            {
                title: '评价地点',
                dataIndex: 'quaplace',
                width: 100,
                align: "center",
            },
            {
                title: '参加供应商',
                dataIndex: 'property_key',
                width: 250,
                align: "center",
                render: (text,redord) => {return redord.gysnames.join(',')}
            },
            {
                title: '评价专家',
                dataIndex: 'name_other',
                width: 150,
                align: "center",
                render: (text,redord) => { return redord.specialistnames.join(',')}
            },
            {
                title: '标准要求',
                dataIndex: 'another_name',
                width: 150,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
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
                <Popconfirm
                        title="确定要删除资质实施记录吗？"
                        onConfirm={ev=>this.deleteSsjl()}
                        okText="确定"
                        cancelText="取消"
                    >
                    <Button type="danger" disabled={!hasSelected}    >删除</Button>
                </Popconfirm> 
            </div>
        )
        let TableFilterBtn = () => (
            <div className="table-fileter">
                <Search placeholder="搜索实施记录名称" onSearch={value => this.loaddata(1,20,value) } enterButton />
            </div>
        )

        return (
            <Card title={<TableOpterta />} extra={<TableFilterBtn />}>
                {  
                    toggleStore.toggles.get(SHOW_PJSSJL_MODEL)&&<NewssModel newSSHandle={this.newSSHandle.bind(this)} />
                }
                {  
                    toggleStore.toggles.get(SHOW_SsDetail_MODEL)&&<SsDetailModel detail={detail} />
                }
                {
                    toggleStore.toggles.get(SHOW_SupZZApply_MODEL) && <SupZzEvaluation refreshData={() => this.loaddata()} />
                }
                
                <Table size='middle' loading={loading} rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''} bordered={true} rowKey={(text) => text.id} rowSelection={rowSelection} scroll={{ x: 500 }} columns={columns} pagination={{showTotal:()=>`共${this.state.ZzpjList.recordsTotal}条`, onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: true, total: this.state.ZzpjList.recordsTotal, pageSize: 20 }} dataSource={this.state.ZzpjList.listZzpjDoQuaEvalVO} />
            </Card>
        )
    }
}

SupEvaLicence.propTypes = {
}
export default SupEvaLicence;