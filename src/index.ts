import express from "express";
import dotenv from "dotenv";
import cors from "cors";
const app = express();
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import credentials from "./middleware/credentials.js";
import corsOprtions from "./config/corsOptions.js";

dotenv.config({ debug: true });
const port = process.env.PORT || 3000;

//connectDB();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(credentials);
app.use(cors(corsOprtions));
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/company", companyRoutes);

const start = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(port, () => console.log(`App is listening on port ${port}`));
  } catch (error) {
    if (typeof error === "string") console.log(error);
    if (error instanceof Error) console.log(error.message);
  }
};
start();
