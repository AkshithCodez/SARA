import React, { useState } from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const [tripType, setTripType] = useState('One-Way');

  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <p className="hero-subtitle">READY TAKE-OFF</p>
          <h1 className="hero-title">
            CONVENIENT ONLINE<br />
            FLIGHT BOOKING SERVICES
          </h1>
          
          <div className="airplane-image">
            <img src="/airplane.png" alt="Airplane" />
          </div>

          <div className="booking-form">
            <div className="trip-type-tabs">
              <button 
                className={`trip-tab ${tripType === 'One-Way' ? 'active' : ''}`}
                onClick={() => setTripType('One-Way')}
              >
                One-Way
              </button>
              <button 
                className={`trip-tab ${tripType === 'Round Trip' ? 'active' : ''}`}
                onClick={() => setTripType('Round Trip')}
              >
                Round Trip
              </button>
              <button 
                className={`trip-tab ${tripType === 'Multi-City' ? 'active' : ''}`}
                onClick={() => setTripType('Multi-City')}
              >
                Multi-City
              </button>
            </div>

            <div className="booking-inputs">
              <div className="input-group">
                <label>From</label>
                <select className="location-select">
                  <option>Tokyo, Japan</option>
                  <option>New York, USA</option>
                  <option>London, UK</option>
                </select>
              </div>

              <div className="input-group">
                <label>To</label>
                <select className="location-select">
                  <option>Berlin, Germany</option>
                  <option>Paris, France</option>
                  <option>Rome, Italy</option>
                </select>
              </div>

              <div className="input-group">
                <label>Departure</label>
                <input type="date" className="date-input" defaultValue="2023-10-13" />
              </div>

              <div className="input-group">
                <label>Return</label>
                <input type="date" className="date-input" defaultValue="2023-12-16" />
              </div>

              <button className="search-btn">
                <span>🔍</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
