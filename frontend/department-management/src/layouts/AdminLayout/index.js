// src/layouts/AdminLayout
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSideMenu from '../../components/AdminSideMenu';

const AdminLayout = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div style={{ display: 'flex' }}>
      
      <AdminSideMenu />

      <div style={{ flex: 1, padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <p>Xin chào: {user?.username}</p>
        </div>
      
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
