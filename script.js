const inputNewTask = document.querySelector(".input__new-task");
const taskContainer = document.querySelector(".container__tasks");
const labelWelcome = document.querySelector(".container__welcome-title");
const labelDate = document.querySelector(".container__welcome-date");

const btnAdd = document.querySelector(".btn__add-task");
const btnDel = document.querySelector(".btn__delete-task");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

// calling greetings method to show greetings
greetings();

// displaying all todos stored in local storage
if (localStorage.getItem("todos")) {
    todos.map((task) => {
        this.createNewTaskEl(task);
    });
}

function greetings() {
    // Get the current time and display it in a nice way on welcome page
    const now = new Date();
    const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
    };
    const [day, month, date] = new Intl.DateTimeFormat(
        `${navigator.language}`,
        options
    )
        .format(now)
        .split(" ");
    labelDate.textContent = `It's ${day} ${month.slice(0, 3)} ${date}`;

    let dayTime = "";
    if (now.getHours() <= 11) dayTime += "Morning";
    else if (now.getHours() <= 16) dayTime += "Afternoon";
    else dayTime += "Evening";
    labelWelcome.textContent = `Good ${dayTime}`;
}

function createNewTaskEl(task) {
    // creating markup for the task
    const html = `
        <div class="task ${task.isCompleted ? 'completed' : ''}" id="${task.id}">
            <span>
                <input type="checkbox" title="Complete" class="check-task" ${
                    task.isCompleted ? "checked" : ""
                } />
                <p class="task__title" ${
                    !task.isCompleted ? "contenteditable = 'true'" : ""
                }>
                    ${task.name}
                </p>
            </span>
            <button title="Remove the ${
                task.name
            } task" class="btn__delete-task">&#10006;</button>
        </div>
        `;

    // inserting in the task container
    taskContainer.insertAdjacentHTML("beforeend", html);
}

function addTask() {
    const inputValue = inputNewTask.value;
    // checking for the empty input
    if (inputValue === "" || inputValue === " ") {
        // adding jiggle animation on empty input
        document
            .querySelector(".container__new-task")
            .classList.add("showJiggle");

        // removing animation class after it ends
        document
            .querySelector(".container__new-task")
            .addEventListener("animationend", function () {
                this.classList.remove("showJiggle");
            });
    } else {
        // creating task object to store in local storage
        const task = {
            id: new Date().getTime(),
            name: inputValue,
            isCompleted: false,
        };

        todos.push(task);
        // storing in local storage
        localStorage.setItem("todos", JSON.stringify(todos));

        // create task el
        createNewTaskEl(task);
    }
    // Reset value of the text field after adding a new task to it
    inputNewTask.value = "";
}

function removeTask(taskId) {
    // updating the todos array by removing the specified todo
    todos = todos.filter((todo) => todo.id !== parseInt(taskId));

    // updating the local storage
    localStorage.setItem("todos", JSON.stringify(todos));

    // removing todo from UI
    document.getElementById(taskId).remove();
}

function disabledTodo() {
    const taskId = this.closest("div").id;
    console.log(taskId);
}

function updateTask(taskId, el) {
    const task = todos.find((task) => (task.id = parseInt(taskId)));
    if (el.hasAttribute("contenteditable")) {
        task.name = el.textContent;
    } else {
        task.isCompleted = !task.isCompleted;

        if (task.isCompleted) {
            el.nextElementSibling.removeAttribute("contenteditable");
            el.closest(".task").classList.add("completed");
        } else {
            el.nextElementSibling.removeAttribute("contenteditable", "true");
            el.closest(".task").classList.remove("completed");
        }
    }

    localStorage.setItem("todos", JSON.stringify(todos));
}

//====================================================
// * EVENT LISTENERS
//====================================================
// adding new task
btnAdd.addEventListener("click", () => {
    addTask();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

// removing task
taskContainer.addEventListener("click", (e) => {
    if (
        e.target.classList.contains("btn__delete-task") ||
        e.target.parentElement.classList.contains("btn__delete-task")
    ) {
        // putting animation fading-out when the todo is being deleted
        e.target.parentElement.classList.add("fade-out");
        // removing fade-out class after the transition ends
        e.target.parentElement.addEventListener("transitionend", function () {
            // removing the specified todo
            const taskId = e.target.closest("div").id;
            removeTask(taskId);
        });
    }
});

// updating task
taskContainer.addEventListener('input', function(e){
    const el = e.target;
    const parent = el.closest('.task');
    const task = todos.find(todo => todo.id === parseInt(parent.id));
    if(el.hasAttribute('contenteditable')){
        task.name = el.textContent;
    } else {
        task.isCompleted = !task.isCompleted;
        if(task.isCompleted){
            parent.classList.add('completed');
            el.nextElementSibling.removeAttribute('contenteditable');
        } else {
            parent.classList.remove('completed');
            el.nextElementSibling.setAttribute('contenteditable', 'true');
        }
    }

    // updating local storage
    localStorage.setItem('todos', JSON.stringify(todos));
})

// to prevent using enter key while editing the task
taskContainer.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        e.target.blur();
    }
});
