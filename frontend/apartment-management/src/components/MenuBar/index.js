// import React from 'react';
// import './MenuBar.css';
// import { Link, useLocation } from 'react-router-dom';

// import { 
//   FaUser, 
//   FaClipboardList, 
//   FaChartLine, 
//   FaBell, 
//   FaConciergeBell, 
//   FaUserFriends, 
//   FaTachometerAlt, 
//   FaReceipt
// } from 'react-icons/fa';

// import logo from '../../assets/white_logo.png'; 
// const MenuBar = ({ role }) => {
//   const location = useLocation();
  
//   const menuItems = {
//     admin: [
//       { name: 'Tài khoản', icon: <FaUser />, path: 'account' },
//       { name: 'Tài khoản khác', icon: <FaUserFriends />, path: 'otherAccount' },
//       { name: 'Xem nhiệm vụ', icon: <FaClipboardList />, path: 'tasks' },
//       { name: 'Dashboard', icon: <FaTachometerAlt />, path: 'dashboard' },
//       { name: 'Logout', icon: <FaUser />, path: '/' },
//     ],
//     manager: [
//       { name: 'Tài khoản', icon: <FaUser />, path: 'account' },
//       { name: 'Tài khoản nhân viên', icon: <FaUserFriends />, path: 'otherAccount' },
//       { name: 'Nhiệm vụ', icon: <FaClipboardList />, path: 'tasks' },
//       { name: 'Giao nhiệm vụ', icon: <FaClipboardList />, path: 'otherTasks' },
//       { name: 'Sự cố', icon: <FaChartLine />, path: 'incidents' },
//       { name: 'Logout', icon: <FaUser />, path: '/' },
//     ],
//     staff: [
//       { name: 'Tài khoản', icon: <FaUser />, path: 'account' },
//       { name: 'Nhiệm vụ', icon: <FaClipboardList />, path: 'tasks' },
//       { name: 'Báo cáo sự cố', icon: <FaChartLine />, path: 'incidents' },
//     ],
//     staffACCT: [
//       { name: 'Tài khoản', icon: <FaUser />, path: 'account' },
//       { name: 'Nhiệm vụ', icon: <FaClipboardList />, path: 'tasks' },
//       { name: 'Báo cáo sự cố', icon: <FaChartLine />, path: 'incidents' },
//       { name: 'Xác nhận thanh toán', icon: <FaReceipt />, path: 'payment' },
//     ],
//     staffRECEP: [
//       { name: 'Tài khoản', icon: <FaUser />, path: 'account' },
//       { name: 'Tài khoản Hộ cư dân', icon: <FaUserFriends />, path: 'otherAccount' },
//       { name: 'Nhiệm vụ', icon: <FaClipboardList />, path: 'tasks' },
//       { name: 'Báo cáo sự cố', icon: <FaChartLine />, path: 'incidents' },
//       { name: 'Dịch vụ', icon: <FaReceipt />, path: 'services' },
//     ],
//     household: [
//       { name: 'Tài khoản', icon: <FaUser />, path: 'account' },
//       { name: 'Thông báo', icon: <FaBell />, path: 'notifications' },
//       { 
//         name: 'Dịch vụ', 
//         icon: <FaConciergeBell />, 
//         path: 'services',
//         subItems: [
//           { name: 'Đăng ký dịch vụ', path: 'registerService' },
//           { name: 'Dịch vụ đã đăng ký', path: 'myService' },
//         ],
//       },
//     ],
//   };

//   const items = menuItems[role] || [];

//   // If no logo is available, use a placeholder or text
//   const logoSrc = logo || "https://via.placeholder.com/50x30?text=SGHOME";

//   return (
//     <div className="menu-bar">
//       <div className="logo">
//         <img src={logoSrc} alt="SGHOME Logo" />
//       </div>
      
//       <div className="menu-items">
//         {items.map((item, index) => {
//           const isActive = location.pathname.endsWith(item.path);
          
//           return (
//             <Link 
//               to={item.path} 
//               key={index} 
//               className={`menu-item ${isActive ? 'active' : ''}`}
//             >
//               <div className="menu-icon">{item.icon}</div>
//               <div className="menu-label">{item.name}</div>
//             </Link>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default MenuBar;


