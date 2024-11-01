import React from 'react';
import './LogoutModal.css';

const LogoutModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className="modal-text">Are you sure you want to Logout?</p>
        <button className="confirm-btn" onClick={onConfirm}>Yes, Logout</button>
        <button className="cancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default LogoutModal;
