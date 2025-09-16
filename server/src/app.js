import express from "express";
import cors from "cors";
import prisma from "./config/db.js";          // Prisma client imported
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("SkillBridge API is running...");
});

export default app;
