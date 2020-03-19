import React, { Component } from 'react'
import { Form, Radio, Tooltip } from 'antd'
import './index.less'


class RadioTable extends Component {
    state = {
        options: [
            {
                key: -2,
                value: -2,
                name: "很不满意"
            },
            {
                key: -1,
                value: -1,
                name: "不满意"
            },
            {
                key: 0,
                value: 0,
                name: "一般"
            },
            {
                key: 1,
                value: 1,
                name: "满意"
            },
            {
                key: 2,
                value: 2,
                name: "很满意"
            },
        ]
    }
    onChange = (element, value) => {
        console.log(element, value.target.value)
    }
    render() {
        const {getFieldDecorator} = this.props
        let { options } = this.state
        let { info } = this.props
        const radioStyle = {
            display: 'inline',
            height: '30px',
            lineHeight: '30px',
        };
        return (
            <div className="test_out">
                <div className="test_table">
                    <div className="test_div">
                        {options.map((item) => {
                            return (
                                <p className="test_div_p" key={item.key}>{item.name}</p>
                            )
                        })}
                    </div>
                    {
                        info.options.map((element, index) => {
                            return (
                                <Form.Item
                                    key={index}
                                >
                                    {getFieldDecorator(`${element.key}`, {
                                        rules: [{ required: true, message: `请对${element.title}打分` }],
                                    })(
                                        <div className="Radio_group_div" name={element}>
                                        <i className="test_i">{element.title}</i>
                                        <Radio.Group className="Radio_group"  >
                                            {options.map((item) => {
                                                return (
                                                    // <Tooltip key={item.key} title={item.name}>
                                                    <Radio key={item.key} style={radioStyle} value={item.value}></Radio>
                                                    // </Tooltip>
                                                )
                                            })}
                                        </Radio.Group>
                                    </div>
                                    )}
                                    
                                </Form.Item>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}

export default RadioTable