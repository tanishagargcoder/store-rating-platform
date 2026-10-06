import { z } from "zod";

export const createUserSchema = z.object({
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
    ),

  role: z.enum(["USER", "ADMIN", "STORE_OWNER"])
});

export const createStoreSchema = z.object({
  name: z
    .string()
    .min(1, "Store name is required"),

  email: z
    .string()
    .email("Invalid email address"),

  address: z
    .string()
    .max(400, "Address cannot exceed 400 characters"),

  ownerId: z
    .number()
    .int()
    .positive()
});