import React, { useState } from 'react';
import './MenuBar.css';
import { Link, useLocation, useNavigate  } from 'react-router-dom';

import { 
  FaUser, 
  FaClipboardList, 
  FaChartLine, 
  FaBell, 
  FaConciergeBell, 
  FaUserFriends, 
  FaTachometerAlt, 
  FaReceipt,
  FaSignOutAlt 
} from 'react-icons/fa';

import logo from '../../assets/white_logo.png'; 
const MenuBar = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    localStorage.removeItem('user');
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const menuItems = {
    admin: [
      { name: 'Tài khoản', icon: <FaUser />, path: 'account' },
      { name: 'Tài khoản khác', icon: <FaUserFriends />, path: 'otherAccount' },
      { name: 'Xem nhiệm vụ', icon: <FaClipboardList />, path: 'tasks' },
      { name: 'Dashboard', icon: <FaTachometerAlt />, path: 'dashboard' },
      { name: 'Đăng xuất', icon: <FaSignOutAlt  />, isLogout: true },
    ],
    manager: [
      { name: 'Tài khoản', icon: <FaUser />, path: 'account' },
      { name: 'Tài khoản nhân viên', icon: <FaUserFriends />, path: 'otherAccount' },
      { name: 'Nhiệm vụ', icon: <FaClipboardList />, path: 'tasks' },
      { name: 'Giao nhiệm vụ', icon: <FaClipboardList />, path: 'otherTasks' },
      { name: 'Sự cố', icon: <FaChartLine />, path: 'incidents' },
      { name: 'Đăng xuất', icon: <FaSignOutAlt  />, isLogout: true },
    ],
    staff: [
      { name: 'Tài khoản', icon: <FaUser />, path: 'account' },
      { name: 'Nhiệm vụ', icon: <FaClipboardList />, path: 'tasks' },
      { name: 'Báo cáo sự cố', icon: <FaChartLine />, path: 'incidents' },
      { name: 'Đăng xuất', icon: <FaSignOutAlt  />, isLogout: true },
    ],
    staffACCT: [
      { name: 'Tài khoản', icon: <FaUser />, path: 'account' },
      { name: 'Nhiệm vụ', icon: <FaClipboardList />, path: 'tasks' },
      { name: 'Báo cáo sự cố', icon: <FaChartLine />, path: 'incidents' },
      { name: 'Xác nhận thanh toán', icon: <FaReceipt />, path: 'payment' },
      { name: 'Đăng xuất', icon: <FaSignOutAlt  />, isLogout: true },
    ],
    staffRECEP: [
      { name: 'Tài khoản', icon: <FaUser />, path: 'account' },
      { name: 'Tài khoản Hộ cư dân', icon: <FaUserFriends />, path: 'otherAccount' },
      { name: 'Nhiệm vụ', icon: <FaClipboardList />, path: 'tasks' },
      { name: 'Báo cáo sự cố', icon: <FaChartLine />, path: 'incidents' },
      { name: 'Dịch vụ', icon: <FaReceipt />, path: 'services' },
      { name: 'Đăng xuất', icon: <FaSignOutAlt  />, isLogout: true },
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
          { name: 'Dịch vụ đã đăng ký', path: 'myService' },
        ],
      },
      { name: 'Đăng xuất', icon: <FaSignOutAlt  />, isLogout: true },
    ],
  };

  const items = menuItems[role] || [];
  const logoSrc = logo || "https://via.placeholder.com/50x30?text=SGHOME";

  return (
    <div className="menu-bar">
      <div className="logo">
        <img src={logoSrc} alt="SGHOME Logo" />
      </div>
      
      <div className="menu-items">
        {items.map((item, index) => {
          const isActive = location.pathname.endsWith(item.path);
          
          if (item.isLogout) {
            return (
              <div 
                key={index} 
                className="menu-item logout-item" 
                onClick={handleLogoutClick}
              >
                <div className="menu-icon">{item.icon}</div>
                <div className="menu-label">{item.name}</div>
              </div>
            );
          }

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

      {showLogoutConfirm && (
        <div className="logout-confirm-popup">
          <div className="popup-content-out">
            <p>Bạn có chắc chắn muốn đăng xuất?</p>
            <button onClick={confirmLogout}>Đồng ý</button>
            <button onClick={cancelLogout}>Hủy</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default MenuBar;


