import mongoose = require("mongoose");
import dotenv = require("dotenv");
dotenv.config({ debug: true });
const url: string = process.env.URL as string;

const connectDB = () => {
  return mongoose.connect(url, { dbName: "jobs" });
  // .then(() => console.log("DB CONNECTED"))
  // .catch((err) => {
  //   console.log(err);
  //   process.exit(1);
  // });
};

export default connectDB;
