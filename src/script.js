const inputEl = document.getElementById("input");
const taskList = document.getElementById("task-list");
const addBtn = document.getElementById("add");
const resetBtn = document.getElementById("reset");
const subtitle = document.getElementById("subtitle");
const filterBtns = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateSubtitle() {
  const remaining = tasks.filter((t) => !t.completed).length;
  subtitle.textContent =
    remaining === 0 ? "Harika, her şey tamam! 🎉" : `${remaining} görev kaldı`;
}

function getFilteredTasks() {
  if (currentFilter === "active") return tasks.filter((t) => !t.completed);
  if (currentFilter === "completed") return tasks.filter((t) => t.completed);
  return tasks;
}

function renderTasks() {
  const filtered = getFilteredTasks();
  taskList.innerHTML = "";

  if (filtered.length === 0) {
    taskList.innerHTML = `<li class="empty-state">Henüz görev yok 🎉</li>`;
    updateSubtitle();
    return;
  }

  filtered.forEach((task) => {
    const realIndex = tasks.indexOf(task);
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;
    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" data-index="${realIndex}" ${task.completed ? "checked" : ""}>
      <span class="task-text">${task.text}</span>
      <button class="delete-btn" data-index="${realIndex}">✕</button>
    `;
    taskList.appendChild(li);
  });

  updateSubtitle();
}

function addTask() {
  const text = inputEl.value.trim();
  if (!text) {
    inputEl.focus();
    inputEl.style.borderColor = "#ff4757";
    setTimeout(() => (inputEl.style.borderColor = ""), 800);
    return;
  }
  tasks.unshift({ text, completed: false });
  saveTasks();
  renderTasks();
  inputEl.value = "";
  inputEl.focus();
}

addBtn.addEventListener("click", addTask);

inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

taskList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const index = +e.target.dataset.index;
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }

  if (e.target.classList.contains("task-checkbox")) {
    const index = +e.target.dataset.index;
    tasks[index].completed = e.target.checked;
    saveTasks();
    renderTasks();
  }
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

resetBtn.addEventListener("click", () => {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  renderTasks();
});

renderTasks();
