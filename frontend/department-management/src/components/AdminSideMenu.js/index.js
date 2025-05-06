// src/components/AdminSideMenu.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AdminSideMenu = () => {
  return (
    <div style={{
      width: '200px',
      minHeight: '100vh',
      background: '#f4f4f4',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <h3>Menu</h3>
      <ul style={{ listStyle: 'none', padding: 5, margin: 5, gap: 5 }}>
        <li><Link to="account">Tài khoản</Link></li>
        <li><Link to="reports">Báo cáo</Link></li>
        <li><Link to="dashboard">Dashboard</Link></li>
      </ul>
    </div>
  );
};

export default AdminSideMenu;
