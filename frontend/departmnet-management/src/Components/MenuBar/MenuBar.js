import React from 'react';
import './MenuBar.css';
import { Link, useLocation } from 'react-router-dom';

// Icons import
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

// Import the logo directly
import logo from '../../assets/white_logo.png'; // You'll need to create this assets folder

const MenuBar = ({ role }) => {
  const location = useLocation();
  
  const menuItems = {
    admin: [
      { name: 'Tài khoản', icon: <FaUser />, path: '/account' },
      { name: 'Nhiệm vụ người khác', icon: <FaClipboardList />, path: '/tasks' },
      { name: 'Tài khoản người khác', icon: <FaUserFriends />, path: '/accounts' },
      { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard' },
    ],
    leader: [
      { name: 'Tài khoản', icon: <FaUser />, path: '/account' },
      { name: 'Nhiệm vụ', icon: <FaClipboardList />, path: '/tasks' },
      { name: 'Báo cáo', icon: <FaChartLine />, path: '/reports' },
      { name: 'Nhiệm vụ nhân viên', icon: <FaClipboardList />, path: '/tasks/employees' },
      { name: 'Tài khoản nhân viên', icon: <FaUserFriends />, path: '/accounts/employees' },
    ],
    emp: [
      { name: 'Tài khoản', icon: <FaUser />, path: '/account' },
      { name: 'Nhiệm vụ', icon: <FaClipboardList />, path: '/tasks' },
      { name: 'Báo cáo', icon: <FaChartLine />, path: '/reports' },
    ],
    resident: [
      { name: 'Tài khoản', icon: <FaUser />, path: '/account' },
      { name: 'Thông báo', icon: <FaBell />, path: '/notifications' },
      { name: 'Dịch vụ', icon: <FaConciergeBell />, path: '/services' },
    ],
    finance: [
      { name: 'Tài khoản', icon: <FaUser />, path: '/account' },
      { name: 'Nhiệm vụ', icon: <FaClipboardList />, path: '/tasks' },
      { name: 'Báo cáo', icon: <FaChartLine />, path: '/reports' },
      { name: 'Xác nhận thanh toán', icon: <FaReceipt />, path: '/payment-confirmation' },
    ]
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
          // Check if this menu item is active
          const isActive = location.pathname === item.path || 
                          (item.path !== '/account' && location.pathname.startsWith(item.path));
          
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