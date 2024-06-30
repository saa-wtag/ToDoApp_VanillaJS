import { $taskInput, $addButton, $taskList } from "./elements.js";
import { showToastMessage } from "./utilities.js";

let tasks = [];
let currentTaskId = null;

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
  if (currentTaskId === taskId) {
    currentTaskId = null;
  }
  renderTasks();
};

const editHandler = (taskId, currentTitleElement, editButton) => {
  if (currentTaskId !== null && currentTaskId !== taskId) {
    cancelEdit();
  }

  currentTaskId = taskId;

  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  const currentTask = tasks[taskIndex];
  const newId = new Date().getTime();
  editButton.hidden = true;

  const $inputField = document.createElement("input");
  $inputField.type = "text";
  $inputField.value = currentTask.title;

  const $updateButton = document.createElement("button");
  $updateButton.innerText = "Update";
  $updateButton.disabled = true;

  const $cancelButton = document.createElement("button");
  $cancelButton.innerText = "Cancel";
  $cancelButton.addEventListener("click", () => {
    cancelEdit();
  });

  const handleInputChange = () => {
    const trimmedValue = $inputField.value.trim();
    $updateButton.disabled = !(
      trimmedValue.length > 0 && trimmedValue !== currentTask.title
    );
  };

  $inputField.addEventListener("input", handleInputChange);

  $updateButton.addEventListener("click", () => {
    updateTask($inputField.value.trim(), taskIndex, newId, editButton);
  });

  currentTitleElement.textContent = "";
  currentTitleElement.appendChild($inputField);
  currentTitleElement.appendChild($updateButton);
  currentTitleElement.appendChild($cancelButton);
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

const updateTask = (newTitle, taskIndex, newId, editButton) => {
  if (newTitle.trim().length > 0) {
    tasks[taskIndex].title = newTitle.trim();
    tasks[taskIndex].id = newId;
    currentTaskId = null;
    renderTasks();
  }
  editButton.hidden = "true";
};

const cancelEdit = () => {
  currentTaskId = null;
  renderTasks();
};

const renderTasks = () => {
  $taskList.innerHTML = "";

  tasks.forEach((task) => {
    const $tasksList = document.createElement("li");
    const $titleElement = document.createElement("span");
    $titleElement.textContent = task.title;

    const $deleteButton = document.createElement("button");
    $deleteButton.innerText = "Delete";
    $deleteButton.addEventListener("click", () => deleteHandler(task.id));

    const $editButton = document.createElement("button");
    $editButton.innerText = "Edit";
    $editButton.addEventListener("click", () =>
      editHandler(task.id, $titleElement, $editButton)
    );

    $tasksList.appendChild($titleElement);
    $tasksList.appendChild($deleteButton);
    $tasksList.appendChild($editButton);

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
