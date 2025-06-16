import { EventEmitter } from "../EventEmitter.js";

export class TodoListModel extends EventEmitter {
  #items;
  constructor(items = []) {
    super();
    this.#items = items;
  }

  getTotalCount() {
    return this.#items.length;
  }

  getTodoItems() {
    return this.#items;
  }

  getCompletedCount() {
    let count = 0;
    this.#items.forEach((element) => {
      if (element.completed === true) {
        count++;
      }
    })
    return count;
  }

    getUncompletedCount() {
    let count = 0;
    this.#items.forEach((element) => {
      if (element.completed === false) {
        count++;
      }
    })
    return count;
  }

  onChange(listener) {
    this.addEventListener("change", listener);
  }

  emitChange() {
    this.emit("change");
  }

  addTodo(todoItem) {
    this.#items.push(todoItem);
    this.emitChange();
  }

  completeTodo({id, completed}) {
    const todoItem = this.#items.find(todo => todo.id === id);
    if (!todoItem) {
      return;
    }
    todoItem.completed = completed;
    this.emitChange();
  }

  deleteTodo({ id }) {
    this.#items = this.#items.filter(todo => {
      return todo.id !== id;
    });
    this.emitChange();
  }

  updateTodo({ id, title }) {
    const todoItem = this.#items.find(todo => todo.id === id);
    if (!todoItem) {
      return;
    }
    todoItem.title = title;
    this.emitChange();
  };
}
