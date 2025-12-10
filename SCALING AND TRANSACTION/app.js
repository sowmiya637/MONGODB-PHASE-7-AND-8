// app.js
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// ensure dotenv loads from same dir as app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import studentRoutes from "./routes/Students.js";
import courseRoutes from "./routes/Courses.js";
import enrollmentRoutes from "./routes/enrollments.js";

const app = express();
app.use(express.json());

// choose DB (USE_DB = local or atlas)
const LOCAL = process.env.LOCAL_DB || "mongodb://127.0.0.1:27017/phase7_test";
const ATLAS = process.env.ATLAS_DB || "";
const USE = (process.env.USE_DB || "local").toLowerCase();
const uri = USE === "atlas" && ATLAS ? ATLAS : LOCAL;

if (!uri) {
  console.error("MongoDB URI is undefined. Check .env");
  process.exit(1);
}

mongoose.connect(uri)
  .then(() => console.log("Connected to MongoDB:", uri))
  .catch(err => console.error("MongoDB connection error:", err.message));

app.use("/students", studentRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
