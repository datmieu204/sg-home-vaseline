import React from 'react';
import './EmployeeList.css';

const EmployeeList = ({ employees, title, onRowClick }) => {
  return (
    <div className="employee-list">
      {title && <h2>{title}</h2>}
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã tài khoản</th>
            <th>Mã nhân viên</th>
            <th>Tên nhân viên</th>
            <th>Mã phòng ban</th>
            <th>Chức vụ</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, index) => (
            <tr
              key={emp.account_id}
              onClick={() => onRowClick && onRowClick(emp.account_id)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              <td>{index + 1}</td>
              <td>{emp.account_id}</td>
              <td>{emp.employee_id}</td>
              <td>{emp.employee_name}</td>
              <td>{emp.department_id}</td>
              <td>{emp.position}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
