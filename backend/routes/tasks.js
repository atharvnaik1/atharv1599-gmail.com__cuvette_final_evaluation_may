const express = require('express');
const auth = require('../utils/auth');
const router = express.Router();
const Task = require('../models/Task');
const TaskValidator = require("../validator/TaskValidator");

router.get("/analytics", auth, async (req, res) => {
  try {
    const getAll = await Task.find({
      userId: req.user,
    });

    const DueDateTask = await Task.countDocuments({
      userId: req.user,
      dueDate: { $exists: true, $ne: null },
    });
    const statusAnalytics = getAll.reduce((result, task) => {
      const status = task.status || "Unknown";
      result[status] = (result[status] || 0) + 1;
      return result;
    }, {});

    const priorityAnalytics = getAll.reduce((result, task) => {
      const priority = task.priority || "Unknown";
      result[priority] = (result[priority] || 0) + 1;
      return result;
    }, {});

    res.json({
      priorityAnalytics,
      DueDateTask,
      statusAnalytics,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Get all tasks for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user }).select('_id title priority status assignTo checklist dueDate');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ msg: 'Failed to fetch tasks' });
  }
});

router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const tasks = await Task.findById(id);
    if (!tasks) return res.status(404).json({ msg: 'Task not found' });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ msg: 'Failed to fetch task' });
  }
});

// Create a new task for the authenticated user with validation
router.post('/', auth, async (req, res) => {
  try {
    // Validate request body against TaskValidator schema
    const validatedData = TaskValidator.parse(req.body);

    const newTask = new Task({
      ...validatedData,
      userId: req.user,
    });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    if (error instanceof TaskValidator.ValidationError) {
      return res.status(400).json({ msg: 'Validation failed', details: error.errors });
    }
    res.status(400).json({ msg: 'Failed to create task', error });
  }
});

// Update an existing task by _id with validation
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    // Validate the incoming updates
    const validatedData = TaskValidator.parse(req.body);

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId: req.user },
      validatedData,
      { new: true, runValidators: true }
    );

    if (!updatedTask) return res.status(404).json({ msg: 'Task not found' });

    res.status(200).json({ msg: 'Task updated successfully', updatedTask });
  } catch (error) {
    if (error instanceof TaskValidator.ValidationError) {
      return res.status(400).json({ msg: 'Validation failed', details: error.errors });
    }
    res.status(500).json({ msg: 'Failed to update task', error });
  }
});

// Delete a task by _id
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findOneAndDelete({ _id: id, userId: req.user });

    if (!deletedTask) return res.status(404).json({ msg: 'Task not found' });

    res.status(200).json({ msg: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Failed to delete task', error });
  }
});

module.exports = router;
