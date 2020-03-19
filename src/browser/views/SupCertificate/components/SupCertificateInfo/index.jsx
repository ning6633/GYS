import React, { Component } from 'react';
import { observer, inject, } from 'mobx-react';
import { toJS } from "mobx"
import { Modal, Form, Row, Col, Table, Button, Card, Select, message, Tooltip, Descriptions } from 'antd';
import { SHOW_SupCertificateInfo_MODEL, SHOW_SupCertificatedetail_MODEL } from "../../../../constants/toggleTypes"
import { supplierApproval, supplierVerify } from "../../../../actions"
import SupCertificatedetail from "../SupCertificatedetail";
import _ from "lodash";
import "./index.less"
// 任何地方使用 toggleStore 触发登录框显示隐藏 - 简化代码复杂性
const { Option } = Select;

@inject('toggleStore', 'verifyStore')
@observer
class SupCertificateInfo extends React.Component {
    state = {
        productid: "",
        supplierId: "",
        supDetail: {},
        curCerName: "", // dang钱的资质名称
        verifyEditProduct: {},
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
        toggleStore.setToggle(SHOW_SupCertificateInfo_MODEL)
    };
    handleSubmit = e => {
        e.preventDefault();
        const { toggleStore, refreshData } = this.props;
        toggleStore.setToggle(SHOW_SupCertificateInfo_MODEL)
       
    };
  //下载附件
  async download(record){
    let downlaodUrl = supplierVerify.FileBaseURL+record.fileId
    window.open(downlaodUrl)
}
    async componentDidMount() {
        let { cerInfo } = this.props;
        let { id } = cerInfo
        let retSupDetail = await supplierApproval.getSupplierDetail(id);
        let retCerDetail = await supplierApproval.getSupplierCredentialDetail(id);
        console.log(retSupDetail)
        this.setState({
            supplierId: id,
            supDetail: retSupDetail,
            supplierCertificatelist: retCerDetail
        })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        const { getFieldDecorator } = this.props.form;
        const { supDetail, supplierCertificatelist, supplierId, curCerName ,flag} = this.state;
        const { toggleStore, } = this.props;
        
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 60,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '资质名称',
                dataIndex: 'qualificationName',
                align: "center",
                render: (text,record) => <Tooltip title={text}><span style={{ cursor: "pointer", 'color': '#3383da' }} onClick={() => { this.setState({ curCerName: text,flag: record.flag}); toggleStore.setToggle(SHOW_SupCertificatedetail_MODEL) }}>{text && text.substr(0, 10)}</span></Tooltip>
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
                dataIndex: 'code',
                align: "center",
            },
            {
                title: '有效期',
                width: 300,
                dataIndex: 'validityTime',
                align: "center",
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
                dataIndex: 'fileId',
                align: "center",
                render: (text, redord, key) => {
                    return (<div><Button size="small" onClick={() => { this.download(redord, key) }} style={{ marginRight: 5 }} type="primary" size={'small'}>下载</Button> </div>)
                }
            },
        ];
        const mockData =
        {
            another_name: "神软",
            code: "230102100024839AE",
            district_key: "北京",
            name: "北京神舟软件技术有限公司",
            name_other: "神软",
            property_key: "软件",
            // 自定义
            binghao: "123456",
            gyslb: "供应商类别",
            xxdz: "软件",
            txrzfw: "ISO",
            zuoji: "0571-56384592",
            frdb: "李红英",
            cplb: "产品类别",
            cpfw: "电阻电容",
            cpzycd: "核心2类",
            ptly: "运载",
            cpmc: ["产品1", "产品2"],
        }
        const lableKey =
        {
            name: "供应商名称",
            shortOfName: "简称",
            anotherName: "别称",
            code: "统一社会信用代码",
            registeredAddr: "注册地",
            property: "企业性质",
            // 自定义
            number: "供应商编号",
            address: "详细地址",
            qulitySystem: "体系认证范围",
            phoneNum: "座机",
            legalPerson: "法人代表",
            productCategory: "产品类别",
            productScope: "产品范围",
            importance: "产品重要程度",
            modelArea: "配套领域",
            // cpmc: "产品",
        }
        return (
            <div>
                {
                    toggleStore.toggles.get(SHOW_SupCertificateInfo_MODEL) && <Modal
                        title={`供应商资质信息`}
                        visible={toggleStore.toggles.get(SHOW_SupCertificateInfo_MODEL)}
                        width={960}
                        centered
                        okText="确认"
                        cancelText="取消"
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                    >
                        <Descriptions column={2} bordered title="供应商信息" size={'small'}>
                            {
                                Object.keys(lableKey).map((key, index) => {
                                    return (
                                        <Descriptions.Item key={index} label={lableKey[key]}>{_.isArray(supDetail[key]) ? supDetail[key].join(',') : supDetail[key]}</Descriptions.Item>
                                    )
                                })
                            }
                        </Descriptions>

                        <Card title={"资质证书"} bordered={false}>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Table scroll={{ x: 1000 }} rowKey={(text, key) => key} pagination={false} columns={columns} dataSource={supplierCertificatelist} />
                                </Col>
                            </Row>
                        </Card>
                    </Modal>
                }
                {
                    toggleStore.toggles.get(SHOW_SupCertificatedetail_MODEL) && <SupCertificatedetail curCerName={curCerName} flag={flag} supplierId={supplierId} supplierCertificatelist={[]} />
                }
            </div>
        );
    }
}

export default Form.create({ name: 'SupCertificateInfo' })(SupCertificateInfo);