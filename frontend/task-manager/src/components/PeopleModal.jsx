// PeopleModal.jsx
import React, { useState } from 'react';
import './PeopleModal.css';
import { addPerson } from '../api/PeopleApi';

const PeopleModal = ({ closeModal, addPeople }) => {
  const [email, setEmail] = useState('');

  const handleSave = async () => {
    if (!email.trim()) return;

    try {
      await addPerson(email);
      addPeople(email); // Update parent component's people list
    } catch (error) {
      console.error("Error saving person:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Assign People</h3>
        <div className="modal-form">
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>
          <div className="modal-actions">
            <button onClick={closeModal} className="cancelbtn">Cancel</button>
            <button onClick={handleSave} className="save-btn">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeopleModal;
