// server/src/routes/ratingRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createRating,
  getCourseRatings,
} from "../controllers/ratingController.js";

const router = express.Router();

// @route   POST /api/ratings
// @desc    Create a new rating
// @access  Private (Learner)
router.post("/", protect, createRating);

// @route   GET /api/ratings/course/:courseId
// @desc    Get all ratings for a specific course
// @access  Public
router.get("/course/:courseId", getCourseRatings);

export default router;