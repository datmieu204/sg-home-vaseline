import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import HouseholdServiceButtons from '../../../components/HouseholdServiceButtons'; 

const Service = () => {
  const navigate = useNavigate();

  const handleRegisterService = () => {
    navigate('registerService');
  };

  const handleMyService = () => {
    navigate('myService');
  };


  return (
    <div>
      <HouseholdServiceButtons
        handleRegisterService={handleRegisterService}
        handleMyService={handleMyService}
      />

      <Outlet /> {/* chỗ render route con */}
    </div>
  );
};

export default Service;
