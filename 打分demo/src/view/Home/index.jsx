import React , {Component} from 'react'
import {Button } from 'antd'
// import { EditOutlined } from '@ant-design/icons';
import './index.less'



class Home extends Component {


    render(){
        return (
            <div className="home_style">
               <div>
               <h1 >欢迎来到问卷调查</h1>
                <Button type="primary"  onClick={()=>{
                    console.log(this)
                    this.props.history.push('/fe/my')
                }}>
                    开始
                </Button>
               </div>
            </div>
        )
    }
}

export default Home