import React, { useState } from 'react';
import './PeopleModal.css'; // Custom CSS for modal styling

const PeopleModal = ({ closeModal, addPeople }) => {
  const [email, setEmail] = useState('');

  const handleSave = () => {
    if (!email.trim()) return; // Do not proceed if email input is empty
    
    // Retrieve existing emails from localStorage, or set it to an empty array if none exist
    const existingEmails = JSON.parse(localStorage.getItem('savedEmails')) || [];
    
    // Only add the new email if it doesn't already exist in the list
    if (!existingEmails.includes(email)) {
      const updatedEmails = [...existingEmails, email];
      localStorage.setItem('savedEmails', JSON.stringify(updatedEmails)); // Save updated list to localStorage
    }

    addPeople(email); // Call the addPeople function with the email
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
            <button onClick={closeModal} className="cancel-btn">Cancel</button>
            <button onClick={handleSave} className="save-btn">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeopleModal;
