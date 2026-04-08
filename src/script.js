const inputEl = document.getElementById("input");
const resultDiv = document.getElementById("result");
const addBtn = document.getElementById("add");
const resetBtn = document.getElementById("reset");

// Görevleri localStorage'dan al
// Artık her görev bir nesne: { text: "görev metni", completed: false }
let tasks = JSON.parse(localStorage.getItem("resultDiv")) || [];

// Önceki görevleri yeni formata dönüştür (eski kod için geçiş)
tasks = tasks.map((task) =>
  typeof task === "string" ? { text: task, completed: false } : task
);

// Görevleri ekrana yazdır
function renderTasks() {
  resultDiv.innerHTML = `<h2 id="h2-header">LİST</h2>`;
  tasks.forEach((task, index) => {
    resultDiv.innerHTML += `
      <p class="task-item ${task.completed ? "completed" : ""}">
        <input type="checkbox" class="task-checkbox" data-index="${index}" ${
      task.completed ? "checked" : ""
    }>
        <span class="task-text">${task.text}</span>
        <button class="delete-btn" data-index="${index}">🗑️</button>
      </p>`;
  });
}
renderTasks();

// Görevleri localStorage'a kaydet
function saveTasks() {
  localStorage.setItem("resultDiv", JSON.stringify(tasks));
}

// Yeni görev ekleme
addBtn.addEventListener("click", () => {
  const taskText = inputEl.value.trim();
  if (taskText === "") {
    alert("Görev giriniz..");
    return;
  }

  // Yeni görev bir nesne olarak eklenir
  tasks.push({ text: taskText, completed: false });
  saveTasks();
  renderTasks();
  inputEl.value = "";
});

// Enter tuşu ile görev ekleme
inputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addBtn.click();
  }
});

// Silme ve tamamlama için delegasyon
resultDiv.addEventListener("click", (e) => {
  // Silme butonu
  if (e.target.classList.contains("delete-btn")) {
    const index = e.target.dataset.index;
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }

  // Checkbox değişikliği
  if (e.target.classList.contains("task-checkbox")) {
    const index = e.target.dataset.index;
    tasks[index].completed = e.target.checked;
    saveTasks();
    renderTasks();
  }
});

// Reset tüm listeyi temizler
resetBtn.addEventListener("click", () => {
  tasks = [];
  localStorage.removeItem("resultDiv");
  renderTasks();
});
