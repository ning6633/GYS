import React , {Component} from 'react'
import './index.less'
import { withRouter } from 'react-router-dom'


class TestOne extends Component {


    render(){
        let {info} = this.props
        return (
        <div className="my_inner_div" onClick={()=>{
            this.props.history.push(info.path)
        }}>
            <h5>{info.title}</h5>
        <p>{info.container}</p>
        </div>
        )
    }
}

export default withRouter(TestOne)