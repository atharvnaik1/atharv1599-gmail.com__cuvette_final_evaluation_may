const express = require('express');
const auth = require('../utils/auth');
const router = express.Router();

// In-memory tasks (in a real setup, these would be in a database)
let tasks = [];

// Get all tasks for the authenticated user
router.get('/', auth, (req, res) => {
  const userTasks = tasks.filter((task) => task.userId === req.user);
  res.json(userTasks);
});

// Create a new task for the authenticated user
router.post('/', auth, (req, res) => {
  const { title, priority, status } = req.body;
  const newTask = {
    id: Date.now().toString(),
    title,
    priority,
    status,
    checklist,
    userId: req.user,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Delete a task
router.delete('/:id', auth, (req, res) => {
  const taskId = req.params.id;
  const userId = req.user;
  tasks = tasks.filter((task) => !(task.id === taskId && task.userId === userId));
  res.json({ msg: 'Task deleted' });
});

module.exports = router;
