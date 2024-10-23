import React from 'react';
import './Sidebar.css';
import { BsWindowSidebar } from "react-icons/bs";
import { LuLayout } from "react-icons/lu";
import { GoDatabase } from "react-icons/go";
import { HiOutlineCog8Tooth } from "react-icons/hi2";

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <div className="logo-section">
      <img src="../public/Group.png" alt="Cube Icon" className="icon-cube" />
      </div>
      <ul className="nav-links">
        <li className="nav-link">
          <LuLayout className="sidebar-icon" />
          <span className='nav-text'>Board</span>
        </li>
        <li className="nav-link">
          <GoDatabase className="sidebar-icon" />
          <span className='nav-text'>Analytics</span>
        </li>
        <li className="nav-link">
          <HiOutlineCog8Tooth className="sidebar-icon" />
          <span className='nav-text'>Settings</span>
        </li>
      </ul>
      <div className="logout-section">
        <a href="#" className="logout-btn">Log out</a>
      </div>
    </nav>
  );
};

export default Sidebar;
