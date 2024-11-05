const express = require('express');
const auth = require('../utils/auth');
const router = express.Router();
const Task = require('../models/Task');
const TaskValidator = require("../validator/TaskValidator");
const { ZodError } = require("zod"); // Import ZodError

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
      // completedTasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


// Get all tasks 

const { startOfToday, endOfToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth } = require('date-fns');

router.get('/', auth, async (req, res) => {
  const { filter } = req.query; 
  const filterOptions = { userId: req.user };

  
  if (filter === 'Today') {
    filterOptions.dueDate = { $gte: startOfToday(new Date()), $lte: endOfToday(new Date()) };
  } else if (filter === 'This Week') {
    filterOptions.dueDate = { $gte: startOfWeek(new Date()), $lte: endOfWeek(new Date()) };
  } else if (filter === 'This Month') {
    filterOptions.dueDate = { $gte: startOfMonth(new Date()), $lte: endOfMonth(new Date()) };
  }

  try {
    const tasks = await Task.find(filterOptions).select('_id title priority status assignTo checklist dueDate');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ msg: 'Failed to fetch tasks' });
  }
});


router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { readonly } = req.query;
  try {
    const tasks=  readonly 
    ? await Task.findById(id).select('_id title priority status assignTo checklist dueDate') 
    : await Task.findOne({ _id: id, userId: req.user });
    if (!tasks) return res.status(404).json({ msg: 'Task not found' });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ msg: 'Failed to fetch task' });
  }
});


// Create a new task for the authenticated user
router.post('/', auth, async (req, res) => {
const { title, priority, status, assignTo, checklist, dueDate } = req.body;

try {
  const newTask = new Task({
    title,
    priority,
    status,
    assignTo,
    checklist,
    dueDate,
    userId: req.user,
  });
  const savedTask = await newTask.save();
  res.status(201).json(savedTask);
} catch (error) {
  res.status(400).json({ msg: 'Failed to create task' });
}
});
// Update an existing task by _id
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const updates= req.body;
  
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId: req.user },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedTask) return res.status(404).json({ msg: 'Task not found' });

    res.status(200).json({ msg: 'Task updated successfully', updatedTask });
  } catch (error) {
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

