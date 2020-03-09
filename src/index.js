const express = require("express");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter, taskRouter);
app.listen(port, () => {
  console.log("Server is up on: " + port);
});

const Task = require("./models/task");
const User = require("./models/user");

const main = async () => {
  // const task = await Task.findById("5e62360dde278715f480e479");
  // await task.populate("owner").execPopulate();
  // console.log(task);

  const user = await User.findById("5e6235332820ef4e44b744c1");
  await user.populate("tasks").execPopulate();
  console.log(user.tasks);
};

main();
