import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    title: String,
    content: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
  },
  { timestamps: true },
);

export const Note = mongoose.model("Note", noteSchema);
