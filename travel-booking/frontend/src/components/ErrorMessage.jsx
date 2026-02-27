import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-container">
      <div className="error-card">
        <div className="error-icon">⚠️</div>
        <h2 className="error-title">Connection Error</h2>
        <p className="error-message">{message}</p>
        <button className="retry-button" onClick={onRetry}>
          🔄 Retry Connection
        </button>
        <div className="error-help">
          <p>Make sure the backend is running:</p>
          <code>python main.py</code>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
