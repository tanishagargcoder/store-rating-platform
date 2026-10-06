import express from "express";

import {
  getDashboard,
  createUser,
  createStore,
  getUsers,
  getStores,
  getUserById
} from "../controllers/admin.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

import {
  createUserSchema,
  createStoreSchema
} from "../validators/admin.validator.js";

const router = express.Router();

// ==================== ADMIN DASHBOARD ====================

router.get(
  "/dashboard",
  authenticate,
  requireRole("ADMIN"),
  getDashboard
);

// ==================== GET ALL USERS ====================

router.get(
  "/users",
  authenticate,
  requireRole("ADMIN"),
  getUsers
);

// ==================== GET ALL STORES ====================

router.get(
  "/stores",
  authenticate,
  requireRole("ADMIN"),
  getStores
);

router.get(
  "/users/:id",
  authenticate,
  requireRole("ADMIN"),
  getUserById
);
// ==================== CREATE USER ====================

router.post(
  "/users",
  authenticate,
  requireRole("ADMIN"),
  (req, res) => {
    const result = createUserSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues.map((issue) => issue.message)
      });
    }

    req.body = result.data;

    return createUser(req, res);
  }
);

// ==================== CREATE STORE ====================

router.post(
  "/stores",
  authenticate,
  requireRole("ADMIN"),
  (req, res) => {
    const result = createStoreSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues.map((issue) => issue.message)
      });
    }

    req.body = result.data;

    return createStore(req, res);
  }
);

export default router;