import {
    observable,
    action
} from 'mobx';
class TrainStore {
    @observable oneInfo;
    @observable allInfo;
    constructor() {
        this.oneInfo = {}
        this.allInfo = {
            list: [],
            recordsTotal: 0
        }
        this.pageNum = 1
        this.selectedRowKeys = []
        this.coursename = ''
    }
    @action searchValue(data) {
        this.coursename = data
    }
    @action changePageNum(data) {
        this.pageNum = data
    }
    @action setOneInfo(data) {
        this.oneInfo = data;
    }
    @action setSelectedRowKeys(array) {
        this.selectedRowKeys = array;
    }
    @action getOneInfo() {
        return this.oneInfo;
    }
    @action setAllInfo(data) {
        this.allInfo = data;
    }
    @action getallInfo() {
        return this.oneInfo;
    }
}
const trainStore = new TrainStore();

export default trainStore;