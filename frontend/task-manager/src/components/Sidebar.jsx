import React, { useState } from 'react';
import './Sidebar.css';
import LogoutModal from './LogoutModal';
import { LuLayout } from "react-icons/lu";
import { GoDatabase } from "react-icons/go";
import { HiOutlineCog8Tooth } from "react-icons/hi2";
import { Link, useNavigate } from 'react-router-dom';
import { MdLogout } from "react-icons/md";


const Sidebar = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setShowModal(true);
  };

  const handleConfirmLogout = () => {
    setShowModal(false);
    navigate('/');
  };

  const handleCancelLogout = () => {
    setShowModal(false);
  };

  return (
    <nav className="sidebar">
      <div className="logo-section">
        <img src="../Group.png" alt="Cube Icon" className="icon-cube" />
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
      <button onClick={handleLogoutClick} className="logout-btn">
    <MdLogout className="logout-icon" />
     Log out
  </button>
      </div>

      {showModal && (
        <LogoutModal onConfirm={handleConfirmLogout} onCancel={handleCancelLogout} />
      )}
    </nav>
  );
};

export default Sidebar;
