import React from 'react';

/**
 * Modal header component with title and close button
 */
const ModalHeader = ({ onClose, onMouseDown }) => {
  return (
    <div 
      className="chart-data-modal-header"
      onMouseDown={onMouseDown}
      style={{ cursor: 'grab' }}
    >
      <h2>Edit Chart Data</h2>
      <button className="close-button" onClick={onClose}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
};

export default ModalHeader;

