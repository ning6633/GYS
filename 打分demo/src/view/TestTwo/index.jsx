import React, { Component, Fragment } from 'react'
import { Button } from 'antd'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ActionType from '../../store/actionType'
import ActionCreator from '../../store/actionCreator'
import Show from '../Show/index'

const { SHOW_MODAL } = ActionType
class TestTwo extends Component {

    showModal = () => {
        let { settoggle } = this.props
        settoggle(SHOW_MODAL)
        this.setState({})
    }
    render() {
        let { gettoggle } = this.props
        return (
            <Fragment>
                <Button type="primary" onClick={() => { this.showModal() }}>显示隐藏</Button>
                <br />
                {gettoggle(SHOW_MODAL) && <Show></Show>}
            </Fragment>
        )
    }
}
export default connect(state => state, dispatch => bindActionCreators(ActionCreator, dispatch))(TestTwo)