import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-text">Loading SARA dashboard data...</p>
    </div>
  );
};

export default LoadingSpinner;
