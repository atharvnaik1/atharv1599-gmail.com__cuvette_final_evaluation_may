import React, { useState } from 'react';
import './SettingsPage.css';
import Sidebar from '../components/Sidebar';
import { updatePassword } from '../api/auth';
import { FaRegUser, FaRegEnvelope } from 'react-icons/fa';
import { RiLockLine } from "react-icons/ri";
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
      const response = await updatePassword({ name, oldPassword, newPassword, email });
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
    <div className="settings-page-container">
      <Sidebar />
      <div className="settings-content">
        <h1 className="title">Settings</h1>
        <div className="settings-container">
          <form onSubmit={handleUpdate}>
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="name"></label>
              <div className="input-icon-container">
                <FaRegUser className="input-icon" />
                <input
                  type="text"
                  id="name"
                  value={name}
                  placeholder="Name"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email"></label>
              <div className="input-icon-container">
                <FaRegEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  placeholder="Update Email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="old-password"></label>
              <div className="input-icon-container">
                <RiLockLine className="input-icon" />
                <input
                  type="password"
                  id="old-password"
                  value={oldPassword}
                  placeholder="Old Password"
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="new-password"></label>
              <div className="input-icon-container">
                <RiLockLine className="input-icon" />
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  placeholder="New Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="update-btn">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
