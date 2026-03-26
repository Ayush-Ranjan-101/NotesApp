import { z } from "zod";

const registerVSchema = z
  .object({
    userName: z
      .string()
      .trim()
      .min(2, "Username must be at least 2 character long")
      .max(15, "Username is too long"),
    email: z.string().trim().email("Invalid email format").lowercase(),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .strict();

const loginVSchema = z
  .object({
    userName: z.string().trim().optional(),
    email: z
      .string()
      .trim()
      .email("Invalid email format")
      .lowercase()
      .optional(),
    password: z.string().min(6, "Password is at least 6 characters"),
  })
  .strict()
  .refine((data) => data.email || data.userName, {
    message: "Please provide either a username or an email",
    path: ["username/email"],
  });

export { registerVSchema, loginVSchema };
