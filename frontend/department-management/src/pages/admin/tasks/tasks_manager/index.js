import React, { useEffect, useState } from 'react';
import ListContainer from '../../../../components/ListContainer/ListContainer';
import TaskDetail from '../../../../components/TaskDetail';
import './ManagerTasks.css';

const ManagerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    'Trạng thái': 'all',
    'Tháng': '',
    'Năm': ''
  });
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Sorting function - newest to oldest
  const sortTasksByDate = (tasksToSort) => {
    return [...tasksToSort].sort((a, b) => {
      // Convert deadlines to dates for comparison (newer ones first)
      const dateA = a.deadline ? new Date(a.deadline) : new Date(0);
      const dateB = b.deadline ? new Date(b.deadline) : new Date(0);
      return dateB - dateA; // Newest first
    });
  };

  // Load tasks
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      setLoading(false);
      return;
    }

    const user = JSON.parse(userData);
    const employeeId = user?.user_id;

    fetch(`http://127.0.0.1:8000/admin/tasks/managers?employee_id=${employeeId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải danh sách công việc');
        return res.json();
      })
      .then((data) => {
        const sortedTasks = sortTasksByDate(data.tasks || []);
        setTasks(sortedTasks);
        setFilteredTasks(sortedTasks);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi tải dữ liệu:', err);
        setLoading(false);
      });
  }, []);

  // Apply filters
  const handleFilter = (filterType, value) => {
    // Update filter state
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  // Apply filters when filter state changes
  useEffect(() => {
    let filtered = [...tasks];

    // Apply status filter
    if (filters['Trạng thái'] && filters['Trạng thái'] !== 'all') {
      filtered = filtered.filter(task => task.status === filters['Trạng thái']);
    }

    // Apply month filter
    if (filters['Tháng']) {
      filtered = filtered.filter(task => 
        task.deadline && new Date(task.deadline).getMonth() + 1 === parseInt(filters['Tháng'])
      );
    }

    // Apply year filter
    if (filters['Năm']) {
      filtered = filtered.filter(task => 
        task.deadline && new Date(task.deadline).getFullYear() === parseInt(filters['Năm'])
      );
    }

    // Always maintain newest-to-oldest sorting
    setFilteredTasks(sortTasksByDate(filtered));
  }, [tasks, filters]);

  // Search functionality
  const handleSearch = (searchTerm) => {
    const term = searchTerm.toLowerCase();
    const filtered = tasks.filter(task => 
      task.name_task.toLowerCase().includes(term) ||
      (task.description && task.description.toLowerCase().includes(term))
    );
    setFilteredTasks(sortTasksByDate(filtered));
  };

  // Format tasks for ListItem component
  const formatTasksForListItems = () => {
    return filteredTasks.map(task => ({
      id: task.task_id,
      title: task.name_task,
      statusText: task.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý',
      statusType: task.status === 'completed' ? 'closed' : 'open',
      deadline: task.deadline ? new Date(task.deadline).toLocaleDateString('vi-VN') : 'Không có hạn',
      deadlineLabel: 'Hạn chót:'
    }));
  };

  const handleItemClick = (id) => {
    setSelectedTaskId(id);
  };

  const handleBackToList = () => {
    setSelectedTaskId(null);
    setSelectedTask(null);
  };

  // Load task details when a task is selected
  useEffect(() => {
    if (selectedTaskId) {
      setDetailLoading(true);
      fetch(`http://127.0.0.1:8000/admin/tasks/managers/${selectedTaskId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Không thể tải chi tiết công việc');
          return res.json();
        })
        .then((data) => {
          setSelectedTask(data);
          setDetailLoading(false);
        })
        .catch((err) => {
          console.error('Lỗi khi tải chi tiết:', err);
          setDetailLoading(false);
        });
    }
  }, [selectedTaskId]);

  // Filter configuration
  const filterConfig = {
    initialFilters: filters,
    showStatusFilter: true,
    showMonthFilter: true,
    showYearFilter: true
  };

  if (loading) return <p className="loading">Đang tải danh sách công việc...</p>;

  return (
    <div className="emp-tasks-container">
      {selectedTaskId ? (
        detailLoading ? (
          <p className="loading">Đang tải chi tiết công việc...</p>
        ) : (
          <TaskDetail task={selectedTask} onBack={handleBackToList} />
        )
      ) : (
        <ListContainer 
          title="Danh sách công việc của Quản lý" 
          items={formatTasksForListItems()} 
          rawTasks={tasks} // Pass the original tasks for filter generation
          searchPlaceholder="Tìm kiếm công việc..." 
          filterConfig={filterConfig}
          onSearch={handleSearch}
          onFilter={handleFilter}
          onItemClick={handleItemClick}
        />
      )}
    </div>
  );
};

export default ManagerTasks;