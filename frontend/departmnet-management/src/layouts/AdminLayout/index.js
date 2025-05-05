import React from 'react';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  return (
    <div>
      <div className="menu-bar">
        <div className="flex items-center">
          <img src="https://via.placeholder.com/50" alt="Logo" className="mr-2" />
          <a href="/admin/account">Tài khoản</a>
          <a href="/admin/other-tasks">Nhiệm vụ người khác</a>
          <a href="/admin/other-accounts">Tài khoản người khác</a>
          <a href="/admin/dashboard">Dashboard</a>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/6 bg-orange-500 text-white p-4">
          <ul>
            <li className="mb-2"><a href="/admin/account">Tài khoản</a></li>
            <li className="mb-2"><a href="/admin/other-tasks">Nhiệm vụ người khác</a></li>
            <li className="mb-2"><a href="/admin/other-accounts">Tài khoản người khác</a></li>
            <li className="mb-2"><a href="/admin/dashboard">Dashboard</a></li>
          </ul>
        </div>
        <div className="w-5/6 p-4">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;