import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TaskBoard from '../components/TaskBoard';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        <div className="board-section">
          <TaskBoard title="Backlog" />
          <TaskBoard title="To do" />
          <TaskBoard title="In progress" />
          <TaskBoard title="Done" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
