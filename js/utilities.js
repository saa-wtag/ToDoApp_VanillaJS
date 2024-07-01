import { $toaster } from "./elements.js";

export const showToastMessage = (message) => {
  $toaster.textContent = message;
  $toaster.hidden = false;
  setTimeout(() => {
    $toaster.hidden = true;
  }, 3000);
};

export const sanitizeInput = (value) => {
  const reg = /[&<>"'/`]/gi;
  return value.replace(reg, "").trim();
};

export const createElement = (text, type, onClick) => {
  const $element = document.createElement(type);
  $element.innerText = text;
  if(onClick)
    $element.addEventListener("click", onClick);
  return $element;
};