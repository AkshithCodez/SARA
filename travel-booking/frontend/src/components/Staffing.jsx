import React from 'react';
import './TabContent.css';

const Staffing = ({ data }) => {
  const { staff_required, forecast } = data;
  const { service, cleaning, reception } = staff_required;

  const peakHourIndex = forecast.indexOf(Math.max(...forecast));
  const totalStaffAtPeak = service[peakHourIndex] + cleaning[peakHourIndex] + reception[peakHourIndex];

  return (
    <div className="tab-content">
      <div className="content-header">
        <h2 className="content-title">Staffing Optimization</h2>
        <p className="content-subtitle">Intelligent staff allocation based on predicted customer volume</p>
      </div>

      <div className="alert-banner">
        <span className="alert-icon">⚠️</span>
        <span>Peak hour detected: <strong>Hour {peakHourIndex + 1}</strong> with <strong>{Math.round(forecast[peakHourIndex])} customers</strong></span>
      </div>

      <div className="metrics-grid">
        <div className="metric-card staff-card">
          <div className="metric-icon">🛎️</div>
          <div className="metric-info">
            <div className="metric-label">Service Staff</div>
            <div className="metric-value">{service[peakHourIndex]}</div>
            <div className="metric-unit">at peak hour</div>
          </div>
        </div>

        <div className="metric-card staff-card">
          <div className="metric-icon">🧹</div>
          <div className="metric-info">
            <div className="metric-label">Cleaning Staff</div>
            <div className="metric-value">{cleaning[peakHourIndex]}</div>
            <div className="metric-unit">at peak hour</div>
          </div>
        </div>

        <div className="metric-card staff-card">
          <div className="metric-icon">📋</div>
          <div className="metric-info">
            <div className="metric-label">Reception Staff</div>
            <div className="metric-value">{reception[peakHourIndex]}</div>
            <div className="metric-unit">at peak hour</div>
          </div>
        </div>

        <div className="metric-card staff-card total">
          <div className="metric-icon">👨‍💼</div>
          <div className="metric-info">
            <div className="metric-label">Total Staff</div>
            <div className="metric-value">{totalStaffAtPeak}</div>
            <div className="metric-unit">at peak hour</div>
          </div>
        </div>
      </div>

      <div className="table-section">
        <h3 className="section-subtitle">Hourly Staffing Requirements</h3>
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
      </div>
    </div>
  );
};

export default Staffing;
