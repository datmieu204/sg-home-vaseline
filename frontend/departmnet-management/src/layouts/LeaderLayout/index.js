import React from 'react';
import './LeaderLayout.css';

const LeaderLayout = ({ children }) => {
  return (
    <div>
      <div className="menu-bar">
        <div className="flex items-center">
          <img src="https://via.placeholder.com/50" alt="Logo" className="mr-2" />
          <a href="/leader/account">Tài khoản</a>
          <a href="/leader/tasks">Nhiệm vụ</a>
          <a href="/leader/reports">Báo cáo</a>
          <a href="/leader/employee-tasks">Nhiệm vụ nhân viên</a>
          <a href="/leader/employee-accounts">Tài khoản nhân viên</a>
        </div>
      </div>
      <div className="flex">
        <div className="w-1/6 bg-orange-500 text-white p-4">
          <ul>
            <li className="mb-2"><a href="/leader/account">Tài khoản</a></li>
            <li className="mb-2"><a href="/leader/tasks">Nhiệm vụ</a></li>
            <li className="mb-2"><a href="/leader/reports">Báo cáo</a></li>
            <li className="mb-2"><a href="/leader/employee-tasks">Nhiệm vụ nhân viên</a></li>
            <li className="mb-2"><a href="/leader/employee-accounts">Tài khoản nhân viên</a></li>
          </ul>
        </div>
        <div className="w-5/6 p-4">{children}</div>
      </div>
    </div>
  );
};

export default LeaderLayout;