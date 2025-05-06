import React, { useState } from 'react';
import OtherTaskList from '../OtherTaskList/OtherTaskList';
import TaskList from '../TaskList/TaskList';
import './OtherTask.css'; // CSS để quản lý tab và lọc

const OtherTasks = () => {
  const [activeTab, setActiveTab] = useState('department'); // Tab mặc định là "Trưởng Bộ phận"
  const [selectedDepartment, setSelectedDepartment] = useState(''); // Bộ phận được chọn

  // Hàm chuyển đổi tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Hàm thay đổi bộ phận được chọn
  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
  };

  return (
    <>
      {/* Tabs và Filters */}
      <div className="tabs-and-filters">
        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'department' ? 'active' : ''}`}
            onClick={() => handleTabChange('department')}
          >
            Trưởng Bộ phận
          </button>
          <button
            className={`tab-button ${activeTab === 'employee' ? 'active' : ''}`}
            onClick={() => handleTabChange('employee')}
          >
            Nhân viên
          </button>
        </div>

        {/* Filters */}
        <div className="filters">
          {[
            { key: 'reception', label: 'Lễ tân' },
            { key: 'accounting', label: 'Kế toán' },
            { key: 'technical', label: 'Kỹ thuật' },
            { key: 'cleaning', label: 'Vệ sinh' },
            { key: 'security', label: 'Bảo vệ' },
          ].map((filter) => (
            <label key={filter.key} className="filter-item">
              <input
                type="radio"
                name="department"
                checked={selectedDepartment === filter.key}
                onChange={() => handleDepartmentChange(filter.key)}
              />
              {filter.label}
            </label>
          ))}
        </div>

      </div>

      {/* Nội dung hiển thị dựa trên tab được chọn */}
      {activeTab === 'department' && <OtherTaskList />}
      {activeTab === 'employee' && <TaskList />}
    </>
  );
};

export default OtherTasks;