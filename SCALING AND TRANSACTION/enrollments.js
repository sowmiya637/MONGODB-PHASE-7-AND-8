// routes/enrollments.js
import express from "express";
import Enrollment from "../models/Enrollment.js";
import Student from "../models/Student.js";
import Course from "../models/Course.js";

const router = express.Router();

// Create enrollment (non-transactional example)
router.post("/", async (req, res) => {
  try {
    const e = await Enrollment.create(req.body);
    // optionally increment course enrolledCount (non-transactional)
    await Course.updateOne({ _id: e.course }, { $inc: { enrolledCount: 1 } });
    res.json(e);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get enrollments with nested populate
router.get("/", async (req, res) => {
  const enrollments = await Enrollment.find()
    .populate({ path: "student", select: "name email" })
    .populate({ path: "course", select: "title category" });
  res.json(enrollments);
});

export default router;
