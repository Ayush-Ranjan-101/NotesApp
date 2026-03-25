import mongoose from "mongoose";
import { Note } from "../models/note.models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

// view notes
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ createdBy: req.user._id });

  if (!notes) {
    throw new ApiError(400, "Failed to fetch notes");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

// create notes
const createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const note = await Note.create({
    title,
    content,
    createdBy: new mongoose.Types.ObjectId(req.user._id),
  });

  if (!note) {
    throw new ApiError(400, "Failed to create note");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, note, "Note created successfully"));
});

// update notes
const updateNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const { noteId } = req.params;

  const updatedNote = await Note.findOneAndUpdate(
    new mongoose.Types.ObjectId(noteId),
    {
      title,
      content,
    },
    { new: true },
  );

  if (!updatedNote) {
    throw new ApiError(404, "Note not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedNote, "Note updated successfully"));
});

// delete notes
const deleteNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  const deletedNote = await Note.findByIdAndDelete(
    new mongoose.Types.ObjectId(noteId),
  );

  if (!deletedNote) {
    throw new ApiError(404, "Note not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedNote, "Note deleted successfully"));
});

export { getNotes, createNote, updateNote, deleteNote };
