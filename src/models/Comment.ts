// File: @/models/Comment.ts

import mongoose, { Schema, model, models } from "mongoose";

const commentSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = models.Comment || model("Comment", commentSchema);
export default Comment;
