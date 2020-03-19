import ActionBase from "../actbase";
import axios from "axios";
class TodoListAction extends ActionBase {
    addtodoList() {
        setTimeout(() => {
            todoStore.addtodoList([1, 2, 3, 4, 5]);
        }, 5000);
    }
    addCount() {
        setTimeout(() => {
            todoStore.addCount()
        }, 1000)
    }
    async getSupplierList(departmentId = '5bc3a2dc-3bd2-4376-bcc3-5612e28e55fe') {
        // 获取供应商列表
        let ret = await axios.get(this.BaseURL + 'gysInfos', {
            params: {
                departmentId: departmentId
            }
        })
        if (ret.status == 200) {
            return ret.data
        }
    }
}
const todoListAction = new TodoListAction();
export default todoListAction;
