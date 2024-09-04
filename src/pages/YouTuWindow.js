import React from 'react';
import './YouTuWindow.css';

function YouTuWindow({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="youtuwindow-overlay" onClick={onClose}>
      <div className="youtuwindow-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default YouTuWindow;
