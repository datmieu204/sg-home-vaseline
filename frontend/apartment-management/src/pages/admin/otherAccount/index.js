import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import AdminDashboardButtons from '../../../components/TopButtons'; 

const OtherAccount = () => {
  const navigate = useNavigate();

  const buttons = [
    { label: 'Tài khoản Hộ dân cư', onClick: () => navigate('HouseholdAccount'), className: 'household' },
    { label: 'Tài khoản Quản lý', onClick: () => navigate('ManagerAccount'), className: 'manager' },
    { label: 'Tài khoản Nhân viên', onClick: () => navigate('StaffAccount'), className: 'staff' },
  ];

  return (
    <div>
      <AdminDashboardButtons buttons={buttons} />
      <Outlet /> {/* chỗ render route con */}
    </div>
  );
};

export default OtherAccount;
