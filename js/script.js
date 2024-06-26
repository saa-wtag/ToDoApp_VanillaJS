const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("add-button");
const unorderedTaskList = document.getElementById("tasks");
const toaster = document.getElementById("message");

let tasks = [];

addButton.onclick = () => {
  const taskTitle = taskInput.value.trim();
  if (taskTitle) {
    tasks.unshift(taskTitle);
    const tasksList = document.createElement("li");
    tasksList.textContent = taskTitle;
    unorderedTaskList.prepend(tasksList);
    taskInput.value = "";
    showMessage("Task added successfully!");
    addButton.disabled = true;
  }
};

const showMessage = (message) => {
  toaster.textContent = message;
  toaster.hidden = false;
  setTimeout(() => {
    toaster.hidden = true;
  }, 1000);
};

taskInput.addEventListener("input", () => {
  if (taskInput.value.trim()) {
    addButton.disabled = false;
  } else {
    addButton.disabled = true;
  }
});
