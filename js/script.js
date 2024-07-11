import {
  $mainContainer,
  $searchInput,
  $searchButton,
  $splash,
  $noTask,
  $taskListContainer,
  $loadMore,
  $createButton,
  $filterAllButton,
  $filterIncompleteButton,
  $filterCompleteButton,
} from "./elements.js";
import {
  showToastMessage,
  sanitizeInput,
  toggleInputContainer,
  containerBuilder,
  showSpinnerOverlay,
  hideSpinnerOverlay,
  formatDate,
  setActiveButton,
} from "./utilities.js";
import { MESSAGES } from "./const.js";

let tasks = [];
let isVisible = false;
let currentFilter = "all";
let filteredOrSearchAbleTasks = [];
let tasksDisplayed = 0;
const tasksPerPage = 9;

const addButtonHandler = (container) => {
  isVisible = !isVisible;
  const taskTitle = sanitizeInput(document.getElementById("task-input").value);

  if (taskTitle) {
    const overlay = showSpinnerOverlay(container);
    setTimeout(() => {
      createTask(taskTitle);
      showToastMessage(MESSAGES.SUCCESS, true);
      hideSpinnerOverlay(overlay);
    }, 1000);
  } else {
    showToastMessage(MESSAGES.ERROR, false);
  }
};

const createButtonHandler = () => {
  isVisible = !isVisible;
  $taskListContainer.style.display = "grid";
  $noTask.style.display = "none";

  toggleInputContainer(isVisible, addButtonHandler);
  if (!isVisible)
    renderTasks(
      filteredOrSearchAbleTasks.length ? filteredOrSearchAbleTasks : tasks
    );
};

const searchButtonHandler = () => {
  const searchTitle = sanitizeInput($searchInput.value).toLowerCase();
  const overlay = showSpinnerOverlay($taskListContainer);

  setTimeout(() => {
    filteredOrSearchAbleTasks = [...tasks];

    if (searchTitle) {
      filteredOrSearchAbleTasks = filteredOrSearchAbleTasks.filter((task) =>
        task.title.toLowerCase().includes(searchTitle)
      );
    }

    switch (currentFilter) {
      case "incomplete":
        filteredOrSearchAbleTasks = filteredOrSearchAbleTasks.filter(
          (task) => !task.done
        );
        break;
      case "complete":
        filteredOrSearchAbleTasks = filteredOrSearchAbleTasks.filter(
          (task) => task.done
        );
        break;
      default:
        break;
    }

    if (filteredOrSearchAbleTasks.length > 0) {
      tasksDisplayed = Math.min(tasksPerPage, filteredOrSearchAbleTasks.length);
      renderTasks(filteredOrSearchAbleTasks);
    } else {
      showToastMessage(MESSAGES.NO_TASKS_FOUND);
    }

    hideSpinnerOverlay(overlay);
    $searchInput.value = "";
  }, 1000);
};

const deleteTask = (taskId, container) => {
  const overlay = showSpinnerOverlay(container);
  setTimeout(() => {
    const index = tasks.findIndex((task) => task.id === taskId);
    if (index !== -1) {
      tasks.splice(index, 1);
      tasksDisplayed = Math.max(0, tasksDisplayed - 1);
    }
    filterTasks();
    hideSpinnerOverlay(overlay);
  }, 1000);
};

const editTask = (task) => {
  cancelEdit();
  task.isEditting = true;
  renderTasks(
    filteredOrSearchAbleTasks.length ? filteredOrSearchAbleTasks : tasks
  );
};

const updateTask = (task, container, newTitle) => {
  if (newTitle) {
    const overlay = showSpinnerOverlay(container);
    setTimeout(() => {
      task.title = newTitle;
      task.isEditting = false;
      filterTasks();
      hideSpinnerOverlay(overlay);
    }, 1000);
  }
};

const completeTask = (taskId, container) => {
  const overlay = showSpinnerOverlay(container);
  setTimeout(() => {
    const task = tasks.find((task) => task.id === taskId);
    if (task) {
      task.done = true;
      filterTasks();
    }
    hideSpinnerOverlay(overlay);
  }, 1000);
};

const createTask = (taskTitle) => {
  const task = {
    id: new Date().getTime(),
    title: taskTitle,
    createdAt: formatDate(new Date()),
    isEditting: false,
    done: false,
  };
  tasks.unshift(task);
  tasksDisplayed = Math.min(tasksPerPage, tasks.length);
  filterTasks();
};

const renderTasks = (tasksToRender) => {
  $taskListContainer.innerHTML = "";

  const paginatedTasks = tasksToRender.slice(0, tasksDisplayed);

  paginatedTasks.forEach((task) => {
    containerBuilder(task, completeTask, editTask, deleteTask, updateTask);
  });

  if (tasksToRender.length === 0) {
    $noTask.style.display = "flex";
  } else {
    $noTask.style.display = "none";
  }

  if (tasksToRender.length > tasksDisplayed) {
    $loadMore.style.display = "block";
  } else {
    $loadMore.style.display = "none";
  }
};

$loadMore.addEventListener("click", () => {
  tasksDisplayed = Math.min(
    tasksDisplayed + tasksPerPage,
    filteredOrSearchAbleTasks.length || tasks.length
  );
  renderTasks(
    filteredOrSearchAbleTasks.length ? filteredOrSearchAbleTasks : tasks
  );
});

const renderNoTasks = () => {
  $taskListContainer.style.display = "none";
  $loadMore.style.display = "none";
};

const cancelEdit = () => {
  tasks.forEach((task) => (task.isEditting = false));
  renderTasks(
    filteredOrSearchAbleTasks.length ? filteredOrSearchAbleTasks : tasks
  );
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

$filterAllButton.addEventListener("click", (event) => {
  currentFilter = "all";
  filterTasks();
  setActiveButton(event.target);
});

$filterIncompleteButton.addEventListener("click", (event) => {
  currentFilter = "incomplete";
  filterTasks();
  setActiveButton(event.target);
});

$filterCompleteButton.addEventListener("click", (event) => {
  currentFilter = "complete";
  filterTasks();
  setActiveButton(event.target);
});

const filterTasks = () => {
  let filteredTasks = [...tasks];

  switch (currentFilter) {
    case "incomplete":
      filteredTasks = filteredTasks.filter((task) => !task.done);
      break;
    case "complete":
      filteredTasks = filteredTasks.filter((task) => task.done);
      break;
    default:
      break;
  }

  const searchTitle = $searchInput.value.trim().toLowerCase();
  if (searchTitle) {
    filteredTasks = filteredTasks.filter((task) =>
      task.title.toLowerCase().includes(searchTitle)
    );
  }

  filteredOrSearchAbleTasks = filteredTasks;
  tasksDisplayed = Math.min(tasksDisplayed, filteredTasks.length);
  renderTasks(filteredTasks);
};
