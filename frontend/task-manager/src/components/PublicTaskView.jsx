// src/components/PublicTaskView.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTaskById } from '../api/taskApi';
import { format } from 'date-fns';
import './PublicTaskView.css';

const PublicTaskView = () => {
  const { taskId } = useParams(); // Use useParams to access route parameters
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await fetchTaskById(taskId, true); // Pass true for read-only
        setTask(data);
      } catch (error) {
        console.error("Failed to fetch task:", error);
      }
    };
    fetchTask();
  }, [taskId]);

  // Only proceed if `task` is not null
  if (!task) return <p>Loading task...</p>;

  // Define priority color classes safely
  const priorityClass =
    task.priority === 'High'
      ? 'red'
      : task.priority === 'Moderate'
      ? 'blue'
      : 'green';

      const calculateChecklistProgress = (checklist) => {
        const completed = checklist.filter((item) => item.completed).length;
        return `(${completed}/${checklist.length})`;
      };

  return (
    <div className="page-container">
      <div className="public-task-view">
        <div className="pt-priorityy">
          <div className={`pt-priority-dott ${priorityClass}`}></div>
          <span>{task.priority} Priority</span>
        </div>
        <div className="pt-task-header">
          <h1 className="pt-task-title">{task.title}</h1>
        </div>
        <div className="pt-task-checklist">
          <h3 className='pt-checklist-header'>Checklist {calculateChecklistProgress(task.checklist)}</h3>
          {task.checklist && task.checklist.map((item, idx) => (
            <div key={idx} className="pt-checklist-item">
              <input type="checkbox" checked={item.completed} readOnly />
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        <div className="pt-date">
          Due Date <div className= "pt-due-date"> {task.dueDate ? format(new Date(task.dueDate), 'MMM do') : 'No due date'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicTaskView;
