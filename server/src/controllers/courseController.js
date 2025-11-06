// server/src/controllers/courseController.js
import prisma from "../config/db.js";

// ========== CREATE COURSE ==========
export const createCourse = async (req, res) => {
  try {
    const { title, description, price, skill, image } = req.body; // Added image

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
        image: image || null, // Add the image URL (or null if not provided)
        skillId: parseInt(skill),
        trainer: {
          connect: { id: req.user.id }
        },
      },
    });

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// ========== GET ALL COURSES ==========
export const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        trainer: {
          select: {
            name: true
          }
        },
        // Include the skill data as well
        skill: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// ========== GET SINGLE COURSE ==========
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: {
        trainer: {
          select: {
            name: true,
            email: true
          }
        },
        // --- THIS IS THE FIX ---
        // We must also include the skill data for the details page
        skill: {
          select: {
            name: true
          }
        }
      },
    });

    if (!course) return res.status(404).json({ error: "Course not found" });

    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// ========== UPDATE COURSE ==========
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, image } = req.body; // Added image

    const course = await prisma.course.findUnique({ where: { id: parseInt(id) } });
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (course.trainerId !== req.user.id) {
      return res.status(403).json({ error: "You are not authorized to update this course" });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        price: parseFloat(price),
        image
      },
    });

    res.json({ message: "Course updated successfully", updatedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// ========== DELETE COURSE ==========
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const courseId = parseInt(id);

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (course.trainerId !== req.user.id) {
      return res.status(403).json({ error: "You are not authorized to delete this course" });
    }

    // --- SAFETY CHECK ---
    // Before deleting the course, delete related enrollments and ratings
    await prisma.enrollment.deleteMany({
      where: { courseId: courseId }
    });
    await prisma.rating.deleteMany({
      where: { courseId: courseId }
    });

    // Now delete the course
    await prisma.course.delete({ where: { id: courseId } });

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};