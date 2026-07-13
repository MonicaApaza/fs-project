require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const prisma = new PrismaClient();
app.use(
  cors({
    origin: process.env["FRONTEND_URL"] || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attemps, try aggain in 10 min" },
  standardHeaders: true, // incluye headers RateLimit-* en la respuesta
  legacyHeaders: false,
  skipSuccessfulRequests: true, // un login exitoso NO cuenta contra el límite
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // ventana de 1 hora
  max: 5, // máximo 5 registros por IP por hora
  message: {
    message: "Too many registration attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const PORT = 1234;
const JWT_SECRET = process.env["JWT_SECRET"];

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must be defined and at least 32 characters long");
}

const authenticateToken = (req: any, res: any, next: any) => {
  console.log("Cookies:", req.cookies);
  console.log("token:", req.cookies.token);
  const token = req.cookies.token;
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
    const tasksDB = await prisma.task.findMany({
      where: { userId: req.user.userId },
    });
    res.json(tasksDB);
  } catch (err) {
    next(err);
  }
});

app.post(
  "/register",
  registerLimiter,
  async (req: any, res: any, next: any) => {
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
  },
);

app.post("/login", loginLimiter, async (req: any, res: any, next: any) => {
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

    res.cookie("token", token, {
      httpOnly: true,
      // sameSite: "strict",
      secure: process.env.NODE_ENV === "production", //la cookie solo se puede acceder a traves de HTTPs
      maxAge: 1000 * 60 * 60, //1 hora igual que JWT
    });
    res.json({
      message: "Login successful",
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
        userId: req.user.userId,
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
        data: { text: text.trim(), completed, userId: req.user.userId },
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

// LOGOUT
app.post("/logout", (req: any, res: any) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("An error ocurred:", err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
