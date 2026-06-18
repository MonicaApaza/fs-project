const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const addTask = () => {
  const taskText = taskInput.value.trim();
  if (!taskText) return;
  const li = document.createElement("li");
  const taskSpan = document.createElement("span");
  taskSpan.textContent = taskText;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Eliminar";
  deleteButton.classList.add("delete-btn");
  deleteButton.addEventListener("click", () => {
    li.remove();
  });

  li.appendChild(taskSpan);
  li.appendChild(deleteButton);
  taskList.appendChild(li);
  taskInput.value = "";
  taskInput.focus();
};

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});
