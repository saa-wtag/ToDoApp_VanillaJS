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
  toggleInputContainer,
  containerBuilder,
  showSpinnerOverlay,
  hideSpinnerOverlay,
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
  const taskTitle = document.getElementById("task-input").value.trim();
  if (taskTitle) {
    const $overlay = showSpinnerOverlay(container);
    setTimeout(() => {
      createTask(taskTitle);
      showToastMessage(MESSAGES.SUCCESS, true);
      hideSpinnerOverlay($overlay);
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
  const searchTitle = $searchInput.value.trim().toLowerCase();
  const $overlay = showSpinnerOverlay($taskListContainer);

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
      tasksDisplayed = 0;
      renderTasks(filteredOrSearchAbleTasks);
    } else {
      showToastMessage(MESSAGES.NO_TASKS_FOUND);
    }

    hideSpinnerOverlay($overlay);
    $searchInput.value = "";
  }, 1000);
};

const deleteHandler = (taskId, container) => {
  const $overlay = showSpinnerOverlay(container);
  setTimeout(() => {
    tasks = tasks.filter((task) => task.id !== taskId);
    renderTasks(tasks);
    hideSpinnerOverlay($overlay);
  }, 1000);
};

const editHandler = (task) => {
  cancelEdit();
  task.editMode = true;
  renderTasks(tasks);
};

const updateHandler = (task, container, newTitle) => {
  if (newTitle.length > 0) {
    const $overlay = showSpinnerOverlay(container);
    setTimeout(() => {
      task.title = newTitle;
      cancelEdit();
      renderTasks(tasks);
      hideSpinnerOverlay($overlay);
    }, 1000);
  }
};

const doneHandler = (taskId, container) => {
  const $overlay = showSpinnerOverlay(container);
  setTimeout(() => {
    const task = tasks.find((task) => task.id === taskId);
    if (task) {
      task.done = !task.done;
      cancelEdit();
      renderTasks(tasks);
    }
    hideSpinnerOverlay($overlay);
  }, 1000);
};

const createTask = (taskTitle) => {
  tasks.unshift({
    id: new Date().getTime(),
    title: taskTitle,
    done: false,
    editMode: false,
  });
  tasksDisplayed = 0;
  renderTasks(tasks);
};

const renderTasks = (tasksToRender) => {
  if (tasksDisplayed === 0) {
    $taskListContainer.innerHTML = "";
  }

  const paginatedTasks = tasksToRender.slice(
    tasksDisplayed,
    tasksDisplayed + tasksPerPage
  );

  paginatedTasks.forEach((task) => {
    containerBuilder(
      task,
      doneHandler,
      editHandler,
      deleteHandler,
      updateHandler
    );
  });

  tasksDisplayed += paginatedTasks.length;

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
  renderTasks(
    filteredOrSearchAbleTasks.length ? filteredOrSearchAbleTasks : tasks
  );
});

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

$filterAllButton.addEventListener("click", () => {
  currentFilter = "all";
  filteredOrSearchAbleTasks = [...tasks];
  filterTasks();
});

$filterIncompleteButton.addEventListener("click", () => {
  currentFilter = "incomplete";
  filterTasks();
});

$filterCompleteButton.addEventListener("click", () => {
  currentFilter = "complete";
  filterTasks();
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

  tasksDisplayed = 0;
  renderTasks(filteredTasks);
};
