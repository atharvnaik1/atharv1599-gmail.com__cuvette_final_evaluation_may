import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TaskBoard from '../components/TaskBoard';
import './Dashboard.css';

const Dashboard = () => {
  const currentDate = format(new Date(), "do MMM, yyyy");
  const [dropDown, setDropDown] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [selectedFilter, setSelectedOption] = useState("Today");
  const { username } = useAppContext();
  const handleDropDown = () => {
    setDropDown(!dropDown);
  };
  const [tasks, setTasks] = useState([]);
  
  return (
    <div className="dashboard-container">
      {/* <Sidebar /> */}
      <div className="dashboard-main">
        <Header />
        <div className="board-section">
          {/* Render TaskBoard once and manage the columns inside TaskBoard */}
          <TaskBoard tasks={tasks} setTasks={setTasks} />
        </div>
      </div>
     
    </div>
  );
};

export default Dashboard;
