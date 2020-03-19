import {
    observable,
    action
} from 'mobx';
class ContractStore {
    @observable gyscode;
 
    constructor() {
        this.gyscode = null;
    }
    @action setGyscode(data) {
        this.gyscode = data;
    }
    @action getGyscode() {
       return this.gyscode 
    }
}
const contractStore = new ContractStore();

export default contractStore;