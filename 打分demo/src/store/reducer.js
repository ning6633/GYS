import State from './state'



function DeepClone (obj) {
	if (obj === null || typeof obj !== 'object') return obj;
	var cpObj = obj instanceof Array ? [] : {};
	for (var key in obj) cpObj[key] = DeepClone(obj[key]);
	return cpObj;
}
export default (proState = State,action)=>{
    let {type,parmas} = action
    // let newData = JSON.parse(JSON.stringify(proState))
    let newData = DeepClone(proState)

    switch (type) {
        case 'CHANGE_NUM':
            newData.num = parmas
            
            break;
        case 'CHANGE_NUM_ADD':
            newData.numAdd ++
            
            break;
        case 'CHANGE_NUM_DELETE':
            newData.numAdd --
            
            break;
        case 'SETYOGGLE':
            newData.toggles= !newData.toggles
            console.log(newData.show(parmas))

            break;
    
        default:
            break;
    }

    return newData
}