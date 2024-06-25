const taskInput = document.getElementById("task-input");
const addButton = document.getElementById("btn-add");
const unoderedList = document.getElementById("tasks");

let tasks = [];
const addTaskHandler = ()=>{
    const taskTitle = taskInput.value.trim()+" ";
    if(taskTitle){
        createTask(taskTitle);
    }
    else
        alert("Please provide valid Task.");
};


const createTask = (taskTitle)=>{
    const task = {
        id: new Date().getTime(),
        title: taskTitle
    };
    tasks.unshift(task);
    renderTasks();

    taskInput.value = "";
};

const deleteHandler = (taskId) => {
    tasks = tasks.filter((task) => task.id !== taskId);
    renderTasks();
};

const renderTasks = () => {
    unoderedList.innerHTML = '';

    tasks.forEach((task) => {
        const tasksList = document.createElement("li");
        tasksList.textContent = task.title;

        const deleteButton = document.createElement("button");
              deleteButton.innerText = "Delete";
        deleteButton.addEventListener("click", () => deleteHandler(task.id));

        tasksList.appendChild(deleteButton);
        unoderedList.appendChild(tasksList);
    });
};



addButton.addEventListener("click",addTaskHandler);