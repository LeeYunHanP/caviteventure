// models/VisitorLog.ts
import mongoose, { Schema, model, models } from 'mongoose';

const VisitorLogSchema = new Schema({
  ip: String,
  userAgent: String,
  referrer: String,
  page: String,
  actionType: {
    type: String,
    default: 'visited',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.VisitorLog || model('VisitorLog', VisitorLogSchema);
