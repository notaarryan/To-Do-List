import "./style.css";
import { TodoItem } from "./todo";
import { Project } from "./projects";
import { Inbox } from "./inbox";

class App {
  #dateRegex =
    /^\d{1,2}\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}$/;
  constructor() {
    this.#cacheDom();
    this.#addEventListeners();
    this.inbox = new Inbox();
  }

  #projects = [];
  #inboxToDos = [];

  #cacheDom() {
    this.addNewTaskButton = document.getElementById("add-task");
    this.addNewTaskDialog = document.getElementById("new-task-dialog");
    this.addNewTaskForm = document.getElementById("new-task-dialog-form");
    this.mainContentDiv = document.querySelector(".main-content");
    this.taskTitleInput = document.getElementById("task-title-input");
    this.taskDescriptionInput = document.getElementById(
      "task-description-input"
    );
    this.taskDueDateInput = document.getElementById("task-due-date-input");
    this.taskPriorityInput = document.getElementById("task-priority-input");
  }

  #addEventListeners() {
    document.addEventListener("DOMContentLoaded", () => {
      this.#inboxToDos = JSON.parse(localStorage.getItem("inbox")) || [];
      if (this.#inboxToDos.length > 0) {
        this.inbox.renderInboxTasks(this.#inboxToDos);
      }
    });

    this.addNewTaskButton.addEventListener("click", () => {
      this.checkDescriptionValidity();
      this.checkTitleValidity();
      this.checkDueDateValidity();
      this.checkPriorityValidity();
      this.addNewTaskDialog.showModal();
    });

    this.addNewTaskForm.addEventListener("submit", (e) => {
      this.checkDescriptionValidity();
      this.checkTitleValidity();
      this.checkDueDateValidity();
      this.checkPriorityValidity();
      if (!this.addNewTaskForm.checkValidity()) {
        e.preventDefault();
        this.addNewTaskForm.reportValidity();
      } else {
        e.preventDefault();
        const formData = new FormData(this.addNewTaskForm);
        const title = formData.get("task-title");
        const description = formData.get("task-description");
        const dueDate = formData.get("task-due-date");
        const priority = formData.get("task-priority");
        const notes = formData.get("task-notes");
        if (this.mainContentDiv.classList.contains("inbox")) {
          this.inbox.newIboxTask(
            title,
            description,
            dueDate,
            priority,
            notes,
            this.#inboxToDos
          );
          this.inbox.renderInboxTasks(this.#inboxToDos);
        }
        this.addNewTaskDialog.close();
        this.addNewTaskForm.reset();
      }
    });

    this.taskTitleInput.addEventListener("input", () =>
      this.checkTitleValidity()
    );

    this.taskDescriptionInput.addEventListener("input", () =>
      this.checkDescriptionValidity()
    );

    this.taskDueDateInput.addEventListener("input", () =>
      this.checkDueDateValidity()
    );

    this.taskPriorityInput.addEventListener("input", () => {
      this.checkPriorityValidity();
    });
  }

  checkTitleValidity() {
    if (!this.taskTitleInput.value) {
      this.taskTitleInput.setCustomValidity("Enter a title");
    } else {
      this.taskTitleInput.setCustomValidity("");
    }
  }
  checkDueDateValidity() {
    if (!this.taskDueDateInput.value) {
      this.taskDueDateInput.setCustomValidity("Enter a due date");
    } else if (
      !this.#dateRegex.test(this.taskDueDateInput.value.toLowerCase())
    ) {
      this.taskDueDateInput.setCustomValidity(
        'Enter due date in this format "DD MONTH YYYY" example 25 March 2025'
      );
    } else {
      this.taskDueDateInput.setCustomValidity("");
    }
  }
  checkDescriptionValidity() {
    if (!this.taskDescriptionInput.value) {
      this.taskDescriptionInput.setCustomValidity("Enter a title");
    } else {
      this.taskDescriptionInput.setCustomValidity("");
    }
  }
  checkPriorityValidity() {
    if (!this.taskPriorityInput.value) {
      this.taskPriorityInput.setCustomValidity("Please select a priority");
    } else {
      this.taskPriorityInput.setCustomValidity("");
    }
  }
}

new App();
