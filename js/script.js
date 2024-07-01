import { $taskInput, $addButton, $taskList } from "./elements.js";
import { showToastMessage, sanitizeInput, createElement } from "./utilities.js";

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
  };
  tasks.unshift(task);
  renderTasks();

  $taskInput.value = "";
};

const renderTasks = () => {
  $taskList.innerHTML = "";

  tasks.forEach((task) => {
    const $tasksList = createElement(task.title, "li");
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
