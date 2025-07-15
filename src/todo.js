export class TodoItem {
  constructor(title, description, dueDate, priority, notes = null) {
    this.title = title;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this.priority = (function () {
      switch (priority.toLowerCase()) {
        case "high":
          return 2;
        case "medium":
          return 1;
        case "low":
          return 0;
      }
    })();
    this.notes = notes;
  }
}
