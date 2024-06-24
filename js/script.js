const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("btn-add");
const unoderedList = document.getElementById("tasks");

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
        alert("Please provide valid Task.");
};


addButton.addEventListener("click",addTaskHandler);