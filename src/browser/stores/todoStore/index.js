import { observable, action } from 'mobx';

class TodoStore {
    @observable todoList;
    @observable count;
    constructor() {
        this.todoList = [];
        this.count = 0;
    }
    @action addtodoList(arr) {
        this.todoList = arr;
    }
    @action addCount() {
        this.count += 1
    }
}
const todoStore = new TodoStore();

export default todoStore;