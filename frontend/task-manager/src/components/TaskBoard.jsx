import React from 'react';
import './TaskBoard.css';
import { LuCopyMinus } from "react-icons/lu";
import { useState } from 'react';

const TaskBoard = ({ title, showPlus }) => {
  // State to manage the tasks in the board
  const [tasks, setTasks] = useState([]);

  // Function to handle adding new tasks
  const addTask = () => {
    const newTask = prompt("Enter a new task:"); // Prompt user for task name
    if (newTask) {
      setTasks([...tasks, newTask]); // Add the new task to the list
    }
  };
  return (
    <div className="task-board">
      <div className="task-board-header">
        <h3>{title}</h3>
        <div className="task-board-controls">
        {showPlus && <span className="plus-icon" onClick={addTask}>+</span>}
          <LuCopyMinus className="copy-minus-icon" /> {/* Adding LuCopyMinus Icon */}
        </div>
      </div>
      <div className="task-board-body">
      {tasks.length === 0 && <p>No tasks</p>}
        {tasks.map((task, index) => (
          <div key={index} className="task-item">{task}</div>)
        )}
        {/* Add task cards here later */}
      </div>
    </div>
  );
};

export default TaskBoard;

