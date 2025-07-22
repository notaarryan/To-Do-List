import "./style.css";
import { Project } from "./projects";
import { Inbox } from "./inbox";
import plusImage from "./images/plus.svg";
import { Today } from "./today";
import { isToday, isThisWeek } from "date-fns";
import { ThisWeek } from "./thisWeek";

class App {
  #dateRegex =
    /^\d{1,2}\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}$/;
  constructor() {
    this.#cacheDom();
    this.#addEventListeners();
  }

  #projects = [];
  #inboxToDos = [];
  #todayToDos = [];
  #thisWeekToDos = [];

  #cacheDom() {
    this.inboxButton = document.getElementById("inbox-btn");
    this.mainContentTitle = document.querySelector(".main-content-title");
    this.addNewTaskDialog = document.getElementById("new-task-dialog");
    this.addNewTaskForm = document.getElementById("new-task-dialog-form");
    this.mainContentDiv = document.querySelector(".main-content");
    this.mainContentDivContainer = document.querySelector(
      ".main-content-container"
    );
    this.taskTitleInput = document.getElementById("task-title-input");
    this.taskDescriptionInput = document.getElementById(
      "task-description-input"
    );
    this.taskDueDateInput = document.getElementById("task-due-date-input");
    this.taskPriorityInput = document.getElementById("task-priority-input");
    this.todayButton = document.getElementById("today-btn");
    this.thisWeekButton = document.getElementById("this-week-btn");
  }

  #addEventListeners() {
    document.addEventListener("DOMContentLoaded", () => {
      this.#loadInbox();
      this.#inboxToDos = JSON.parse(localStorage.getItem("inbox")) || [];
      if (this.#inboxToDos.length > 0) {
        this.inbox.renderInboxTasks(this.#inboxToDos);
      }
      this.#todayToDos = this.#inboxToDos.filter((todo) => {
        if (isToday(todo.dueDate)) {
          return todo;
        }
      });

      this.#thisWeekToDos = this.#inboxToDos.filter((todo) => {
        if (isThisWeek(todo.dueDate)) {
          return todo;
        }
      });
    });

    this.inboxButton.addEventListener("click", () => {
      if (!this.mainContentDiv.classList.contains("inbox")) {
        this.#loadInbox();
      }
    });

    this.todayButton.addEventListener("click", () => {
      if (!this.mainContentDiv.classList.contains("today")) {
        this.#todayToDos = this.#inboxToDos.filter((todo) => {
          if (isToday(todo.dueDate)) {
            return todo;
          }
        });
        this.#loadToday();
      }
    });

    this.thisWeekButton.addEventListener("click", () => {
      if (!this.mainContentDiv.classList.contains("this-week")) {
        this.#thisWeekToDos = this.#inboxToDos.filter((todo) => {
          if (isThisWeek(todo.dueDate)) {
            return todo;
          }
        });
        this.#loadThisWeek();
      }
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
            this.#inboxToDos,
            this.#todayToDos,
            this.#thisWeekToDos
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

  #loadInbox() {
    this.mainContentDiv.classList.remove("today");
    this.mainContentDiv.classList.remove("this-week");
    this.mainContentDiv.classList.add("inbox");
    this.mainContentTitle.innerText = "Inbox";
    const addTaskButton = document.createElement("button");
    addTaskButton.id = "add-task";
    const image = document.createElement("img");
    image.src = plusImage;
    const subDiv = document.createElement("div");
    subDiv.classList.add("subtitle");
    subDiv.innerText = "Add Task";
    addTaskButton.appendChild(image);
    addTaskButton.appendChild(subDiv);
    this.mainContentDiv.appendChild(addTaskButton);
    addTaskButton.addEventListener("click", () => {
      this.checkDescriptionValidity();
      this.checkTitleValidity();
      this.checkDueDateValidity();
      this.checkPriorityValidity();
      this.addNewTaskDialog.showModal();
    });
    this.inbox = new Inbox();
    this.inbox.renderInboxTasks(this.#inboxToDos);
  }

  #loadToday() {
    this.mainContentDiv.classList.remove("inbox");
    this.mainContentDiv.classList.remove("this-week");
    this.mainContentDiv.classList.add("today");
    this.mainContentTitle.innerText = "Today";
    const today = new Today();
    today.renderTodayTasks(this.#todayToDos);
  }

  #loadThisWeek() {
    this.mainContentDiv.classList.remove("inbox");
    this.mainContentDiv.classList.remove("today");
    this.mainContentDiv.classList.add("this-week");
    this.mainContentTitle.innerText = "This Week";
    const thisWeek = new ThisWeek();
    thisWeek.renderThisWeekTasks(this.#thisWeekToDos);
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
