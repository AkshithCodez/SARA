import React from 'react';
import './HotelBooking.css';

const HotelBooking = () => {
  const hotels = [
    {
      id: 1,
      name: 'MOXY NYC DOWNTOWN',
      rating: 4,
      location: 'Downtown Manhattan',
      image: '/hotel1.jpg'
    },
    {
      id: 2,
      name: 'HOTEL TROPICAL DAISY',
      rating: 5,
      location: 'Los Angeles, California',
      image: '/hotel2.jpg'
    },
    {
      id: 3,
      name: 'HOTEL TROPICAL DAISY',
      rating: 5,
      location: 'Miami Beach, Florida',
      image: '/hotel3.jpg'
    }
  ];

  return (
    <section className="hotel-booking">
      <div className="hotel-container">
        <h2 className="section-title">BOOK YOUR HOTEL</h2>
        <p className="section-subtitle">
          The world's leading airlines offer top-notch service, ensuring memorable travel experiences for passengers.
        </p>

        <div className="hotels-grid">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="hotel-card">
              <div className="hotel-image">
                <div className="hotel-placeholder">
                  <span>🏨</span>
                </div>
                <button className="favorite-btn">♡</button>
              </div>
              <div className="hotel-info">
                <h3 className="hotel-name">{hotel.name}</h3>
                <div className="hotel-rating">
                  {'⭐'.repeat(hotel.rating)}
                </div>
                <p className="hotel-location">{hotel.location}</p>
                <button className="book-hotel-btn">Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotelBooking;
