import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Input, Icon, Tooltip, message, Select,Popconfirm } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import { SHOW_CHOOSESUPPLIER_MODEL, SHOW_FeedBack_MODEL, SHOW_ChooseSupplierPub_MODEL } from "../../../../constants/toggleTypes";
import { supplierAction,supplierDirectory } from "../../../../actions"
import ChooseDirSup from "../ChooseDirSup";
import ChooseDirSupByAuthoried from '../ChooseDirSupByAuthoried'
import "./index.less";
const { Option } = Select;
const { Search } = Input;

const ButtonGroup = Button.Group;

@inject('toggleStore', 'supplierStore')
@observer
class SupsInDirInfo extends Component {
    state = {
        supplierList: {
            list: [],
            recordsTotal: 0
        },
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
    };

    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed:', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
 
    async chooseSupplier() {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_CHOOSESUPPLIER_MODEL)
        // let supplierList = await supplierAction.submitSupplierInfo(this.state.selectedRowKeys);
        // message.success("提交成功")
    }
    async chooseSupplierByAuthoried() {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_ChooseSupplierPub_MODEL)
        // let supplierList = await supplierAction.submitSupplierInfo(this.state.selectedRowKeys);
        // message.success("提交成功")
    }
    async deleteSupplierInfo() {
     
        const { refreshData } = this.props
        let result = await supplierDirectory.removeSupsInDirect(this.state.selectedRowKeys)
     
        if(result.code==200){
            message.success(result.message)
            let params={
                pageNum:1,
                rowNum:15
            }
            this.setState({ selectedRowKeys:[] });
            refreshData(params)
        }else{
            message.error(result.message)
        }
    }
    selectedSupplier(data){
        const { directDetail,refreshData} =this.props
        let newData = {
            directoryid:directDetail.id,
            gysIdCategoryVOs:data
        }
        console.log(newData)
      supplierDirectory.addSupByDirect(newData).then(res=>{
          if(res.code==200){
            message.success(res.message)
            let params={
                pageNum:1,
                rowNum:15
            }
            refreshData(params)
          }else{
            message.error(res.message)
          }
      })
    }
    editorSupplierInfo(redord, islookdetail = false) {
        const { toggleStore, supplierStore } = this.props;
        if (islookdetail) {
            // 查看详情
            supplierStore.setEditSupplierInfo(redord)
            supplierStore.iseditor = true;
            supplierStore.islookdetail = true;
            toggleStore.setToggle(SHOW_CHOOSESUPPLIER_MODEL)
        } else {
            supplierStore.islookdetail = false;
            if (redord.status == !20) {
                supplierStore.setEditSupplierInfo(redord)
                supplierStore.iseditor = true;
                toggleStore.setToggle(SHOW_CHOOSESUPPLIER_MODEL)
            } else {
                message.error("已提交供应商记录，无法编辑")
            }
        }
    }
 
  
    //分页查询
    async pageChange(pageNum, rowNum) {
        const  { refreshData} = this.props
        let params={
            pageNum,
            rowNum
        }
        refreshData(params,'')
    }
   //搜索供应商
   searchSuplist(value){
    const  { refreshData} = this.props
    let params={
        pageNum:1,
        rowNum:15
    }
   refreshData(params,value)
   }
    render() {
        const { toggleStore, userInfo  ,supplierList,directDetail} = this.props;
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
                render: (text, index, key) => key + 1
            },
            {
                title: '供应商名称',
                dataIndex: 'name',
                width: 150,
                align: "center",
                render: (text, redord) => <Tooltip title={text}><span onClick={() => {}} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '来自于',
                dataIndex: 'from',
                width: 100,
                align: "center",
            
            },
            {
                title: '供应商编号',
                dataIndex: 'number',
                width: 130,
                align: "center",
            },
            {
                title: '产品类别',
                dataIndex: 'product_category',
                width: 150,
                align: "center",
            },
            {
                title: '供货产品',
                dataIndex: 'product_names',
                width: 230,
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 10)}</span></Tooltip>
            },
          
         
        ];
        const uploadProps = {
            name: 'file',
            action: `${supplierAction.BaseURL}files?username=${supplierAction.pageInfo.username}`,
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} 文件上传成功，正在等待服务端转换...`);
                    setTimeout(() => {
                        message.success("文件转换成功，开始加载数据...")
                    }, 3000);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };
        let TableOpterta = () => (
            <div className="table-operations">
                <Button type="primary"  onClick={() => { this.chooseSupplier() }}>添加</Button>
                {userInfo.usertype !='1' &&  <Button type="primary"  onClick={() => { this.chooseSupplierByAuthoried() }}>从上级名录添加</Button>}
               
                <Popconfirm
                    title="确定要删除此供应商吗？"
                    onConfirm={ev=>this.deleteSupplierInfo()}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button type="danger" disabled={!hasSelected}  >删除</Button>
                </Popconfirm>
                {/* <Button icon="download">下载模板</Button>
                <div style={{ display: "inline-block", marginRight: 8 }}>
                    <Upload {...uploadProps}>
                        <Button>
                            <Icon type="upload" />上传Excel文件
                        </Button>
                    </Upload>
                </div> */}
            </div>
        )
     
        return (
        <Card title={directDetail.source!='prevOrg'?<TableOpterta />:null}  extra={<Search placeholder="搜索供应商" onSearch={value => {this.searchSuplist(value)}} enterButton />} >
                {
                    toggleStore.toggles.get(SHOW_CHOOSESUPPLIER_MODEL) && <ChooseDirSup selectedSupplier={this.selectedSupplier.bind(this)}  />
                }
                 {
                    toggleStore.toggles.get(SHOW_ChooseSupplierPub_MODEL) && <ChooseDirSupByAuthoried selectedSupplier={this.selectedSupplier.bind(this)}  />
                }
                
                {/* <SupInfoManager /> */}
                <Table size='middle' loading={loading}  bordered={true} rowKey={(text) => text.rel_id} rowSelection={rowSelection} scroll={{ x: 850 }} columns={columns} pagination={{ onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: false, total: supplierList.recordsTotal, pageSize: 10 }} dataSource={supplierList.list} />
            </Card>
        )
    }
}

SupsInDirInfo.propTypes = {
}
export default SupsInDirInfo;