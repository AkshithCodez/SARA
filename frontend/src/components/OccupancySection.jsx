import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './OccupancySection.css';

const OccupancySection = ({ data }) => {
  const { forecast, risk_level } = data;

  const chartData = forecast.map((value, index) => ({
    hour: `Hour ${index + 1}`,
    occupancy: value,
  }));

  const currentOccupancy = forecast[0];
  const peakOccupancy = Math.max(...forecast);
  const peakHourIndex = forecast.indexOf(peakOccupancy);
  const currentRisk = risk_level[0];

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <section className="section">
      <h2 className="section-title">📊 Lounge Occupancy Forecast</h2>
      
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-label">Current Occupancy</div>
          <div className="metric-value">{currentOccupancy}</div>
          <div className="metric-unit">customers</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-label">Peak Occupancy</div>
          <div className="metric-value">{peakOccupancy}</div>
          <div className="metric-unit">at Hour {peakHourIndex + 1}</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-label">Risk Level</div>
          <div 
            className="risk-badge" 
            style={{ backgroundColor: getRiskColor(currentRisk) }}
          >
            {currentRisk.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="hour" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="occupancy" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 5 }}
              activeDot={{ r: 7 }}
              name="Predicted Customers"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default OccupancySection;
