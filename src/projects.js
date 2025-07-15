import { compareAsc, format } from "date-fns";

export class Project {
  constructor(title) {
    this.title = title;
    this.ToDos = [];
  }

  addToDoItem(item) {
    this.ToDos.push(item);
  }

  sortByPriority() {
    for (let i = 0; i < this.ToDos.length; i++) {
      for (let j = 0; j < i; j++) {
        if (this.ToDos[i].priority > this.ToDos[j].priority) {
          let temp = this.ToDos[i];
          this.ToDos[i] = this.ToDos[j];
          this.ToDos[j] = temp;
        }
      }
    }
  }

  sortByDate() {
    for (let i = 0; i < this.ToDos.length; i++) {
      for (let j = 0; j < i; j++) {
        if (compareAsc(this.ToDos[i].dueDate, this.ToDos[j].dueDate) == -1) {
          let temp = this.ToDos[i];
          this.ToDos[i] = this.ToDos[j];
          this.ToDos[j] = temp;
        }
      }
    }
  }

  logToDos() {
    this.ToDos.forEach((todo) => {
      console.log({
        title: todo.title,
        description: todo.description,
        dueDate: format(todo.dueDate, "dd-MMM-yyyy"),
        priority: todo.priority,
        note: todo.note,
      });
    });
  }
}
