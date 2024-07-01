import { $taskInput, $addButton, $taskList } from "./elements.js";
import { showToastMessage, sanitizeInput } from "./utilities.js";

let tasks = [];

const addButtonHandler = () => {
  const taskTitle = sanitizeInput($taskInput.value).trim();
  if (taskTitle) {
    tasks.unshift(taskTitle);
    const $tasksList = document.createElement("li");
    $tasksList.textContent = taskTitle;
    $taskList.prepend($tasksList);
    $taskInput.value = "";
    showToastMessage("Task added successfully!");
    $addButton.disabled = true;
  }
};

$taskInput.addEventListener("input", () => {
  if ($taskInput.value.trim()) {
    $addButton.disabled = false;
  } else {
    $addButton.disabled = true;
  }
});

$addButton.addEventListener("click", addButtonHandler);
