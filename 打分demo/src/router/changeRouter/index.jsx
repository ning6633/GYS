import React, { Component } from 'react'
import { List} from 'antd'
import { withRouter } from 'react-router-dom'


class ChangeRouter extends Component {

    
    state = {
        router: [],
        defaultValue: this.props.config[localStorage.getItem("saverouter")]
    }
    componentDidMount() {
        let router = []
        for (let key in this.props.config) {
            router.push({
                link: key,
                name: this.props.config[key]
            })
        }
        this.setState({
            router
        })
    }

    render() {
        return (
            <List
            size="small"
            bordered={false}
            dataSource={this.state.router}
            renderItem={item => {
                return <List.Item onClick={()=>{
                    localStorage.setItem("saverouter", item.link)
                    this.props.history.replace(item.link)
                    this.props.onClose()
                }}>{item.name}</List.Item>
            }}
          />
        )
    }
}

export default withRouter(ChangeRouter)