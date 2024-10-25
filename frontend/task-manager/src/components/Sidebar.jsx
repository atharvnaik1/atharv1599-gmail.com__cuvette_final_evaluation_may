import React from 'react';
import './Sidebar.css';
import { BsWindowSidebar } from "react-icons/bs";
import { LuLayout } from "react-icons/lu";
import { GoDatabase } from "react-icons/go";
import { HiOutlineCog8Tooth } from "react-icons/hi2";
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <div className="logo-section">
      <img src="../public/Group.png" alt="Cube Icon" className="icon-cube" />
      </div>
      <ul className="nav-links">
        <li className="nav-link">
          <LuLayout className="sidebar-icon" />
          <Link to="/dashboard" className='nav-text'>Board</Link>
        </li>
        <li className="nav-link">
          <GoDatabase className="sidebar-icon" />
          <Link to="/analytics" className='nav-text'>Analytics</Link>
        </li>
        <li className="nav-link">
          <HiOutlineCog8Tooth className="sidebar-icon" />
          <Link to="/settings" className='nav-text'>Settings</Link>
        </li>
      </ul>
      <div className="logout-section">
        <a href="#" className="logout-btn">Log out</a>
      </div>
    </nav>
  );
};

export default Sidebar;
