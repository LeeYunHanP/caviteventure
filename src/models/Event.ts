import { Schema, model, models, Document, Types } from "mongoose";

export interface IEvent extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  image?: string;
  status: "approved" | "pending" | "rejected";
  createdBy: Types.ObjectId;
  approvedBy?: Types.ObjectId;
}

const EventSchema = new Schema<IEvent>(
  {
    title:       { type: String, required: true },
    description: { type: String, required: true },
    date:        { type: Date,   required: true },
    time:        { type: String, required: true },
    location:    { type: String, required: true },
    image:       String,
    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null, // no longer required, default to null until approved
    },
  },
  { timestamps: true }
);

const Event = models.Event || model<IEvent>("Event", EventSchema);
export default Event;