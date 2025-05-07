import React, { useEffect, useState } from 'react';
import TaskList from '../../../components/TaskList';
import TaskDetail from '../../../components/TaskDetail';
// import './ManagerTasks.css';

const ManagerTasks1 = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

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

  useEffect(() => {
    const employeeId = getEmployeeId();
    if (!employeeId) {
      alert('Không tìm thấy thông tin người dùng.');
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/manager/tasks?employee_id=${employeeId}`)
      .then(res => {
        if (!res.ok) throw new Error('Không thể tải danh sách nhiệm vụ');
        return res.json();
      })
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải danh sách nhiệm vụ:', err);
        alert('Không thể tải danh sách nhiệm vụ');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = [...tasks];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (monthFilter) {
      filtered = filtered.filter(task => new Date(task.deadline).getMonth() + 1 === parseInt(monthFilter));
    }

    if (yearFilter) {
      filtered = filtered.filter(task => new Date(task.deadline).getFullYear() === parseInt(yearFilter));
    }

    setFilteredTasks(filtered);
  }, [tasks, statusFilter, monthFilter, yearFilter]);

  useEffect(() => {
    const employeeId = getEmployeeId();
    if (selectedTaskId && employeeId) {
      setDetailLoading(true);
      fetch(`http://127.0.0.1:8000/manager/tasks/${selectedTaskId}?employee_id=${employeeId}`)
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
          alert('Không thể tải chi tiết nhiệm vụ');
          setDetailLoading(false);
        });
    }
  }, [selectedTaskId]);

  const handleSelectTask = (taskId) => {
    setSelectedTaskId(taskId);
  };

  const handleBackToList = () => {
    setSelectedTaskId(null);
    setSelectedTask(null);
  };

  if (loading) return <p className="loading">Đang tải danh sách nhiệm vụ...</p>;

  return (
    <div className="manager-tasks-container">
      {selectedTaskId ? (
        detailLoading ? (
          <p className="loading">Đang tải chi tiết nhiệm vụ...</p>
        ) : (
          <TaskDetail task={selectedTask} onBack={handleBackToList} />
        )
      ) : (
        <>
          <h2 className="task-title">Danh sách nhiệm vụ được giao</h2>

          <div className="filters">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Tất cả trạng thái</option>
              <option value="completed">Hoàn thành</option>
              <option value="in_progress">Đang xử lý</option>
            </select>

            <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
              <option value="">Tất cả tháng</option>
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i + 1}>Tháng {i + 1}</option>
              ))}
            </select>

            <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
              <option value="">Tất cả năm</option>
              {Array.from(new Set(tasks.map(t => new Date(t.deadline).getFullYear()))).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <TaskList tasks={filteredTasks} onTaskClick={handleSelectTask} />
        </>
      )}
    </div>
  );
};

export default ManagerTasks1;
