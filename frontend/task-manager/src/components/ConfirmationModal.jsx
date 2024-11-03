import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ email, onClose }) => {
  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal-content">
        <p><strong>{email}</strong> added to board</p>
        <button onClick={onClose} className="confirm-btn">
          Okay, got it!
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;
