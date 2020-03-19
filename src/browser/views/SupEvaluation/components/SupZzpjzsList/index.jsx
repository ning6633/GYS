import React, { Component } from 'react';
import { number, bool, string, array, object } from 'prop-types';
import { Card, Button, Table, Upload, Input, Tooltip, message, Select } from 'antd';
import { observer, inject, } from 'mobx-react';
import moment from "moment";
import _ from "lodash";
import { SHOW_NewPJZS_MODEL,SHOW_ShowPJZS_MODEL } from "../../../../constants/toggleTypes";
import { supplierAction ,supplierEvalution } from "../../../../actions"
import NewPJZS from "../NewPJZS"
import ShowPJZS from '../ShowPJZS'

import "./index.less";
const { Search } = Input;

@inject('toggleStore', 'supplierStore')
@observer
//资质评价专家 管理
class SupZzpjzjList extends Component {
    state = {
        PJZSList: {
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
   async submitFn(data){
       const { toggleStore } = this.props
    let date = data.time.format('YYYY-MM-DD')
    let arr = []
    data['totime'] = date
    arr.push(data)
    let result  = await supplierEvalution.newZzpjCertificate(arr)
    if(result.code==200){
        toggleStore.setToggle(SHOW_NewPJZS_MODEL)
        this.loaddata()
    }
   
    }
   //删除资质证书
   async deleteZzpjCertificate(){
       const { selectedRowKeys} =this.state
       let result  = await supplierEvalution.deleteZzpjCertificate(selectedRowKeys)
      if(result.code==200){
        this.loaddata()
       }
   }
    async submitSupplierInfo(redord) {
        const { toggleStore, supplierStore } = this.props;
        if (redord.is_diff != 0) {
            toggleStore.setToggle(SHOW_SupInfoManager_MODEL)
        } else {
            let PJZSList = await supplierAction.submitSupplierInfo([redord.id]);
            message.success("提交成功")
            this.loaddata()
        }
    }
    async submitSupplierInfopl() {
        let PJZSList = await supplierAction.submitSupplierInfo(this.state.selectedRowKeys);
        message.success("提交成功")
        this.loaddata()
    }
    async deleteSupplierInfo() {
        let PJZSList = await supplierAction.deleteSupplierInfo(this.state.selectedRowKeys);
        if (PJZSList) {
            message.success("删除成功")
            this.loaddata()
        }
    }
   async editorSupplierInfo(redord) {
        const { toggleStore} = this.props;
        // if (islookdetail) {
        //     // 查看详情
        //     supplierStore.setEditSupplierInfo(redord)
        //     supplierStore.iseditor = true;
        //     supplierStore.islookdetail = true;
        //     toggleStore.setToggle(SHOW_LOGIN_MODEL)
        // } else {
        //     supplierStore.islookdetail = false;
        //     if (redord.status == !20) {
        //         supplierStore.setEditSupplierInfo(redord)
        //         supplierStore.iseditor = true;
        //         toggleStore.setToggle(SHOW_LOGIN_MODEL)
        //     } else {
        //         message.error("已提交供应商记录，无法编辑")
        //     }
        // }
        
        let result = await supplierEvalution.getZzpjCertificateDetail(redord.certificateid)
        console.log(result)
        if(result.code==200){
            this.setState({
                detail:result.data
            })
        toggleStore.setToggle(SHOW_ShowPJZS_MODEL)

        }
    }
    editFn(data){
    }
    async loaddata(pageNum = 1, rowNum = 15) {
        this.setState({ loading: true });
        let PJZSList = await supplierEvalution.getZzpjCertificate(pageNum, rowNum);
        this.setState({
            PJZSList: PJZSList.data,
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
        const { loading, selectedRowKeys,detail } = this.state;
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
                title: '证书名称',
                dataIndex: 'certificatename',
                width: 200,
                align: "center",
              //  render: (text, redord) => <Tooltip title={text}><span onClick={() => { this.editorSupplierInfo(redord, redord.status == 20) }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '证书类型',
                dataIndex: 'type',
                width: 120,
                align: "center",
                //render: (text) => text == 20 ? '已提交' : '未提交'
            },
            {
                title: '有效期限',
                dataIndex: 'totime',
                width: 130,
                align: "center",
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                width: 130,
                align: "center",
            },
            {
                title: '附件',
                dataIndex: 'file',
                width: 130,
                align: "center",
                render: (text, redord) =>redord.fileid && <span onClick={() => { window.open(`${supplierEvalution.FileBaseURL}${redord.fileid}`) }} style={{ cursor: "pointer", 'color': '#3383da' }}>查看附件</span>
            },
            // {
            //     title: '操作',
            //     dataIndex: 'modify',
            //     align: "center",
            //     width: 200,
            //     // render: (text, redord) => {
            //     //     return (<div><Button disabled={redord.status == 20} onClick={() => { this.editorSupplierInfo(redord) }} style={{ marginRight: 5 }} type="primary" size={'small'}>编辑</Button></div>)
            //     // }
            // },
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
                        that.loaddata();
                    }, 3000);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };
        let TableOpterta = () => (
            <div className="table-operations">
                <Button icon="edit" type="primary" onClick={() => { toggleStore.setToggle(SHOW_NewPJZS_MODEL); }}>新建</Button>
                <Button type="danger" disabled={!hasSelected} onClick={() => { this.deleteZzpjCertificate() }} >删除</Button>
            </div>
        )
        let TableFilterBtn = () => (
            <div className="table-fileter">
                {/* <Search placeholder="搜索证书名称" onSearch={value => console.log(value)} enterButton /> */}
            </div>
        )
        return (
            <Card title={<TableOpterta />} extra={<TableFilterBtn />}>
                {
                    toggleStore.toggles.get(SHOW_NewPJZS_MODEL) && <NewPJZS  submitFn={this.submitFn.bind(this)} />
                }
                 {
                    toggleStore.toggles.get(SHOW_ShowPJZS_MODEL) && <ShowPJZS detail={detail}  editFn={this.editFn.bind(this)} />
                }
                <Table size='middle' loading={loading} rowClassName={(text) => text.is_diff == 1 ? 'is_diff' : text.is_new == 1 ? 'is_new' : ''} bordered={true} rowKey={(text) => text.certificateid} rowSelection={rowSelection} columns={columns} pagination={{ showTotal:()=>`共${this.state.PJZSList.recordsTotal}条`, onChange: (page, num) => { this.pageChange(page, num) }, showQuickJumper: true, total: this.state.PJZSList.recordsTotal, pageSize: 15 }} dataSource={this.state.PJZSList.listZzpjCertificateVO} />
            </Card>
        )
    }
}

SupZzpjzjList.propTypes = {
}
export default SupZzpjzjList;