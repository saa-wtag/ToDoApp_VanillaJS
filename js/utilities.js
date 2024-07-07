import { $toaster, $toastBox, $taskListContainer } from "./elements.js";

export const showToastMessage = (message, isSuccess) => {
  if (isSuccess) $toastBox.style.backgroundColor = "#0BC375"; // green
  else $toastBox.style.backgroundColor = "#E85F5F"; //red
  $toaster.textContent = message;
  $toaster.hidden = false;
  setTimeout(() => {
    $toastBox.style.backgroundColor = "#ffffff";
    $toaster.hidden = true;
  }, 1500);
};

export const handleInputChange = ($inputField, $updateButton, currentTask) => {
  const trimmedValue = $inputField.value.trim();
  $updateButton.disabled = !(
    trimmedValue.length > 0 && trimmedValue !== currentTask.title
  );
};

export const toggleInputContainer = (
  isVisible,
  addButtonHandler,
  $inputContainer,
  $noTask,
  tasksLength
) => {
  if (isVisible) {
    $taskListContainer.style.display = "grid";
    let inputContainer = createContainerBuilder(addButtonHandler);
    $taskListContainer.appendChild(inputContainer);
  } else {
    $inputContainer = document.getElementById("input-container");
    $inputContainer.remove();      
  }
};

const createButton = (id, imgSrc, alt, handler) => {
  const button = document.createElement("button");
  button.classList.add("card-buttons");
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
  taskContainer.classList.add("task-container");
  taskContainer.id = "input-container";

  const taskInputDiv = document.createElement("div");
  const taskInput = document.createElement("textarea");
  taskInput.id = "task-input";
  taskInputDiv.appendChild(taskInput);

  const taskButtonsDiv = document.createElement("div");
  taskButtonsDiv.classList.add("task-buttons");

  const addButton = document.createElement("button");
  addButton.classList.add("filters-button");
  addButton.id = "add-button";
  addButton.textContent = "Add Task";
  addButton.addEventListener("click", addButtonHandler);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("card-buttons");
  deleteButton.id = "delete-button";
  const deleteImg = document.createElement("img");
  deleteImg.src = "./icons/delete-icon.svg";
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
  const taskContainer = createElement("div", ["task-container"]);
  taskContainer.id = task.done ? "done-task-unit" : "remaining-task-unit";

  const taskInfo = createElement("div");
  const taskButtons = createElement("div", ["task-buttons"]);

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
      createButton("delete-button", "./icons/delete-icon.svg", "Delete", () =>
        deleteHandler(task.id)
      )
    );
  } else {
    if (!task.editMode) {
      taskButtons.append(
        createButton("edit-button", "./icons/edit-icon.svg", "Edit", () =>
          editHandler(task)
        )
      );
    } else {
      taskButtons.append(
        createButton("save-button", null, "Save", () =>
          updateHandler(task, content[0].value.trim())
        )
      );
    }

    taskButtons.append(
      createButton("done-button", "./icons/done-icon.svg", "Done", () =>
        doneHandler(task.id)
      )
    );

    taskButtons.append(
      createButton("delete-button", "./icons/delete-icon.svg", "Delete", () =>
        deleteHandler(task.id)
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
  const taskTitle = createElement("p", ["task-title"]);
  taskTitle.textContent = task.title;
  if (task.done) taskTitle.id = "done-title";

  const createdAt = createElement("p");
  createdAt.id = "task-created-at";
  createdAt.textContent = `Created At: ${
    task.createdAt || new Date().toLocaleDateString()
  }`;
  return [taskTitle, createdAt];
};

const calculateCompletionTime = (task) => {
  const createdDate = new Date(task.id);
  const completedDate = new Date(task.completedAt || new Date());
  const timeDiff = Math.abs(completedDate - createdDate);
  const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return diffDays;
};
