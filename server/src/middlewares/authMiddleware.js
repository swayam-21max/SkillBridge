// server/src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const protect = (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Attach user data to request
      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({ error: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ error: "Not authorized, no token provided" });
  }
};
