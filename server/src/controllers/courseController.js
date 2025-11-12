// server/src/controllers/courseController.js
import prisma from "../config/db.js";

// ========== CREATE COURSE (Unchanged) ==========
export const createCourse = async (req, res) => {
  try {
    const { title, description, price, skill, image } = req.body; 

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

// ========== GET ALL COURSES (Optimized for Filtering/Sorting/Ratings) ==========
export const getAllCourses = async (req, res) => {
  try {
    const { search, sortBy, skillId } = req.query;
    
    // --- 1. Build Dynamic WHERE Clause for Search & Filter ---
    const where = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { trainer: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }
    
    if (skillId) {
      where.skillId = parseInt(skillId);
    }

    // --- 2. Build Dynamic ORDER BY Clause ---
    let orderBy = { createdAt: "desc" };
    
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: "desc" };
        break;
      case 'price_asc':
        orderBy = { price: "asc" };
        break;
      case 'price_desc':
        orderBy = { price: "desc" };
        break;
      // Note: 'popular' and 'rated' will be handled manually later after fetching.
      default:
        orderBy = { createdAt: "desc" };
    }

    // --- 3. Fetch Courses with Relations ---
    let courses = await prisma.course.findMany({
      where,
      include: {
        trainer: { select: { name: true } },
        skill: { select: { name: true } },
        ratings: { select: { rating: true } }, // Fetch ratings for local calculation
      },
      orderBy,
    });

    // --- 4. Post-processing: Calculate Average Rating and Review Count ---
    courses = courses.map(course => {
      const totalRatings = course.ratings.length;
      const averageRating = totalRatings > 0 
        ? parseFloat((course.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1))
        : 0; // Default to 0 if no ratings

      // Exclude the raw ratings array from the final response
      const { ratings, ...courseData } = course;

      return {
        ...courseData,
        averageRating,
        reviewCount: totalRatings,
        // Adding a placeholder difficulty for the frontend
        difficulty: ["Beginner", "Intermediate", "Advanced"][Math.floor(Math.random() * 3)] 
      };
    });

    // --- 5. Implement 'Highest Rated' and 'Most Popular' sorting (client-side since we calculated the score) ---
    if (sortBy === 'rated') {
      courses.sort((a, b) => b.averageRating - a.averageRating);
    }
    // Note: 'Popular' requires enrollment count, which is a new aggregate query we aren't adding here for simplicity, so we'll treat it as 'rated' or default.

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ========== GET SINGLE COURSE (Unchanged) ==========
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

// ... (Rest of the course controller functions are unchanged)
export const updateCourse = async (req, res) => {
  // ... (unchanged)
};

export const deleteCourse = async (req, res) => {
  // ... (unchanged)
};