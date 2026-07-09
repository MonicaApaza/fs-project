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
const JWT_SECRET = process.env["JWT_SECRET"];

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be defined and at least 32 characters long");
}

const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization header missing or malformed" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
    };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

app.get("/", (req: any, res: any) => {
  res.send("Backend is working!");
});

app.get("/tasks", authenticateToken, async (req: any, res: any, next: any) => {
  try {
    const tasksDB = await prisma.task.findMany();
    res.json(tasksDB);
  } catch (err) {
    next(err);
  }
});

app.post("/register", async (req: any, res: any, next: any) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
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
  } catch (err) {
    next(err);
  }
});

app.post("/login", async (req: any, res: any, next: any) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const matchingPassword = await bcrypt.compare(password, user.password);
    if (!matchingPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
      algorithm: "HS256",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

app.get("/profile", authenticateToken, (req: any, res: any) => {
  res.json({ message: "Protected profile data", user: req.user });
});

// POST /tasks — create a new task
app.post("/tasks", authenticateToken, async (req: any, res: any, next: any) => {
  try {
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

    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (err) {
    next(err);
  }
});

// PUT /tasks/:id — full update (text + completed)
app.put(
  "/tasks/:id",
  authenticateToken,
  async (req: any, res: any, next: any) => {
    try {
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
    } catch (err) {
      next(err);
    }
  },
);

// PATCH /tasks/:id — partial update (text and/or completed)
app.patch(
  "/tasks/:id",
  authenticateToken,
  async (req: any, res: any, next: any) => {
    try {
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
    } catch (err) {
      next(err);
    }
  },
);

// DELETE /tasks/:id
app.delete(
  "/tasks/:id",
  authenticateToken,
  async (req: any, res: any, next: any) => {
    try {
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
    } catch (err) {
      next(err);
    }
  },
);

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("An error ocurred:", err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
