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
  if (!isVisible) renderTasks(tasks);
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
    tasks = tasks.filter((task) => task.id !== taskId);
    renderTasks(tasks);
    hideSpinnerOverlay(overlay);
  }, 1000);
};

const editTask = (task) => {
  task.isEditing = true;
  renderTasks(tasks);
};

const updateTask = (task, container, newTitle) => {
  if (newTitle) {
    const overlay = showSpinnerOverlay(container);
    setTimeout(() => {
      task.title = newTitle;
      task.isEditing = false;
      renderTasks(tasks);
      hideSpinnerOverlay(overlay);
    }, 1000);
  }
};

const completeTask = (taskId, container) => {
  const overlay = showSpinnerOverlay(container);
  setTimeout(() => {
    const task = tasks.find((task) => task.id === taskId);
    if (task === undefined) {
      return;
    }

    task.done = true;
    task.isEditing = false;
    renderTasks(tasks);
    hideSpinnerOverlay(overlay);
  }, 1000);
};

const createTask = (taskTitle) => {
  const task = {
    id: new Date().getTime(),
    title: taskTitle,
    createdAt: formatDate(new Date()),
    isEditing: false,
    done: false,
  };
  tasks.unshift(task);
  renderTasks(tasks);
};

const renderTasks = (tasksToRender = tasks) => {
  $taskListContainer.innerHTML = "";
  tasksToRender.forEach((task) => {
    containerBuilder(task, completeTask, editTask, deleteTask, updateTask);
  });

  if (tasksToRender.length === 0) {
    $noTask.style.display = "flex";
  } else {
    $noTask.style.display = "none";
  }
};

const renderNoTasks = () => {
  $taskListContainer.style.display = "none";
  $loadMore.style.display = "none";
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
  filteredOrSearchAbleTasks = [...tasks];
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
  let filteredTasks = [...filteredOrSearchAbleTasks];

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

  renderTasks(filteredTasks);
};
