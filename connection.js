const { MongoClient } = require("mongodb");

const connection = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://nisarga:mongo123@cluster0.bmty9v3.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = client.db("courses");
  return { db };
};

module.exports = { connection };
