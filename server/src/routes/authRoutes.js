// server/src/routes/authRoutes.js
import express from "express";
import { signup, login } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js"; // ✅ Import protect middleware

const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/login", login);

// Protected route example
router.get("/profile", protect, async (req, res) => {
  res.json({ message: "Access granted to profile", userId: req.user.id });
});

export default router;
