import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(20, "Name must be at least 20 characters")
    .max(60, "Name cannot exceed 60 characters"),

  email: z
    .string()
    .email("Invalid email address"),

  address: z
    .string()
    .max(400, "Address cannot exceed 400 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password cannot exceed 16 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/,
      "Password must contain at least one uppercase letter and one special character"
    )
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password cannot exceed 16 characters")
});

export const changePasswordSchema = z.object({
  currentPassword: z.string(),

  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password cannot exceed 16 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+$/,
      "Password must contain at least one uppercase letter and one special character"
    )
});