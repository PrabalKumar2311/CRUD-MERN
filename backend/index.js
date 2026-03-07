const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("detabase");
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

    // UPDATE USER
    app.put("/users/:id", async (req, res) => {
      try {
        const { ObjectId } = require("mongodb");

        const result = await collection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: req.body },
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User updated" });
      } catch (error) {
        res.status(500).json({ message: "Failed to update user" });
      }
    });

    // DELETE USER
    app.delete("/users/:id", async (req, res) => {
      try {
        const { ObjectId } = require("mongodb");

        const result = await collection.deleteOne({
          _id: new ObjectId(req.params.id),
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted" });
      } catch (error) {
        res.status(500).json({ message: "Failed to delete user" });
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
