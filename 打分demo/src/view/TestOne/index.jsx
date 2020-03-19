import React, { Component } from 'react'
import { Form, Button, Radio, Input, Icon } from 'antd'
import RadioTable from '../../components/RadioTable/index'
import './index.less'
import Axios from 'axios'


class TestOne extends Component {

    state = {
        // info:[]
        info: [
            {
                title: '本次培训组织的整体评价',
                key: "peixunpingjia",
                options: [
                    {
                        title: "培训组织的时间安排",
                        key: 'peixunpingjia_time'
                    },
                    {
                        title: "培训XXX活动安排",
                        key: 'peixunpingjia_XXX'
                    },
                    {
                        title: "培训YYY活动安排",
                        key: 'peixunpingjia_YYY'
                    },
                    {
                        title: "培训ZZZ活动安排",
                        key: 'peixunpingjia_ZZZ'
                    }
                ]
            },
            {
                title: '课程XX整体打分',
                key: "kechengdafen",
                options: [
                    {
                        title: "培训目标",
                        key: 'kechengdafen_time'
                    },
                    {
                        title: "培训内容与目的的吻合度",
                        key: 'pkechengdafen_XXX'
                    },
                    {
                        title: "课程时间安排的合理性",
                        key: 'kechengdafen_YYY'
                    },
                    {
                        title: "课程的实用性",
                        key: 'kechengdafen_ZZZ'
                    }
                ]
            },
            {
                title: '专家XXX整体打分',
                key: "zhuanjiadafen",
                options: [
                    {
                        title: "讲课的风格",
                        key: 'zhuanjiadafen_time'
                    },
                    {
                        title: "讲授的条理性",
                        key: 'zhuanjiadafen_XXX'
                    },
                    {
                        title: "讲师XX成分程度",
                        key: 'zhuanjiadafen_YYY'
                    },
                    {
                        title: "专家总分",
                        key: 'zhuanjiadafen_ZZZ'
                    }
                ]
            }
        ]
    }


    onFinish = () => {
        console.log(this.props.form)
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values)
            }
        })
    }
    
    componentDidMount=()=>{
        console.log(window.location)
        console.log(this)
    }
    render() {
        const { getFieldDecorator } = this.props.form
        let { info } = this.state
        const layout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
        };
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };
        return (
            <div className="test_info">
                <Form
                    {...layout}
                    onSubmit={this.onFinish}
                >

                    <Form.Item  label={'请输入姓名'}>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: '请输入姓名' }],
                        })(
                            <Input
                                size="small"
                                placeholder="请输入姓名"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item  label={'所属供应商'}>
                        {getFieldDecorator('gys', {
                            rules: [{ required: true, message: '所属供应商' }],
                        })(
                            <Input
                                size="small"
                                placeholder="所属供应商"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item  label={'联系方式'}>
                        {getFieldDecorator('tel', {
                            rules: [{ required: false, message: '联系方式' }],
                        })(
                            <Input
                                size="small"
                                placeholder="联系方式"
                            />,
                        )}
                    </Form.Item>
                    {
                        info.map((item, index) => {
                            return (
                                <Form.Item
                                    label={<b>{item.title}</b>}
                                    key={index}
                                >
                                    {getFieldDecorator('username', {
                                        rules: [{ required: true, message: '请输入用户名' }],
                                    })(
                                        <RadioTable info={item} getFieldDecorator={getFieldDecorator}/>
                                    )}
                                    
                                </Form.Item>
                            )
                        })
                    }







                    <div style={{ width: "100%", textAlign: "center", marginBottom: '30px' }}>
                        <Button type="primary" onClick={() => { this.onFinish() }}>
                            提交
                            </Button>
                    </div>
                </Form>
            </div >
        )
    }
}

export default Form.create({ name: 'TestOne' })(TestOne)