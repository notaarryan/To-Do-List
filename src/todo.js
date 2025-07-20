import { format } from "date-fns";

export class TodoItem {
  constructor(title, description, dueDate, priority, notes = null) {
    this.title = title;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this.priority = priority;
    this.notes = notes;
  }
}
