const { z } = require("zod");

const TaskValidator = z.object({
  title: z.string().min(1, { message: "Title is required" }), // Ensures title is a non-empty string
  priority: z.enum(["High", "Moderate", "Low"]), // Restricts priority to specific values
  checklist: z.array(
    z.object({
      text: z.string().min(1, { message: "Checklist item text is required" }), // Ensures checklist item text is non-empty
      completed: z.boolean().optional().default(false), // Optional with default to false
    })
  ).optional(),
assignTo: z.array(z.string().email()).optional(),  
dueDate: z.date().nullable(), // Allows null for due date
  status: z.enum(["backlog", "to-do", "in-progress", "done"]).default("to-do"), // Default value for status
});

module.exports = TaskValidator;
