import {
    observable,
    action
} from 'mobx';

class VerifyStore {
    @observable verifyEditProduct;
    constructor() {
        this.verifyEditProduct = {};
    }
    @action setverifyEditProduct(data) {
        this.verifyEditProduct = data;
    }
}
const verifyStore = new VerifyStore();

export default verifyStore;