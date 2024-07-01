import { $taskInput, $addButton, $taskList } from "./elements.js";
import { showToastMessage, sanitizeInput, createElement, formatDate } from "./utilities.js";

let tasks = [];

const addButtonHandler = () => {
  const taskTitle = sanitizeInput($taskInput.value);
  if (taskTitle) {
    createTask(taskTitle);
    showToastMessage("Task added successfully!");
    $addButton.disabled = true;
  }
};

const deleteTask = (taskId) => {
  tasks = tasks.filter((task) => task.id !== taskId);
  renderTasks();
};

const createTask = (taskTitle) => {
  const task = {
    id: new Date().getTime(),
    title: taskTitle,
    createdAt: formatDate(new Date())
  };
  tasks.unshift(task);
  renderTasks();

  $taskInput.value = "";
};

const renderTasks = () => {
  $taskList.innerHTML = "";

  tasks.forEach((task) => {
    const texts = [task.title, " Created at: " + task.createdAt];
    const $tasksList = createElement(texts, "li");
    const $deleteButton = createElement("Delete", "button", () =>
      deleteTask(task.id)
    );
    $tasksList.appendChild($deleteButton);
    $taskList.appendChild($tasksList);
  });
};

$taskInput.addEventListener("input", () => {
  if ($taskInput.value.trim()) {
    $addButton.disabled = false;
  } else {
    $addButton.disabled = true;
  }
});

$addButton.addEventListener("click", addButtonHandler);
