// server/src/controllers/ratingController.js
import prisma from "../config/db.js";

/**
 * @desc    Create a new rating for a course
 * @route   POST /api/ratings
 * @access  Private (Learners only)
 */
export const createRating = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;
    const learnerId = req.user.id;

    if (req.user.role !== "learner") {
      return res.status(403).json({ error: "Only learners can leave ratings" });
    }

    // 1. Check if the user is enrolled in the course
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        learnerId: learnerId,
        courseId: parseInt(courseId),
      },
    });

    if (!enrollment) {
      return res.status(403).json({ error: "You must be enrolled in this course to leave a review." });
    }

    // 2. Check if the user has already rated this course
    const existingRating = await prisma.rating.findFirst({
      where: {
        learnerId: learnerId,
        courseId: parseInt(courseId),
      },
    });

    if (existingRating) {
      return res.status(400).json({ error: "You have already reviewed this course." });
    }

    // 3. Create the new rating
    const newRating = await prisma.rating.create({
      data: {
        learnerId: learnerId,
        courseId: parseInt(courseId),
        rating: parseInt(rating),
        comment: comment || null,
      },
      include: {
        learner: { // Include learner's name in the response
          select: { name: true }
        }
      }
    });

    res.status(201).json({ message: "Review submitted successfully", rating: newRating });

  } catch (error) {
    console.error("Create rating error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc    Get all ratings for a specific course
 * @route   GET /api/ratings/course/:courseId
 * @access  Public
 */
export const getCourseRatings = async (req, res) => {
  try {
    const { courseId } = req.params;

    const ratings = await prisma.rating.findMany({
      where: {
        courseId: parseInt(courseId),
      },
      include: {
        learner: { // Include the name of the user who left the rating
          select: { name: true }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(ratings);
  } catch (error)
 {
    console.error("Get course ratings error:", error);
    res.status(500).json({ error: "Server error" });
  }
};