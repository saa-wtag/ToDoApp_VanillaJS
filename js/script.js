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

const handleAddTask = (container) => {
  isVisible = !isVisible;
  const taskTitle = sanitizeInput(document.getElementById("taskInput").value);

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

const handleTaskView = () => {
  isVisible = !isVisible;
  $taskListContainer.style.display = "grid";
  $noTask.style.display = "none";

  toggleInputContainer(isVisible, handleAddTask);
  if (!isVisible)
    renderTasks(
      filteredOrSearchableTasks.length ? filteredOrSearchableTasks : tasks
    );
};

const handleSearchTasks = () => {
  // Sanitize and retrieve the input value
  const searchTitle = sanitizeInput($searchInput.value).toLowerCase();
  const overlay = showSpinnerOverlay($taskListContainer);
  setTimeout(() => {
    // Use early return to handle empty search scenario
    if (!searchTitle) {
      renderTasks(tasks);
      return;
    }
    // Filter tasks based on the sanitized input
    const filteredTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTitle.toLowerCase())
    );
    // Render based on the filtering result
    if (filteredTasks.length > 0) {
      renderTasks(filteredTasks);
    } else {
      showToastMessage("No tasks found matching the search.");
    }
    hideSpinnerOverlay(overlay);
    // Clear the input field
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
    if (task === undefined) {
      return;
    }

    task.done = true;
    task.isEditing = false;
    renderTasks(tasks);
    hideSpinnerOverlay(overlay);
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

$noTask.addEventListener("click", handleTaskView);
$createButton.addEventListener("click", handleTaskView);
$searchButton.addEventListener("click", handleSearchTasks);

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
