import React, { useState } from 'react';
import './SettingsPage.css';
import { updatePassword } from '../api/auth';

const SettingsPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await updatePassword({ name, oldPassword, newPassword, email }); // Include 'email'
      setMessage(response.status === 'success' ? 'Information updated successfully!' : '');
      setError('');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update');
      setMessage('');
    }
  };

  return (
    <div>
      <h1 className='title'>Settings</h1>
      <div className="settings-container">
        <form onSubmit={handleUpdate}>
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Update Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="old-password">Old Password</label>
            <input
              type="password"
              id="old-password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="update-btn">Update</button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
