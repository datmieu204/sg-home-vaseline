import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import AdminDashboardButtons from '../../../components/AdminDashboardButtons'; 

const Dashboard = () => {
  const navigate = useNavigate();

  const handleEmployeeDashboard = () => {
    navigate('employeeDashboard');
  };

  const handleServiceDashboard = () => {
    navigate('serviceDashboard');
  };

  const handleHouseholdDashboard = () => {
    navigate('householdDashboard');
  };

  return (
    <div>
      <AdminDashboardButtons
        handleEmployeeDashboard={handleEmployeeDashboard}
        handleServiceDashboard={handleServiceDashboard}
        handleHouseholdDashboard={handleHouseholdDashboard}
      />

      <Outlet /> {/* chỗ render route con */}
    </div>
  );
};

export default Dashboard;
