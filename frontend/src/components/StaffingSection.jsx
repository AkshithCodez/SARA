import React from 'react';
import './StaffingSection.css';

const StaffingSection = ({ data }) => {
  const { staff_required, forecast } = data;
  const { service, cleaning, reception } = staff_required;

  const peakHourIndex = forecast.indexOf(Math.max(...forecast));

  return (
    <section className="section">
      <h2 className="section-title">👥 Staffing Optimization</h2>
      
      <div className="info-banner">
        ⚠️ Peak hour detected: <strong>Hour {peakHourIndex + 1}</strong> with{' '}
        <strong>{Math.round(forecast[peakHourIndex])} customers</strong>
      </div>

      <div className="staff-breakdown">
        <div className="staff-card">
          <div className="staff-icon">🛎️</div>
          <div className="staff-type">Service Staff</div>
          <div className="staff-count">{service[peakHourIndex]}</div>
          <div className="staff-label">at peak hour</div>
        </div>

        <div className="staff-card">
          <div className="staff-icon">🧹</div>
          <div className="staff-type">Cleaning Staff</div>
          <div className="staff-count">{cleaning[peakHourIndex]}</div>
          <div className="staff-label">at peak hour</div>
        </div>

        <div className="staff-card">
          <div className="staff-icon">📋</div>
          <div className="staff-type">Reception Staff</div>
          <div className="staff-count">{reception[peakHourIndex]}</div>
          <div className="staff-label">at peak hour</div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Hour</th>
              <th>Customers</th>
              <th>Service</th>
              <th>Cleaning</th>
              <th>Reception</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {forecast.map((customers, index) => (
              <tr key={index} className={index === peakHourIndex ? 'peak-row' : ''}>
                <td>Hour {index + 1}</td>
                <td>{Math.round(customers)}</td>
                <td>{service[index]}</td>
                <td>{cleaning[index]}</td>
                <td>{reception[index]}</td>
                <td><strong>{service[index] + cleaning[index] + reception[index]}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default StaffingSection;
