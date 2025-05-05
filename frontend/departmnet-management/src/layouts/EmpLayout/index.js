import React from 'react';
import './EmpLayout.css';

const EmpLayout = ({ children }) => {
  return (
    <div>
      <div className="menu-bar">
        <div className="flex items-center">
          <img src="https://via.placeholder.com/50" alt="Logo" className="mr-2" />
          <a href="/emp/account">Tài khoản</a>
          <a href="/emp/tasks">Nhiệm vụ</a>
          <a href="/emp/reports">Báo cáo</a>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/6 bg-orange-500 text-white p-4">
          <ul>
            <li className="mb-2"><a href="/emp/account">Tài khoản</a></li>
            <li className="mb-2"><a href="/emp/tasks">Nhiệm vụ</a></li>
            <li className="mb-2"><a href="/emp/reports">Báo cáo</a></li>
          </ul>
        </div>
        <div className="w-5/6 p-4">{children}</div>
      </div>
    </div>
  );
};

export default EmpLayout;