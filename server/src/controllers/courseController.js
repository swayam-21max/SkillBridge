import prisma from "../config/db.js";

// ========== CREATE COURSE (MODIFIED to include teachingHours) ==========
export const createCourse = async (req, res) => {
  try {
    // ADDED teachingHours
    const { title, description, price, skill, image, teachingHours } = req.body;

    if (!title || !description || !price || !skill) {
      return res.status(400).json({ error: "Title, description, price and skill are required" });
    }

    if (req.user.role !== "trainer") {
      return res.status(403).json({ error: "Only trainers can create courses" });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price,
        image: image || null,
        teachingHours: parseInt(teachingHours) || 0, // NEW FIELD
        skillId: parseInt(skill),
        trainer: {
          connect: { id: req.user.id }
        },
      },
    });

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    console.error(error);
    // You will get a P2003 error if skillId is invalid, you can handle it more gracefully
    res.status(500).json({ error: "Server error during course creation" });
  }
};

// ====================================================================
// Placeholder Controllers (Based on standard CRUD patterns)
// ====================================================================

/**
 * @desc    Get all courses with related data (for public listing)
 * @route   GET /api/courses
 * @access  Public
 */
export const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        skill: { select: { name: true } },
        ratings: { select: { rating: true } },
        enrollments: { select: { id: true } }
      }
    });

    // Simple aggregation for placeholder
    const coursesWithStats = courses.map(course => ({
      ...course,
      averageRating: course.ratings.length > 0
        ? parseFloat((course.ratings.reduce((sum, r) => sum + r.rating, 0) / course.ratings.length).toFixed(1))
        : 0,
      enrollmentCount: course.enrollments.length,
      ratings: undefined, // Remove raw relations
      enrollments: undefined,
    }));

    res.json(coursesWithStats);
  } catch (error) {
    console.error("Error fetching all courses:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc    Get a single course by ID
 * @route   GET /api/courses/:id
 * @access  Public
 */
export const getCourseById = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        trainer: { select: { id: true, name: true, email: true } },
        skill: { select: { name: true } },
        ratings: { select: { rating: true, comment: true, learner: { select: { name: true } } } },
        enrollments: true,
      },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    console.error("Error fetching course by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ====================================================================
// NEW & MODIFIED CONTROLLERS
// ====================================================================

// ========== GET COURSES BY TRAINER ID (NEW CONTROLLER) ==========
/**
 * @desc    Get all courses created by the logged-in trainer with stats
 * @route   GET /api/courses/trainer
 * @access  Private (Trainer)
 */
export const getCoursesByTrainerId = async (req, res) => {
  try {
    const trainerId = req.user.id;

    if (req.user.role !== "trainer") {
      return res.status(403).json({ error: "Access denied. Only trainers can view this dashboard." });
    }

    // Fetch courses along with ratings, enrollment count, and skill name
    const courses = await prisma.course.findMany({
      where: { trainerId },
      include: {
        ratings: { select: { rating: true } },
        enrollments: { select: { id: true } },
        skill: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" },
    });

    // Post-process to calculate aggregates
    const coursesWithStats = courses.map(course => {
      const totalRatings = course.ratings.length;
      const averageRating = totalRatings > 0
        ? parseFloat((course.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1))
        : 0;

      const reviewCount = totalRatings;
      const enrollmentCount = course.enrollments.length;

      // Exclude the raw relations
      const { ratings, enrollments, ...courseData } = course;

      return {
        ...courseData,
        averageRating,
        reviewCount,
        enrollmentCount,
        // Add a placeholder difficulty for consistency with CourseCard
        difficulty: ["Beginner", "Intermediate", "Advanced"][Math.floor(Math.random() * 3)]
      };
    });

    res.json(coursesWithStats);
  } catch (error) {
    console.error("Error fetching trainer courses:", error);
    res.status(500).json({ error: "Server error fetching trainer courses" });
  }
};

/**
 * @desc    Update a course
 * @route   PUT /api/courses/:id
 * @access  Private (Trainer)
 */
export const updateCourse = async (req, res) => {
  try {
    const { title, description, price, skill, image, teachingHours } = req.body;
    const courseId = parseInt(req.params.id);

    // 1. Check if course exists and belongs to the trainer
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    if (course.trainerId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized to update this course" });
    }

    // 2. Perform the update
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        title: title || course.title,
        description: description || course.description,
        price: price || course.price,
        image: image !== undefined ? image : course.image, // Allow setting to null/empty string
        teachingHours: teachingHours !== undefined ? parseInt(teachingHours) : course.teachingHours,
        skillId: skill ? parseInt(skill) : course.skillId,
      },
    });

    res.json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Server error during course update" });
  }
};

/**
 * @desc    Delete a course
 * @route   DELETE /api/courses/:id
 * @access  Private (Trainer)
 */
export const deleteCourse = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);

    // 1. Check if course exists and belongs to the trainer
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    if (course.trainerId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized to delete this course" });
    }

    // 2. Delete the course (Prisma handles cascading deletes if configured, otherwise you might need to delete related records first)
    await prisma.course.delete({ where: { id: courseId } });

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    // P2003 Foreign key constraint failed error often means related records (enrollments/ratings) still exist.
    res.status(500).json({ error: "Server error during course deletion. Check for related records (enrollments/ratings)." });
  }
};