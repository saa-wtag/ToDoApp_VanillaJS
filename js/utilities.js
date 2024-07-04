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

export const createButton = (text, onClick) => {
  const $button = document.createElement("button");
  $button.innerText = text;
  $button.addEventListener("click", onClick);
  return $button;
};

export const toggleInputContainer = () => {
  const inputContainer = document.getElementById("input-container");
  if (
    inputContainer.style.display === "none" ||
    inputContainer.style.display === ""
  ) {
    inputContainer.style.display = "block";
  } else {
    inputContainer.style.display = "none";
  }
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
  const taskContainer = document.createElement("div");
  taskContainer.classList.add("task-container");
  taskContainer.id = task.done ? "done-task-unit" : "remaining-task-unit";

  const taskInfo = document.createElement("div");
  const saveButton = document.createElement("button");

  if (task.editMode) {
    const taskInput = document.createElement("textarea");
    taskInput.id = "task-input";
    taskInput.value = task.title;
    taskContainer.appendChild(taskInput);

    saveButton.classList.add("filters-button");
    saveButton.id = "save-button";
    saveButton.textContent = "Save";
    saveButton.addEventListener("click", updateHandler(task, taskInput.value));
  } else {
    const taskTitle = document.createElement("p");
    taskTitle.classList.add("task-title");
    taskTitle.id = task.done ? "done-title" : "not-done-title";
    taskTitle.textContent = task.title;

    const createdAt = document.createElement("p");
    createdAt.id = "task-created-at";
    createdAt.textContent = `Created At: ${
      task.createdAt || new Date().toLocaleDateString()
    }`;

    taskInfo.append(taskTitle, createdAt);
  }

  const taskButtons = document.createElement("div");
  taskButtons.classList.add("task-buttons");
  if (task.done) {
    taskButtons.id = "done-task-buttons";
  }

  const createButton = (id, imgSrc, alt, handler) => {
    const button = document.createElement("button");
    button.classList.add("card-buttons");
    button.id = id;
    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = alt;
    button.appendChild(img);
    button.addEventListener("click", handler);
    return button;
  };

  if (task.done) {
    const doneAt = document.createElement("p");
    doneAt.id = "task-done-at";
    doneAt.textContent = `Completed in ${calculateCompletionTime(task)} days`;
    taskButtons.append(
      createButton("delete-button", "./icons/delete-icon.svg", "Delete", () =>
        deleteHandler(task.id)
      ),
      doneAt
    );
    if (taskTitle) {
      taskTitle.style.textDecoration = "line-through";
    }
  } else {
    if (!task.editMode) {
      taskButtons.append(
        createButton("edit-button", "./icons/edit-icon.svg", "Edit", () =>
          editHandler(task)
        ),
        createButton("done-button", "./icons/done-icon.svg", "Done", () =>
          doneHandler(task.id)
        )
      );
    } else {
      taskButtons.append(saveButton);
    }
    taskButtons.append(
      createButton("delete-button", "./icons/delete-icon.svg", "Delete", () =>
        deleteHandler(task.id)
      )
    );
  }

  taskContainer.append(taskInfo, taskButtons);
  $taskListContainer.appendChild(taskContainer);
};

const calculateCompletionTime = (task) => {
  const createdDate = new Date(task.createdAt);
  const completedDate = new Date(task.completedAt || new Date());
  const timeDiff = Math.abs(completedDate - createdDate);
  const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return diffDays;
};
