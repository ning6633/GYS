import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { observer, inject, } from 'mobx-react';
import { SHOW_Flow_MODEL } from "../../../../constants/toggleTypes"
import { supplierApproval } from "../../../../actions"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性

@inject('toggleStore')
@observer
class ApprovalFlowModel extends React.Component {
    state = {
        realUrl: "",
        title:""
    };
    handleOk = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_Flow_MODEL)
    };
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_Flow_MODEL)
    };
    // //修改链接和title
    // editUrl(){
    //     const { flowURL } = this.props;
    //     console.log(this.props)
    //     const { userId} =supplierApproval.pageInfo
    //     console.log(flowURL)
    //     if( flowURL.status!=0 ){
    //         this.setState({
    //             realUrl :supplierApproval.checkInfolUrl+`&objId=`+flowURL.id+`&processInstanceId=`+flowURL.processInstId+`&userId=${userId}`+`&status=`+flowURL.status+`&processReceiveId=`+flowURL.process_received,
    //             title:"基本信息详情查看"
    //         })
    //         // console.log()
    //     }else{
    //         this.setState({
    //             realUrl :supplierApproval.checkInfolUrl+`&objId=`+flowURL.id+`&userId=${userId}`,
    //             title:"基本信息详情编辑"
    //         })
    //     }
    // }
    // componentWillMount() {
    //     this.editUrl()
        
    // }
    
    render() {
        const { toggleStore, flowURL } = this.props;
        const { userId} =supplierApproval.pageInfo
        console.log(flowURL)
        // let realUrl = 
        let title = flowURL.status !=0 ?"基本信息详情查看":"基本信息详情编辑"
        let realUrl = flowURL.status !=0 
        ?supplierApproval.checkInfolUrl+`&objId=`+flowURL.id+`&processInstanceId=`+flowURL.processInstId+`&userId=${userId}`+`&status=`+flowURL.status+`&processReceiveId=`+flowURL.process_received
        :supplierApproval.editInfoUrl+`&objId=`+flowURL.id+`&userId=${userId}`
        return (
            <div>
                <Modal
                    title={title}
                    visible={toggleStore.toggles.get(SHOW_Flow_MODEL)}
                    footer={null}
                    width={1000}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <div style={{ width: 800, height: 600 }}>
                        <iframe style={{ width: 950, height: "100%" }} src={realUrl} frameBorder="none"></iframe>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default ApprovalFlowModel;