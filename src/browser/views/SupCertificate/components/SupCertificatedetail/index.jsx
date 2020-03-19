import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { toJS } from "mobx"
import { Modal, Form, Row, Col, Table, Button, Card, Select, message, Tooltip, Divider, Descriptions } from 'antd';
import { SHOW_SupCertificatedetail_MODEL ,SHOW_SsDetail_MODEL} from "../../../../constants/toggleTypes"
import { supplierApproval, supplierVerify,supplierEvalution } from "../../../../actions"
import SsDetailModel from '../../../SupEvaluation/components/SsDetailModel'
import _ from "lodash";
import "./index.less"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Option } = Select;

@inject('toggleStore', 'verifyStore')
@observer
class SupCertificatedetail extends React.Component {
    state = {
        productid: "",
        supplierId: "",
        verifyEditProduct: {},
        retSupDetail:[],
        selectField: {
            "zycd": [

            ],
            "cpfl": [

            ],
            "ptfs": [

            ],
            "ptly": [

            ],
            "sfst": [

            ]
        }
    }
    handleCancel = e => {
        const { toggleStore } = this.props;
        toggleStore.setToggle(SHOW_SupCertificatedetail_MODEL)
    };
    async getSsInfo(record){
        const { toggleStore } = this.props;
       let result = await supplierEvalution.getZJSSDeatail(record.evaluationId)
       if(result.code==200){
            this.setState({
                detail:result.data
            })
            toggleStore.setToggle(SHOW_SsDetail_MODEL)
       }else{

       }
    }
    //下载附件
    async download(record){
        let downlaodUrl = supplierEvalution.FileBaseURL+record.fileId
        window.open(downlaodUrl)
    }
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore, refreshData } = this.props;
        toggleStore.setToggle(SHOW_SupCertificatedetail_MODEL)
    //     this.props.form.validateFields(async (err, values) => {
    //         values = this.handelValuesadddunhao(values, true);
    //         if (!err) {
    //             console.log(values);
    //             let gysProducts = values;
    //             let { productid, supplierId } = this.state;
    //             let ret = await supplierVerify.modifySupplierProductinfo(supplierId, productid, gysProducts);
    //             message.success("信息修改成功")
    //             refreshData();
    //             toggleStore.setToggle(SHOW_SupCertificatedetail_MODEL)
    //         }
    //     });
    };

    async componentDidMount() {
        const { curCerName, supplierId,flag } = this.props;
        let retSupDetail = await supplierApproval.getSupplierCerDetail(supplierId,curCerName,flag);
        if(retSupDetail){
            this.setState({
                retSupDetail
            })
        }
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const { getFieldDecorator } = this.props.form;
        const { toggleStore, supplierCertificatelist } = this.props;
        const { retSupDetail,detail} = this.state
        let supplierCertificatelistmock = [
            {
                name: "保密",
                is_sky: "XXXX",
                category: "XXXX",
                model_area: "123123",
                match_mode: "2019年8月至2020年10月",
                org_id: "航天科技集团",
                product_scope: "集团",
            }
        ]
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '资质名称',
                dataIndex: 'qualificationName',
                width: 120,
                align: "center",
            },
            {
                title: '资质类别',
                dataIndex: 'qualificationType',
                align: "center",
                render: (text) => <Tooltip title={text}><span>{text && text.substr(0, 8)}</span></Tooltip>
            },
            {
                title: '证书名称',
                dataIndex: 'certificationName',
                align: "center",
            },
            {
                title: '证书编号',
                dataIndex: 'model_area',
                align: "center",
            },
            {
                title: '有效期',
                width: 200,
                dataIndex: 'validityTime',
                align: "center",
            },
            {
                title: '实施记录',
                width: 150,
                dataIndex: 'evaluationName',
                align: "center",
                render: (text, record) => <Tooltip title={text}><span onClick={() => { this.getSsInfo(record);    }} style={{ cursor: "pointer", 'color': '#3383da' }}>{text && text.substr(0, 10)}</span></Tooltip>
            },
            {
                title: '认证机构',
                dataIndex: 'certificationBody',
                align: "center",
            },
            {
                title: '认证方级别',
                dataIndex: 'certificationBody_Level',
                align: "center",
            },
            {
                title: '附件',
                dataIndex: 'cz',
                align: "center",
                render: (text, record, key) => {
                    
                    return (<div>{record.fileId &&<Button size="small" onClick={() => { this.download(record, key) }} style={{ marginRight: 5 }} type="primary" size={'small'}>下载</Button> }</div>)
                }
            },
        ];
        const mockData =
        {
            another_name: "12312313",
            code: "2019年8月至2020年10月",
            district_key: "集团",
            name: "发动机软资质",
            name_other: "123123",
            property_key: "保密",
            // 自定义
            binghao: "保密",
        }
        const lableKey =
        {
            name: "资质名称",
            name_other: "资质类别",
            another_name: "资质证书编号",
            code: "有效期",
            district_key: "认证机构",
            property_key: "认证方级别",
            binghao: "引用标准",
        }
        const mockData2 =
        {
            district_key: "北京",
            name: "北京神舟软件技术有限公司",
            property_key: "软件",
            // 自定义
            binghao: "123456",
            xxdz: "通过",
            myd: 10,
        }
        const lableKey2 =
        {
            name: "供应商名称",
            binghao: "供应商编号",
            property_key: "评价时间",
            district_key: "评价地点",
            xxdz: "评价结果",
            myd: "评价满意",
        }
        return (
            <div>
                {
                    toggleStore.toggles.get(SHOW_SupCertificatedetail_MODEL) && <Modal
                        title={<b>资质详情</b>}
                        visible={toggleStore.toggles.get(SHOW_SupCertificatedetail_MODEL)}
                        width={1100}
                        style={{ top: '25vh'}}
                        okText="确认"
                        cancelText="取消"
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                        
                    >

                        <Card  bordered={false}>
                            <Row gutter={0}>

                                <Col span={24} >
                                    <Divider orientation="left">
                                        <small>证书</small>
                                    </Divider>
                                </Col>
                                <Col span={24} >
                                    <Table rowKey={(text, key) => key} pagination={false} columns={columns} dataSource={retSupDetail} />
                                </Col>
                            </Row>
                        </Card>
                     
                    </Modal>
                    
                }
                   {  
                    toggleStore.toggles.get(SHOW_SsDetail_MODEL)&&<SsDetailModel detail={detail} />

                }
            </div>
        );
    }
}

export default Form.create({ name: 'SupCertificatedetail' })(SupCertificatedetail);