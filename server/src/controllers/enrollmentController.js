// server/src/controllers/enrollmentController.js
import prisma from "../config/db.js";

// ========== CREATE ENROLLMENT ==========
export const createEnrollment = async (req, res) => {
  try {
    const { courseId } = req.body;
    const learnerId = req.user.id;

    // 1. Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        courseId: parseInt(courseId),
        learnerId: learnerId,
      },
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: "You are already enrolled in this course" });
    }

    // 2. Check if user is the trainer (trainers can't enroll in their own course)
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
    });
    
    if (course.trainerId === learnerId) {
        return res.status(400).json({ error: "Trainers cannot enroll in their own courses" });
    }

    // 3. Create new enrollment
    const newEnrollment = await prisma.enrollment.create({
      data: {
        learnerId: learnerId,
        courseId: parseInt(courseId),
        status: "active", // You can set a default status
      },
      // This include is correct and was added in the previous fix
      include: {
        course: {
          include: {
            trainer: {
              select: { name: true },
            },
            skill: {
              select: { name: true },
            },
          },
        },
      },
    });

    res.status(201).json({ message: "Enrollment successful", enrollment: newEnrollment });
  } catch (error) {
    console.error("Error creating enrollment:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ========== GET USER ENROLLMENTS ==========
export const getUserEnrollments = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { learnerId: req.user.id },

      // --- THIS IS THE FIX ---
      // We must include the same nested data as createEnrollment
      // so the profile card gets all the info it needs on page load.
      include: {
        course: {
          include: {
            trainer: {
              select: { name: true },
            },
            skill: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: {
        enrolledAt: "desc",
      },
    });
    res.json(enrollments);
  } catch (error) {
    console.error("Error fetching user enrollments:", error);
    res.status(500).json({ error: "Server error" });
  }
};