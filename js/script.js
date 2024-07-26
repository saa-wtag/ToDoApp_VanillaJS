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
  formatDate,
  handleSpinner,
} from "./utilities.js";
import { MESSAGES } from "./const.js";

let tasks = [];
let isTaskInputVisible = false;

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
  if (!isTaskInputVisible) renderTasks(tasks);
};

const handleSearchTasks = () => {
  const searchTitle = sanitizeInput($searchInput.value.trim());
  handleSpinner($taskListContainer, () => {
    if (!searchTitle) {
      renderTasks(tasks);
      return;
    }
    const filteredTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTitle.toLowerCase())
    );
    if (filteredTasks.length > 0) {
      renderTasks(filteredTasks);
    } else {
      showToastMessage("No tasks found matching the search.");
    }
    $searchInput.value = "";
  });
};

const deleteTask = (taskId, container) => {
  handleSpinner(container, () => {
    tasks = tasks.filter((task) => task.id !== taskId);
    renderTasks(tasks);
  });
};

const editTask = (task) => {
  task.isEditing = true;
  renderTasks(tasks);
};

const updateTask = (task, container, newTitle) => {
  if (newTitle) {
    handleSpinner(container, () => {
      task.title = newTitle;
      task.isEditing = false;
      renderTasks(tasks);
    });
  }
};

const completeTask = (taskId, container) => {
  handleSpinner(container, () => {
    const task = tasks.find((task) => task.id === taskId);
    if (task) {
      task.done = true;
      task.isEditing = false;
      renderTasks(tasks);
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
  renderTasks(tasks);
};

const renderTasks = (tasksToRender = tasks) => {
  $taskListContainer.innerHTML = "";
  tasksToRender.forEach((task) => {
    containerBuilder(task, completeTask, editTask, deleteTask, updateTask);
  });

  $noTask.style.display = tasksToRender.length === 0 ? "flex" : "none";
};

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
