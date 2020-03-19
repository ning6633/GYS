import {
    observable,
    action
} from 'mobx';

class EvaluationStore {
    @observable productComboBox;
 
    constructor() {
        this.productComboBox = null;
    }
    @action setproductComboBox(data) {
        this.productComboBox = data;
    }
    @action getproductComboBox() {
       return this.productComboBox 
    }


}
const evaluationStore = new EvaluationStore();

export default evaluationStore;