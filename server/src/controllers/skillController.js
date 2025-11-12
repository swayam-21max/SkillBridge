// server/src/controllers/skillController.js
import prisma from "../config/db.js";

/**
 * CREATE SKILL (Trainer only)
 */
export const createSkill = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: "Name and description are required" });
    }

    // Only trainers can create skills
    if (req.user.role !== "trainer") {
      return res.status(403).json({ error: "Only trainers can create skills" });
    }

    const skill = await prisma.skill.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json({ message: "Skill created successfully", skill });
  } catch (error) {
    console.error("Error creating skill:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * GET ALL SKILLS (Public) - New/Improved
 */
export const getAllSkills = async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { createdAt: "asc" }, // Ordered by creation time
    });
    // Returning simple { id, name } structure for the frontend filters
    res.json(skills.map(s => ({ id: s.id, name: s.name })));
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * GET SINGLE SKILL
 */
export const getSkillById = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await prisma.skill.findUnique({
      where: { id: parseInt(id) },
    });

    if (!skill) return res.status(404).json({ error: "Skill not found" });

    res.json(skill);
  } catch (error) {
    console.error("Error fetching skill:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * UPDATE SKILL (Trainer only)
 */
export const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (req.user.role !== "trainer") {
      return res.status(403).json({ error: "Only trainers can update skills" });
    }

    const skill = await prisma.skill.findUnique({ where: { id: parseInt(id) } });
    if (!skill) return res.status(404).json({ error: "Skill not found" });

    const updatedSkill = await prisma.skill.update({
      where: { id: parseInt(id) },
      data: { name, description },
    });

    res.json({ message: "Skill updated successfully", updatedSkill });
  } catch (error) {
    console.error("Error updating skill:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * DELETE SKILL (Trainer only)
 */
export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== "trainer") {
      return res.status(403).json({ error: "Only trainers can delete skills" });
    }

    const skill = await prisma.skill.findUnique({ where: { id: parseInt(id) } });
    if (!skill) return res.status(404).json({ error: "Skill not found" });

    await prisma.skill.delete({ where: { id: parseInt(id) } });

    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    console.error("Error deleting skill:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * TRACK USER SKILL PROGRESS (Learner only)
 */
export const trackSkillProgress = async (req, res) => {
  try {
    const { skillId, status } = req.body;

    if (!skillId || !status) {
      return res.status(400).json({ error: "Skill ID and status are required" });
    }

    // Allowed statuses
    const allowedStatuses = ["pending", "in_progress", "completed"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const existingRecord = await prisma.userSkill.findFirst({
      where: {
        userId: req.user.id,
        skillId: parseInt(skillId),
      },
    });

    let userSkill;

    if (existingRecord) {
      // Update progress
      userSkill = await prisma.userSkill.update({
        where: { id: existingRecord.id },
        data: { status },
      });
    } else {
      // Create new record
      userSkill = await prisma.userSkill.create({
        data: {
          userId: req.user.id,
          skillId: parseInt(skillId),
          status,
        },
      });
    }

    res.json({ message: "Skill progress updated", userSkill });
  } catch (error) {
    console.error("Error tracking skill progress:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * GET USER'S SKILLS
 */
export const getUserSkills = async (req, res) => {
  try {
    const { userId } = req.params;

    const userSkills = await prisma.userSkill.findMany({
      where: { userId: parseInt(userId) },
      include: {
        skill: true,
      },
    });

    res.json(userSkills);
  } catch (error) {
    console.error("Error fetching user skills:", error);
    res.status(500).json({ error: "Server error" });
  }
};