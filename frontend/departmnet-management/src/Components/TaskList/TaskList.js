import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TaskList.css';
import ListContainer from '../ListContainer/ListContainer';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false); // State để theo dõi toggle

  useEffect(() => {
    // Mock data for tasks
    const mockTasks = [
      {
        id: 1, // Thêm ID để định danh nhiệm vụ
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
    ];

    setTasks(mockTasks);
    setFilteredTasks(mockTasks);
    setLoading(false);
  }, []);

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

  const filterOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Đang mở', value: 'open' },
    { label: 'Đã đóng', value: 'closed' },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="task-page">
      {/* Header với toggle */}
      <div
        className="task-list-header"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className={`toggle-icon ${isCollapsed ? 'collapsed' : ''}`}>▼</span>
        <h2>Tất cả Nhiệm vụ</h2>
      </div>

      {/* Danh sách nhiệm vụ, ẩn/hiện dựa trên toggle */}
      {!isCollapsed && (
        <ListContainer
          title="Danh sách nhiệm vụ"
          items={filteredTasks.map((task) => ({
            ...task,
            title: (
              <Link to={`/task/${task.id}`} className="task-link">
                {task.title}
              </Link>
            ), // Tiêu đề nhiệm vụ chuyển thành liên kết
          }))}
          searchPlaceholder="Tìm kiếm theo tên nhiệm vụ..."
          filterOptions={filterOptions}
          onSearch={handleSearch}
          onFilter={handleFilter}
        />
      )}
    </div>
  );
};

export default TaskList;