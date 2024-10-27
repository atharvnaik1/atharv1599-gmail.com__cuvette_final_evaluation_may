const mongoose = require('mongoose');

const checklistItemSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  priority: { type: String, enum: ['High', 'Moderate', 'Low'], default: 'Moderate' },
  status: { type: String, enum: ['backlog', 'to-do', 'in-progress', 'done'], default: 'backlog' },
  assignTo: [{ type: String }], // List of emails assigned to the task
  checklist: [checklistItemSchema], // Array of checklist items
  dueDate: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Task', taskSchema);