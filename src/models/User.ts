import mongoose, { Document, Schema, Model, Types } from "mongoose";

// Possible roles
export type UserRole = "user" | "admin" | "superadmin";

// Extend Mongoose's Document interface for your user fields
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;              
  email: string;             
  city: string;              
  gender: "male" | "female"; 
  hashedPassword: string;    
  password?: string;         
  isVerified: boolean;       
  verifyCode?: string;       
  profilePicture?: string;   
  role: UserRole;            
  bio?: string;              // <-- Added this optional bio field
}

// Define the User schema
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifyCode: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
      required: true,
    },
    bio: {
      type: String, // <-- Add a 'bio' field to match the interface
    },
  },
  {
    timestamps: true, // createdAt / updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create a virtual property 'password' to alias hashedPassword
UserSchema.virtual("password")
  .get(function (this: IUser) {
    return this.hashedPassword;
  })
  .set(function (this: IUser, value: string) {
    this.hashedPassword = value;
  });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
