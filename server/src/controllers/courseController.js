// server/src/controllers/courseController.js
import prisma from "../config/db.js";

// ========== CREATE COURSE ==========
export const createCourse = async (req, res) => {
  try {
    // Note: 'skill' should be the ID of the skill
    const { title, description, price , skill } = req.body;

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
        skillId: parseInt(skill), // Connect to the skill via its ID
        trainer: { // Connect to the trainer who is making the request
          connect: {id : req.user.id}
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
        // FIX: Changed 'creator' to 'trainer'
        trainer: { 
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
        // FIX: Changed 'creator' to 'trainer'
        trainer: { 
          select: { 
            name: true, 
            email: true 
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
    const { title, description, price } = req.body;

    const course = await prisma.course.findUnique({ where: { id: parseInt(id) } });
    if (!course) return res.status(404).json({ error: "Course not found" });

    // FIX: Changed 'course.createdBy' to 'course.trainerId'
    if (course.trainerId !== req.user.id) {
      return res.status(403).json({ error: "You are not authorized to update this course" });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) },
      data: { title, description, price: parseFloat(price) },
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

    const course = await prisma.course.findUnique({ where: { id: parseInt(id) } });
    if (!course) return res.status(404).json({ error: "Course not found" });

    // FIX: Changed 'course.createdBy' to 'course.trainerId'
    if (course.trainerId !== req.user.id) {
      return res.status(403).json({ error: "You are not authorized to delete this course" });
    }

    await prisma.course.delete({ where: { id: parseInt(id) } });

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};