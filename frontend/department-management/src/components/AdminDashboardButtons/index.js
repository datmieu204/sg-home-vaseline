import React from 'react';
import './AdminDashboardButtons.css';

const AdminDashboardButtons = ({
  handleEmployeeDashboard,
  handleServiceDashboard,
  handleHouseholdDashboard,
}) => {
  return (
    <div className="button-container">
      <button className="dashboard-button employee" onClick={handleEmployeeDashboard}>
        Quản lý Nhân viên
      </button>
      <button className="dashboard-button service" onClick={handleServiceDashboard}>
        Quản lý Dịch vụ
      </button>
      <button className="dashboard-button household" onClick={handleHouseholdDashboard}>
        Quản lý Hộ cư dân
      </button>
    </div>
  );
};

export default AdminDashboardButtons;
