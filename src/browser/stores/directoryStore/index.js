import {
    observable,
    action
} from 'mobx';

class DirectoryStore {

    @observable editSupplierInfo;
    @observable editSupplierProductInfo;
    @observable isClassEditor;
    @observable isNewClass;
    @observable isNewRootClass;
    @observable iseditor;
    @observable iseditorproduct;
    @observable isNewDirect;
    @observable treeData;


    constructor(type) {
        this.editSupplierInfo = {};
        this.editSupplierProductInfo = {};
        this.iseditor = false;
        this.isClassEditor = false
        this.isNewClass = false
        this.isNewDirect = false
        this.isNewRootClass= false
        this.treeData = []

    }

    @action setEditSupplierInfo = (info) => {
        this.editSupplierInfo = info;
    }
    @action setEditSupplierProductInfo = (info) => {
        
        this.editSupplierProductInfo = info;
    }
    @action setTreeData = (list) => {
        this.treeData = list;
    }
}

const directoryStore = new DirectoryStore();

export default directoryStore;