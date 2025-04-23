// models/VisitorLog.ts
import mongoose from "mongoose";

const VisitorLogSchema = new mongoose.Schema({
  ip: String,
  page: String,
  userAgent: String,
  referrer: String,
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.VisitorLog || mongoose.model("VisitorLog", VisitorLogSchema);
