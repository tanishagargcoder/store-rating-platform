import express from "express";
import prisma from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = express.Router();

// Database connection test
router.get("/db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      success: true,
      message: "Database connected successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Protected route test
router.get("/protected", authenticate, (req, res) => {
  res.json({
    success: true,
    message: "You can access this protected route",
    user: req.user,
  });
});

// Admin-only route
router.get(
  "/admin-only",
  authenticate,
  requireRole("ADMIN"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin!",
    });
  }
);

export default router;