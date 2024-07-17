import {
  $mainContainer,
  $searchInput,
  $searchButton,
  $splash,
  $noTask,
  $taskListContainer,
  $createButton,
} from "./elements.js";
import {
  showToastMessage,
  sanitizeInput,
  toggleInputContainer,
  containerBuilder,
  showSpinnerOverlay,
  hideSpinnerOverlay,
  formatDate,
} from "./utilities.js";
import { MESSAGES } from "./const.js";

let tasks = [];
let isVisible = false;

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
  if (!isVisible) renderTasks(tasks);
};

const handleSearchTasks = () => {
  // Sanitize and retrieve the input value
  const searchTitle = sanitizeInput($searchInput.value.trim());
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

$noTask.addEventListener("click", handleTaskView);
$createButton.addEventListener("click", handleTaskView);
$searchButton.addEventListener("click", handleSearchTasks);
