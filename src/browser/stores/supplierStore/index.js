import {
    observable,
    action
} from 'mobx';

class SupplierStore {

    @observable editSupplierInfo;
    @observable editSupplierBase; // 维护供应商信息
    @observable editSupplierProductInfo;
    @observable iseditor;
    @observable iseditorproduct;
    @observable isRKeditor;
    @observable islookdetail;
    @observable supFeedback;
    @observable islookFkdetail; // 看反馈详情
    @observable editSupplierArchivesInfo; // 查看档案详情
    chooseGysCompany
    constructor(type) {
        this.editSupplierInfo = {};
        this.editSupplierBase = {};
        this.supFeedback = {};
        this.supBZkuFeedback = {};
        this.editSupplierProductInfo = {};
        this.editSupplierArchivesInfo = {};
        this.islookdetail = false;
        this.islookFkdetail = false;
        this.islookRKdetail = false;
        this.isRKeditor = false;
    }

    @action setEditSupplierInfo = (info) => {
        this.editSupplierInfo = info;
    }
    @action setEditSupplierBase = (info) => {
        this.editSupplierBase = info;
    }
    @action setEditSupplierProductInfo = (info) => {
        this.editSupplierProductInfo = info;
    }
    @action setEditSuppliersupFeedback = (info) => {
        this.supFeedback = info;
    }
    @action setEditSupplierBZkuFeedback = (info) => {
        this.supBZkuFeedback = info;
    }
    @action setEditSupplierArchivesInfo = (info) => {
        this.editSupplierArchivesInfo = info;
    }
}

const supplierStore = new SupplierStore();

export default supplierStore;