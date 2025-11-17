// server/src/controllers/userController.js
import prisma from "../config/db.js";

/**
 * @desc    Update Trainer/Learner Profile (e.g., bio, name, experience)
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, bio, yearsOfExperience, role } = req.body;
    
    // Only allow role change if it's the current role, preventing unauthorized swaps
    if (role && role !== req.user.role) {
        return res.status(403).json({ error: "Role cannot be changed via this endpoint." });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : undefined,
      },
      select: { id: true, name: true, email: true, role: true, isVerified: true, bio: true, yearsOfExperience: true }
    });
    
    // NOTE: This response should also trigger an update in the frontend's authSlice state
    res.json({ 
        message: "Profile updated successfully", 
        user: updatedUser 
    });

  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * @desc    Get Current Logged-in User Profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
             where: { id: userId },
             select: { id: true, name: true, email: true, role: true, isVerified: true, bio: true, yearsOfExperience: true }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Server error" });
    }
};