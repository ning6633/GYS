let _map = new Map()

export default {
    num:0,
    numAdd:0,
    toggles:false,
    settoggle:(type)=>{
        _map.get(type) === undefined ? _map.set(type,true) : _map.set(type,!_map.get(type))
        
    },
    gettoggle:(type)=>{
        return _map.get(type)

    }
}