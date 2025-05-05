import React from 'react';
import { Link } from 'react-router-dom'; // Sử dụng Link cho điều hướng
import './MenuBar.css';

const MenuBar = ({ role }) => {
  const menuItems = {
    admin: [
      { name: 'Tài khoản', path: '/admin/account' },
      { name: 'Nhiệm vụ người khác', path: '/admin/other-tasks' },
      { name: 'Tài khoản người khác', path: '/admin/other-accounts' },
      { name: 'Dashboard', path: '/admin/dashboard' },
    ],
    leader: [
      { name: 'Tài khoản', path: '/leader/account' },
      { name: 'Nhiệm vụ', path: '/leader/tasks' },
      { name: 'Báo cáo', path: '/leader/reports' },
      { name: 'Nhiệm vụ nhân viên', path: '/leader/other-tasks' },
      { name: 'Tài khoản nhân viên', path: '/leader/employee-accounts' },
    ],
    emp: [
      { name: 'Tài khoản', path: '/emp/account' },
      { name: 'Nhiệm vụ', path: '/emp/tasks' },
      { name: 'Báo cáo', path: '/emp/reports' },
    ],
    resident: [
      { name: 'Tài khoản', path: '/resident/account' },
      { name: 'Thông báo', path: '/resident/notifications' },
      { name: 'Dịch vụ', path: '/resident/services' },
    ],
  };

  const items = menuItems[role] || [];

  return (
    <div className="menu-bar">
      {items.map((item, index) => (
        <Link key={index} to={item.path} className="menu-item">
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default MenuBar;