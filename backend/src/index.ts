const express = require("express");

const app = express();
const PORT = 1234;

app.use(express.json());

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

const tasks: Task[] = [
  { id: 1, text: "Estudiar Node.js", completed: false },
  { id: 2, text: "Crear servidor Express", completed: true },
  { id: 3, text: "Probar rutas del backend", completed: false },
];

let nextId = 4;

app.get("/", (req: any, res: any) => {
  res.send("Backend is working!");
});

app.get("/tasks", (req: any, res: any) => res.json(tasks));

// POST /tasks — create a new task
app.post("/tasks", (req: any, res: any) => {
  const { text } = req.body;
  if (!text || typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ message: "Field 'text' is required" });
  }

  const newTask: Task = {
    id: nextId++,
    text: text.trim(),
    completed: false,
  };
  tasks.push(newTask);

  res.status(201).json({ message: "Task created successfully", task: newTask });
});

// PUT /tasks/:id — full update (text + completed)
app.put("/tasks/:id", (req: any, res: any) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const { text, completed } = req.body;
  if (!text || typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ message: "Field 'text' is required" });
  }
  if (typeof completed !== "boolean") {
    return res.status(400).json({ message: "Field 'completed' must be a boolean" });
  }

  tasks[taskIndex] = { id, text: text.trim(), completed };
  res.json({ message: "Task updated successfully", task: tasks[taskIndex] });
});

// PATCH /tasks/:id — partial update (text and/or completed)
app.patch("/tasks/:id", (req: any, res: any) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const task = tasks[taskIndex];
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const { text, completed } = req.body;
  if (text !== undefined) {
    if (typeof text !== "string" || text.trim() === "") {
      return res.status(400).json({ message: "Field 'text' must be a non-empty string" });
    }
    task.text = text.trim();
  }
  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res.status(400).json({ message: "Field 'completed' must be a boolean" });
    }
    task.completed = completed;
  }

  res.json({ message: "Task updated successfully", task });
});

// DELETE /tasks/:id
app.delete("/tasks/:id", (req: any, res: any) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks.splice(taskIndex, 1);
  res.json({ message: "Task deleted successfully", tasks });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
