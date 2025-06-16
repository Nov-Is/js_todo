import { TodoListModel } from "./model/TodoListModel.js";
import { TodoItemModel } from "./model/TodoItemModel.js";
import { element, render } from "./view/html-util.js";

export class App {
  #todoListModel = new TodoListModel();

  mount () {
    const formElement = document.querySelector("#js-form");
    const inputElement = document.getElementById("js-form-input");
    const containerElement = document.querySelector("#js-todo-list");
    const todoItemCountElement = document.querySelector("#js-todo-count");
    
    this.#todoListModel.onChange(() => {
      const todoListElement = element`<ul class="d-flex flex-column w-100"></ul>`;
      const todoItems = this.#todoListModel.getTodoItems();
      todoItems.forEach(item => {
        const todoItemElement = item.completed
          ? element`<li class="d-flex align-self-center align-items-center w-50 my-1">
            <input type="checkbox" class="checkbox me-2" checked>
            <p class="text my-auto"><s>${item.title}</s></p>
            <div class="ms-auto">
              <button class="edit btn btn-secondary">編集</button>
              <button class="delete btn btn-danger">削除</button>
            </div>
            </li>`
            : element`<li class="d-flex align-self-center align-items-center w-50 my-1">
            <input type="checkbox" class="checkbox me-2">
            <p class="text my-auto">${item.title}</p>
            <div class="ms-auto buttons">
              <button class="edit btn btn-secondary">編集</button>
              <button class="delete btn btn-danger">削除</button>
            </div>
            </li>`;
        const inputCheckBoxElement = todoItemElement.querySelector(".checkbox");
        inputCheckBoxElement.addEventListener("change", () => {
          this.#todoListModel.completeTodo({
            id: item.id,
            completed: !item.completed
          });
        });
        const deleteButtonElement = todoItemElement.querySelector(".delete");
        deleteButtonElement.addEventListener("click", () => {
          const alertMessage = confirm("本当に削除してもよろしいですか？");
          if (alertMessage) {
            this.#todoListModel.deleteTodo({
              id: item.id
            });
          }
        });

        const editButtonElement = todoItemElement.querySelector(".edit");
        editButtonElement.addEventListener("click", () => {
          const text = todoItemElement.querySelector("p");
          const editForm = document.createElement("input");
          editForm.value = item.title;
          editForm.type = "text";
          editForm.className = "edit-form";
          todoItemElement.replaceChild(editForm, text);

          editButtonElement.remove();
          const deleteButtonElement = todoItemElement.querySelector(".delete");
          const updateButtonElement = document.createElement("button");
          updateButtonElement.innerText = "更新";
          updateButtonElement.className = "update btn btn-warning";
          deleteButtonElement.replaceWith(updateButtonElement);

          updateButtonElement.addEventListener("click", (event) => {
            event.preventDefault();
            this.#todoListModel.updateTodo({
              id: item.id,
              title: editForm.value
            });
          });          
          editForm.focus();
        });
        todoListElement.appendChild(todoItemElement);
      });
      render(todoListElement, containerElement);
      console.log("Total Count:", this.#todoListModel.getTotalCount());
      console.log("Completed Count:", this.#todoListModel.getCompletedCount());
      todoItemCountElement.textContent = `全てのタスク: ${this.#todoListModel.getTotalCount()}  完了済み: ${this.#todoListModel.getCompletedCount()}  未完了: ${this.#todoListModel.getUncompletedCount()}`;
    });

    formElement.addEventListener("submit", (event) => {
        event.preventDefault();
        this.#todoListModel.addTodo(new TodoItemModel({
            title: inputElement.value,
            completed: false
        }));
        inputElement.value = "";
    });
  }
}
