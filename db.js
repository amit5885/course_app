import mongoose, { Schema } from "mongoose";
import { Types } from "mongoose";
const { ObjectId } = Types;

import "dotenv/config";

export const connectDB = async () => {
  if (!process.env.MONGO_URL) {
    console.error("MONGO_URL is not defined in the .env file.");
    process.exit(1); // Exit the process if MONGO_URL is missing
  }

  try {
    console.log("Connecting to the database...");
    // Add connection options to avoid deprecation warnings
    // const connectionOptions = {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   useFindAndModify: false,
    //   useCreateIndex: true,
    // };

    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit the process if DB connection fails
  }
};

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
});

const adminSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
});

const courseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  creatorId: ObjectId,
});

const purchaseSchema = new Schema({
  userId: { type: ObjectId, ref: "user" },
  courseId: { type: ObjectId, ref: "course" },
});

export const userModel = mongoose.model("user", userSchema);
export const adminModel = mongoose.model("admin", adminSchema);
export const courseModel = mongoose.model("course", courseSchema);
export const purchaseModel = mongoose.model("purchase", purchaseSchema);
