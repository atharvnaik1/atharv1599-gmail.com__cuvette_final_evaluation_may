import React, { useState } from 'react';
import './Header.css';
import { LuUsers2 } from "react-icons/lu";
import PeopleModal from './Peoplemodal';

const Header = () => {
  const [showPeopleModal, setShowPeopleModal] = useState(false);
  const [assignedPeople, setAssignedPeople] = useState([]);
  const openPeopleModal = () => {
    setShowPeopleModal(true);
  };
  const closePeopleModal = () => {
    setShowPeopleModal(false);
  };
  const addPeople = (email) => {
    setAssignedPeople([...assignedPeople, email]); // Add the email to the list
    closePeopleModal(); // Close the modal after adding
  };
  return (
    <div className="header">
      <div className="welcome-section">
        <h1>Welcome!{}</h1>
        <div className="board-container">
          
        <h2>Board</h2>
        <div className="addPeople-container"onClick={openPeopleModal}>
        <LuUsers2 className='icon' />
        <span className='add-people-text'>Add People</span>
        </div>
      </div>  
    </div>
      <div className="date-section">
        <p>12th Jan, 2024</p>
        <p>This week ▼</p>
      </div>
      {showPeopleModal && <PeopleModal closeModal={closePeopleModal} addPeople={addPeople} />}

    </div>
  );
};

export default Header;
