import {
  $mainContainer,
  $bodyContainer,
  $searchInput,
  $searchButton,
  $splash,
  $noTask,
  $taskListContainer,
  $loadMore,
  $createButton,
} from "./elements.js";
import {
  showToastMessage,
  toggleInputContainer,
  containerBuilder,
} from "./utilities.js";

let tasks = [];
let isVisible;

const addButtonHandler = () => {
  isVisible = !isVisible;
  const taskTitle = document.getElementById("task-input").value.trim();
  if (taskTitle) {
    createTask(taskTitle);
    showToastMessage("√ Changes are saved successfully", true);
  } else {
    showToastMessage("We couldn't save your changes", false);
  }
};

const createButtonHandler = () => {
  isVisible = !isVisible;
  $taskListContainer.style.display = "grid";
  $noTask.style.display = "none";

  toggleInputContainer(isVisible, addButtonHandler);
  if (!isVisible) renderTasks(tasks);
};

const searchButtonHandler = () => {
  const searchTitle = $searchInput.value.trim();

  const $overlay = document.createElement("div");
  $overlay.style.position = "absolute";
  $overlay.style.top = "23%";
  $overlay.style.left = "0";
  $overlay.style.width = "100%";
  $overlay.style.height = "77%";
  $overlay.style.backgroundColor = "rgba(240, 240, 240, 0.4)";
  $overlay.style.zIndex = "9999";
  $overlay.style.display = "flex";
  $overlay.style.justifyContent = "center";
  $overlay.style.alignItems = "center";

  const $spinnerImage = document.createElement("img");
  $spinnerImage.src = "./icons/spinner-icon.svg";
  $spinnerImage.alt = "Loading...";
  $spinnerImage.style.width = "50px";
  $spinnerImage.style.height = "50px";
  $spinnerImage.style.borderRadius = "50%";
  $spinnerImage.style.animation = "spin 1s linear infinite";

  $overlay.appendChild($spinnerImage);

  $bodyContainer.appendChild($overlay);

  setTimeout(() => {
    if (searchTitle) {
      const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
      if (filteredTasks.length > 0) {
        renderTasks(filteredTasks);
      } else {
        showToastMessage("No tasks found matching the search.");
      }
    } else {
      renderTasks(tasks);
    }

    $bodyContainer.removeChild($overlay);

    $searchInput.value = "";
  }, 3000);
};

const deleteHandler = (taskId) => {
  tasks = tasks.filter((task) => task.id !== taskId);
  renderTasks(tasks);
};

const editHandler = (task) => {
  cancelEdit();
  task.editMode = true;
  renderTasks(tasks);
};

const updateHandler = (task, newTitle) => {
  if (newTitle.length > 0) {
    task.title = newTitle;
  }
  cancelEdit();
  renderTasks(tasks);
};

const doneHandler = (taskId) => {
  const task = tasks.find((task) => task.id === taskId);
  if (task) {
    task.done = !task.done;
    cancelEdit();
    renderTasks(tasks);
  }
};

const createTask = (taskTitle) => {
  tasks.unshift({
    id: new Date().getTime(),
    title: taskTitle,
    done: false,
    editMode: false,
  });
  renderTasks(tasks);
};

const renderTasks = (tasks = []) => {
  $taskListContainer.innerHTML = "";
  tasks.forEach((task) => {
    containerBuilder(
      task,
      doneHandler,
      editHandler,
      deleteHandler,
      updateHandler
    );
  });

  if (tasks.length === 0) {
    $noTask.style.display = "flex";
  } else {
    $noTask.style.display = "none";
  }
};

const renderNoTasks = () => {
  $taskListContainer.style.display = "none";
  $loadMore.style.display = "none";
};

const cancelEdit = () => {
  tasks.forEach((task) => (task.editMode = false));
  renderTasks(tasks);
};

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    $splash.style.display = "none";
    isVisible = false;
    $mainContainer.hidden = false;
    if (tasks.length === 0) {
      renderNoTasks();
    }
  }, 1000);
});

$noTask.addEventListener("click", createButtonHandler);
$createButton.addEventListener("click", createButtonHandler);
$searchButton.addEventListener("click", searchButtonHandler);
