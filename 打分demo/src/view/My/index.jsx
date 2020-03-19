import React , {Component} from 'react'
import './index.less'
import ShowCard from '../../components/ShowCard/index'


class My extends Component {

    state={
        info:[
            {
                title:'test1',
                path:'/fe/test1',
                container:'测试1'
            },
            {
                title:'test2',
                path:'/fe/test2',
                container:'测试2'
            }
        ]
    }
    render(){
        let {info} = this.state
        return (
            <div className="out_style my_div"> 
                   {info.map((item,index)=>{
                       return <ShowCard info={item} key={index}/>
                   })}
            </div>
        )
    }
}

export default My