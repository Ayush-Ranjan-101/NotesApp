import { z } from "zod";

const createNoteVSchema = z
  .object({
    title: z
      .string({ required_error: "Title is required" })
      .trim()
      .min(1, "Title cannot be empty")
      .max(50, "Title is too long"),

    content: z
      .string({ required_error: "Content is required" })
      .trim()
      .min(1, "Content cannot be empty"),
  })
  .strict();

const updateNoteVSchema = z
  .object({
    title: z
      .string({ required_error: "Title is required" })
      .trim()
      .min(1, "Title cannot be empty")
      .max(50, "Title is too long"),

    content: z
      .string({ required_error: "Content is required" })
      .trim()
      .min(1, "Content cannot be empty"),
  })
  .strict();

export { createNoteVSchema, updateNoteVSchema };
