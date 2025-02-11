import mongoose from "mongoose";
import data from "./seedData.js";
import Task from "./task.js";
import * as dotenv from "dotenv";

console.log("Start seed");

await mongoose.connect(process.env.DATABASE_URL);

await Task.deleteMany({});
await Task.insertMany(data);

await mongoose.connection.close(); // connection을 시작하면 끊는 것도 같이 넣어야 함
console.log("End seed");
