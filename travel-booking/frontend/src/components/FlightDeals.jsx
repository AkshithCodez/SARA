import React from 'react';
import './FlightDeals.css';

const FlightDeals = () => {
  const deals = [
    {
      id: 1,
      type: 'STANDARD',
      title: 'LUXURY TRAVEL AND AIRLINES',
      description: 'Experience the ultimate in comfort and service with our premium airline partners.',
      image: '/deal1.jpg'
    },
    {
      id: 2,
      type: 'HOTEL BOOKINGS',
      title: 'Premium Hotels',
      description: 'Book luxury accommodations at unbeatable prices.',
      image: '/hotel1.jpg'
    },
    {
      id: 3,
      type: 'ROOM BOOKINGS',
      title: 'Exclusive Rooms',
      description: 'Find your perfect stay with our curated selection.',
      image: '/hotel2.jpg'
    }
  ];

  return (
    <section className="flight-deals">
      <div className="deals-container">
        <h2 className="section-title">TOP FLIGHT DEALS</h2>
        <p className="section-subtitle">
          Discover top flight deals for elite travel experiences at unbeatable prices.
        </p>

        <div className="deals-grid">
          {deals.map((deal) => (
            <div key={deal.id} className="deal-card">
              <div className="deal-image">
                <div className="deal-placeholder">
                  <span>{deal.type}</span>
                </div>
              </div>
              <div className="deal-content">
                <span className="deal-type">{deal.type}</span>
                <h3 className="deal-title">{deal.title}</h3>
                <p className="deal-description">{deal.description}</p>
                <button className="book-btn">Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlightDeals;
