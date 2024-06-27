import {$taskInput, $addButton, $taskList, $toaster } from "./elements.js";

let tasks = [];

const addButtonHandler = () => {
  const taskTitle = $taskInput.value.trim();
  if (taskTitle) {
    tasks.unshift(taskTitle);
    const tasksList = document.createElement("li");
    tasksList.textContent = taskTitle;
    $taskList.prepend(tasksList);
    $taskInput.value = "";
    showToastMessage("Task added successfully!");
    $addButton.disabled = true;
  }
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
