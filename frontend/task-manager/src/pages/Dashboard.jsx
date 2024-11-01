import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TaskBoard from '../components/TaskBoard';
import './Dashboard.css';
// import { useAppContext } from '../components/layouts/AppLayout';


const Dashboard = () => {
  // const { username } = useAppContext();

 
  const [tasks, setTasks] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("This Week");

  
  return (
    <div className="dashboard-container"> 
      {/* <Sidebar /> */}
      <div className="dashboard-main">
        <Header selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter}/>
        <div className="board-section">
          {/* Render TaskBoard once and manage the columns inside TaskBoard */}
          <TaskBoard tasks={tasks} setTasks={setTasks} selectedFilter={selectedFilter}/>
        </div>
      </div>
     
    </div>
  );
};

export default Dashboard;
