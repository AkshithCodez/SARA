import React from 'react';
import './TabContent.css';

const RiskMonitoring = ({ data }) => {
  const { risk_level, forecast, confidence_margin } = data;

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

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'low':
        return '✅';
      case 'medium':
        return '⚠️';
      case 'high':
        return '🚨';
      default:
        return '❓';
    }
  };

  const loungeCapacity = 300;
  const currentRisk = risk_level[0];
  const highRiskHours = risk_level.filter(r => r === 'high').length;
  const mediumRiskHours = risk_level.filter(r => r === 'medium').length;

  return (
    <div className="tab-content">
      <div className="content-header">
        <h2 className="content-title">Risk Monitoring</h2>
        <p className="content-subtitle">Real-time capacity and operational risk assessment</p>
      </div>

      <div className="metrics-grid">
        <div className="metric-card risk-card">
          <div className="metric-icon">{getRiskIcon(currentRisk)}</div>
          <div className="metric-info">
            <div className="metric-label">Current Risk Level</div>
            <div 
              className="risk-badge-large" 
              style={{ backgroundColor: getRiskColor(currentRisk) }}
            >
              {currentRisk.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="metric-card risk-card">
          <div className="metric-icon">🏢</div>
          <div className="metric-info">
            <div className="metric-label">Lounge Capacity</div>
            <div className="metric-value">{loungeCapacity}</div>
            <div className="metric-unit">max customers</div>
          </div>
        </div>

        <div className="metric-card risk-card">
          <div className="metric-icon">📊</div>
          <div className="metric-info">
            <div className="metric-label">Capacity Utilization</div>
            <div className="metric-value">{Math.round((forecast[0] / loungeCapacity) * 100)}%</div>
            <div className="metric-unit">current</div>
          </div>
        </div>
      </div>

      <div className="risk-summary">
        <h3 className="section-subtitle">6-Hour Risk Summary</h3>
        <div className="risk-stats">
          <div className="risk-stat">
            <span className="risk-stat-icon" style={{ color: '#ef4444' }}>🚨</span>
            <span className="risk-stat-label">High Risk Hours:</span>
            <span className="risk-stat-value">{highRiskHours}</span>
          </div>
          <div className="risk-stat">
            <span className="risk-stat-icon" style={{ color: '#f59e0b' }}>⚠️</span>
            <span className="risk-stat-label">Medium Risk Hours:</span>
            <span className="risk-stat-value">{mediumRiskHours}</span>
          </div>
          <div className="risk-stat">
            <span className="risk-stat-icon" style={{ color: '#10b981' }}>✅</span>
            <span className="risk-stat-label">Low Risk Hours:</span>
            <span className="risk-stat-value">{6 - highRiskHours - mediumRiskHours}</span>
          </div>
        </div>
      </div>

      <div className="table-section">
        <h3 className="section-subtitle">Hourly Risk Assessment</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Hour</th>
                <th>Predicted Occupancy</th>
                <th>Capacity %</th>
                <th>Confidence Margin</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {forecast.map((occupancy, index) => (
                <tr key={index}>
                  <td>Hour {index + 1}</td>
                  <td>{Math.round(occupancy)}</td>
                  <td>{Math.round((occupancy / loungeCapacity) * 100)}%</td>
                  <td>±{Math.round(confidence_margin[index])}</td>
                  <td>
                    <span 
                      className="risk-badge" 
                      style={{ backgroundColor: getRiskColor(risk_level[index]) }}
                    >
                      {getRiskIcon(risk_level[index])} {risk_level[index].toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RiskMonitoring;
