// server/src/routes/skillRoutes.js
import express from "express";
import {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  trackSkillProgress,
  getUserSkills
} from "../controllers/skillController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllSkills);
router.get("/:id", getSkillById);

// Protected routes
router.post("/", protect, createSkill);
router.put("/:id", protect, updateSkill);
router.delete("/:id", protect, deleteSkill);

// Learner-specific routes
router.post("/track", protect, trackSkillProgress);
router.get("/user/:userId", protect, getUserSkills);

export default router;
