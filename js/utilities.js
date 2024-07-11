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

export const createTaskElement = (task, deleteTask) => {
  const $taskItem = document.createElement("li");

  const $titleElement = document.createElement("span");
  $titleElement.textContent = task.title;

  const $createdAtElement = document.createElement("span");
  $createdAtElement.textContent = " Created at: " + formatDate(task.id);

  const $deleteButton = createElement("Delete", "button", () =>
    deleteTask(task.id)
  );
  $taskItem.appendChild($titleElement);
  $taskItem.appendChild($createdAtElement);
  $taskItem.appendChild($deleteButton);

  return $taskItem;
};

export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}.${month}.${year}`;
};
