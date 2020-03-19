import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { observer, inject, } from 'mobx-react';
import { Card, message,Table,Button,Input,Tooltip  } from 'antd';
import {
    Link,
    withRouter // 包装组件使组件拥有history对象
} from 'react-router-dom';
import { SHOW_NewReviewPlan_MODEL,SHOW_ModelDetail_MODEL ,SHOW_ShowSupApply_MODEL} from "../../../../constants/toggleTypes";
import { supYearAudit ,supplierApproval} from "../../../../actions"
import ShowReviewPlanDetail from '../ShowReviewPlanDetail'
 import NewReviewPlan from "../NewReviewPlan";
 import ShowSupSsDetail from '../ShowSupSsDetail'
const { Search } = Input;
@inject('toggleStore')
@observer
class SupAnnualExaminationInfo extends Component {
    state = {
        bzList: {
            list: [],
            recordsTotal: 0
        },
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        detail:{},
        gysInfo:{},
        ssDetail:{},
        userTypeVerty:'sup'
    };
    async getAnnualExaminationDetail(record){
        const { toggleStore}=this.props
       let result = await supYearAudit.getAnnualExaminationDetail(record.id)
       if(result.code==200){
           this.setState({
               detail:result.data[0]
           })
           toggleStore.setToggle(SHOW_ModelDetail_MODEL)
       }
    }
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ selectedRowKeys });
    
    };
    convertStatus(status){
        let str = ''
        switch (status) {
            case '0':
            str = '未实施'
                break;
                case '1':
                str = '复审中'
                break;
                case '2':
                str = '已完成'
                break;
            default:
                break;
        }
        return str
    }
    async getauditRecordByPlanidAndGysid(record){
        const { toggleStore}=this.props
        const { gysInfo } = this.state
        let result  = await supYearAudit.getauditRecordByPlanidAndGysid(record.id,gysInfo.gysId)
        console.log(result)
        
        let ssDetail = result.data[0]
        ssDetail['gysInfo'] = gysInfo
        if(result.code==200){
            this.setState({
                ssDetail:ssDetail
            },()=>{
                toggleStore.setToggle(SHOW_ShowSupApply_MODEL)
            })
        }
    }
     async deleteReecord(){
         const { selectedRowKeys}=this.state
      let result = await supYearAudit.deleteAnnualExamination(selectedRowKeys)
      if(result.code==200){
          this.loaddata()
          this.setState({ selectedRowKeys:[] });
        message.success(result.message)
      }else{
        message.danger(result.message)
      }
     }
    async loaddata(pageNum = 1, rowNum = 20,annualPlanName='') {
        const { userTypeVerty,gysInfo } = this.state
        this.setState({ loading: true });
        console.log(userTypeVerty)
        let ret = userTypeVerty=='approve'? await supYearAudit.getAnnualExamination(pageNum, rowNum,{annualPlanName}): await supYearAudit.getAnnualExaminationByGYS(pageNum, rowNum,{annualPlanName,gysID:gysInfo.gysId})
        console.log(ret)
        if(ret.code==200){
            this.setState({
                bzList:ret.data,
                loading: false
            })
        }
       
    }
    //分页查询
    async pageChange(page, num) {
        this.loaddata(page, num)
    }
   async componentDidMount(){
       const { roleNameKey } = supplierApproval.pageInfo
         let ApproveroleLists = await supplierApproval.getCharacter()
         console.log(ApproveroleLists)
    //获取自身角色信息
    let roles= roleNameKey.split(',')
     //判断是否是审核角色
     for(let roleName of roles){
      let userVerty = ApproveroleLists.some(item=>item==roleName)
         if(userVerty){
          this.setState({
              userTypeVerty:'approve'
            })
            break
         }
     }
     let gysinfo = await supYearAudit.comfgysInfo()
     console.log(gysinfo)
    
         this.setState({
            gysInfo:gysinfo.data
         },()=>{
            this.loaddata()

         })
    

    }
    render() {
        const { toggleStore } = this.props;
        const { loading, selectedRowKeys ,bzList,detail,userTypeVerty,ssDetail} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type:"radio",
            getCheckboxProps:record => ({
                //匹配校验数据
                disabled: record.annualauditStatus==0?false:true,
            })
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
                title: '复审计划名称',
                dataIndex: 'annualauditName',
                width: 200,
                align: "center",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.getAnnualExaminationDetail(redord) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '复审计划类型',
                dataIndex: 'annualauditType',
                width: 100,
                align: "center",
            },
            {
                title: '申请人',
                dataIndex: 'annualauditCreateUser',
                width: 120,
                align: "center",
            },

            {
                title: '复审地点',
                dataIndex: 'annualauditAddress',
                width: 80,
                align: "center",
            },
            {
                title: '复审机构',
                dataIndex: 'annualauditOrg',
                width: 150,
                align: "center",
            },
            {
                title: '复审时间',
                dataIndex: 'annualauditDate',
                width: 120,
                align: "center",
            },
            {
                title: '状态',
                dataIndex: 'annualauditStatus',
                width: 100,
                align: "center",
                render:(text,record)=>this.convertStatus(text)
            },
            {
                title: '操作',
                dataIndex: 'cz',
                width: 100,
                align: "center",
                render: (text, record, key) => {
                    
                    return (<div>{record.annualauditStatus == '1' && userTypeVerty =='sup'?<Button size="small" onClick={() => { this.getauditRecordByPlanidAndGysid(record) }} style={{ marginRight: 5 }} type="primary" size={'small'}>查看实施记录</Button>:null }</div>)
                }
            },
            
        ];
        let TableOpterta = () => (
            <div className="table-operations">
                <Button icon="edit" type="primary" onClick={() => { toggleStore.setToggle(SHOW_NewReviewPlan_MODEL) }}>新建</Button>
                <Button type="danger" disabled={!hasSelected} onClick={() => { this.deleteReecord() }} >删除</Button>
            </div>
        )
        let TableFilterBtn = () => (
            <div className="table-fileter">
                <Search placeholder="请输入内容" onSearch={value =>this.loaddata(1,20,value)} enterButton />
            </div>
        )
        return (
            <div>
                <Card title={userTypeVerty=='approve' && <TableOpterta />} extra={<TableFilterBtn />} >
                {
                    toggleStore.toggles.get(SHOW_NewReviewPlan_MODEL) && <NewReviewPlan refreshData={() => this.loaddata()} />
                }
                 {
                    toggleStore.toggles.get(SHOW_ModelDetail_MODEL) && <ShowReviewPlanDetail detail={detail}refreshData={() => this.loaddata()} />
                }
                  {
                    toggleStore.toggles.get(SHOW_ShowSupApply_MODEL) && <ShowSupSsDetail detail={ssDetail}refreshData={() => this.loaddata()} />
                }
             
                <Table size='middle' loading={loading}  bordered={true} rowKey={(text) => text.id} rowSelection={rowSelection} scroll={{ x: 1050 }} columns={columns} pagination={{ onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: true, total: bzList.recordsTotal, pageSize: 20 }} dataSource={bzList.list} />

                </Card> 
            </div>
        )
    }
}

SupAnnualExaminationInfo.propTypes = {
}
export default SupAnnualExaminationInfo;