import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import AdminDashboardButtons from '../../../components/AdminTopButtons';
import './Tasks.css';

const Tasks = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine which tab should be active based on the current path
  const getActiveIndex = () => {
    const path = location.pathname;
    if (path.includes('managerTasks')) return 0;
    if (path.includes('staffTasks')) return 1;
    return null;
  };

  const buttons = [
    { 
      label: 'Nhiệm vụ của Quản lý', 
      onClick: () => navigate('managerTasks'), 
      className: 'manager' 
    },
    { 
      label: 'Nhiệm vụ của Nhân viên', 
      onClick: () => navigate('staffTasks'), 
      className: 'staff' 
    },
  ];

  return (
    <div className="tasks-container">
      <AdminDashboardButtons buttons={buttons} activeButtonIndex={getActiveIndex()} />
      <Outlet />
    </div>
  );
};

export default Tasks;
