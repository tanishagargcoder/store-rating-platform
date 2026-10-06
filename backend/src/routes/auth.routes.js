import express from "express";

import { signup, login, changePassword } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

import {
  signupSchema,
  loginSchema,
  changePasswordSchema
} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.issues.map((issue) => issue.message)
    });
  }

  req.body = result.data;

  return signup(req, res);
});

router.post("/login", async (req, res) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.issues.map((issue) => issue.message)
    });
  }

  req.body = result.data;

  return login(req, res);
});

router.post(
  "/change-password",
  authenticate,
  (req, res) => {
    const result = changePasswordSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues.map((issue) => issue.message)
      });
    }

    req.body = result.data;

    return changePassword(req, res);
  }
);
export default router;