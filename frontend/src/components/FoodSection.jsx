import React from 'react';
import './FoodSection.css';

const FoodSection = ({ data }) => {
  const { food_required, forecast } = data;
  const totalFood = food_required.reduce((sum, val) => sum + val, 0);

  return (
    <section className="section">
      <h2 className="section-title">🍽️ Food Waste Reduction</h2>
      
      <div className="food-summary">
        <div className="food-metric">
          <div className="food-icon">📦</div>
          <div>
            <div className="food-label">Total Food Required</div>
            <div className="food-value">{Math.round(totalFood)} units</div>
            <div className="food-sublabel">Next 6 hours</div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Hour</th>
              <th>Expected Customers</th>
              <th>Food Units Required</th>
            </tr>
          </thead>
          <tbody>
            {food_required.map((food, index) => (
              <tr key={index}>
                <td>Hour {index + 1}</td>
                <td>{Math.round(forecast[index])}</td>
                <td>{food.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="info-box">
        <div className="info-icon">💡</div>
        <div className="info-content">
          <strong>Smart Ordering:</strong> By predicting demand accurately, SARA helps reduce 
          food waste by ordering the right amount of supplies based on expected customer volume. 
          This optimization leads to cost savings and environmental benefits.
        </div>
      </div>
    </section>
  );
};

export default FoodSection;
