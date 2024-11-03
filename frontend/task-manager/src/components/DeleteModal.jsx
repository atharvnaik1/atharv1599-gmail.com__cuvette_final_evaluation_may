import React from 'react';
import './DeleteModal.css';

const DeleteConfirmationModal = ({ onDeleteConfirm, onCancel }) => {
  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal-content">
        <p>Are you sure you want to delete?</p>
        <button className="dconfirm-button" onClick={onDeleteConfirm}>
          Yes, Delete
        </button>
        <button className="dcancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
