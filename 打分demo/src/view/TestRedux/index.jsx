import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { } from '../../store/actionType'
import CONSTTOGGLE from '../../store/actionType'
import ActionCreator from '../../store/actionCreator'
import { Button } from 'antd'

class TestRedux extends Component {


    render() {
        let { num, numAdd, toggles, changNum, changNumAdd, changNumDelete, setToggle } = this.props
        let {SETYOGGLE} = CONSTTOGGLE
        return (
            <Fragment>
                测试
                {num}
                <br />
                <Button onClick={() => {
                    changNum(1222222222222)
                }}>点击改变</Button>

                <br />
                {numAdd}
                <br />
                <Button onClick={() => {
                    changNumAdd()
                }}>点击添加</Button>
                <Button onClick={() => {
                    changNumDelete()
                }}>点击添加</Button>
                <br />
                {toggles}
                <Button onClick={() => {
                    setToggle(SETYOGGLE)
                }}>点击改变</Button>
            </Fragment>
        )
    }
}
let mapStateToProps = (state) => {
    return state
}
let mapDispatchToProps = (dispatch) => {
    return bindActionCreators(ActionCreator, dispatch)
}

export default connect(mapStateToProps, dispatch=>bindActionCreators(ActionCreator, dispatch))(TestRedux)