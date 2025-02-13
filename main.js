import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import Task from "./task.js";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

const corsOptions = {
  origin: ["https://todo.com"],
};

app.use(cors(corsOptions));
app.use(express.json());

await mongoose.connect(process.env.DATABASE_URL);

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === "CastError") {
        res.status(404).send({ message: "Cannot find ID" });
      } else if (e.name === "vaildationError") {
        console.log("Error occured!");
        res.status(400).send({ mesasgs: e.message });
      } else {
        res.status(500).send({ mesage: e.message });
      }
    }
  };
}

app.post(
  "/tasks",
  asyncHandler(async (req, res) => {
    const data = req.body;
    console.log(data);
    const newTask = await Task.create(data);
    console.log(newTask);
    res.status(201).send(newTask);
  })
);

app.get(
  "/tasks",
  asyncHandler(async (req, res) => {
    const count = Number(req.query.count) || 0;
    const sortOption =
      req.query.sort === "oldest"
        ? ["createdAt", "asc"]
        : ["createdAt", "desc"];
    const tasks = await Task.find().limit(count).sort([sortOption]);
    res.send(tasks);
  })
);

app.get(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (task) {
      res.send(task);
    } else {
      res.status(404).send({ mesage: "Cannot find ID" });
    }
  })
);

app.patch(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
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
  })
);

app.delete(
  "/tasks/:id",
  asyncHandler(async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (task) {
      res.sendStatus(200);
    } else {
      res.status(404).send({ mesage: "Cannot find ID " });
    }
  })
);

app.listen(process.env.PORT, () =>
  console.log(`Server started on port ${process.env.PORT}`)
);
