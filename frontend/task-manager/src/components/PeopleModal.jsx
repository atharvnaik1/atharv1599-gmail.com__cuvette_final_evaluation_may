import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PeopleModal.css'; // Custom CSS for modal styling

const PeopleModal = ({ closeModal, addPeople }) => {
  const [email, setEmail] = useState('');
  const [existingEmails, setExistingEmails] = useState([]);
  const [error, setError] = useState('');

  // Fetch existing emails from the backend when the modal opens
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the JWT token
        const response = await axios.get('http://localhost:5000/api/people', {
          headers: { 'x-auth-token': token },
        });
        setExistingEmails(response.data); // Assuming the response data is an array of emails
      } catch (err) {
        setError('Failed to load emails');
        console.error(err);
      }
    };

    fetchEmails();
  }, []);

  const handleSave = async () => {
    if (!email.trim()) return; // Do not proceed if email input is empty

    // Check if email already exists
    if (existingEmails.includes(email)) {
      setError('Email already exists');
      return;
    }

    try {
      const token = localStorage.getItem('token'); // Retrieve the JWT token
      await axios.post(
        'http://localhost:5000/api/people',
        { email },
        { headers: { 'x-auth-token': token } }
      );

      // Update the local list and clear the email input
      setExistingEmails([...existingEmails, email]);
      setEmail('');
      addPeople(email); // Call the addPeople function with the email
      setError('');
    } catch (err) {
      setError('Failed to save email');
      console.error(err);
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

          {error && <p className="error-message">{error}</p>}

          <div className="modal-actions">
            <button onClick={closeModal} className="cancel-btn">Cancel</button>
            <button onClick={handleSave} className="save-btn">Save</button>
          </div>
        </div>

        {/* Display existing emails */}
        <div className="existing-emails">
          <h4>Existing Emails</h4>
          <ul>
            {existingEmails.map((savedEmail, index) => (
              <li key={index}>{savedEmail}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PeopleModal;
