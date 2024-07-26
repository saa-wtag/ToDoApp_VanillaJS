import {
  $mainContainer,
  $searchInput,
  $searchButton,
  $splash,
  $noTask,
  $taskListContainer,
  $createButton,
  $filterAllButton,
  $filterIncompleteButton,
  $filterCompleteButton,
  $loadMore,
} from "./elements.js";
import {
  showToastMessage,
  sanitizeInput,
  toggleInputContainer,
  containerBuilder,
  formatDate,
  setActiveButton,
  handleSpinner,
} from "./utilities.js";
import { MESSAGES, TASK_PER_PAGE } from "./const.js";

let tasks = [];
let isTaskInputVisible = false;
let currentFilter = "all";
let filteredOrSearchableTasks = [];
let tasksDisplayed = TASK_PER_PAGE;

const filteredSearchableTasksOrTasks = filteredOrSearchableTasks.length
  ? filteredOrSearchableTasks
  : tasks;

const handleAddTask = (container) => {
  isTaskInputVisible = !isTaskInputVisible;
  const taskTitle = sanitizeInput(document.getElementById("taskInput").value);

  if (taskTitle) {
    handleSpinner(container, () => {
      createTask(taskTitle);
      showToastMessage(MESSAGES.SUCCESS, true);
    });
  } else {
    showToastMessage(MESSAGES.ERROR, false);
  }
};

const toggleTaskInput = () => {
  isTaskInputVisible = !isTaskInputVisible;
  $taskListContainer.style.display = "grid";
  $noTask.style.display = "none";

  toggleInputContainer(isTaskInputVisible, handleAddTask);
  if (!isTaskInputVisible) renderTasks(filteredSearchableTasksOrTasks);
};

const handleSearchTasks = () => {
  const searchTitle = sanitizeInput($searchInput.value.trim()).toLowerCase();
  handleSpinner($taskListContainer, () => {
    filterTasks(searchTitle);
    if (filteredOrSearchableTasks.length === 0) {
      showToastMessage("No tasks found matching the search.");
    }
    $searchInput.value = "";
  });
};

const deleteTask = (taskId, container) => {
  handleSpinner(container, () => {
    tasks = tasks.filter((task) => task.id !== taskId);
    filterTasks();
  });
};

const editTask = (task) => {
  task.isEditing = true;
  renderTasks(filteredSearchableTasksOrTasks);
};

const updateTask = (task, container, newTitle) => {
  if (newTitle) {
    handleSpinner(container, () => {
      task.title = newTitle;
      task.isEditing = false;
      filterTasks();
    });
  }
};

const completeTask = (taskId, container) => {
  handleSpinner(container, () => {
    const task = tasks.find((task) => task.id === taskId);
    if (task) {
      task.done = true;
      task.isEditing = false;
      filterTasks();
    }
  });
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
  filteredOrSearchableTasks = tasks;
  tasksDisplayed = TASK_PER_PAGE;
  filterTasks();
};

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

const renderTasks = (tasksToRender = filteredOrSearchableTasks) => {
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
    tasksDisplayed + TASK_PER_PAGE,
    filteredOrSearchableTasks.length || tasks.length
  );
  renderTasks(filteredSearchableTasksOrTasks);
});

const renderNoTasks = () => {
  $taskListContainer.style.display = "none";
};

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    $splash.style.display = "none";
    isTaskInputVisible = false;
    $mainContainer.hidden = false;
    if (tasks.length === 0) {
      renderNoTasks();
    }
  }, 1000);
});

$noTask.addEventListener("click", toggleTaskInput);
$createButton.addEventListener("click", toggleTaskInput);
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
