import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './ProfileModal.css';

const ProfileModal = ({ onClose, userName, documentTitle, onSave }) => {
  const [editedUserName, setEditedUserName] = useState(userName || '');
  const [editedDocumentTitle, setEditedDocumentTitle] = useState(documentTitle || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setEditedUserName(userName || '');
    setEditedDocumentTitle(documentTitle || '');
  }, [userName, documentTitle]);

  const handleSave = () => {
    onSave({
      userName: editedUserName,
      documentTitle: editedDocumentTitle
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUserName(userName || '');
    setEditedDocumentTitle(documentTitle || '');
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const modalContent = (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-header">
          <h2>Profile Settings</h2>
          <button className="profile-modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="profile-modal-body">
          <div className="profile-field">
            <label htmlFor="userName">User Name</label>
            {isEditing ? (
              <input
                id="userName"
                type="text"
                value={editedUserName}
                onChange={(e) => setEditedUserName(e.target.value)}
                placeholder="Enter your name"
                className="profile-input"
              />
            ) : (
              <div className="profile-display">
                {editedUserName || 'Not set'}
              </div>
            )}
          </div>

          <div className="profile-field">
            <label htmlFor="documentTitle">Document Title</label>
            {isEditing ? (
              <input
                id="documentTitle"
                type="text"
                value={editedDocumentTitle}
                onChange={(e) => setEditedDocumentTitle(e.target.value)}
                placeholder="Enter document title"
                className="profile-input"
              />
            ) : (
              <div className="profile-display">
                {editedDocumentTitle || 'Untitled Presentation'}
              </div>
            )}
          </div>
        </div>

        <div className="profile-modal-footer">
          {isEditing ? (
            <>
              <button className="profile-button profile-button-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button className="profile-button profile-button-save" onClick={handleSave}>
                Save Changes
              </button>
            </>
          ) : (
            <button className="profile-button profile-button-edit" onClick={handleEdit}>
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ProfileModal;
