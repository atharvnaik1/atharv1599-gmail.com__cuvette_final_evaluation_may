// PeopleModal.jsx
import React, { useState } from 'react';
import './PeopleModal.css';
import { addPerson } from '../api/PeopleApi';
import ConfirmationModal from './ConfirmationModal';

const PeopleModal = ({ closeModal, addPeople }) => {
  const [email, setEmail] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSave = async () => {
    if (!email.trim()) return;

    try {
      await addPerson(email);
      addPeople(email); // Update parent component's people list
      setShowConfirmation(true); // Show confirmation modal
    } catch (error) {
      console.error("Error saving person:", error);
    }
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    // setEmail(''); // Clear email input after confirmation
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add people to the board</h3>
        <div className="modal-form">
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="form-input"
              required
            />
          </div>
          <div className="modal-btns">
            <button onClick={closeModal} className="cancelbutn">Cancel</button>
            <button onClick={handleSave} className="save-butn">Add Email</button>
          </div>
        </div>
      </div>

      {/* Render ConfirmationModal when showConfirmation is true */}
      {showConfirmation && (
        <ConfirmationModal email={email} onClose={closeConfirmation} />
      )}
    </div>
  );
};

export default PeopleModal;
