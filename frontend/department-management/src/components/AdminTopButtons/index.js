import React, { useState, useEffect } from 'react';
import './AdminDashboardButtons.css';

const AdminDashboardButtons = ({ buttons, activeButtonIndex: externalActiveIndex }) => {
  const [activeButtonIndex, setActiveButtonIndex] = useState(externalActiveIndex || null);
  
useEffect(() => {
  if (externalActiveIndex !== undefined && externalActiveIndex !== activeButtonIndex) {
    setActiveButtonIndex(externalActiveIndex);
  }
}, [externalActiveIndex, activeButtonIndex]);

  const handleButtonClick = (index, onClick) => {
    setActiveButtonIndex(index);
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="button-container">
      {buttons.map((btn, index) => (
        <button
          key={index}
          className={`dashboard-button ${btn.className || ''} ${activeButtonIndex === index ? 'active' : ''}`}
          onClick={() => handleButtonClick(index, btn.onClick)}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
};

export default AdminDashboardButtons;