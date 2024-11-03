import React from 'react';
import './LogoutModal.css';

const LogoutModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="lmodal-overlay">
      <div className="lmodal-content">
        <p className="lmodal-text">Are you sure you want to Logout?</p>
        <button className="lconfirm-btn" onClick={onConfirm}>Yes, Logout</button>
        <button className="lcancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default LogoutModal;
