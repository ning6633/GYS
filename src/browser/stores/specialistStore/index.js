import {
    observable,
    action
} from 'mobx';

class SpecialistStore {
    @observable specialistDetail;
    constructor() {
        this.specialistDetail = null;
    }
    @action setspecialistDetail(data) {
        this.specialistDetail = data;
    }
}
const specialistStore = new SpecialistStore();

export default specialistStore;