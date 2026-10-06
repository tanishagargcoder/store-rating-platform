import express from "express";

import { getStores } from "../controllers/user.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { submitRating } from "../controllers/user.controller.js";
import { ratingSchema } from "../validators/user.validator.js";

const router = express.Router();

router.get(
  "/stores",
  authenticate,
  requireRole("USER"),
  getStores
);
router.post(
  "/ratings",
  authenticate,
  requireRole("USER"),
  (req, res) => {
    const result = ratingSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues.map((issue) => issue.message)
      });
    }

    req.body = result.data;

    return submitRating(req, res);
  }
);

export default router;