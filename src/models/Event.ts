// File: models/Event.ts
import { Schema, model, models, Document, Types } from "mongoose";

export interface IEvent extends Document {
  _id: Types.ObjectId;
  title: string;
  date: Date;
  location: string;
  image?: string;
  status: "approved" | "pending" | "rejected";
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    image: String,
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const Event = models.Event || model<IEvent>("Event", EventSchema);
export default Event;
