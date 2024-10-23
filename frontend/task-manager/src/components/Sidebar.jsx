import React from 'react';
import './Sidebar.css';
import { MdOutlineTableChart } from "react-icons/md";
import { CgViewComfortable } from "react-icons/cg";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo-section">
        <h3>Pro Manage</h3>
      </div>
      <nav className="nav-links">
        <a href="#" className="nav-link active">Board</a>
        <a href="#" className="nav-link">Analytics</a>
        <a href="#" className="nav-link">Settings</a>
      </nav>
      <div className="logout-section">
        <a href="#" className="logout-btn">Log out</a>
      </div>
    </div>
  );
};

export default Sidebar;
