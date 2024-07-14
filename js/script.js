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
let filteredOrSearchableTasks = [];
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
      filteredOrSearchableTasks.length ? filteredOrSearchableTasks : tasks
    );
};

const searchButtonHandler = () => {
  const searchTitle = sanitizeInput($searchInput.value).toLowerCase();
  const overlay = showSpinnerOverlay($taskListContainer);

  setTimeout(() => {
    filterTasks(searchTitle);
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
  task.isEditing = true;
  renderTasks(
    filteredOrSearchableTasks.length ? filteredOrSearchableTasks : tasks
  );
};

const updateTask = (task, container, newTitle) => {
  if (newTitle) {
    const overlay = showSpinnerOverlay(container);
    setTimeout(() => {
      task.title = newTitle;
      task.isEditing = false;
      filterTasks();
      hideSpinnerOverlay(overlay);
    }, 1000);
  }
};

const completeTask = (taskId, container) => {
  const overlay = showSpinnerOverlay(container);
  setTimeout(() => {
    const task = tasks.find((task) => task.id === taskId);
    if (task && !task.done) {
      task.done = !task.done;
      renderTasks(tasks);
    }
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
  tasksDisplayed = Math.min(tasksPerPage, tasks.length);
  filterTasks();
};

const renderTasks = (tasksToRender) => {
  $taskListContainer.innerHTML = "";

  const paginatedTasks = tasksToRender.slice(0, tasksDisplayed);

  paginatedTasks.forEach((task) => {
    containerBuilder(task, completeTask, editTask, deleteTask, updateTask);
  });

  $noTask.style.display = tasksToRender.length === 0 ? "flex" : "none";
  $loadMore.style.display =
    tasksToRender.length > tasksDisplayed ? "block" : "none";
};

$loadMore.addEventListener("click", () => {
  tasksDisplayed = Math.min(
    tasksDisplayed + tasksPerPage,
    filteredOrSearchableTasks.length || tasks.length
  );
  renderTasks(
    filteredOrSearchableTasks.length ? filteredOrSearchableTasks : tasks
  );
});

const renderNoTasks = () => {
  $taskListContainer.style.display = "none";
  $loadMore.style.display = "none";
};

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
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

const filterTasks = (searchTitle = "") => {
  let filteredTasks = tasks.filter((task) => {
    if (currentFilter === "incomplete") return !task.done;
    if (currentFilter === "complete") return task.done;
    return true;
  });

  if (searchTitle) {
    filteredTasks = filteredTasks.filter((task) =>
      task.title.toLowerCase().includes(searchTitle)
    );
  }

  filteredOrSearchableTasks = filteredTasks;
  tasksDisplayed = Math.min(tasksDisplayed, filteredTasks.length);
  renderTasks(filteredTasks);
};
