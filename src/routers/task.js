const express = require("express");
require("../db/mongoose");
const Task = require("../models/task");

const router = express.Router();

router.post("/tasks", async (req, res) => {
  const task = new Task(req.body);

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    return task ? res.send(task) : res.status(404).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/tasks/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const validUpdate = updates.every(update => allowedUpdates.includes(update));

  if (!validUpdate) {
    return res.status(400).send({ error: "Invalid update!" });
  }

  try {
    const task = await Task.findById(req.params.id);
    updates.forEach(update => {
      task[update] = req.body[update];
    });

    await task.save();

    return task ? res.send(task) : res.status(404).send();
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    console.log(deletedTask);
    return deletedTask
      ? res.send("Following task was deleted: " + deletedTask.description)
      : res.status(404).send("Task does not exist");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
