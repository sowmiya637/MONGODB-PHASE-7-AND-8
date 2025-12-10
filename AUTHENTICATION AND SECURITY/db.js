import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const LOCAL = process.env.LOCAL_DB;
const ATLAS = process.env.ATLAS_DB;
const USE = (process.env.USE_DB || "local").toLowerCase();
const URI = USE === "atlas" && ATLAS ? ATLAS : LOCAL;

export const connectDB = async () => {
  try {
    await mongoose.connect(URI, { dbName: "phase8_auth" });
    console.log("MongoDB Connected:", URI);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
