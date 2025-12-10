import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  lessons: [
    { title: String, duration: Number }
  ]
}, { timestamps: true });

// Virtual field for enrollments
courseSchema.virtual("enrollments", {
  ref: "Enrollment",
  localField: "_id",
  foreignField: "course",
  justOne: false
});

// Include virtuals in JSON output
courseSchema.set("toObject", { virtuals: true });
courseSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Course", courseSchema);
