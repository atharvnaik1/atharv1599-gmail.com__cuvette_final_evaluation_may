import React from 'react';
import './Header.css';
import { LuUsers2 } from "react-icons/lu";
const Header = () => {
  return (
    <div className="header">
      <div className="welcome-section">
        <h1>Welcome!{}</h1>
        <div className="board-container">
          
        <h2>Board</h2>
        <div className="addPeople-container">
        <LuUsers2 className='icon' />
        <span className='add-people-text'>Add People</span>
        </div>
      </div>  
    </div>
      <div className="date-section">
        <p>12th Jan, 2024</p>
        <p>This week ▼</p>
      </div>
    </div>
  );
};

export default Header;
