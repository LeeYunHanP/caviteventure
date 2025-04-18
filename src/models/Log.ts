import mongoose, { Schema, model, models } from "mongoose";

const logSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    actionType: { type: String, required: true }, // e.g. "created event"
    eventId: { type: mongoose.Types.ObjectId, ref: "Event", required: false },
  },
  { timestamps: true }
);

const Log = models.Log || model("Log", logSchema);
export default Log;
