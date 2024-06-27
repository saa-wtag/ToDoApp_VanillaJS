import {$taskInput, $addButton, $taskList, $toaster } from "./elements.js";

let tasks = [];

const addButtonHandler = () => {
  const taskTitle = $taskInput.value.trim();
  if (taskTitle) {
    createTask(taskTitle);
    showToastMessage("Task added successfully!");
    $addButton.disabled = true;
  }
};

const createTask = (taskTitle) => {
  const task = {
    id: new Date().getTime(),
    title: taskTitle,
  };
  tasks.unshift(task);
  renderTasks();

  taskInput.value = "";
};

const deleteHandler = (taskId) => {
  tasks = tasks.filter((task) => task.id !== taskId);
  renderTasks();
};

const renderTasks = () => {
  unorderedTaskList.innerHTML = "";

  tasks.forEach((task) => {
    const tasksList = document.createElement("li");
    tasksList.textContent = task.title;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", () => deleteHandler(task.id));

    tasksList.appendChild(deleteButton);
    unorderedTaskList.appendChild(tasksList);
  });
};

const showToastMessage = (message) => {
  $toaster.textContent = message;
  $toaster.hidden = false;
  setTimeout(() => {
    $toaster.hidden = true;
  }, 3000);
};

$taskInput.addEventListener("input", () => {
  if ($taskInput.value.trim()) {
    $addButton.disabled = false;
  } else {
    $addButton.disabled = true;
  }
});

$addButton.addEventListener("click", addButtonHandler);
