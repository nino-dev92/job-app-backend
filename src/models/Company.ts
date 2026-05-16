import mongoose from "mongoose";
import { Document, Schema } from "mongoose";

interface ICompany extends Document {
  name: string;
  user: mongoose.Types.ObjectId;
  description: string;
  website: string;
  linkedin?: string;
  instagram?: string;
  glassdoor?: string;
}

const companySchema: Schema<ICompany> = new mongoose.Schema({
  name: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: { type: String, required: true },
  website: { type: String, required: true },
  linkedin: { type: String, required: false },
  instagram: { type: String, required: false },
  glassdoor: { type: String, required: false },
});

export default mongoose.model<ICompany>("Company", companySchema);
