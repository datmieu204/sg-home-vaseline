import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import AdminDashboardButtons from '../../../components/AdminTopButtons'; 

const Dashboard = () => {
  const navigate = useNavigate();

  const buttons = [
    { label: 'Quản lý Nhân viên', onClick: () => navigate('employeeDashboard'), className: 'employee' },
    { label: 'Quản lý Dịch vụ', onClick: () => navigate('serviceDashboard'), className: 'service' },
    { label: 'Quản lý Hộ cư dân', onClick: () => navigate('householdDashboard'), className: 'household' },
  ];

  return (
    <div>
      <AdminDashboardButtons buttons={buttons} />
      <Outlet /> {/* chỗ render route con */}
    </div>
  );
};

export default Dashboard;
