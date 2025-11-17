// server/src/routes/userRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { updateUserProfile, getUserProfile } from "../controllers/userController.js";

const router = express.Router();

// Protected User Routes
router.get("/profile", protect, getUserProfile); // Fetch profile details
router.put("/profile", protect, updateUserProfile); // Update profile details

export default router;