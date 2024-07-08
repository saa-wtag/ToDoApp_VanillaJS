import { $toaster, $toastBox, $taskListContainer } from "./elements.js";
import {
  COLORS,
  ICONS,
  MESSAGES,
  TASK_BUTTON_CLASSES,
  TASK_CONTAINER_CLASSES,
  FILTER_BUTTON_CLASSES,
  CARD_BUTTON_CLASSES,
  TASK_TITLE_CLASSES,
  OVERLAY_STYLES,
  SPINNER_STYLES,
} from "./const.js";

export const showToastMessage = (message, isSuccess) => {
  if (isSuccess) $toastBox.style.backgroundColor = COLORS.SUCCESS; // green
  else $toastBox.style.backgroundColor = COLORS.ERROR; // red
  $toaster.textContent = message;
  $toaster.hidden = false;
  setTimeout(() => {
    $toastBox.style.backgroundColor = COLORS.DEFAULT;
    $toaster.hidden = true;
  }, 1500);
};

export const handleInputChange = ($inputField, $updateButton, currentTask) => {
  const trimmedValue = $inputField.value.trim();
  $updateButton.disabled = !(
    trimmedValue.length > 0 && trimmedValue !== currentTask.title
  );
};

export const toggleInputContainer = (isVisible, addButtonHandler) => {
  if (isVisible) {
    $taskListContainer.style.display = "grid";
    const inputContainer = createContainerBuilder(addButtonHandler);
    $taskListContainer.appendChild(inputContainer);
  } else {
    const inputContainer = document.getElementById("input-container");
    if (inputContainer) inputContainer.remove();
  }
};

const createButton = (id, imgSrc, alt, handler) => {
  const button = document.createElement("button");
  button.classList.add(...CARD_BUTTON_CLASSES);
  button.id = id;
  if (imgSrc) {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = alt;
    button.appendChild(img);
  } else {
    button.textContent = alt;
  }
  button.addEventListener("click", handler);
  return button;
};

export const createContainerBuilder = (addButtonHandler) => {
  const taskContainer = document.createElement("div");
  taskContainer.classList.add(...TASK_CONTAINER_CLASSES);
  taskContainer.id = "input-container";

  const taskInputDiv = document.createElement("div");
  const taskInput = document.createElement("textarea");
  taskInput.id = "task-input";
  taskInputDiv.appendChild(taskInput);

  const taskButtonsDiv = document.createElement("div");
  taskButtonsDiv.classList.add(...TASK_BUTTON_CLASSES);

  const addButton = document.createElement("button");
  addButton.classList.add(...FILTER_BUTTON_CLASSES);
  addButton.id = "add-button";
  addButton.textContent = "Add Task";
  addButton.addEventListener("click", (event) => {
    event.preventDefault();
    addButtonHandler(taskContainer);
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add(...CARD_BUTTON_CLASSES);
  deleteButton.id = "delete-button";
  const deleteImg = document.createElement("img");
  deleteImg.src = ICONS.DELETE;
  deleteImg.alt = "Delete";
  deleteButton.appendChild(deleteImg);
  deleteButton.addEventListener("click", () => {
    taskContainer.remove();
  });
  taskButtonsDiv.append(addButton, deleteButton);
  taskContainer.append(taskInputDiv, taskButtonsDiv);

  return taskContainer;
};

export const containerBuilder = (
  task,
  doneHandler,
  editHandler,
  deleteHandler,
  updateHandler
) => {
  const taskContainer = createElement("div", TASK_CONTAINER_CLASSES);
  taskContainer.id = task.done ? "done-task-unit" : "remaining-task-unit";

  const taskInfo = createElement("div");
  const taskButtons = createElement("div", TASK_BUTTON_CLASSES);

  const content = task.editMode
    ? buildEditModeContent(task)
    : buildNormalModeContent(task);

  taskContainer.append(taskInfo, taskButtons);
  taskInfo.append(...content);

  if (task.done) {
    task.editMode = false;
    const doneAt = createElement("p");
    doneAt.textContent = `Completed in ${calculateCompletionTime(task)} days`;
    doneAt.id = "task-done-at";
    taskButtons.id = "done-task-buttons";
    taskButtons.prepend(doneAt);

    taskButtons.prepend(
      createButton("delete-button", ICONS.DELETE, "Delete", () =>
        deleteHandler(task.id, taskContainer)
      )
    );
  } else {
    if (!task.editMode) {
      taskButtons.append(
        createButton("edit-button", ICONS.EDIT, "Edit", () => editHandler(task))
      );
    } else {
      taskButtons.append(
        createButton("save-button", null, "Save", () =>
          updateHandler(task, taskContainer, content[0].value.trim())
        )
      );
    }

    taskButtons.append(
      createButton("done-button", ICONS.DONE, "Done", () =>
        doneHandler(task.id, taskContainer)
      )
    );

    taskButtons.append(
      createButton("delete-button", ICONS.DELETE, "Delete", () =>
        deleteHandler(task.id, taskContainer)
      )
    );
  }

  $taskListContainer.appendChild(taskContainer);
};

const createElement = (type, classes = []) => {
  const element = document.createElement(type);
  if (classes.length > 0) element.classList.add(...classes);
  return element;
};

const buildEditModeContent = (task) => {
  const taskInput = createElement("textarea");
  taskInput.id = "task-input";
  taskInput.value = task.title;
  return [taskInput];
};

const buildNormalModeContent = (task) => {
  const taskTitle = createElement("p", TASK_TITLE_CLASSES);
  taskTitle.textContent = task.title;
  if (task.done) taskTitle.id = "done-title";

  const createdAt = createElement("p");
  createdAt.id = "task-created-at";
  createdAt.textContent = `Created At: ${formatCreatedAt(task.id)}`;
  return [taskTitle, createdAt];
};

const calculateCompletionTime = (task) => {
  const createdDate = new Date(task.id);
  const completedDate = new Date(task.completedAt || new Date());
  const timeDiff = Math.abs(completedDate - createdDate);
  const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return diffDays;
};

const formatCreatedAt = (createdAt) => {
  const date = new Date(createdAt);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}.${month}.${year}`;
};

export const showSpinnerOverlay = (targetContainer) => {
  const $overlay = document.createElement("div");
  Object.assign($overlay.style, OVERLAY_STYLES);

  const $spinnerImage = document.createElement("img");
  $spinnerImage.src = ICONS.SPINNER;
  $spinnerImage.alt = "Loading...";
  Object.assign($spinnerImage.style, SPINNER_STYLES);

  $overlay.appendChild($spinnerImage);
  targetContainer.style.position = "relative";
  targetContainer.appendChild($overlay);

  return $overlay;
};

export const hideSpinnerOverlay = ($overlay) => {
  const parent = $overlay.parentNode;
  parent.removeChild($overlay);
};
