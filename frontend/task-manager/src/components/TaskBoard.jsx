import React from 'react';
import './TaskBoard.css';

const TaskBoard = ({ title }) => {
  return (
    <div className="task-board">
      <div className="task-board-header">
        <h3>{title}</h3>
        <span>+</span>
      </div>
      <div className="task-board-body">
        {/* Add task cards here later */}
      </div>
    </div>
  );
};

export default TaskBoard;
