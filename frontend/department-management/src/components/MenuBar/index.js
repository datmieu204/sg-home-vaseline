import React from 'react';
import './MenuBar.css';
import { Link, useLocation } from 'react-router-dom';

import { 
  FaUser, 
  FaClipboardList, 
  FaChartLine, 
  FaBell, 
  FaConciergeBell, 
  FaUserFriends, 
  FaTachometerAlt, 
  FaReceipt
} from 'react-icons/fa';

import logo from '../../assets/white_logo.png'; 
const MenuBar = ({ role }) => {
  const location = useLocation();
  
  const menuItems = {
    admin: [
      { name: 'Tài khoản', icon: <FaUser />, path: 'account' },
      { name: 'Tài khoản khác', icon: <FaUserFriends />, path: 'otherAccount' },
      { name: 'Xem nhiệm vụ', icon: <FaClipboardList />, path: 'tasks' },
      { name: 'Dashboard', icon: <FaTachometerAlt />, path: 'dashboard' },
    ],
    manager: [
      { name: 'Tài khoản', icon: <FaUser />, path: 'account' },
      { name: 'Tài khoản nhân viên', icon: <FaUserFriends />, path: 'otherAccount' },
      { name: 'Nhiệm vụ', icon: <FaClipboardList />, path: 'tasks' },
      { name: 'Giao nhiệm vụ', icon: <FaClipboardList />, path: 'otherTasks' },
      { name: 'Sự cố', icon: <FaChartLine />, path: 'incidents' },
    ],
    staff: [
      { name: 'Tài khoản', icon: <FaUser />, path: 'account' },
      { name: 'Nhiệm vụ', icon: <FaClipboardList />, path: 'tasks' },
      { name: 'Báo cáo sự cố', icon: <FaChartLine />, path: 'incidents' },
    ],
    staffACCT: [
      { name: 'Tài khoản', icon: <FaUser />, path: 'account' },
      { name: 'Nhiệm vụ', icon: <FaClipboardList />, path: 'tasks' },
      { name: 'Báo cáo sự cố', icon: <FaChartLine />, path: 'incidents' },
      { name: 'Xác nhận thanh toán', icon: <FaReceipt />, path: 'payment' },
    ],
    staffRECEP: [
      { name: 'Tài khoản', icon: <FaUser />, path: 'account' },
      { name: 'Tài khoản Hộ cư dân', icon: <FaUserFriends />, path: 'otherAccount' },
      { name: 'Nhiệm vụ', icon: <FaClipboardList />, path: 'tasks' },
      { name: 'Báo cáo sự cố', icon: <FaChartLine />, path: 'incidents' },
      { name: 'Dịch vụ', icon: <FaReceipt />, path: 'services' },
    ],
    household: [
      { name: 'Tài khoản', icon: <FaUser />, path: 'account' },
      { name: 'Thông báo', icon: <FaBell />, path: 'notifications' },
      { 
        name: 'Dịch vụ', 
        icon: <FaConciergeBell />, 
        path: 'services',
        subItems: [
          { name: 'Đăng ký dịch vụ', path: 'registerService' },
          { name: 'Quản lý dịch vụ', path: 'myService' },
        ],
      },
    ],
  };

  const items = menuItems[role] || [];

  // If no logo is available, use a placeholder or text
  const logoSrc = logo || "https://via.placeholder.com/50x30?text=SGHOME";

  return (
    <div className="menu-bar">
      <div className="logo">
        <img src={logoSrc} alt="SGHOME Logo" />
      </div>
      
      <div className="menu-items">
        {items.map((item, index) => {
          const isActive = location.pathname.endsWith(item.path);
          
          return (
            <Link 
              to={item.path} 
              key={index} 
              className={`menu-item ${isActive ? 'active' : ''}`}
            >
              <div className="menu-icon">{item.icon}</div>
              <div className="menu-label">{item.name}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MenuBar;