import prisma from "../config/db.js";

// ========== CREATE COURSE (FIXED PRISMA SYNTAX) ==========
export const createCourse = async (req, res) => {
  try {
    // Note: 'skill' here is the skillId sent from the frontend
    const { title, description, price, skill, image, teachingHours } = req.body;

    if (!title || !description || !price || !skill) {
      return res.status(400).json({ error: "Title, description, price and skill are required" });
    }

    if (req.user.role !== "trainer") {
      return res.status(403).json({ error: "Only trainers can create courses" });
    }

    // DEBUG: Log the image data received
    console.log("Image data received:", image ? image.substring(0, 50) + "..." : "No Image");

    const course = await prisma.course.create({
      data: {
        title,
        description,
        price: parseFloat(price), // Ensure price is a float
        image: image || null, // Storing the string (URL or Base64)
        teachingHours: parseInt(teachingHours) || 0,
        
        // --- THIS IS THE FIX ---
        // Removed the old `skillId: parseInt(skill)`
        // Added the correct relational connect syntax
        skill: {
          connect: { id: parseInt(skill) } 
        },
        // --- End Fix ---

        trainer: {
          connect: { id: req.user.id }
        },
      },
    });

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    console.error(error);
    // Include better error handling for common Prisma issues
    if (error.code === 'P2003') { // Foreign key constraint failed
        return res.status(400).json({ error: "Invalid Skill ID. Please select a valid category." });
    }
    if (error.code === 'P2025') { // Record to connect not found
        return res.status(400).json({ error: "Selected Skill or Trainer not found." });
    }
    res.status(500).json({ error: "Server error during course creation" });
  }
};

// ========== GET ALL COURSES (This was fixed previously) ==========
export const getAllCourses = async (req, res) => {
  try {
    const { search, sortBy, skillId } = req.query;
    
    // 1. Build Dynamic Filter
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

    // 2. Build Sorting
    let orderBy = { createdAt: "desc" };
    
    switch (sortBy) {
      case 'newest': orderBy = { createdAt: "desc" }; break;
      case 'price_asc': orderBy = { price: "asc" }; break;
      case 'price_desc': orderBy = { price: "desc" }; break;
      default: orderBy = { createdAt: "desc" };
    }

    // 3. Fetch with Relations
    const courses = await prisma.course.findMany({
      where,
      include: {
        trainer: { select: { name: true, email: true } }, 
        skill: { select: { name: true } },
        ratings: { select: { rating: true } },
        enrollments: { select: { id: true } }
      },
      orderBy,
    });

    // 4. Post-processing for stats
    const coursesWithStats = courses.map(course => {
      const totalRatings = course.ratings.length;
      const averageRating = totalRatings > 0 
        ? parseFloat((course.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1))
        : 0;

      const { ratings, enrollments, ...courseData } = course;

      return {
        ...courseData,
        averageRating,
        reviewCount: totalRatings,
        enrollmentCount: enrollments.length,
        difficulty: ["Beginner", "Intermediate", "Advanced"][Math.floor(Math.random() * 3)] 
      };
    });

    // Handle 'rated' sorting manually since it depends on calculated average
    if (sortBy === 'rated') {
      coursesWithStats.sort((a, b) => b.averageRating - a.averageRating);
    }

    res.json(coursesWithStats);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ========== GET SINGLE COURSE ==========
export const getCourseById = async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        trainer: { select: { id: true, name: true, email: true } },
        skill: { select: { name: true } },
        ratings: { 
          select: { 
            rating: true, 
            comment: true, 
            createdAt: true, 
            learner: { select: { name: true } } 
          },
          orderBy: { createdAt: 'desc'}
        },
        enrollments: true,
      },
    });

    if (!course) return res.status(404).json({ error: "Course not found" });

    const totalRatings = course.ratings.length;
    const averageRating = totalRatings > 0 
        ? parseFloat((course.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1))
        : 0;

    res.json({
      ...course,
      averageRating,
      reviewCount: totalRatings
    });

  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ========== GET TRAINER COURSES ==========
export const getCoursesByTrainerId = async (req, res) => {
  try {
    const trainerId = req.user.id;

    if (req.user.role !== "trainer") {
      return res.status(403).json({ error: "Access denied. Only trainers can view this dashboard." });
    }

    const courses = await prisma.course.findMany({
      where: { trainerId },
      include: {
        ratings: { select: { rating: true } },
        enrollments: { select: { id: true } },
        skill: { select: { name: true } } 
      },
      orderBy: { createdAt: "desc" },
    });

    const coursesWithStats = courses.map(course => {
      const totalRatings = course.ratings.length;
      const averageRating = totalRatings > 0 
        ? parseFloat((course.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1))
        : 0;

      const { ratings, enrollments, ...courseData } = course;

      return {
        ...courseData,
        averageRating,
        reviewCount: totalRatings,
        enrollmentCount: enrollments.length,
      };
    });

    res.json(coursesWithStats);
  } catch (error) {
    console.error("Error fetching trainer courses:", error);
    res.status(500).json({ error: "Server error" });
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
        price: price ? parseFloat(price) : course.price,
        image: image !== undefined ? image : course.image,
        teachingHours: teachingHours !== undefined ? parseInt(teachingHours) : course.teachingHours,
        // FIX: Use correct Prisma connect syntax for relations
        skill: skill ? { connect: { id: parseInt(skill) } } : undefined,
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

    // 2. Manually delete related records first to avoid constraint errors
    await prisma.rating.deleteMany({
      where: { courseId: courseId }
    });
    await prisma.enrollment.deleteMany({
      where: { courseId: courseId }
    });
    
    // 3. Now delete the course
    await prisma.course.delete({ where: { id: courseId } });

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    // This was the 5D00 typo, now corrected
    res.status(500).json({ error: "Server error during course deletion." });
  }
};