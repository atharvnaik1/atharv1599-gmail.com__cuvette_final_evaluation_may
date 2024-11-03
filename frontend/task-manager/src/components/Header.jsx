import React, { useState ,useEffect} from 'react';
import './Header.css';
import { LuUsers2 } from "react-icons/lu";
import PeopleModal from './PeopleModal';
import { format } from 'date-fns';
import { FaChevronDown } from "react-icons/fa6";
import { Userdata } from '../api/auth'; // Update path as needed

// import { useAppContext } from '../AppContext/AppLayout'; // Import context hook


const Header = ({ selectedFilter, setSelectedFilter }) => {
  // const { username } = useAppContext() ;
  const [userName, setUserName] = useState('');
  const token = localStorage.getItem('token');
  const [showPeopleModal, setShowPeopleModal] = useState(false);
  const [assignedPeople, setAssignedPeople] = useState([]);
  const [dropDown, setDropDown] = useState(false);
  // const [selectedFilter, setSelectedFilter] = useState("Today");

  useEffect(() => {
    const getUserData = async () => {
      if (token) {
        try {
          const userData = await Userdata(token);
          setUserName(userData.name);
        } catch (err) {
          console.error("Failed to fetch user data:", err);
        }
      }
    };

    getUserData();
  }, [token]);

  const currentDate = format(new Date(), "do MMM, yyyy");
  const openPeopleModal = () => setShowPeopleModal(true);
  const closePeopleModal = () => setShowPeopleModal(false);

  const addPeople = (email) => {
    setAssignedPeople([...assignedPeople, email]);
    closePeopleModal();
  };

  const handleDropDown = () => setDropDown(!dropDown);

  const handleOptionChange = (option) => {
    setSelectedFilter(option);
    setDropDown(false);
  };

  return (
    <div className="header">
      <div className="welcome-section">
        <h1>Welcome{userName}!</h1> {/* Provide a fallback text */}
        <div className="board-container">
          <h2>Board</h2>
          <div className="addPeople-container" onClick={openPeopleModal}>
            <LuUsers2 className='icon' />
            <span className='add-people-text'>Add People</span>
          </div>
        </div>  
      </div>
      <div className="date-section">
        <p className="current-date">{currentDate}</p>
        <div className="filter-container">
          <br />
          <div className="drop-down" onClick={handleDropDown}>
            {selectedFilter}
           <div className="chevron-icon" onClick={handleDropDown}>
          <FaChevronDown />
          </div>
          
          </div>
           
          {dropDown && (
            <div className="drop-down-list">
              <div onClick={() => handleOptionChange("Today")}>Today</div>
              <div onClick={() => handleOptionChange("This Week")}>This Week</div>
              <div onClick={() => handleOptionChange("This Month")}>This Month</div>
              <div onClick={() => handleOptionChange("All Time")}>All Time</div>
            </div>
          )}
        </div>
      </div>
      
      {showPeopleModal && <PeopleModal closeModal={closePeopleModal} addPeople={addPeople} />}
    </div>
  );
};

export default Header;
