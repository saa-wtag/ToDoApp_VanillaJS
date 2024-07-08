export const COLORS = {
  SUCCESS: "#0BC375",
  ERROR: "#E85F5F",
  DEFAULT: "#ffffff",
};

export const ICONS = {
  DELETE: "./icons/delete-icon.svg",
  EDIT: "./icons/edit-icon.svg",
  DONE: "./icons/done-icon.svg",
  SPINNER: "./icons/spinner-icon.svg",
};

export const MESSAGES = {
  SUCCESS: "√ Changes are saved successfully",
  ERROR: "We couldn't save your changes",
  NO_TASKS_FOUND: "No tasks found matching the search.",
};

export const TASK_BUTTON_CLASSES = ["task-buttons"];
export const TASK_CONTAINER_CLASSES = ["task-container"];
export const FILTER_BUTTON_CLASSES = ["filters-button"];
export const CARD_BUTTON_CLASSES = ["card-buttons"];
export const TASK_TITLE_CLASSES = ["task-title"];

export const OVERLAY_STYLES = {
  position: "absolute",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(240, 240, 240, 0.4)",
  zIndex: "9999",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const SPINNER_STYLES = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};
