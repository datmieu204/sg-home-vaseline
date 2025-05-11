
import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import AdminDashboardButtons from '../../../components/TopButtons'; 

const ServiceHousehold = () => {
  const navigate = useNavigate();

  const buttons = [
    { label: 'Đăng ký dịch vụ', onClick: () => navigate('registerService'), className: 'registerService' },
    { label: 'Dịch vụ của tôi', onClick: () => navigate('myService'), className: 'myService' },
  ];

  return (
    <div>
      <AdminDashboardButtons buttons={buttons} />
      <Outlet /> {/* chỗ render route con */}
    </div>
  );
};

export default ServiceHousehold;
