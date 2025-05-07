import React, { useEffect, useState } from 'react';
import TaskList from '../../../components/TaskList';
import TaskDetail from '../../../components/TaskDetail';
import './ManagerOtherTasks1.css';

const ManagerOtherTasks1 = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    task_name: '',
    assignee_id: '',
    deadline: '',
    description: ''
  });
  const [staffs, setStaffs] = useState([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(''); // Thêm state thông báo thành công

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

  const fetchTasks = () => {
    const employeeId = getEmployeeId();
    if (!employeeId) {
      alert('Không tìm thấy thông tin người dùng.');
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/manager/tasks_staffs?employee_id=${employeeId}`)
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
  };

  const fetchStaffs = () => {
    const managerId = getEmployeeId();
    if (!managerId) {
      alert('Không tìm thấy thông tin người dùng.');
      setStaffLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/manager/accounts/staffs?employee_id=${managerId}`)
      .then(res => res.json())
      .then(data => {
        setStaffs(Array.isArray(data) ? data : []);
        setStaffLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải danh sách nhân viên:', err);
        setStaffLoading(false);
      });
  };

  useEffect(() => {
    fetchTasks();
    fetchStaffs();
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
      fetch(`http://127.0.0.1:8000/manager/tasks_staffs/${selectedTaskId}?employee_id=${employeeId}`)
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

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const employeeId = getEmployeeId();
    if (!employeeId) return;

    // Kiểm tra xem assignee_id có hợp lệ không
    const validAssignee = staffs.find(staff => staff.employee_id === formData.assignee_id);
    if (!validAssignee) {
      alert("Nhân viên được chỉ định không hợp lệ.");
      return;
    }

    // Gửi dữ liệu đến server
    fetch(`http://127.0.0.1:8000/manager/tasks_staffs?employee_id=${employeeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task_name: formData.task_name,
        assignee_id: formData.assignee_id,
        deadline: formData.deadline,
        description: formData.description
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Không thể tạo nhiệm vụ mới');
        return res.json();
      })
      .then(() => {
        setShowForm(false);
        setFormData({ task_name: '', assignee_id: '', deadline: '', description: '' });
        fetchTasks(); // Cập nhật lại danh sách nhiệm vụ sau khi thêm
        setSuccessMessage('Nhiệm vụ đã được thêm thành công!'); // Thêm thông báo thành công
        setTimeout(() => setSuccessMessage(''), 3000); // Ẩn thông báo sau 3 giây
      })
      .catch(err => {
        console.error('Lỗi khi tạo nhiệm vụ:', err);
        alert('Không thể tạo nhiệm vụ');
      });
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
          <h2 className="task-title">Danh sách nhiệm vụ giao cho nhân viên</h2>

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

            <button onClick={() => setShowForm(true)}>+ Thêm nhiệm vụ</button>
          </div>

          <TaskList tasks={filteredTasks} onTaskClick={handleSelectTask} />

          {showForm && (
            <div className="popup-form">
              <div className="popup-content">
                <h3>Thêm nhiệm vụ mới</h3>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="task_name"
                    placeholder="Tên nhiệm vụ"
                    value={formData.task_name}
                    onChange={handleChange}
                    required
                  />

                  <select
                    name="assignee_id"
                    value={formData.assignee_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn nhân viên --</option>
                    {staffs.map((staff) => (
                      <option key={staff.employee_id} value={staff.employee_id}>
                        {staff.employee_name} ({staff.username})
                      </option>
                    ))}
                  </select>

                  <input
                    type="datetime-local"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                  />

                  <textarea
                    name="description"
                    placeholder="Mô tả"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <div className="form-buttons">
                    <button type="submit">Lưu</button>
                    <button type="button" onClick={() => setShowForm(false)}>Hủy</button>
                  </div>
                </form>

                {/* Hiển thị thông báo thành công trong popup */}
                {successMessage && (
                  <div className="success-message">{successMessage}</div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManagerOtherTasks1;
