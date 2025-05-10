import React, { useEffect, useState } from 'react';
import ListContainer from '../../../components/ListContainer/ListContainer';
import TaskDetail from '../../../components/TaskDetail';

const StaffTasks = () => {
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

  const getEmployeeId = () => {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    try {
      const user = JSON.parse(userData);
      return user?.user_id || null;
    } catch {
      return null;
    }
  };

  // Load tasks
  useEffect(() => {
    const employeeId = getEmployeeId();
    if (!employeeId) {
      alert('Không tìm thấy thông tin người dùng.');
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/staff/tasks?employee_id=${employeeId}`)
      .then(res => {
        if (!res.ok) throw new Error('Không thể tải danh sách nhiệm vụ');
        return res.json();
      })
      .then(data => {
        const sortedTasks = sortTasksByDate(data || []);
        setTasks(sortedTasks);
        setFilteredTasks(sortedTasks);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải danh sách nhiệm vụ:', err);
        setTasks([]);
        setFilteredTasks([]);
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
      statusText: task.status === 'completed' ? 'Hoàn thành' : task.status === 'in_progress' ? 'Đang xử lý' : 'Chưa bắt đầu',
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
    const employeeId = getEmployeeId();
    if (selectedTaskId && employeeId) {
      setDetailLoading(true);
      fetch(`http://127.0.0.1:8000/staff/tasks/${selectedTaskId}?employee_id=${employeeId}`)
        .then(res => {
          if (!res.ok) throw new Error('Không thể tải chi tiết nhiệm vụ');
          return res.json();
        })
        .then(data => {
          setSelectedTask(data);
          setDetailLoading(false);
        })
        .catch(err => {
          console.error('Lỗi khi tải chi tiết nhiệm vụ:', err);
          setDetailLoading(false);
        });
    }
  }, [selectedTaskId]);

  const handleUpdateTaskStatus = (taskId, status) => {
    const employeeId = getEmployeeId();
    if (!employeeId) {
      alert('Không tìm thấy thông tin người dùng.');
      return;
    }

    const requestData = {
      status: status,
    };

    fetch(`http://127.0.0.1:8000/staff/tasks/${taskId}?employee_id=${employeeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then(res => {
        if (!res.ok) throw new Error('Không thể cập nhật trạng thái nhiệm vụ');
        return res.json();
      })
      .then(data => {
        console.log('Cập nhật trạng thái nhiệm vụ thành công:', data);
      })
      .catch(err => {
        console.error('Lỗi khi cập nhật trạng thái nhiệm vụ:', err);
      });
  };

  // Filter configuration
  const filterConfig = {
    initialFilters: filters,
    showStatusFilter: true,
    showMonthFilter: true,
    showYearFilter: true
  };

  if (loading) return <p className="loading">Đang tải danh sách nhiệm vụ...</p>;

  return (
    <div className="staff-tasks-container">
      {selectedTaskId ? (
        detailLoading ? (
          <p className="loading">Đang tải chi tiết nhiệm vụ...</p>
        ) : (
          selectedTask && <TaskDetail task={selectedTask} onBack={handleBackToList} updateTaskStatus={handleUpdateTaskStatus} showStatusUpdateButton={true}/>
        )
      ) : (
        <ListContainer 
          title="Nhiệm vụ của tôi" 
          items={formatTasksForListItems()} 
          rawTasks={tasks}
          searchPlaceholder="Tìm kiếm nhiệm vụ..." 
          filterConfig={filterConfig}
          onSearch={handleSearch}
          onFilter={handleFilter}
          onItemClick={handleItemClick}
        />
      )}
    </div>
  );
};

export default StaffTasks;