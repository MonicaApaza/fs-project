require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

const PORT = 1234;

app.get("/", (req: any, res: any) => {
  res.send("Backend is working!");
});

app.get("/tasks", async (req: any, res: any) => {
  const tasksDB = await prisma.task.findMany();
  res.json(tasksDB);
});

app.post("/register", async (req: any, res: any) => {
  const {name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  res
    .status(201)
    .json({ message: "User registered successfully", user: newUser });
});

app.post("/login", async (req: any, res: any) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const validEmail = "admin@test.com";
  const validPassword = "123456";

  if (email === validEmail && password === validPassword) {
    const token = jwt.sign({ email }, "secret_key", {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.get("/profile", (req: any, res: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, "secret_key");
    res.json({ message: "Protected profile data", user: decoded });
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
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
    return res
      .status(400)
      .json({ message: "Field 'completed' must be a boolean" });
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
      return res
        .status(400)
        .json({ message: "Field 'text' must be a non-empty string" });
    }
    data.text = text.trim();
  }
  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res
        .status(400)
        .json({ message: "Field 'completed' must be a boolean" });
    }
    data.completed = completed;
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({
      message: "At least one field ('text' or 'completed') is required",
    });
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
