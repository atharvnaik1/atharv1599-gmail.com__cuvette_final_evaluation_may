const express = require('express');
const auth = require('../utils/auth');
const router = express.Router();
const Task = require('../models/Task');
const TaskValidator = require("../validator/TaskValidator");


const {
  startOfWeek,
  endOfWeek,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
} = require("date-fns");

// router.get(
//   "/all/:datePreference/:status",
//   auth,
//   async (req, res) => {
//     try {
//       let {Newdate, status } = req.params;
//       const currentDate = new Date();
//       let startDate, endDate;

//       if (!Newdate|| Newdate.trim() === "") {
//         startDate = new Date(0);
//         endDate = new Date();
//       } else {
//         switch (Newdate) {
//           case "today":
//             startDate = startOfDay(currentDate);
//             endDate = endOfDay(currentDate);
//             break;
//           case "thisweek":
//             startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
//             endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
//             break;
//           case "thismonth":
//             startDate = startOfMonth(currentDate);
//             endDate = endOfMonth(currentDate);
//             break;
//           default:
//             return res.status(400).json({ error: "Invalid date" });
//         }
//       }

//       const query = {
//         createdAt: { $gte: startDate, $lt: endDate },
//         userId: req.user,
//         ...(status && { status: status.toLowerCase() }),
//       };

//       const TaskByDate = await Task.find(query);
//       res.status(200).json({ data: TaskByDate });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );

router.get("/analytics", auth, async (req, res) => {
  try {
    const getAll = await Task.find({
      userId: req.user,
    });

    // const DueDateTask = await Task.countDocuments({
    //   userId: req.user,
    //   dueDate: { $exists: true, $ne: null },
    // });
    const statusAnalytics = getAll.reduce((result, task) => {
      const status = task.status || "Unknown";
      result[status] = (result[status] || 0) + 1;
      return result;
    }, {});
    // const completedTasks = getAll.reduce((result, Task) => {
    //   const tasks = Task.tasks || [];
    //   const completedTasks = tasks.filter((task) => task.isDone);
    //   result += completedTasks.length;
    //   return result;
    // }, 0);
    const priorityAnalytics = getAll.reduce((result, task) => {
      const priority = task.priority || "Unknown";
      result[priority] = (result[priority] || 0) + 1;
      return result;
    }, {});

    res.json({
      priorityAnalytics,
      // DueDateTask,
      statusAnalytics,
      // completedTasks,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Get all tasks for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user }).select('_id title priority status assignTo checklist dueDate');;
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ msg: 'Failed to fetch tasks' });
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
router.patch('/update/:id', auth, async (req, res) => {
  const { id } = req.params;
  const TaskData= await TaskValidator.validateAsync(req.body);
  if (!id) {
    return res
      .status(400)
      .json({ status: "failed", error: "id required for updating"});
  }
  try {
    const updatedTask = await Task.findOne(
      {_id: id, userId: req.user,
      });

    if (!updatedTask) return res.status(404).json({ msg: 'Task not found' });
    if (TaskData.title) updatedTask.title = TaskData.title;
    if (TaskData.priority) updatedTask.priority = TaskData.priority;
    if (TaskData.tasks) updatedTask.tasks = TaskData.tasks;
    if (TaskData.dueDate) updatedTask.dueDate = TaskData.dueDate;
    if (TaskData.status) updatedTask.status = TaskData.status;
    await updatedTask.save();
   
    // res.json(updatedTask);

  } catch (error) {
    res.status(400).json({ msg: 'Failed to update task' });
  }
});


router.patch("/update/status/:id", auth, async (req, res) => {
  try {
    const {id} = req.params;
    const { status, tasks } = req.body;

    if (!id) {
      return res.status(400).json({
        status: "failed",
        error: "ID is required for updating",
      });
    }
    const Taskdata = await Task.findOne({
      _id: id,
     userId: req.user,
    });
    if (!Taskdata) {
      return res.status(404).json({ error: "TAsk not found" });
    }
    if (status) {
      Taskdata.status = status;
    }
    if (tasks) {
      Taskdata.tasks = tasks;
    }
    await Taskdata.save();
    return res.status(200).json({
      status: "success",
      message: "Task updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal server error");
  }
});


// Delete a task
router.delete('/delete/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    if (task.userId.toString() !== req.user) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete" });
    }
    await task.deleteOne();
    res
      .status(200)
      .json({ status: "success", message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;

