const express = require("express");
require("../db/mongoose");
const Task = require("../models/task");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt_desc
router.get("/tasks", auth, async (req, res) => {
  try {
    const match = {};
    const [sortColumn, direction] = req.query.sortBy.split("_");

    if (req.query.completed === "completed") {
      match.completed = req.query.completed === "true";
    }
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort: {
            [sortColumn]: direction === "desc" ? -1 : 1
          }
        }
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    return task ? res.send(task) : res.status(404).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const validUpdate = updates.every(update => allowedUpdates.includes(update));

  if (!validUpdate) {
    return res.status(400).send({ error: "Invalid update!" });
  }

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    updates.forEach(update => {
      task[update] = req.body[update];
    });

    await task.save();

    return task ? res.send(task) : res.status(404).send();
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id,
      owner: req.user._id
    });
    return deletedTask
      ? res.send("Following task was deleted: " + deletedTask.description)
      : res.status(404).send("Task does not exist");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
