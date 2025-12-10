// routes/students.js
import express from "express";
import Student from "../models/Student.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const s = await Student.create(req.body);
    res.json(s);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const students = await Student.find().limit(100);
  res.json(students);
});

router.get("/:id", async (req, res) => {
  const s = await Student.findById(req.params.id);
  if (!s) return res.status(404).json({ message: "Not found" });
  res.json(s);
});

export default router;
