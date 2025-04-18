// src/models/Comment.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment extends Document {
  eventId: mongoose.Types.ObjectId;
  rating: number;
  text: string;
  userName: string;
  userId?: mongoose.Types.ObjectId | null;
  likes: number;
  dislikes: number;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    eventId:   { type: Schema.Types.ObjectId, ref: "Event", required: true },
    rating:    { type: Number, required: true, min: 1, max: 5 },
    text:      { type: String, required: true },
    userName:  { type: String, default: "Anonymous" },
    userId:    { type: Schema.Types.ObjectId, ref: "User", default: null },  // ← made optional
    likes:     { type: Number, default: 0 },
    dislikes:  { type: Number, default: 0 },
    createdAt: { type: Date, default: () => new Date() },
  },
  { collection: "comments" }
);

// prevent model overwrite in dev/hot-reload
const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);

export default Comment;
