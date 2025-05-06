import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './OtherTaskList.css';
import ListContainer from '../ListContainer/ListContainer';

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="red"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="trash-icon"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const OtherTaskList = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Nhiệm vụ tuần 28/04/2025 - 04/05/2025',
      statusText: 'Đang mở',
      statusType: 'open',
      deadline: '04/05/2025 lúc 23:59',
      deadlineLabel: 'Hết hạn',
    },
    {
      id: 2,
      title: 'Nhiệm vụ tuần 21/04/2025 - 27/04/2025',
      statusText: 'Đã đóng',
      statusType: 'closed',
      deadline: '27/04/2025 lúc 23:59',
      deadlineLabel: 'Hết hạn',
    },
    {
      id: 3,
      title: 'Nhiệm vụ tuần 14/04/2025 - 20/04/2025',
      statusText: 'Đã đóng',
      statusType: 'closed',
      deadline: '20/04/2025 lúc 23:59',
      deadlineLabel: 'Hết hạn',
    },
  ]);

  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [isCollapsed, setIsCollapsed] = useState(false); // Toggle state
  const navigate = useNavigate(); // Hook for navigation

  const handleSearch = (searchTerm) => {
    const filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  const handleFilter = (filterType) => {
    if (filterType === 'all') {
      setFilteredTasks(tasks);
    } else if (filterType === 'open') {
      setFilteredTasks(tasks.filter((task) => task.statusType === 'open'));
    } else if (filterType === 'closed') {
      setFilteredTasks(tasks.filter((task) => task.statusType === 'closed'));
    }
  };

  const handleAddTask = () => {
    navigate('/add-task'); // Điều hướng đến trang thêm nhiệm vụ
  };

  const handleDeleteTask = (id) => {
    // Xóa nhiệm vụ khỏi danh sách
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks); // Cập nhật danh sách đã lọc
  };

  const filterOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Đang mở', value: 'open' },
    { label: 'Đã đóng', value: 'closed' },
  ];

  return (
    <div className="other-task-page">
      <div
        className="task-list-header"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className={`toggle-icon ${isCollapsed ? 'collapsed' : ''}`}>▼</span>
        <h2>Tất cả Nhiệm vụ</h2>
      </div>

      {/* Nút Thêm nhiệm vụ mới */}
      <div className="add-task-container">
        <button className="add-task-button" onClick={handleAddTask}>
          Thêm nhiệm vụ mới
        </button>
      </div>

      {/* Nội dung danh sách nhiệm vụ */}
      {!isCollapsed && (
        <ListContainer
          title="Danh sách nhiệm vụ khác"
          items={filteredTasks.map((task) => ({
            ...task,
            title: (
              <div className="task-item">
                <Link to={`/other-task/${task.id}`} className="task-link">
                  {task.title}
                </Link>
                <button
                  className="delete-task-button"
                  onClick={() => handleDeleteTask(task.id)}
                  title="Xóa nhiệm vụ"
                >
                  <TrashIcon />
                </button>
              </div>
            ),
          }))}
          searchPlaceholder="Tìm kiếm theo tên nhiệm vụ..."
          filterOptions={filterOptions}
          onSearch={handleSearch}
          onFilter={handleFilter} // Truyền handleFilter xuống ListContainer
        />
      )}
    </div>
  );
};

export default OtherTaskList;