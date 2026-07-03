const {PrismaClient} = require("@prisma/client");
const express = require("express");


const app = express();
const PORT = 1234;

const prisma = new PrismaClient();

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

app.get("/tasks", async (req: any, res: any) => {
  const tasksDB = await prisma.task.findMany();
  res.json(tasksDB);
});

// POST /tasks — create a new task
app.post("/tasks", async (req: any, res: any) => {
  const { text } = req.body;
  if (!text || typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ message: "Field 'text' is required" });
  }

  const newTask = await prisma.task.create({
    data: {
      text: text.trim(),
      completed: false,
    },
  });

  res.status(201).json({ message: "Task created successfully", task: newTask });
});

// PUT /tasks/:id — full update (text + completed)
app.put("/tasks/:id", async (req: any, res: any) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid task id" });
  }

  const { text, completed } = req.body;
  if (!text || typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ message: "Field 'text' is required" });
  }
  if (typeof completed !== "boolean") {
    return res.status(400).json({ message: "Field 'completed' must be a boolean" });
  }

  const existingTask = await prisma.task.findUnique({ where: { id } });
  if (!existingTask) {
    return res.status(404).json({ message: "Task not found" });
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: { text: text.trim(), completed },
  });

  res.json({ message: "Task updated successfully", task: updatedTask });
});

// PATCH /tasks/:id — partial update (text and/or completed)
app.patch("/tasks/:id", async (req: any, res: any) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid task id" });
  }

  const existingTask = await prisma.task.findUnique({ where: { id } });
  if (!existingTask) {
    return res.status(404).json({ message: "Task not found" });
  }

  const { text, completed } = req.body;
  const data: { text?: string; completed?: boolean } = {};

  if (text !== undefined) {
    if (typeof text !== "string" || text.trim() === "") {
      return res.status(400).json({ message: "Field 'text' must be a non-empty string" });
    }
    data.text = text.trim();
  }
  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res.status(400).json({ message: "Field 'completed' must be a boolean" });
    }
    data.completed = completed;
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: "At least one field ('text' or 'completed') is required" });
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data,
  });

  res.json({ message: "Task updated successfully", task: updatedTask });
});

// DELETE /tasks/:id
app.delete("/tasks/:id", async (req: any, res: any) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: "Invalid task id" });
  }

  const existingTask = await prisma.task.findUnique({ where: { id } });
  if (!existingTask) {
    return res.status(404).json({ message: "Task not found" });
  }

  await prisma.task.delete({ where: { id } });
  res.json({ message: "Task deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
