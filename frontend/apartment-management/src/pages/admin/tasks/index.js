import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import AdminDashboardButtons from '../../../components/TopButtons'; 

const Tasks = () => {
  const navigate = useNavigate();

  const buttons = [
    { label: 'Nhiệm vụ của Quản lý', onClick: () => navigate('managerTasks'), className: 'manager' },
    { label: 'Nhiệm vụ của Nhân viên', onClick: () => navigate('staffTasks'), className: 'staff' },
  ];

  return (
    <div>
      <AdminDashboardButtons buttons={buttons} />
      <Outlet /> {/* chỗ render route con */}
    </div>
  );
};

export default Tasks;
