import React from 'react';
import './MenuBar.css';

const MenuBar = ({ role }) => {
  const menuItems = {
    admin: ['Tài khoản', 'Nhiệm vụ người khác', 'Tài khoản người khác', 'Dashboard'],
    leader: ['Tài khoản', 'Nhiệm vụ', 'Báo cáo', 'Nhiệm vụ nhân viên', 'Tài khoản nhân viên'],
    emp: ['Tài khoản', 'Nhiệm vụ', 'Báo cáo'],
    resident: ['Tài khoản', 'Thông báo', 'Dịch vụ'],
  };

  const items = menuItems[role] || [];

  return (
    <div className="menu-bar">
      {items.map((item, index) => (
        <div key={index} className="menu-item">
          {item}
        </div>
      ))}
    </div>
  );
};

export default MenuBar;