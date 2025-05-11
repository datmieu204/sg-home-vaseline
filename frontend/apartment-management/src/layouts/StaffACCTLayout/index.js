// src/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import MenuBar from '../../components/MenuBar';

const StaffACCTLayout = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div style={{ display: 'flex' }}>

      <MenuBar role='staffACCT' />

      <div style={{ flex: 1, padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <p>Xin chào: {user?.username}</p>
        </div>
      
        <Outlet />
      </div>
    </div>
  );
};

export default StaffACCTLayout;
