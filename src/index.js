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

const bcrypt = require("bcryptjs");

const myFunction = async () => {
  const password = "Ales12345";
  const hashedPassword = await bcrypt.hash(password, 8);

  console.log(password);
  console.log(hashedPassword);

  const isMatch = await bcrypt.compare("Ales12345x", hashedPassword);
  console.log(isMatch);
};

myFunction();
