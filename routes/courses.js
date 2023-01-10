const { ObjectId } = require("mongodb");
const express = require("express");
const { connection } = require("../connection");
const router = express.Router();
const verify = require("../middleware/verify");

//Getting all courses
router.get("/all", verify, async (req, res) => {
  const { db } = await connection();
  const courses = await db.collection("courses").find({}).toArray();
  if (!courses) {
    return res.json({ message: "No courses were found" });
  }
  return res.json({ message: "Courses found", courses });
});

//Creating a course
router.post("/add", verify, async (req, res) => {
  const { db } = await connection();
  const { name, price, duration, description } = req.body;
  if (!name || !price || !duration || !description) {
    return res.json({
      message: "Please fill all required properties",
    });
  }
  const courseExists = await db.collection("courses").findOne({ name: name });
  if (courseExists) {
    return res.send({ message: "Course already exist", isSuccess: false });
  }

  const courses = await db
    .collection("courses")
    .insertOne({ name, price, duration, description });
  return res.json({
    message: "Course was added successfully",
    isSuccess: true,
  });
});
//Edit a single course
router.put("/edit/:id", verify, async (req, res) => {
  const { db } = await connection();
  const id = req.params.id;
  const { name, price, duration, description } = req.body;

  if (!name || !price || !duration || !description) {
    return res.json({ message: "Please fill all the details" });
  }
  const courseExists = await db
    .collection("courses")
    .findOne({ _id: ObjectId(id) });
  if (!courseExists) {
    return res.json({ message: "Course does not exist" });
  }
  await db
    .collection("courses")
    .updateOne({ _id: ObjectId(id) }, { $set: { ...req.body } });
  return res.json({ message: "course Updated Successfully",isSuccess:true });
});
//Get a single course
router.get("/get/:id", verify, async (req, res) => {
  const { db } = await connection();
  const id = req.params.id;

  const courseExists = await db.collection("courses").findOne({ _id: ObjectId(id) });

  if (!courseExists) {
    return res.json({ message: "No courses found" });
  }

  return res.json({ message: "Courses found",isSuccess:true, courseExists });
});
//Delete a course
router.delete("/delete/:id", async (req, res) => {
  const { db } = await connection();
  const id = req.params.id;

  const courseExists = await db
    .collection("courses")
    .findOne({ _id: ObjectId(id) });

  if (!courseExists) {
    return res.json({ message: "Course does not exist", isSuccess: false });
  }

  await db.collection("courses").deleteOne({ _id: ObjectId(id) });

  return res.json({ message: "Course deleted successfully", isSuccess: true });
});

module.exports = router;
