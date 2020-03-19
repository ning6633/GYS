import React, { Component } from 'react'; 
import { observer, inject, } from 'mobx-react';
import { SHOW_AddBlackList_MODEL, SHOW_ModifyBlackList_MODEL } from "../../../../constants/toggleTypes"
import { Modal, Form, Row, Col, Input,  Button , Table} from 'antd';
import { SHOW_Punishment_MODEL} from "../../../../constants/toggleTypes"
import { toJS } from "mobx"
import { supplierAction, supBlackList, supArchives } from "../../../../actions"
import ChooseTBSupplier from '../../../../components/ChooseTBSupplier'
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { TextArea } = Input;

@inject('toggleStore', 'supplierStore')
@observer
class Punishment extends React.Component {
    state={
        list:[]
    }
    
    handleSubmit=()=>{
        let {toggleStore} = this.props
        toggleStore.setToggle(SHOW_Punishment_MODEL)
    }
    async computedList(){
        let tmp = []
        let { editSupplierArchivesInfo } = this.props.supplierStore
        let num = this.props.num 
        let res = await supArchives.getPunishmentsList(editSupplierArchivesInfo)
        if(res.code == 200){
             tmp = res.data.listGysEvaluateRecords
        }
        // let tmp = this.props.punishmentData.listGysEvaluateRecords
        let arr = [] 
        for(let i = 0;i<tmp.length;i++){
            if(tmp[i].type == num){
                arr.push(tmp[i])
            }
        }
        this.setState({list:arr})
    }
    componentDidMount=()=>{
        this.computedList()
    }
    render() {
        const PunList = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '供应商名称',
                dataIndex: 'gys_name',
                width: 200,
                align: "center",
            },
            {
                title: '创建时间',
                dataIndex: 'createdate',
                width: 200,
                align: "center",
            },
            {
                title: '创建人',
                dataIndex: 'createuser',
                width: 100,
                align: "center",
            },
            {
                title: '修改时间',
                dataIndex: 'updatedate',
                width: 200,
                align: "center",
            },
            {
                title: '修改人',
                dataIndex: 'updateuser',
                width: 100,
                align: "center",
            }
        ]
        let Choose = ()=>{
            let {num} = this.props
            switch(num){
                case 0 : return <b>突出贡献记录</b>
                    break;
                case 1 : return <b>通报记录</b>
                    break;
                case 2 : return <b>约谈记录</b>
                    break;
                case 3 : return <b>限期整改记录</b>
                    break;
                default: return null
                    break;
            }
        }
        let {list} = this.state
        return (
            <div>
                <Modal
                    title={<Choose />}
                    width={960}
                    visible= {true}
                    
                    footer={
                        <Button onClick={this.handleSubmit} type='primary'>关闭</Button>
                    }
                    onCancel = {this.handleSubmit}
                >
                     <Table 
                      rowKey={(text, key) => key}
                      scroll={{ x: 860 }}
                      bordered = {true}
                      columns = {PunList}
                      dataSource = {list}
                      pagination = {false}
                      />
                </Modal>
            </div>
        )
    }
}

export default Form.create({ name: 'punishment' })(Punishment);