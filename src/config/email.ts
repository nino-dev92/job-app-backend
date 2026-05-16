import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ debug: true });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export default transporter;
