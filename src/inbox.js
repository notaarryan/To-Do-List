import { de } from "date-fns/locale";
import { TodoItem } from "./todo";
import { format } from "date-fns";

export class Inbox {
  #dateRegex =
    /^\d{1,2}\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}$/;
  constructor() {
    this.#cacheDom();
  }

  #cacheDom() {
    this.addNewTaskButton = document.getElementById("add-task");
    this.addNewTaskDialog = document.getElementById("new-task-dialog");
    this.addNewTaskForm = document.getElementById("new-task-dialog-form");
    this.mainContentDiv = document.querySelector("div.main-content");
  }

  newIboxTask(title, description, dueDate, priority, notes, inboxArray) {
    inboxArray.push(new TodoItem(title, description, dueDate, priority, notes));
    localStorage.setItem("inbox", JSON.stringify(inboxArray));
  }

  formatDate(date) {
    const parsed = new Date(date);
    return !isNaN(parsed) ? format(parsed, "dd-MM-yyyy") : "";
  }

  renderInboxTasks(inboxArray) {
    while (this.mainContentDiv.firstChild !== this.addNewTaskButton) {
      this.mainContentDiv.removeChild(this.mainContentDiv.firstChild);
    }

    inboxArray.forEach((ToDo) => {
      const toDoDiv = document.createElement("div");
      toDoDiv.classList.add("task", ToDo.priority.toLowerCase());

      const form = document.createElement("form");

      const titleInput = document.createElement("input");
      titleInput.type = "text";
      titleInput.name = "task-name";
      titleInput.id = "task-name-input";
      titleInput.value = ToDo.title;

      const dueDateInput = document.createElement("input");
      dueDateInput.type = "text";
      dueDateInput.name = "task-due-date";
      dueDateInput.id = "task-due-date-input";
      dueDateInput.value = this.formatDate(ToDo.dueDate);

      const priorityContainer = document.createElement("div");
      priorityContainer.classList.add("priority-container");

      const priorityLabel = document.createElement("label");
      priorityLabel.setAttribute("for", "priority");
      priorityLabel.textContent = "Select to change priority: ";

      const prioritySelect = document.createElement("select");
      prioritySelect.id = "priority";

      ["High", "Medium", "Low"].forEach((level) => {
        const option = document.createElement("option");
        option.value = level;
        option.textContent = level;
        if (ToDo.priority === level) option.selected = true;
        prioritySelect.appendChild(option);
      });

      priorityContainer.appendChild(priorityLabel);
      priorityContainer.appendChild(prioritySelect);

      form.appendChild(titleInput);
      form.appendChild(dueDateInput);
      form.appendChild(priorityContainer);

      toDoDiv.appendChild(form);
      this.mainContentDiv.insertBefore(toDoDiv, this.addNewTaskButton);

      titleInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && titleInput.checkValidity()) {
          e.preventDefault();
          ToDo.title = titleInput.value;
          this.renderInboxTasks(inboxArray);
        } else {
          titleInput.reportValidity();
        }
      });

      prioritySelect.addEventListener("change", () => {
        ToDo.priority = prioritySelect.value;
        this.renderInboxTasks(inboxArray);
      });

      prioritySelect.addEventListener("input", () => {
        ToDo.priority = prioritySelect.value;
        this.renderInboxTasks(inboxArray);
      });

      dueDateInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && dueDateInput.checkValidity()) {
          e.preventDefault();
          ToDo.dueDate = dueDateInput.value;
          this.renderInboxTasks(inboxArray);
        } else {
          dueDateInput.reportValidity();
        }
      });

      toDoDiv.addEventListener("click", (e) => {
        if (e.target == toDoDiv) {
          toDoDiv.classList.toggle("open");
          if (toDoDiv.classList.contains("open")) {
            while (toDoDiv.lastChild !== form) {
              toDoDiv.removeChild(toDoDiv.lastChild);
            }
          } else {
            const descriptionContainer = document.createElement("div");
            descriptionContainer.classList.add("task-description-container");

            const descriptionTitle = document.createElement("div");
            descriptionTitle.classList.add("task-description-title");
            descriptionTitle.textContent = ToDo.title;

            const descriptionText = document.createElement("div");
            descriptionText.classList.add("task-description");
            descriptionText.textContent = ToDo.description;

            descriptionContainer.appendChild(descriptionTitle);
            descriptionContainer.appendChild(descriptionText);

            toDoDiv.appendChild(descriptionContainer);

            const deleteButton = document.createElement("button");
            deleteButton.id = "task-delete-button";
            deleteButton.innerText = "Delete Task";

            deleteButton.addEventListener("click", (e) => {
              e.stopPropagation();
              const index = inboxArray.indexOf(ToDo);
              if (index > -1) {
                inboxArray.splice(index, 1);
                localStorage.setItem("inbox", JSON.stringify(inboxArray));
              }
              this.mainContentDiv.removeChild(toDoDiv);
            });

            toDoDiv.appendChild(deleteButton);
            console.log(ToDo.notes);
            if (ToDo.notes) {
              const notesContainer = document.createElement("div");
              notesContainer.classList.add("task-notes-container");

              const notesTitle = document.createElement("div");
              notesTitle.classList.add("task-notes-title");
              notesTitle.textContent = "Notes";

              const notesText = document.createElement("div");
              notesText.classList.add("task-notes");
              notesText.textContent = ToDo.notes;

              notesContainer.appendChild(notesTitle);
              notesContainer.appendChild(notesText);
              toDoDiv.appendChild(notesContainer);
            }
          }
        }
      });
      titleInput.addEventListener("input", () => {
        if (!titleInput.value) {
          titleInput.setCustomValidity("Enter a title");
        } else {
          titleInput.setCustomValidity("");
        }
      });

      dueDateInput.addEventListener("input", () => {
        if (!dueDateInput.value) {
          dueDateInput.setCustomValidity("Enter a due date");
        } else if (!this.#dateRegex.test(dueDateInput.value.toLowerCase())) {
          dueDateInput.setCustomValidity(
            'Enter due date in this format "DD MONTH YYYY" example 25 March 2025'
          );
        } else {
          dueDateInput.setCustomValidity("");
        }
      });
    });
  }
}
