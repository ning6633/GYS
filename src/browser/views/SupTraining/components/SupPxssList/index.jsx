import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Upload, Input, Tooltip, message, Popconfirm } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import Layout from "../../../../components/Layouts";
import _ from "lodash";
import { SHOW_PJSSJL_MODEL,SHOW_SsDetail_MODEL  ,SHOW_SupZZApply_MODEL} from "../../../../constants/toggleTypes";
import { supplierAction ,supplierEvalution,supplierTrain} from "../../../../actions"
import NewssModel from "../NewssModel"
import SsDetailModel from '../SsDetailModel'
import SupZzEvaluation from '../../components/SupZzEvaluation'

const { Search } = Input;

@inject('toggleStore', 'supplierStore')
@observer
//资质实施记录
class SupEvaLicence extends Component {
    state = {
        PxssList: {
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

   async getSsInfo(record){
        const { toggleStore } = this.props;
       let result = await supplierTrain.getTrainimplementDetail(record.id)
       console.log(result)
       if(result.code==200){
            this.setState({
                detail:result.data
            })
            toggleStore.setToggle(SHOW_SsDetail_MODEL)
       }else{

       }
     
    }
     //处理培训成员
    handelPxmember(arr){
        let _arr = arr.map(item=>{
            return {
                "applyid": item.gystrainapply_id,
                "gysname":item.gysname,
                "gystiuser": item.id,
                "identitycode": item.identitycode,
                "identitytype": item.identitytype,
                "status": item.status,
                "tel": item.tel,
                "username": item.username,
              }
        })
     return _arr
    }

     //处理培训证书
     handelPxCers(arr){
        let _arr = arr.map(item=>{
            return {
                "authoritied_orgname":item.authoritied_orgname,
                "gyscid":item.id,
                // "createtime":item.createdate,
                "expiry_months": item.authoritied_orgname,
                "name": item.name,
                "type":item.type
              }
        })
     return _arr
     }
    async newSSHandle(data,AttachData){
       const { 
        PxzsData,
        pxmemberData,
        PxGysData,
        } =AttachData
        
     
      
        let newSSData = {
            ...data,
            trainname:data.trainPlanName,
            trainPlace:data.trainPlace,
            trainTypeName:data.trainTypeName,
            trainImplementUserList:this.handelPxmember(pxmemberData),
            trainImplementCertificateList:this.handelPxCers(PxzsData)
        }
      
        console.log(AttachData)
        console.log(newSSData)
        let result = await supplierTrain.newTrainimplement(newSSData)
        console.log(result)
        this.loaddata()
    //  if(result.code==200){
    //     this.loaddata()
    //   //处理全部供应商
    //     let arr = []
    //     supArr.forEach(item=>{
    //         arr.push({
    //            deception:item.deception||'',
    //            pass:item.pass,
    //            zzpjapplyid:item.id,
    //            zzpjcertificateid:item.certificateid||'',
    //         })
    //     })
    //     console.log(arr)
    //     let ret = await supplierEvalution.addGYSToSs(result.data.id,arr)
    //     console.log(ret)
    //     if(ret.code==200){

    //     }else{
    //         message.danger('添加供应商失败')
    //     }
    //     //添加专家到实施记录
    //     console.log(specialist)
    //     if(specialist){
    //         let addSpecialist = await  supplierEvalution.addSpecialToSs(result.data.id,specialist)
    //         console.log(addSpecialist)
    //     }

    //     //处理标准要求
    //     if(BzyqData){
    //         // let addSpecialist = await  supplierEvalution.addSpecialToSs(result.data.id,specialist)
    //         // console.log(addSpecialist)
    //     }
      
    //  }
     
        const { toggleStore } = this.props;

      toggleStore.setToggle(SHOW_PJSSJL_MODEL)
    }
    async loaddata(pageNum = 1, rowNum = 20,name) {
        this.setState({ loading: true });
        let ret = await supplierTrain.getTrainimplement(pageNum, rowNum,name);
        console.log(ret)

        this.setState({
            PxssList: ret.data,
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
                title: '培训名称',
                dataIndex: 'trainname',
                width: 160,
                align: "center",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.getSsInfo(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '培训班次',
                dataIndex: 'trainShift',
                width: 120,
                align: "center",
             
            },
            {
                title: '培训类型',
                dataIndex: 'trainTypeName',
                width: 100,
                align: "center",
            },
            {
                title: '培训课时',
                dataIndex: 'trainhour',
                width: 250,
                align: "center",
             //   render: (text,redord) => {return redord.gysnames.join(',')}
            },
            {
                title: '培训专家',
                dataIndex: 'trainteacher',
                width: 150,
                align: "center",
              //  render: (text,redord) => { return redord.specialistnames.join(',')}
            },
            {
                title: '参加供应商',
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
                {/* <Popconfirm
                        title="确定要删除资质实施记录吗？"
                        onConfirm={ev=>this.deleteSsjl()}
                        okText="确定"
                        cancelText="取消"
                    >
                    <Button type="danger" disabled={!hasSelected}    >删除</Button>
                </Popconfirm>  */}
            </div>
        )
        let TableFilterBtn = () => (
            <div className="table-fileter">
                <Search placeholder="搜索实施记录名称" onSearch={value => this.loaddata(1,20,value) } enterButton />
            </div>
        )

        return (
            <Layout title={"供应商培训管理"}>
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
                
                <Table size='middle' loading={loading} rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''} bordered={true} rowKey={(text) => text.id}  scroll={{ x: 2000 }} columns={columns} pagination={{showTotal:()=>`共${this.state.PxssList.recordsTotal}条`, onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: true, total: this.state.PxssList.recordsTotal, pageSize: 20 }} dataSource={this.state.PxssList.list} />
            </Card>
            </Layout>
        )
    }
}

SupEvaLicence.propTypes = {
}
export default SupEvaLicence;