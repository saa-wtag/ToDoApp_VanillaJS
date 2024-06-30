import { $taskInput, $addButton, $taskList } from "./elements.js";
import {
  showToastMessage,
  handleInputChange,
  createButton,
} from "./utilities.js";

let tasks = [];

const addButtonHandler = () => {
  const taskTitle = $taskInput.value.trim();
  if (taskTitle) {
    createTask(taskTitle);
    showToastMessage("Task added successfully!");
    $addButton.disabled = true;
  }
};

const deleteHandler = (taskId) => {
  tasks = tasks.filter((task) => task.id !== taskId);
  renderTasks();
};

const editHandler = (task) => {
  cancelEdit();
  task.editMode = true;
  renderTasks();
};

const updateHandler = (task, newTitle) => {
  if (newTitle.trim().length > 0) {
    task.title = newTitle.trim();
  }
  cancelEdit();
  renderTasks();
};

const createTask = (taskTitle) => {
  tasks.unshift({
    id: new Date().getTime(),
    title: taskTitle,
    editMode: false,
  });
  renderTasks();
  $taskInput.value = "";
  $addButton.disabled = true;
};

const renderTasks = () => {
  $taskList.innerHTML = "";
  tasks.forEach((task) => {
    const $tasksList = document.createElement("li");
    const $titleElement = document.createElement("span");
    $titleElement.textContent = task.title;

    if (task.editMode) {
      const $inputField = document.createElement("input");
      $inputField.type = "text";
      $inputField.value = task.title;

      const $updateButton = createButton("Update", () =>
        updateHandler(task, $inputField.value)
      );
      const $cancelButton = createButton("Cancel", cancelEdit);

      $inputField.addEventListener("input", () => {
        handleInputChange($inputField, $updateButton, task);
      });

      $tasksList.append($inputField, $updateButton, $cancelButton);
    } else {
      const $deleteButton = createButton("Delete", () =>
        deleteHandler(task.id)
      );
      const $editButton = createButton("Edit", () => editHandler(task));

      $tasksList.append($titleElement, $deleteButton, $editButton);
    }

    $taskList.appendChild($tasksList);
  });
};

const cancelEdit = () => {
  tasks.forEach((task) => (task.editMode = false));
  renderTasks();
};

$taskInput.addEventListener("input", () => {
  $addButton.disabled = !$taskInput.value.trim();
});

$addButton.addEventListener("click", addButtonHandler);
