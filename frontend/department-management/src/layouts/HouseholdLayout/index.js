// src/layouts/HouseholdLayout
import React from 'react';
import { Outlet } from 'react-router-dom';
import HouseholdSideMenu from '../../components/HouseholdSideMenu/index.js';

const HouseholdLayout = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div style={{ display: 'flex' }}>
      
      <HouseholdSideMenu />

      <div style={{ flex: 1, padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <p>Xin chào: {user?.username}</p>
        </div>
      
        <Outlet />
      </div>
    </div>
  );
};

export default HouseholdLayout;
