import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["student", "instructor"], default: "student" }
}, { timestamps: true });

studentSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("Student", studentSchema);
