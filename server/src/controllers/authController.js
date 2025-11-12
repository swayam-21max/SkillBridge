import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const OTP_EXPIRY_MINUTES = 5; // OTP valid for 5 minutes

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, isVerified: user.isVerified }, // Include verification status
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Helper to generate a 6-digit OTP and its expiry
const generateOtpData = () => {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60000);
  return { otpCode, otpExpires };
};

// ========== 1. SIGNUP (Now for Learners) ==========
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (role === 'trainer') {
        // Trainers must use the trainerSignup flow, which is separate,
        // but for now, we process it and force verification on login.
        return trainerSignup(req, res);
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new learner user (defaulting isVerified to true for ease)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'learner',
        isVerified: true, // Learners are instantly verified
      },
    });

    // Generate JWT
    const token = generateToken(user);

    res.status(201).json({
      message: "Learner account created successfully",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ========== 2. TRAINER SIGNUP (Initiates Verification) ==========
// This function handles the initial registration and OTP generation for trainers.
export const trainerSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.role === 'trainer' && existingUser.isVerified) {
        return res.status(400).json({ error: "Trainer account already exists and is verified. Please log in." });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const { otpCode, otpExpires } = generateOtpData();

    // Create or update the trainer entry
    const trainer = await prisma.user.upsert({
      where: { email },
      update: { 
        password: hashedPassword, // Update password if re-registering unverified account
        otpCode, 
        otpExpires,
        isVerified: false, // Ensure verification remains false until OTP confirmed
      },
      create: {
        name,
        email,
        password: hashedPassword,
        role: 'trainer',
        isVerified: false, // Trainer is unverified initially
        otpCode,
        otpExpires,
      },
    });

    // --- MOCK EMAIL LOG ---
    console.log(`--- MOCK EMAIL SENT to ${email} ---`);
    console.log(`Trainer OTP: ${otpCode}`);
    console.log(`OTP Expires: ${otpExpires}`);
    // --- END MOCK EMAIL LOG ---

    res.status(200).json({ 
        message: "Trainer registration initiated. OTP sent to email (check console).",
        // Only return necessary unverified info to prompt OTP screen
        trainer: { id: trainer.id, email: trainer.email, isVerified: trainer.isVerified }
    });

  } catch (error) {
    console.error("Trainer signup error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// ========== 3. VERIFY OTP (New Endpoint) ==========
export const verifyTrainerOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user || user.role !== 'trainer') {
            return res.status(404).json({ error: "Trainer account not found" });
        }

        if (user.isVerified) {
             return res.status(400).json({ error: "Account is already verified. Please proceed to login." });
        }

        if (user.otpCode !== otp) {
            return res.status(401).json({ error: "Invalid OTP provided." });
        }
        
        // Check expiry
        if (user.otpExpires < new Date()) {
            return res.status(401).json({ error: "OTP has expired. Please re-register." });
        }
        
        // Mark as verified
        const verifiedUser = await prisma.user.update({
            where: { id: user.id },
            data: { 
                isVerified: true, 
                otpCode: null, 
                otpExpires: null 
            }
        });

        // Generate final JWT for verified user
        const token = generateToken(verifiedUser);

        res.json({
            message: "Verification successful. You can now log in.",
            token,
            user: { id: verifiedUser.id, name: verifiedUser.name, email: verifiedUser.email, role: verifiedUser.role, isVerified: verifiedUser.isVerified },
        });

    } catch (error) {
        console.error("OTP verification error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// ========== 4. LOGIN (Now checks Trainer Verification) ==========
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // --- NEW: Trainer Verification Check ---
    if (user.role === 'trainer' && !user.isVerified) {
        // If a trainer is not verified, deny login and ask them to verify
         return res.status(403).json({ error: "Account not verified. Please check your email for the OTP." });
    }
    // ---------------------------------------

    // Generate JWT
    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};