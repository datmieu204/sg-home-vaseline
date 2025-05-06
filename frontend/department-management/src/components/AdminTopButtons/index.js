import React from 'react';
import './AdminDashboardButtons.css';

const AdminDashboardButtons = ({ buttons }) => {
  return (
    <div className="button-container">
      {buttons.map((btn, index) => (
        <button
          key={index}
          className={`dashboard-button ${btn.className || ''}`}
          onClick={btn.onClick}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
};

export default AdminDashboardButtons;
