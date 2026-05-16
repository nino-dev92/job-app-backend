import mongoose, { Document, Schema } from "mongoose";

interface IJob extends Document {
  title: string;
  description: string;
  company: mongoose.Types.ObjectId;
  location: string;
  salary?: number;
  createdBy: mongoose.Types.ObjectId;
}

const jobSchema: Schema<IJob> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: mongoose.Types.ObjectId, ref: "Company", required: true },
    location: { type: String, required: true },
    salary: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Job", jobSchema);
