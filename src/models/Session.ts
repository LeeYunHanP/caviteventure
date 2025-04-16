import { Schema, model, models } from "mongoose";

/**
 * A simple session schema:
 * - token: random string stored in the user's cookie
 * - userId: references the user who owns that session
 * - createdAt: for audit/debug
 */
const sessionSchema = new Schema({
  token: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Session = models.Session || model("Session", sessionSchema);
export default Session;
