import cors from "cors";
import express, { json } from "express";
import { MongoClient, ObjectId } from "mongodb";
import { envService } from "./services/environmentService.js";

let db;
const app = express();

app.use(json());
app.use(cors({ origin: envService.allowedOrigin }));

app.get("/", async (req, res) => {
  res.send("Hello from server");
});

app.get("/books", async (req, res) => {
  try {
    const books = await db.collection("books").find().toArray();
    books.forEach(book => {
      book.id = book._id;
      delete book._id;
    });

    res.status(200).send(books);
  } catch (err) {
    console.error("Find Error: ", err);
    return res.status(500).send(err);
  }
});

app.post("/books", async (req, res) => {
  try {
    const book = req.body;
    const result = await db.collection("books").insertOne(book);
    res.status(201).send(result.insertedId);
  } catch (err) {
    console.error("Insert Error: ", err);
    res.status(500).send(err);
  }
});

app.put("/books/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedBook = req.body;

    const result = await db
      .collection("books")
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedBook });

    res.status(200).send(result);
  } catch (err) {
    console.error("Update Error: ", err);
    return res.status(500).send(err);
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db
      .collection("books")
      .deleteOne({ _id: new ObjectId(id) });

    res.status(200).send(result);
  } catch (err) {
    console.error("Delete Error: ", err);
    return res.status(500).send(err);
  }
});

const connectToMongoDB = async () => {
  try {
    const client = await MongoClient.connect(envService.mongoServerUrl);
    db = client.db(envService.mongoDbName);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB Connection Error: ", err);
    process.exit(1);
  }
};

connectToMongoDB().then(() => {
  app.listen(envService.port, () => {
    console.log(`Server is running on http://localhost:${envService.port}`);
  });
});
