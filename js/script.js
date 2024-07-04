import {
  $mainContainer,
  $addButton,
  $taskList,
  $searchInput,
  $searchButton,
  $splash,
  $noTask,
  $taskListContainer,
  $loadMore,
  $createButton,
  $taskAddBox,
} from "./elements.js";
import {
  showToastMessage,
  handleInputChange,
  toggleInputContainer,
  containerBuilder,
  createContainerBuilder,
} from "./utilities.js";

let tasks = [];

const addButtonHandler = () => {
  const taskTitle = document.getElementById("task-input").value.trim();
  if (taskTitle) {
    createTask(taskTitle);
    showToastMessage("√ Changes are saved successfully", true);
  } else {
    showToastMessage("We couldn't save your changes", false);
  }
};

const createButtonHandler = () => {
  $taskListContainer.style.display = "grid";
  $noTask.style.display = "none";

  let inputContainer = createContainerBuilder(addButtonHandler);
  $taskListContainer.appendChild(inputContainer);

  toggleInputContainer();
};

const searchButtonHandler = () => {
  const searchTitle = $searchInput.value.trim();

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
  $searchInput.value = "";
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
  if (newTitle.trim().length > 0) {
    task.title = newTitle.trim();
  }
  cancelEdit();
  renderTasks(tasks);
};

const doneHandler = (taskId) => {
  const task = tasks.find((task) => task.id === taskId);
  if (task) {
    task.done = !task.done;
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
    containerBuilder(task, doneHandler, editHandler, deleteHandler, updateHandler);
  });

  if (tasks.length === 0) {
    $noTask.style.display = "block";
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
    $mainContainer.hidden = false;
    if (tasks.length === 0) {
      renderNoTasks();
    }
  }, 1000);
});

$noTask.addEventListener("click", createButtonHandler);
$createButton.addEventListener("click", createButtonHandler);
$searchButton.addEventListener("click", searchButtonHandler);
