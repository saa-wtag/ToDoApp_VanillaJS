import {
  $taskInput,
  $addButton,
  $taskList,
  $searchInput,
  $searchButton,
} from "./elements.js";
import {
  showToastMessage,
  createTaskElement,
  sanitizeInput,
  formatDate,
  successMessage,
  invalidMessage,
  noTaskMessage,
} from "./utilities.js";

let tasks = [];

const addButtonHandler = () => {
  const taskTitle = sanitizeInput($taskInput.value);
  if (taskTitle) {
    createTask(taskTitle);
    showToastMessage(successMessage);
    $addButton.disabled = true;
  } else {
    showToastMessage(invalidMessage);
  }
};

const searchButtonHandler = () => {
  // Sanitize and retrieve the input value
  const searchTitle = sanitizeInput($searchInput.value.trim());
  // Clear the input field
  $searchInput.value = "";
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
};

const deleteTask = (taskId) => {
  tasks = tasks.filter((task) => task.id !== taskId);
  renderTasks(tasks);
};

const editTask = (task) => {
  task.isEditing = true;
  renderTasks(tasks);
};

const updateTask = (task, newTitle) => {
  if (newTitle) {
    task.title = newTitle;
    task.isEditing = false;
  }
  renderTasks(tasks);
};

const completeTask = (taskId) => {
  const task = tasks.find((task) => task.id === taskId);

  if (task === undefined) {
    return;
  }

  task.done = true;
  task.isEditing = false;

  renderTasks(tasks);
};

const createTask = (taskTitle) => {
  const task = {
    id: new Date().getTime(),
    title: taskTitle,
    createdAt: formatDate(new Date()),
  };
  tasks.unshift(task);
  renderTasks(tasks);
  $taskInput.value = "";
};

const renderTasks = (tasks = []) => {
  $taskList.innerHTML = "";

  tasks.forEach((task) => {
    const $taskElement = createTaskElement(
      task,
      deleteTask,
      editTask,
      updateTask,
      cancelEdit,
      completeTask
    );
    $taskList.appendChild($taskElement);
  });
};

const cancelEdit = (curTask) => {
  tasks.forEach((task) => {
    if (task.id === curTask.id) task.isEditing = false;
  });
  renderTasks(tasks);
};

$taskInput.addEventListener("input", () => {
  if ($taskInput.value.trim()) {
    $addButton.disabled = false;
  } else {
    $addButton.disabled = true;
  }
});

$addButton.addEventListener("click", addButtonHandler);
$searchButton.addEventListener("click", searchButtonHandler);
