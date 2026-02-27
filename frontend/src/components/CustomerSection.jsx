import React, { useState } from 'react';
import './CustomerSection.css';

const CustomerSection = () => {
  const [showNotification, setShowNotification] = useState(false);

  const handleCallStaff = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <section className="section">
      <h2 className="section-title">✨ Customer Experience</h2>
      
      <div className="customer-content">
        <p className="customer-text">
          Need assistance? Our staff is here to help you with any requests or concerns.
        </p>
        
        <button className="call-staff-button" onClick={handleCallStaff}>
          📞 Call Staff for Assistance
        </button>
      </div>

      {showNotification && (
        <div className="notification">
          <div className="notification-icon">✅</div>
          <div className="notification-text">
            Staff notified. Assistance is on the way.
          </div>
        </div>
      )}
    </section>
  );
};

export default CustomerSection;
