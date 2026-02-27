import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import './TabContent.css';

const LoungeTraffic = ({ data }) => {
  const { forecast } = data;

  const chartData = forecast.map((value, index) => ({
    hour: `Hour ${index + 1}`,
    customers: Math.round(value),
  }));

  const currentOccupancy = Math.round(forecast[0]);
  const peakOccupancy = Math.round(Math.max(...forecast));
  const peakHourIndex = forecast.indexOf(Math.max(...forecast));

  // Custom tooltip for dark theme
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #111827 100%)',
          border: '1px solid rgba(34, 211, 238, 0.3)',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
        }}>
          <p style={{ color: '#F8FAFC', margin: 0, fontWeight: 600 }}>{payload[0].payload.hour}</p>
          <p style={{ color: '#22D3EE', margin: '4px 0 0 0' }}>
            {payload[0].value} customers
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="tab-content">
      <div className="content-header">
        <h2 className="content-title">Lounge Traffic Forecast</h2>
        <p className="content-subtitle">Real-time customer occupancy predictions for the next 6 hours</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-info">
            <div className="metric-label">Current Occupancy</div>
            <div className="metric-value">{currentOccupancy}</div>
            <div className="metric-unit">customers</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-info">
            <div className="metric-label">Peak Occupancy</div>
            <div className="metric-value">{peakOccupancy}</div>
            <div className="metric-unit">at Hour {peakHourIndex + 1}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">⏰</div>
          <div className="metric-info">
            <div className="metric-label">Forecast Period</div>
            <div className="metric-value">6</div>
            <div className="metric-unit">hours ahead</div>
          </div>
        </div>
      </div>

      <div className="chart-section">
        <h3 className="section-subtitle">Hourly Customer Forecast</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22D3EE" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(59, 130, 246, 0.1)" />
              <XAxis 
                dataKey="hour" 
                stroke="#94A3B8"
                style={{ fontSize: '0.875rem' }}
              />
              <YAxis 
                stroke="#94A3B8"
                style={{ fontSize: '0.875rem' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="customers"
                stroke="none"
                fill="url(#colorCustomers)"
              />
              <Line 
                type="monotone" 
                dataKey="customers" 
                stroke="#22D3EE" 
                strokeWidth={3}
                dot={{ fill: '#22D3EE', r: 6, strokeWidth: 2, stroke: '#0B0F19' }}
                activeDot={{ r: 8, fill: '#22D3EE', stroke: '#0B0F19', strokeWidth: 2 }}
                filter="drop-shadow(0 0 8px rgba(34, 211, 238, 0.5))"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LoungeTraffic;
