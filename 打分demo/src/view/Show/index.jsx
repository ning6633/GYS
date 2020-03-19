import React , {Component,Fragment} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ActionType from '../../store/actionType'
import ActionCreator from '../../store/actionCreator'


class Show extends Component {


    render(){
        return (
            <Fragment>
                这里是show
            </Fragment>
        )
    }
}
export default connect(state => state,dispatch=>bindActionCreators(ActionCreator,dispatch))(Show)