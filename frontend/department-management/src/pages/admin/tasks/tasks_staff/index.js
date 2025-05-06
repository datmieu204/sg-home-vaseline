import React, { useEffect, useState } from 'react';
import TaskList from '../../../../components/TaskList';
import TaskDetail from '../../../../components/TaskDetail';
import './StaffTasks.css';

const StaffTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      alert('Không có thông tin người dùng trong localStorage.');
      setLoading(false);
      return;
    }

    const user = JSON.parse(userData);
    const employeeId = user?.user_id;

    fetch(`http://127.0.0.1:8000/admin/tasks/staffs?employee_id=${employeeId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải danh sách công việc');
        return res.json();
      })
      .then((data) => {
        setTasks(data.tasks);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi tải dữ liệu:', err);
        alert('Không thể tải danh sách công việc');
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
    if (selectedTaskId) {
      setDetailLoading(true);
      fetch(`http://127.0.0.1:8000/admin/tasks/staffs/${selectedTaskId}`)
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
          alert('Không thể tải chi tiết công việc');
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

  if (loading) return <p className="loading">Đang tải danh sách công việc...</p>;

  return (
    <div className="staff-tasks-container">
      {selectedTaskId ? (
        detailLoading ? (
          <p className="loading">Đang tải chi tiết công việc...</p>
        ) : (
          <TaskDetail task={selectedTask} onBack={handleBackToList} />
        )
      ) : (
        <>
          <h2 className="task-title">Danh sách công việc của Nhân viên</h2>

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

export default StaffTasks;
