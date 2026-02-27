import React, { useState } from 'react';
import './TabContent.css';

const CustomerExperience = ({ data }) => {
  const [showNotification, setShowNotification] = useState(false);
  const { estimated_cost } = data;

  const handleCallStaff = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="tab-content">
      <div className="content-header">
        <h2 className="content-title">Customer Experience</h2>
        <p className="content-subtitle">Enhancing passenger satisfaction through proactive service</p>
      </div>

      <div className="experience-grid">
        <div className="experience-card">
          <div className="experience-icon">🔔</div>
          <h3 className="experience-title">Request Assistance</h3>
          <p className="experience-description">
            Need help? Our dedicated staff is ready to assist you with any requests or concerns.
          </p>
          <button className="call-staff-button" onClick={handleCallStaff}>
            📞 Call Staff for Assistance
          </button>
        </div>

        <div className="experience-card">
          <div className="experience-icon">⭐</div>
          <h3 className="experience-title">Service Quality</h3>
          <p className="experience-description">
            We maintain high service standards with optimized staff allocation to ensure prompt attention.
          </p>
          <div className="quality-metrics">
            <div className="quality-item">
              <span className="quality-label">Response Time:</span>
              <span className="quality-value">{'< 2 min'}</span>
            </div>
            <div className="quality-item">
              <span className="quality-label">Satisfaction Rate:</span>
              <span className="quality-value">98%</span>
            </div>
          </div>
        </div>

        <div className="experience-card">
          <div className="experience-icon">💰</div>
          <h3 className="experience-title">Operational Efficiency</h3>
          <p className="experience-description">
            Smart resource allocation ensures cost-effective operations while maintaining service excellence.
          </p>
          <div className="cost-display">
            <div className="cost-label">Estimated 6-Hour Cost</div>
            <div className="cost-value">${estimated_cost.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="info-box">
        <div className="info-icon">💡</div>
        <div className="info-content">
          <strong>SARA Advantage:</strong> By predicting customer flow and optimizing resources in real-time, 
          we ensure that staff are available when and where they're needed most, leading to faster service, 
          reduced wait times, and enhanced overall customer satisfaction.
        </div>
      </div>

      {showNotification && (
        <div className="notification-toast">
          <div className="notification-icon">✅</div>
          <div className="notification-text">
            Staff notified. Assistance is on the way.
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerExperience;
