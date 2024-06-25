const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("btn-add");
const unoderedList = document.getElementById("tasks");
const notification = document.getElementById("message");

let tasks = [];
const addTaskHandler = ()=>{
    const taskTitle = taskInput.value.trim();
    if(taskTitle){
        tasks.unshift(taskTitle);
        const tasksList = document.createElement("li");
        tasksList.textContent = taskTitle;
        unoderedList.prepend(tasksList);
        taskInput.value = "";
    }
    else
        showMessage("Please provide valid Task.");
};

const showMessage = (message) => {
    notification.textContent = message;
    notification.hidden=false;
    setTimeout(() => {
        notification.hidden=true;
    }, 1000);
};

addButton.addEventListener("click",addTaskHandler);