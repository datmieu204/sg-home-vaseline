import React, { useState, useEffect } from 'react';
import './TaskList.css';
import ListContainer from '../ListContainer/ListContainer';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch tasks from an API
    const mockTasks = [
      {
        title: 'Nhiệm vụ tuần 28/04/2025 - 04/05/2025',
        statusText: 'Đang mở',
        statusType: 'open',
        deadline: '04/05/2025 lúc 23:59',
        deadlineLabel: 'Hết hạn'
      },
      {
        title: 'Nhiệm vụ tuần 21/04/2025 - 27/04/2025',
        statusText: 'Đã đóng',
        statusType: 'closed',
        deadline: '27/04/2025 lúc 23:59',
        deadlineLabel: 'Hết hạn'
      },
      {
        title: 'Nhiệm vụ tuần 14/04/2025 - 20/04/2025',
        statusText: 'Đã đóng',
        statusType: 'closed',
        deadline: '20/04/2025 lúc 23:59',
        deadlineLabel: 'Hết hạn'
      }
    ];
    
    setTasks(mockTasks);
    setFilteredTasks(mockTasks);
    setLoading(false);
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  const handleFilter = (filterType) => {
    if (filterType === 'all') {
      setFilteredTasks(tasks);
    } else if (filterType === 'open') {
      setFilteredTasks(tasks.filter(task => task.statusType === 'open'));
    } else if (filterType === 'closed') {
      setFilteredTasks(tasks.filter(task => task.statusType === 'closed'));
    }
  };

  const filterOptions = [
    { label: 'Xem theo Năm', value: 'year' },
    { label: 'Xem Đang mở', value: 'open' }
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="task-page">
      <ListContainer
        title="Tất cả Nhiệm vụ"
        items={filteredTasks}
        searchPlaceholder="Tìm kiếm theo tên nhiệm vụ..."
        filterOptions={filterOptions}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />
    </div>
  );
};

export default TaskList;