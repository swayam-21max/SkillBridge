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

// --- PUBLIC ROUTES ---
router.get("/", getAllSkills);        // GET /api/skills: Fetch all skills (for dropdowns, filters)
router.get("/:id", getSkillById);     // GET /api/skills/:id: Fetch a single skill by ID

// --- PROTECTED ROUTES (Trainer/Admin) ---
router.post("/", protect, createSkill);       // POST /api/skills: Create a new skill
router.put("/:id", protect, updateSkill);     // PUT /api/skills/:id: Update a skill
router.delete("/:id", protect, deleteSkill);  // DELETE /api/skills/:id: Delete a skill

// --- LEARNER/USER-SPECIFIC ROUTES ---

// NEW: GET /api/skills/my (Recommended for fetching current user's skills easily)
// You would need to create a simple controller function (e.g., 'getMySkills') 
// that uses req.user.id internally instead of req.params.userId.
// For now, let's update the next route to be more intuitive:

// GET /api/skills/user/:userId - Fetch skills for a specified user ID (e.g., for profiles)
router.get("/user/:userId", protect, getUserSkills); 

// POST /api/skills/track - Update/create user's skill progress
router.post("/track", protect, trackSkillProgress); 

export default router;