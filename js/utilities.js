import { $toaster } from "./elements.js";

export const showToastMessage = (message) => {
  $toaster.textContent = message;
  $toaster.hidden = false;
  setTimeout(() => {
    $toaster.hidden = true;
  }, 1500);
};

export const sanitizeInput = (value) => {
  const reg = /[&<>"'/`]/gi;
  return value.replace(reg, "").trim();
};

export const createElement = (text, type, onClick) => {
  const $element = document.createElement(type);
  $element.innerText = text;
  if (onClick) {
    $element.addEventListener("click", onClick);
  }
  return $element;
};

export const createTaskElement = (
  task,
  deleteTask,
  editTask,
  updateTask,
  cancelEdit,
  completeTask
) => {
  const $taskItem = document.createElement("li");

  const $titleElement = document.createElement("span");
  $titleElement.textContent = task.title;
  if (task && task.done) {
    $titleElement.style.textDecoration = "line-through";
  }

  if (task.isEditing) {
    const $inputField = document.createElement("input");
    $inputField.type = "text";
    $inputField.value = task.title;

    const $updateButton = createElement("Update", "button", () => {
      const sanitizedTitle = sanitizeInput($inputField.value);
      updateTask(task, sanitizedTitle);
    });
    const $cancelButton = createElement("Cancel", "button", () => {
      cancelEdit(task);
    });

    $taskItem.append($inputField, $updateButton, $cancelButton);
  } else {
    const $deleteButton = createElement("Delete", "button", () =>
      deleteTask(task.id)
    );
    const $editButton = createElement("Edit", "button", () => editTask(task));
    const $doneButton = createElement("Done", "button", () =>
      completeTask(task.id)
    );

    $taskItem.append($titleElement, $deleteButton);
    if (!task.done) {
      $taskItem.append($editButton, $doneButton);
    }
  }

  return $taskItem;
};

export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}.${month}.${year}`;
};
