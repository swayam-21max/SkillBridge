// server/src/routes/enrollmentRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createEnrollment,
  getUserEnrollments,
} from "../controllers/enrollmentController.js";

const router = express.Router();

// @route   POST /api/enrollments
// @desc    Enroll in a course
// @access  Private (Learner)
router.post("/", protect, createEnrollment);

// @route   GET /api/enrollments/user
// @desc    Get all enrollments for the logged-in user
// @access  Private
router.get("/user", protect, getUserEnrollments); // <-- REMOVED :userId

export default router;