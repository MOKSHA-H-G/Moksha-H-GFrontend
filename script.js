let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskForm = document.getElementById("taskForm");
const taskFormSection = document.getElementById("taskFormSection");

const addTaskBtn = document.getElementById("addTaskBtn");
const cancelBtn = document.getElementById("cancelBtn");

const taskList = document.getElementById("taskList");
const noTasks = document.getElementById("noTasks");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");


// Show form
addTaskBtn.addEventListener("click", () => {

    taskForm.reset();

    document.getElementById("taskId").value = "";

    document.getElementById("formTitle").textContent = "Add Task";

    taskFormSection.classList.remove("hidden");
});


// Cancel form
cancelBtn.addEventListener("click", () => {

    taskFormSection.classList.add("hidden");

    taskForm.reset();
});


// Add / Update task
taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const id = document.getElementById("taskId").value;

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const priority = document.getElementById("priority").value;
    const status = document.getElementById("status").value;
    const dueDate = document.getElementById("dueDate").value;

    // Clear errors
    document.getElementById("titleError").textContent = "";
    document.getElementById("priorityError").textContent = "";
    document.getElementById("dateError").textContent = "";

    let valid = true;

    // Validation
    if (title === "") {
        document.getElementById("titleError").textContent =
            "Task title is required.";
        valid = false;
    }

    if (priority === "") {
        document.getElementById("priorityError").textContent =
            "Please select priority.";
        valid = false;
    }

    if (dueDate === "") {
        document.getElementById("dateError").textContent =
            "Due date is required.";
        valid = false;
    }

    if (!valid) {
        return;
    }


    // Update existing task
    if (id) {

        const task = tasks.find(task => task.id == id);

        task.title = title;
        task.description = description;
        task.priority = priority;
        task.status = status;
        task.dueDate = dueDate;

    }

    // Create new task
    else {

        const newTask = {

            id: Date.now(),

            title: title,

            description: description,

            priority: priority,

            status: status,

            dueDate: dueDate

        };

        tasks.push(newTask);
    }


    saveTasks();

    taskForm.reset();

    taskFormSection.classList.add("hidden");

    displayTasks();
});


// Display tasks
function displayTasks() {

    const searchText = searchInput.value.toLowerCase();

    const selectedStatus = statusFilter.value;

    const filteredTasks = tasks.filter(task => {

        const matchesSearch =
            task.title.toLowerCase().includes(searchText);

        const matchesStatus =
            selectedStatus === "All" ||
            task.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });


    taskList.innerHTML = "";


    if (filteredTasks.length === 0) {

        noTasks.style.display = "block";

    } else {

        noTasks.style.display = "none";
    }


    filteredTasks.forEach(task => {

        const taskCard = document.createElement("div");

        taskCard.className = "task-card";

        taskCard.innerHTML = `

            <div class="task-header">

                <h3>${task.title}</h3>

                <div class="task-actions">

                    <button
                        class="edit-btn"
                        onclick="editTask(${task.id})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteTask(${task.id})">
                        Delete
                    </button>

                </div>

            </div>

            <p>${task.description}</p>

            <div class="task-info">

                <span class="badge">
                    Priority: ${task.priority}
                </span>

                <span class="badge">
                    Status: ${task.status}
                </span>

                <span class="badge">
                    Due: ${task.dueDate}
                </span>

            </div>

        `;

        taskList.appendChild(taskCard);
    });


    updateStatistics();
}


// Edit task
function editTask(id) {

    const task = tasks.find(task => task.id === id);

    document.getElementById("taskId").value = task.id;

    document.getElementById("title").value = task.title;

    document.getElementById("description").value =
        task.description;

    document.getElementById("priority").value =
        task.priority;

    document.getElementById("status").value =
        task.status;

    document.getElementById("dueDate").value =
        task.dueDate;

    document.getElementById("formTitle").textContent =
        "Edit Task";

    taskFormSection.classList.remove("hidden");
}


// Delete task
function deleteTask(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this task?");

    if (!confirmDelete) {
        return;
    }

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    displayTasks();
}


// Save tasks
function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


// Statistics
function updateStatistics() {

    const total = tasks.length;

    const pending =
        tasks.filter(task => task.status === "Pending").length;

    const progress =
        tasks.filter(task => task.status === "In Progress").length;

    const completed =
        tasks.filter(task => task.status === "Completed").length;


    document.getElementById("totalTasks").textContent =
        total;

    document.getElementById("pendingTasks").textContent =
        pending;

    document.getElementById("progressTasks").textContent =
        progress;

    document.getElementById("completedTasks").textContent =
        completed;
}


// Search
searchInput.addEventListener("input", displayTasks);


// Filter
statusFilter.addEventListener("change", displayTasks);


// Initial display
displayTasks();