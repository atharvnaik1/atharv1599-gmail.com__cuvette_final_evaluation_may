import React, { useState, useEffect } from 'react';
import './Analytics.css';

const AnalyticsPage = ({ tasks }) => {
  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    backlog: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    pastDue: 0,
    completed: 0,
  });

  useEffect(() => {
    const calculateStats = () => {
      const totalTasks = tasks.length;
      const backlog = tasks.filter(task => task.status === 'backlog').length;
      const todo = tasks.filter(task => task.status === 'todo').length;
      const inProgress = tasks.filter(task => task.status === 'in-progress').length;
      const done = tasks.filter(task => task.status === 'done').length;
      const pastDue = tasks.filter(task => new Date(task.dueDate) < new Date() && task.status !== 'done').length;
      const completed = tasks.filter(task => task.status === 'done').length;

      const lowPriority = tasks.filter(task => task.priority === 'low').length;
      const moderatePriority = tasks.filter(task => task.priority === 'moderate').length;
      const highPriority = tasks.filter(task => task.priority === 'high').length;


      setTaskStats({
        totalTasks,
        backlog,
        todo,
        inProgress,
        done,
        pastDue,
        completed,
        lowPriority,
        moderatePriority,
        highPriority,
      });
    };

    calculateStats();
  }, [tasks]);

  return (
    <div className="analytics-page">
    <h2>Analytics Overview</h2>
    <div className="stats-container">
      <div className="status-section">
        <h3>Task Status</h3>
        <div className="stat-item">
          <p>Backlog Tasks</p>
          <span>{taskStats.backlog}</span>
        </div>
        <div className="stat-item">
          <p>To-Do Tasks</p>
          <span>{taskStats.todo}</span>
        </div>
        <div className="stat-item">
          <p>In Progress</p>
          <span>{taskStats.inProgress}</span>
        </div>
        <div className="stat-item">
          <p>Completed Tasks</p>
          <span>{taskStats.completed}</span>
        </div>
      </div>
      <div className="priority-section">
        <h3>Task Priority</h3>
        <div className="stat-item">
          <p>Low Priority</p>
          <span>{taskStats.lowPriority}</span>
        </div>
        <div className="stat-item">
          <p>Moderate Priority</p>
          <span>{taskStats.moderatePriority}</span>
        </div>
        <div className="stat-item">
          <p>High Priority</p>
          <span>{taskStats.highPriority}</span>
        </div>
        <div className="stat-item">
          <p>Due Date Tasks</p>
          <span>{taskStats.pastDue}</span>
        </div>
      </div>
    </div>
  </div>
);
};

export default AnalyticsPage;