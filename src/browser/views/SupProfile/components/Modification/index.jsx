import React, { Component } from 'react'; 
import { observer, inject, } from 'mobx-react';
import { Modal, Form, Row, Col, Input,  Button , Table} from 'antd';
import { SHOW_Modification_MODEL} from "../../../../constants/toggleTypes"
import { supplierAction, supBlackList, supplierTrain } from "../../../../actions"
import ChooseTBSupplier from '../../../../components/ChooseTBSupplier'
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { TextArea } = Input;

@inject('toggleStore', 'supplierStore')
@observer
class Modification extends React.Component {
    state={
        ModificationData:[]
    }
    
    handleSubmit=()=>{
        let {toggleStore} = this.props
        toggleStore.setToggle(SHOW_Modification_MODEL)
    }
    componentDidMount=()=>{
        // console.log(this)

    }
    render() {
        let {ModificationData} = this.state
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const modificationcolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '修改时间',
                dataIndex: 'name',
                width: 300,
                align: "center",
                render:(text,redord)=>{
                    // console.log(moment(redord.startdata).format('l'))
                    return (
                        <span>
                            自
                            {/* {moment(redord.startdata).format('LL')}
                            至
                            {moment(redord.enddata).format('LL')} */}
                        </span>
                    )
                    
                }
            },
            {
                title: '修改内容',
                dataIndex: 'type',
                width: 540,
                align: "center",
            },
    
        ]
       let {getFieldDecorator}=this.props.form
       const { toggleStore }=this.props
        return (
            <div>
                <Modal
                    title={<b>查看修改记录</b>}
                    width={960}
                    visible= {true}
                    onOk = {this.handleSubmit}
                    onCancel = {this.handleSubmit}
                >
                     <Table rowKey={(text, key) => key.id} scroll={{ x: 900 }} columns={modificationcolumns} dataSource={ModificationData}/>
                </Modal>
            </div>
        )
    }
}

export default Form.create({ name: 'modification' })(Modification);