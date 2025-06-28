import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    mongoose
      .connect(process.env.MONGO_URL)
      .then(() => console.log("Database has been connected"));
  } catch (err) {
    console.log("MongoDB connection failed", error.message);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
