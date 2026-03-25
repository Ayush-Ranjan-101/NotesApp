import { z } from "zod";

const registerVSchema = z
  .object({
    userName: z
      .string()
      .trim()
      .min(2, "Username must be at least 2 character long")
      .max(15, "Username is too long"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .strict();

const loginVSchema = z
  .object({
    userName: z.string().trim().optional(),
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  })
  .strict();

export { registerVSchema, loginVSchema };
