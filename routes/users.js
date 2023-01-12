const express = require("express");
const { connection } = require("../connection");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Login a user route
router.post("/login", async (req, res) => {
  const { db } = await connection();
  const { email, password } = req.body;

  //Checking for empty values
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Body is missing some required properties" });
  }
  //Checking if user is registered or not
  const user = await db.collection("users").findOne({ email });
  if (!user) {
    return res.json({ message: "User does not exist" });
  }

  //Comparing passwords
  const passwordIsTrue = await bcrypt.compare(password, user?.password);

  //Generating a token
  const secretkey = "someprivatekey";
  const token = jwt.sign({ _id: user?._id, name: user?.name }, secretkey, {
    expiresIn: 20000,
  });
  if (passwordIsTrue) {
    return res.status(201).json({
      message: "User logged successfully",
      email,
      token,
      isSuccess: true,
    });
  } else {
    return res
      .status(201)
      .json({ message: "Password is wrong", isSuccess: false });
  }
});

//Signup
router.post("/signup", async (req, res) => {
  const { db } = await connection();
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ message: "Please fill all required properties" });
  }

  const emailExists = await db.collection("users").findOne({ email: email });
  if (emailExists) {
    return res.json({ message: "User already exists", isSuccess: false });
  }

  const hashedPasswords = await bcrypt.hash(password, 10);

  //Inserting a user
  const user = await db
    .collection("users")
    .insertOne({ name, email, password: hashedPasswords });
  return res.json({ message: "User registered", isSuccess: true });
});

module.exports = router;
