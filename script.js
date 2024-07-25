let input = document.querySelector("#listInput");
let btn = document.querySelector("#addButton");
let list = document.querySelector("#list");
let li;
var listContent;

let task;

const saveData = () => {
  localStorage.setItem("data", list.innerHTML);
};

const showData = () => {
  list.innerHTML = localStorage.getItem("data");
};

const getTask = () => {
  task = input.value;
  if (task == "") {
    alert("Enter a task");
  } else {
    let newElement = document.createElement("li");
    newElement.innerText = task;
    list.append(newElement);
    let span = document.createElement("span");
    span.innerText = "\u00d7";
    newElement.append(span);
  }
  input.value = "";
  saveData();
};

list.addEventListener("click", (e) => {
  if (e.target.tagName == "SPAN") {
    e.target.parentElement.remove();
    saveData();
  } else if (e.target.tagName == "LI") {
    e.target.classList.toggle("checked");
    saveData();
  }
});

btn.addEventListener("click", () => {
  getTask();
  listContent = document.querySelector("#listDiv").innerHTML;
});

showData();
