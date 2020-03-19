import { observable, action } from 'mobx';

class ToggleStore {

  @observable toggles;
  @observable modelOptions;
  constructor(type) {
    this.modelOptions = null;
    this.toggles = observable.map({});
    if(type){
      this.toggles.set(type, !this.toggles.get(type));
    }
    
  }

  @action setToggle = (type) => {
    this.toggles.set(type, !this.toggles.get(type));
  }
  @action setModelOptions(data){
    this.modelOptions = data
 }

 @action getModelOptions(){
     return this.modelOptions
 }
}

const toggleStore = new ToggleStore();

export default toggleStore;
