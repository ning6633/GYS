import ActionType from './actionType'

let {CHANGE_NUM,CHANGE_NUM_ADD,CHANGE_NUM_DELETE,SETYOGGLE} = ActionType
export default {
    changNum(data){
        let action = {
            type:CHANGE_NUM,
            parmas:data
        }
        return action
    },
    changNumAdd(data){
        let action = {
            type:CHANGE_NUM_ADD,
            parmas:data
        }
        return action
    },
    changNumDelete(data){
        let action = {
            type:CHANGE_NUM_DELETE,
            parmas:data
        }
        return action
    },
    setToggle(data){
        let action = {
            type:SETYOGGLE,
            parmas:data
        }
        return action
    }
}