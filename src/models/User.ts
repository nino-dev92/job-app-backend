//import mongoose, { Document, Schema } from "mongoose";
import mongoose from "mongoose";
import type { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "jobseeker" | "employer";
  refreshToken: string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["jobseeker", "employer"],
      default: "jobseeker",
    },
    refreshToken: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", userSchema);
