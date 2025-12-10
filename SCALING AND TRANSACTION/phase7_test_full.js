import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "../models/Student.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

dotenv.config();

// Select DB
const LOCAL = process.env.LOCAL_DB || "mongodb://127.0.0.1:27017/phase7_test";
const ATLAS = process.env.ATLAS_DB || "";
const USE = (process.env.USE_DB || "local").toLowerCase();

const uri = USE === "atlas" && ATLAS ? ATLAS : LOCAL;

async function run() {
  console.log(`\nConnecting to: ${uri}\n`);
  await mongoose.connect(uri);
  console.log("Connected!\n");

  // Clean collections
  await Student.deleteMany({});
  await Course.deleteMany({});
  await Enrollment.deleteMany({});

 
  //  INSERT 1000 STUDENTS + 50 COURSES

  console.time("Insert students 1000");
  const students = [];
  for (let i = 1; i <= 1000; i++) {
    students.push({
      name: `User${i}`,
      email: `u${i}@mail.com`,
      role: i % 10 === 0 ? "instructor" : "student"
    });
  }
  await Student.insertMany(students);
  console.timeEnd("Insert students 1000");

  console.time("Insert courses 50");
  const instructors = await Student.find({ role: "instructor" });
  const coursesArr = [];

  for (let i = 1; i <= 50; i++) {
    const randomInstructor = instructors[Math.floor(Math.random() * instructors.length)];
    coursesArr.push({
      title: `Course ${i}`,
      description: `Description ${i}`,
      category: i % 2 === 0 ? "programming" : "database",
      instructor: randomInstructor._id,
      lessons: [
        { title: "L1", duration: Math.floor(Math.random() * 20) + 10 },
        { title: "L2", duration: Math.floor(Math.random() * 30) + 10 },
      ]
    });
  }

  await Course.insertMany(coursesArr);
  console.timeEnd("Insert courses 50");

 
  //  ENROLL STUDENTS IN COURSES

  console.time("Enroll students");
  const allCourses = await Course.find({});
  const allStudents = await Student.find({ role: "student" });

  const enrollments = [];
  allCourses.forEach(course => {
    for (let i = 0; i < 4; i++) {
      const randomStudent = allStudents[Math.floor(Math.random() * allStudents.length)];
      enrollments.push({ course: course._id, student: randomStudent._id });
    }
  });

  await Enrollment.insertMany(enrollments);
  console.timeEnd("Enroll students");

 
  //  QUERY COURSES + POPULATE STUDENTS (using virtual)

  console.time("Query courses with enrollments (populate)");
  const populated = await Course.find({})
    .populate({
      path: "enrollments",
      populate: { path: "student" }
    });
  console.timeEnd("Query courses with enrollments (populate)");

  console.log(`Sample enrollment count: ${await Enrollment.countDocuments()}`);
  console.log(`First course enrollments sample:`, populated[0].enrollments.slice(0, 3));


  // 4. TRANSACTION EXAMPLE

  console.log("\n--- Transaction Test ---");
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const s1 = await Student.findOne({ role: "student" }).session(session);
    const c1 = await Course.findOne().session(session);

    await Enrollment.create([{ student: s1._id, course: c1._id }], { session });

    throw new Error("FORCED ERROR TO TEST ROLLBACK");

    await session.commitTransaction();
    console.log("Transaction committed!");
  } catch (err) {
    await session.abortTransaction();
    console.log("Transaction rolled back:", err.message);
  } finally {
    session.endSession();
  }


  // 5. PERFORMANCE TEST BEFORE/AFTER INDEX

  console.log("\n--- Performance Test (Index Impact) ---");

  console.time("Query by email before index");
  await Student.find({ email: "u10@mail.com" });
  console.timeEnd("Query by email before index");

  // Create index if not already exists
  try {
    await Student.collection.createIndex({ email: 1 });
  } catch (err) {}

  console.time("Query by email after index");
  await Student.find({ email: "u10@mail.com" });
  console.timeEnd("Query by email after index");

  console.log("\n--- Phase 7 Completed Successfully ---\n");
  process.exit();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
