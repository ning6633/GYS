import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import _ from "lodash";
import { SHOW_GetAuthorizedrole_MODEL } from "../../../../constants/toggleTypes"
import { Modal, Form, Icon, Table, Input, Button, Tooltip, Card,Upload ,Select,message,Popconfirm } from 'antd';
import { supplierAction ,supplierDirectory} from "../../../../actions"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Search } = Input;
const { Option } = Select;
const ButtonGroup = Button.Group;
const columns = [
    {
        title: '序号',
        dataIndex: 'key',
        width: 60,
        align: "center",
        render: (text, index, key) => key + 1
    },
    {
        title: '角色名称',
        dataIndex: 'rolename',
        width: 250,
        align: "center",
        render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 15)}</span></Tooltip>
    },
    {
        title: '描述',
        dataIndex: 'roledesc',
        width: 230,
        align: "center",
    },
  
];

@inject('toggleStore')
@observer
class ShowAuthorizedrole extends React.Component {
    state = {
        supplierList: [],
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        roleList:[]
    };
    handleOk = e => {
        console.log(this.state.selectedRowKeys)
        const { toggleStore,nextOrgList } = this.props;
        const { selectedRowKeys } = this.state;
        // selectedSupplier(this.state.selectedRowKeys);
        // let pushArr = []
        // selectedRowKeys.forEach(item=>{
        //     let OrgObject = nextOrgList.find(element=>{
        //         return element.id==item
        //     })
        //     if(OrgObject){
        //         pushArr.push({
        //             departmentname:OrgObject.name,
        //             id:OrgObject.id,
        //             parentid:OrgObject.pid
        //         })
        //     }
        //     console.log(OrgObject)
        // })
        //  console.log(pushArr)
        
        toggleStore.setToggle(SHOW_GetAuthorizedrole_MODEL)

    };
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
         this.setState({ selectedRowKeys });
       
    };
    //移除名录授权
   async removeAuthortyDirect(){
    const { selectedRowKeys } = this.state;
    let ret = await supplierDirectory.removeAuthortyDirect(selectedRowKeys)
    if(ret.code==200){
        message.success(ret.message)
        this.loaddata(1, 15)
    }else{
        message.error(ret.message)
    }
   }
    async searchSupplierInfo(name){
        let ret = await supplierAction.searchSupplierInfo(name);
        this.setState({
            supplierList: ret
        })
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_GetAuthorizedrole_MODEL)
    };
    async componentDidMount() {
    
        this.loaddata()
      
    }
  //分页查询
  async pageChange(page, num) {
    this.loaddata(page, num)
}
    async loaddata(pageNum = 1, rowNum = 15) {
        this.setState({ loading: true });
        const {detail} = this.props
        let parms = {
            directoryId:detail.id,
            pageNum,
            rowNum
        }
        let result = await supplierDirectory.getAuthorizedrole(parms)
        console.log(result)
        if(result.code==200){
            this.setState({
                roleList: result.data,
                loading: false
            })
        }
     
    }
    //搜索已授权的角色
   async searchAuthoriedRole(value){
        const {detail} = this.props
        let parms = {
            directoryId:detail.id,
            pageNum:1,
            rowNum:15,
            keyword:value|| ''
        }
        let result = await supplierDirectory.getAuthorizedrole(parms)
        if(result.code==200){
            this.setState({
                roleList: result.data,
                loading: false
            })
        }
    }
    render() {
        const { toggleStore ,detail} = this.props;
        const { loading, selectedRowKeys ,roleList} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
     
        let TableOpterta = () => (
            <div className="table-operations">
                <Popconfirm
                    title="确定要删除此授权吗？"
                    onConfirm={ev=>this.removeAuthortyDirect()}
                    okText="确定"
                    cancelText="取消"
                >
                     <Button type="danger" disabled={!selectedRowKeys.length} >删除</Button>
                </Popconfirm>
                
            </div>
        )
     
        let TableFilterBtn = () => (
            <div className="table-fileter">
              <Search placeholder="搜索角色" onSearch={value => {this.searchAuthoriedRole(value)}} enterButton />
            </div>
        )
        return (
            <div>
                <Modal
                    title={`名录 ${detail.name} 下已授权的角色`}
                    visible={toggleStore.toggles.get(SHOW_GetAuthorizedrole_MODEL)}
                    width={1000}
                    centered
                    okText="确认"
                    cancelText="取消"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Card title={<TableOpterta />}  extra={<TableFilterBtn  />}>
                        {/* <Table size='middle' loading={loading} bordered={true} rowKey={(text) => text.id} rowSelection={rowSelection} columns={columns} pagination={false} dataSource={this.state.supplierList} /> */}
                        <Table size='middle' loading={loading} rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''} bordered={true} rowKey={(text) => text.relId} rowSelection={rowSelection}  columns={columns} pagination={{ onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: true, total: roleList.recordsTotal, pageSize: 10 }} dataSource={roleList.list} />
                    </Card>
                </Modal>
            </div>
        );
    }
}

export default ShowAuthorizedrole