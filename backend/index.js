const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

const dbName = "detabase";

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection("students");

    // GET USERS
    app.get("/", async (req, res) => {
      try {
        const users = await collection.find().toArray();
        res.json(users);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch users" });
      }
    });

    // CREATE USER
    app.post("/users", async (req, res) => {
      try {
        const newUser = req.body;

        const result = await collection.insertOne(newUser);

        res.status(201).json({
          message: "User created",
          id: result.insertedId,
        });
      } catch (error) {
        res.status(500).json({ message: "Failed to create user" });
      }
    });

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });

  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
}

startServer();