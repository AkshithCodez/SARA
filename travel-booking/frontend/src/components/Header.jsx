import React from 'react';
import './Header.css';

const Header = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'lounge', label: 'Lounge Traffic' },
    { id: 'staffing', label: 'Staffing' },
    { id: 'food', label: 'Food Optimization' },
    { id: 'risk', label: 'Risk Monitoring' },
    { id: 'customer', label: 'Customer Experience' }
  ];

  // Enhanced SARA logo matching the actual design
  const SaraLogo = () => (
    <svg width="50" height="50" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Blue wing with stripes */}
      <path d="M30 60 Q40 40, 70 50 L70 100 Q50 110, 35 100 L30 60 Z" fill="#2563EB" opacity="0.9"/>
      <path d="M35 70 Q42 60, 65 68 L65 105 Q50 112, 38 105 L35 70 Z" fill="#3B82F6" opacity="0.8"/>
      
      {/* Wing stripes (white lines) */}
      <line x1="45" y1="65" x2="65" y2="70" stroke="white" strokeWidth="3" opacity="0.6"/>
      <line x1="42" y1="80" x2="62" y2="85" stroke="white" strokeWidth="3" opacity="0.6"/>
      
      {/* Gold/Yellow seat */}
      <path d="M85 70 L160 70 Q170 70, 170 80 L170 140 Q170 150, 160 150 L100 150 Q90 150, 90 140 L90 80 Q90 70, 85 70 Z" 
            fill="url(#goldGradient)"/>
      
      {/* Seat back */}
      <path d="M100 75 L150 75 L150 95 L160 95 Q165 95, 165 100 L165 140 L100 140 L100 75 Z" 
            fill="url(#lightGoldGradient)"/>
      
      {/* Seat armrest */}
      <rect x="155" y="95" width="10" height="45" rx="3" fill="#D97706" opacity="0.7"/>
      
      {/* Gradients */}
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="lightGoldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FCD34D" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <SaraLogo />
          <h2>SARA Dashboard</h2>
        </div>
        
        <nav className="nav-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="status-indicator">
          <span className="status-dot"></span>
          <span className="status-text">Live</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
