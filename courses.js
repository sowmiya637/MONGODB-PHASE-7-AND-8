// routes/courses.js
import express from "express";
import Course from "../models/Course.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const c = await Course.create(req.body);
    res.json(c);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const courses = await Course.find().limit(200);
  res.json(courses);
});

// fetch single course with lessons and populated instructor
router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id).populate("instructor", "name email");
  if (!course) return res.status(404).json({ message: "Course not found" });
  res.json(course);
});

// delete course (document delete triggers pre deleteOne hook)
router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    await course.deleteOne(); // will call pre('deleteOne') cascade
    res.json({ message: "Course deleted (and related enrollments removed)" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
