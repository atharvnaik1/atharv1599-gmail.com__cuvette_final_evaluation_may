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

      setTaskStats({
        totalTasks,
        backlog,
        todo,
        inProgress,
        done,
        pastDue,
        completed,
      });
    };

    calculateStats();
  }, [tasks]);

  return (
    <div className="analytics-page">
      <h2>Analytics Overview</h2>
      <div className="stats-container">
        <div className="stat-item">
          <h3>Total Tasks</h3>
          <p>{taskStats.totalTasks}</p>
        </div>
        <div className="stat-item">
          <h3>Backlog Tasks</h3>
          <p>{taskStats.backlog}</p>
        </div>
        <div className="stat-item">
          <h3>To-Do Tasks</h3>
          <p>{taskStats.todo}</p>
        </div>
        <div className="stat-item">
          <h3>In Progress</h3>
          <p>{taskStats.inProgress}</p>
        </div>
        <div className="stat-item">
          <h3>Done Tasks</h3>
          <p>{taskStats.done}</p>
        </div>
        <div className="stat-item">
          <h3>Past Due Tasks</h3>
          <p>{taskStats.pastDue}</p>
        </div>
        <div className="stat-item">
          <h3>Completed Tasks</h3>
          <p>{taskStats.completed}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
