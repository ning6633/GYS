import React from 'react';
import { Modal, Form, Table, Button, Input, AutoComplete, Row, Col , Icon } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import Axios from 'axios'
import ChoosePlan from '../ChoosePlan/index'
import ActionType from '../../../../store/actionType'


const { Option } = AutoComplete;
const {ADD_INFO} = ActionType
class AddInfo extends React.Component {
    state = {
        attachedFiles: [],
        dataSource: [],
        dataSourceAll: [],
        selectData: '',
        kecheng: [],
        zhuanjia: [],
        gys:[],
        showPlan:false
    }
    onFinish = () => {
        console.log(this.props.form)
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
            }
        })
    }
    onCancel = () => {
        let { changeModal } = this.props
        changeModal()
    }
    // changeMdal
    changeModal=()=>{
        this.setState({
            showPlan:false
        })
    }

    // 获取培训计划
    onChoosePlan=(data)=>{
        console.log(data)
        this.newTrainPlanById(data.id)
        this.newTrainPlanTraincourse(data.id)
        this.newTrainPlanGysBases(data.id)
    }

    // 根据计划ID获取详情
    async newTrainPlanById(id) {
        let { setFieldsValue } = this.props.form
        await Axios.get(`http://10.0.32.106:8179/gys/1.0/newTrainPlanById?id=${id}`)
            .then(res => {
                if (res.status == 200 && res.data.code == 200) {
                    let {
                        trainplottypeName,
                        name,
                        type,
                        trainplottype,
                        zt,
                        pxdx,
                        pxmd,
                        pxnrfs
                    } = res.data.data
                    setFieldsValue({
                        trainplottypeName,
                        name,
                        type,
                        trainplottype,
                        zt,
                        pxdx,
                        pxmd,
                        pxnrfs
                    })
                }
            })
    }

    // 根据计划ID获取供应商
    async newTrainPlanGysBases(id) {
        let { setFieldsValue } = this.props.form
        await Axios.get(`http://10.0.32.106:8179/gys/1.0/newTrainPlanGysBases?newtrainplanid=${id}`)
            .then(res => {
                if (res.status == 200 && res.data.code == 200) {
                    this.setState({
                        gys:res.data.data
                    })
                }
            })
    }

    // 根据计划ID获取培训课程
    async newTrainPlanTraincourse(id) {
        let { setFieldsValue } = this.props.form
        await Axios.get(`http://10.0.32.106:8179/gys/1.0/newTrainPlanTraincourse?newtrainplanID=${id}`)
            .then(res => {
                if (res.status == 200 && res.data.code == 200) {
                    let _arr = []
                    let _flag = 0
                    res.data.data.forEach((item, index) => {
                        item.coursetospecia.forEach((element) => {
                            element.flag = _flag
                            _arr.push(element)
                            _flag++
                        })
                    })
                    this.setState({
                        kecheng: res.data.data,
                        zhuanjia: _arr
                    })
                }
            })
    }
    render() {
        let {  dataSourceAll, kecheng, zhuanjia ,showPlan,gys} = this.state
        const { getFieldDecorator } = this.props.form
        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        // const children = dataSourceAll.map((item, index) => <Option key={item.id}>{item.name}</Option>);
        const Footer = () => {
            return (
                <div>
                    <Button type="primary" onClick={() => { this.onCancel() }}>取消</Button>
                    <Button type="primary" onClick={() => { this.onFinish() }}>发布</Button>
                </div>
            )
        }
        // 供应商列表
        const gyscolunms = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '供应商名称',
                dataIndex: 'name',
                width: 200,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '社会统一信用代码',
                dataIndex: 'code',
                width: 200,
                align: "center",
                render: (text, index, key) => key + 1
            },
        ]

        // 课程列表
        const kechengcolumns = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '培训计划名称',
                dataIndex: 'name',
                width: 150,
                align: "center",
            },
            {
                title: '课程描述',
                dataIndex: 'descri',
                width: 200,
                align: "center",
            },
            {
                title: '专家姓名',
                dataIndex: 'coursetospecia',
                width: 200,
                align: "center",
                render: (text, record) => {
                    return (
                        text && text.map((item, index) => {
                            return (
                                <span key={index}>{item.name}   </span>
                            )
                        })
                    )
                }
            },
        ]

        // 专家列表
        const zhuanjiacolunms = [
            {
                title: '序号',
                dataIndex: 'key',
                width: 45,
                align: "center",
                render: (text, index, key) => key + 1
            },
            {
                title: '专家姓名',
                dataIndex: 'name',
                width: 150,
                align: "center",
            },
            {
                title: '所属领域',
                dataIndex: 'field',
                width: 200,
                align: "center",
            },
            {
                title: '所属单位',
                dataIndex: 'source',
                width: 200,
                align: "center",
            },
        ]
        return (
            <Modal
                title="新建打分"
                visible={true}
                width={1000}
                okText="确认"
                cancelText="取消"
                footer={<Footer />}
                onCancel={this.onCancel}
            >
                <Scrollbars
                    autoHeight
                    autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200}
                    style={{ width: '100%' }}
                    autoHeightMin={300}
                    autoHeightMax={700}
                >
                    <Form
                        {...layout}
                        onSubmit={this.onFinish}
                    >
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item {...layout} label={'培训计划'}>
                                    {getFieldDecorator(`trainplottypeName`, {
                                        rules: [
                                            {
                                                required: true,
                                                message: '培训计划'
                                            },
                                        ],
                                    })(<Input 
                                    placeholder='培训计划' 
                                    disabled 
                                    addonAfter={ <Icon style={{ cursor: 'pointer' }} onClick={()=>{
                                        this.setState({
                                            showPlan:true
                                        })
                                    }} type="plus" />} 
                                    />)}


                                    {/* <AutoComplete
                                        // dataSource={dataSource}
                                        onSelect={(e) => { this.onSelect(e) }}
                                        onSearch={(e) => { this.onSearch(e) }}
                                        placeholder="搜索计划"
                                    >
                                        {children}
                                    </AutoComplete> */}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item {...layout} label={'名称'}>
                                    {getFieldDecorator(`name`, {
                                        rules: [
                                            {
                                                required: false,
                                                message: '名称'
                                            },
                                        ],
                                    })(<Input disabled={true} />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item {...layout} label={'培训分类'}>
                                    {getFieldDecorator(`type`, {
                                        rules: [
                                            {
                                                required: false,
                                                message: '培训分类'
                                            },
                                        ],
                                    })(<Input disabled={true} />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item {...layout} label={'类型'}>
                                    {getFieldDecorator(`trainplottype`, {
                                        rules: [
                                            {
                                                required: false,
                                                message: '类型'
                                            },
                                        ],
                                    })(<Input disabled={true} />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item {...layout} label={'培训主题'}>
                                    {getFieldDecorator(`zt`, {
                                        rules: [
                                            {
                                                required: false,
                                                message: '培训主题'
                                            },
                                        ],
                                    })(<Input disabled={true} />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item {...layout} label={'培训对象'}>
                                    {getFieldDecorator(`pxdx`, {
                                        rules: [
                                            {
                                                required: false,
                                                message: '培训对象'
                                            },
                                        ],
                                    })(<Input disabled={true} />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item {...layout} label={'培训目的'}>
                                    {getFieldDecorator(`pxmd`, {
                                        rules: [
                                            {
                                                required: false,
                                                message: '培训目的'
                                            },
                                        ],
                                    })(<Input disabled={true} />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item {...layout} label={'培训内容和方式'}>
                                    {getFieldDecorator(`pxnrfs`, {
                                        rules: [
                                            {
                                                required: false,
                                                message: '培训内容和方式'
                                            },
                                        ],
                                    })(<Input disabled={true} />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <b>培训课程</b>
                            <Table
                                size='small'
                                // loading={loading}
                                bordered={true}
                                rowKey={(text) => text.id}
                                columns={kechengcolumns}
                                dataSource={kecheng}
                            ></Table>
                        </Row>
                        <Row>
                            <b>培训专家</b>
                            <Table
                                // loading={loading}
                                bordered={true}
                                rowKey={(text) => text.flag}
                                columns={zhuanjiacolunms}
                                size="small"
                                dataSource={zhuanjia}
                            ></Table>
                        </Row>
                        <Row>
                            <b>参加供应商</b>
                            <Table
                                // loading={loading}
                                bordered={true}
                                rowKey={(text) => text.id}
                                columns={gyscolunms}
                                size="small"
                                dataSource={gys}
                            ></Table>
                        </Row>
                    </Form>
                </Scrollbars>
                <ChoosePlan showModal = {showPlan} changeModal={this.changeModal} onChoosePlan={this.onChoosePlan}/>
            </Modal>
        );
    }
}

export default Form.create({ name: 'AddInfo' })(AddInfo)