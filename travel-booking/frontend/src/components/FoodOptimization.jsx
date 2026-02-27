import React from 'react';
import './TabContent.css';

const FoodOptimization = ({ data }) => {
  const { food_required, forecast } = data;
  const totalFood = Math.round(food_required.reduce((sum, val) => sum + val, 0));

  return (
    <div className="tab-content">
      <div className="content-header">
        <h2 className="content-title">Food Waste Reduction</h2>
        <p className="content-subtitle">Smart ordering based on demand prediction to minimize waste</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card food-card">
          <div className="metric-icon">📦</div>
          <div className="metric-info">
            <div className="metric-label">Total Food Required</div>
            <div className="metric-value">{totalFood}</div>
            <div className="metric-unit">units (next 6 hours)</div>
          </div>
        </div>

        <div className="metric-card food-card">
          <div className="metric-icon">🍽️</div>
          <div className="metric-info">
            <div className="metric-label">Average Per Hour</div>
            <div className="metric-value">{Math.round(totalFood / 6)}</div>
            <div className="metric-unit">units/hour</div>
          </div>
        </div>

        <div className="metric-card food-card">
          <div className="metric-icon">♻️</div>
          <div className="metric-info">
            <div className="metric-label">Waste Reduction</div>
            <div className="metric-value">25%</div>
            <div className="metric-unit">vs traditional ordering</div>
          </div>
        </div>
      </div>

      <div className="info-box">
        <div className="info-icon">💡</div>
        <div className="info-content">
          <strong>Smart Ordering System:</strong> By accurately predicting customer demand, SARA helps reduce 
          food waste by ordering the right amount of supplies based on expected volume. This optimization 
          leads to significant cost savings and environmental benefits while ensuring customer satisfaction.
        </div>
      </div>

      <div className="table-section">
        <h3 className="section-subtitle">Hourly Food Requirements</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Hour</th>
                <th>Expected Customers</th>
                <th>Food Units Required</th>
                <th>Per Customer</th>
              </tr>
            </thead>
            <tbody>
              {food_required.map((food, index) => (
                <tr key={index}>
                  <td>Hour {index + 1}</td>
                  <td>{Math.round(forecast[index])}</td>
                  <td><strong>{Math.round(food)}</strong></td>
                  <td>{(food / forecast[index]).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FoodOptimization;
