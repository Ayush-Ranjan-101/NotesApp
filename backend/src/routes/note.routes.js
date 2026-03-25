import { Router } from "express";

import { validate } from "../middlewares/validate.middlewares.js";
import {
  createNoteVSchema,
  updateNoteVSchema,
} from "../validators/noteValidator.validators.js";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/note.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router();

// Secure all routes
router.use(verifyJWT);

// General routes (Base: /api/v1/notes)
router.route("/").get(getNotes).post(validate(createNoteVSchema), createNote);

// Specific resource routes (Base: /api/v1/notes/:noteId)
router
  .route("/:noteId")
  .patch(validate(updateNoteVSchema), updateNote)
  .delete(deleteNote);

export default router;
