import express from "express";
import mongoose from "mongoose";
import Task from "./task.js";
import { DATABASE_URL, PORT } from "./env.js";

const app = express();
app.use(express.json());

await mongoose.connect(DATABASE_URL);

app.post("/tasks", async (req, res) => {
  const data = req.body;
  console.log(data);
  const newTask = await Task.create(data);
  console.log(newTask);
  res.status(201).send(newTask);
});

app.get("/tasks", async (req, res) => {
  const count = Number(req.query.count) || 0;
  const sortOption =
    req.query.sort === "oldest" ? ["createdAt", "asc"] : ["createdAt", "desc"];
  const tasks = await Task.find().limit(count).sort([sortOption]);
  res.send(tasks);
});

app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      res.send(task);
    } else {
      res.status(404).send({ mesage: "Cannot find ID" });
    }
  } catch (e) {
    if (e.name === "CastError") {
      res.status(404).send({ mesage: "Cannot find ID" });
    } else {
      res.status(500).send({ mesage: e.error });
    }
  }
});

app.patch("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      const data = req.body;
      Object.keys(data).forEach((key) => {
        task[key] = data[key];
      });
      await task.save();
      res.send(task);
    } else {
      res.status(404).send({ mesage: "Cannot find ID" });
    }
  } catch (e) {
    if (e.name === "CastError") {
      res.status(404).send({ mesage: "Cancnot find Id" });
    } else {
      res.status(500).send({ mesags: e.error });
    }
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (task) {
      res.sendStatus(200);
    } else {
      res.status(404).send({ mesage: "Cannot find ID " });
    }
  } catch (e) {
    if (e.name === "CastError") {
      res.status(404).send({ mesage: "Cannot find ID" });
    } else {
      res.status(500).send({ mesage: e.error });
    }
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
