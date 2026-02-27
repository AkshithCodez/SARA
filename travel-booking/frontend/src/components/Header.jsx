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

  // SARA logo - enhanced version matching the actual design
  const SaraLogo = () => (
    <svg width="60" height="60" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Blue wing with gradient and stripes */}
      <defs>
        <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="seatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fcd34d" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="seatBackGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
      </defs>
      
      {/* Wing shape */}
      <path d="M30 50 Q35 30, 60 40 Q70 45, 75 55 L75 110 Q70 120, 60 115 Q40 110, 35 105 L30 50 Z" 
            fill="url(#wingGradient)" opacity="0.95"/>
      
      {/* Wing stripes */}
      <path d="M40 60 Q50 55, 70 62 L70 70 Q50 65, 42 68 L40 60 Z" fill="white" opacity="0.3"/>
      <path d="M38 80 Q48 75, 68 82 L68 90 Q48 85, 40 88 L38 80 Z" fill="white" opacity="0.3"/>
      
      {/* Seat base */}
      <path d="M90 65 L170 65 Q180 65, 180 75 L180 145 Q180 155, 170 155 L105 155 Q95 155, 95 145 L95 75 Q95 65, 90 65 Z" 
            fill="url(#seatGradient)"/>
      
      {/* Seat back/cushion */}
      <path d="M105 72 L160 72 L160 100 L170 100 Q175 100, 175 105 L175 145 Q175 148, 172 148 L105 148 Q102 148, 102 145 L102 75 Q102 72, 105 72 Z" 
            fill="url(#seatBackGradient)"/>
      
      {/* Seat armrest */}
      <rect x="165" y="100" width="8" height="48" rx="2" fill="#d97706" opacity="0.8"/>
      
      {/* Seat details/shadows */}
      <ellipse cx="135" cy="130" rx="25" ry="8" fill="#f59e0b" opacity="0.3"/>
    </svg>
  );

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <SaraLogo />
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
