import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} from "../controllers/courseController.js";
import { protect } from "../middlewares/authMiddleware.js"; // ✅ fixed path

const router = express.Router();

// Public routes
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// Protected routes
router.post("/", protect, createCourse);
router.put("/:id", protect, updateCourse);
router.delete("/:id", protect, deleteCourse);

export default router;
