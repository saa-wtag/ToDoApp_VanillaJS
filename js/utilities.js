import { $toaster } from "./elements.js";

export const showToastMessage = (message) => {
  $toaster.textContent = message;
  $toaster.hidden = false;
  setTimeout(() => {
    $toaster.hidden = true;
  }, 3000);
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
  doneTask
) => {
  const $taskItem = document.createElement("li");

  const $titleElement = document.createElement("span");
  $titleElement.textContent = task.title;
  if (task.done) {
    $titleElement.style.textDecoration = "line-through";
  }

  if (task.editMode) {
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
      doneTask(task.id)
    );

    $taskItem.append($titleElement, $deleteButton);
    if (!task.done) {
      $taskItem.append($editButton, $doneButton);
    }
  }

  return $taskItem;
};

export const formatDate = (now) => {
  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear().toString().slice(-2);

  return `${day},${month},${year}`;
};
