// server/src/routes/courseRoutes.js
import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  // ADDED NEW CONTROLLER
  getCoursesByTrainerId
} from "../controllers/courseController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes

// 1. NEW PROTECTED ROUTE FOR TRAINER DASHBOARD (MUST COME FIRST)
// When a GET request hits /api/courses/trainer, it runs this middleware chain.
router.get("/trainer", protect, getCoursesByTrainerId); 

// 2. Generic routes
router.get("/", getAllCourses); 
router.get("/:id", getCourseById); // This is now correctly handled only for numeric IDs

// Protected routes
router.post("/", protect, createCourse);
router.put("/:id", protect, updateCourse);
router.delete("/:id", protect, deleteCourse);

export default router;