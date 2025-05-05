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
      { name: 'Tài khoản', icon: <FaUser />, path: '/admin/account' },
      { name: 'Nhiệm vụ người khác', icon: <FaClipboardList />, path: '/admin/other-tasks' },
      { name: 'Tài khoản người khác', icon: <FaUserFriends />, path: '/accounts' },
      { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/admin/dashboard' },
    ],
    leader: [
      { name: 'Tài khoản', icon: <FaUser />, path: '/leader/account' },
      { name: 'Nhiệm vụ', icon: <FaClipboardList />, path: '/leader/tasks' },
      { name: 'Báo cáo', icon: <FaChartLine />, path: '/leader/reports' },
      { name: 'Nhiệm vụ nhân viên', icon: <FaClipboardList />, path: '/leader/other-tasks' },
      { name: 'Tài khoản nhân viên', icon: <FaUserFriends />, path: '/leader/employee-tasks' },
    ],
    emp: [
      { name: 'Tài khoản', icon: <FaUser />, path: '/emp/account' },
      { name: 'Nhiệm vụ', icon: <FaClipboardList />, path: '/emp/tasks' },
      { name: 'Báo cáo', icon: <FaChartLine />, path: '/emp/reports' },
    ],
    resident: [
      { name: 'Tài khoản', icon: <FaUser />, path: 'resident/account' },
      { name: 'Thông báo', icon: <FaBell />, path: 'resident/notifications' },
      { name: 'Dịch vụ', icon: <FaConciergeBell />, path: 'resident/services' },
    ],
    finance: [
      { name: 'Tài khoản', icon: <FaUser />, path: 'emp/account' },
      { name: 'Nhiệm vụ', icon: <FaClipboardList />, path: 'emp/tasks' },
      { name: 'Báo cáo', icon: <FaChartLine />, path: 'emp/reports' },
      { name: 'Xác nhận thanh toán', icon: <FaReceipt />, path: 'finance/payments' },
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