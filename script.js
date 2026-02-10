const todoData = {};
const todo = document.getElementById("todo");
const inProgress = document.getElementById("progress");
const done = document.getElementById("done");
const tasks = document.querySelectorAll(".task");
const showFromButton = document.querySelector("nav button");
const hideFromButton = document.querySelector(".close-button");
const formContainer = document.querySelector(".modal");
let draggedTask = null;

tasks.forEach((task) => {
  task.addEventListener("dragstart", (e) => {
    draggedTask = task;
  });
});

const columns = [todo, inProgress, done];

function loadData() {
  const savedData = JSON.parse(localStorage.getItem("todoData"));
  for (const columnId in savedData) {
    const column = document.getElementById(columnId);
    savedData[columnId].forEach((task) => {
      addTask(task.title, task.desc, column);
    });
  }
  updateTaskCounts();
}

function updateTaskCounts() {
  columns.forEach((column) => {
    const countSpan = column.querySelector(".taskCount");
    const taskCount = column.querySelectorAll(".task").length;
    countSpan.textContent = `Tasks: ${taskCount}`;
    todoData[column.id] = Array.from(column.querySelectorAll(".task")).map(
      (task) => ({
        title: task.querySelector(".task-title").textContent,
        desc: task.querySelector(".task-desc").textContent,
      })
    );
    localStorage.setItem("todoData", JSON.stringify(todoData));
  });
}

function allowDrop() {
  columns.forEach((column) => {
    column.addEventListener("dragover", (e) => {
      column.classList.add("drag-over");
      e.preventDefault();
    });
    column.addEventListener("drop", (e) => {
      if (draggedTask) {
        column.appendChild(draggedTask);
        column.classList.remove("drag-over");
      }
      updateTaskCounts();
    });
    column.addEventListener("dragleave", (e) => {
      column.classList.remove("drag-over");
    });
  });
}

function formToggle() {
  showFromButton.addEventListener("click", () => {
    formContainer.classList.remove("hidden");
  });

  hideFromButton.addEventListener("click", () => {
    formContainer.classList.add("hidden");
  });
}

function addTask(title, desc, column) {
  const task = document.createElement("div");
  task.classList.add("task");
  task.setAttribute("draggable", "true");
  task.innerHTML = `<h3 class="task-title">${title}</h3>
            <p class="task-desc">${desc}</p>
            <button class="delete-button">Delete</button>`;
  column.appendChild(task);
  task.addEventListener("dragstart", (e) => {
    draggedTask = task;
  });
  task.querySelector(".delete-button").addEventListener("click", () => {
    task.remove();
    updateTaskCounts();
  });
  updateTaskCounts();
}

function formSubmit() {
  const form = document.getElementById("task-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("task-title").value;
    const desc = document.getElementById("task-desc").value;
    addTask(title, desc, todo);
    form.reset();
    formContainer.classList.add("hidden");
  });

  updateTaskCounts();
}

loadData();
allowDrop();
formToggle();
formSubmit();
