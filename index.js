const express = require("express");
const { connection } = require("./connection");
const app = express();
const userRoutes = require("./routes/users");
const coursesRoutes = require("./routes/courses");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/courses",coursesRoutes)
app.use("*", (req, res) => {
  res.status(404).json({ msg: "Route does not exist" });
});

const PORT = 4000;

app.listen(PORT, async () => {
  const { db } = await connection();
  const dbs = await db.listCollections().toArray();
  if (dbs.length) {
    console.log(`app started on port ${PORT}`);
  }
});
