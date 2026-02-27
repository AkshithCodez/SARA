import React from 'react';
import './PopularAirlines.css';

const PopularAirlines = () => {
  const airlines = [
    { id: 1, name: 'TURKISH AIRLINES', logo: '✈️' },
    { id: 2, name: 'EMIRATES', logo: '✈️' },
    { id: 3, name: 'QATAR AIRWAYS', logo: '✈️' },
    { id: 4, name: 'LUFTHANSA', logo: '✈️' }
  ];

  return (
    <section className="popular-airlines">
      <div className="airlines-container">
        <h2 className="section-title">MOST POPULAR AIRLINES</h2>
        <p className="section-subtitle">
          The world's leading airlines offer top-notch service, ensuring memorable travel experiences for passengers.
        </p>

        <div className="airlines-grid">
          {airlines.map((airline) => (
            <div key={airline.id} className="airline-card">
              <div className="airline-image">
                <div className="airline-placeholder">
                  <span className="airline-icon">{airline.logo}</span>
                </div>
              </div>
              <div className="airline-info">
                <h3 className="airline-name">{airline.name}</h3>
                <button className="view-btn">→</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularAirlines;
