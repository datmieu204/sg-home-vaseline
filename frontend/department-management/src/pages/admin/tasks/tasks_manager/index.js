import React, { useEffect, useState } from 'react';
import TaskList from '../../../../components/TaskList';
import TaskDetail from '../../../../components/TaskDetail';
import './ManagerTasks.css';

const ManagerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    name_task: '',
    assignee_id: '',
    assigned_time: '',
    deadline: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [accounts, setAccounts] = useState([]);


  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      alert('Không có thông tin người dùng trong localStorage.');
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
    fetch('http://127.0.0.1:8000/admin/accounts/managers')
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải dữ liệu');
        return res.json();
      })
      .then((data) => {
        setAccounts(data.accounts); // vẫn giữ nguyên vì response có field 'accounts'
      })
      .catch((err) => {
        console.error('Lỗi khi tải tài khoản:', err);
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
          alert('Không thể tải chi tiết công việc');
          setDetailLoading(false);
        });
    }
  }, [selectedTaskId]);
  

  const handleSelectTask = (taskId) => {
    setSelectedTaskId(taskId);
  };


  const handleSubmitNewTask = () => {
    const userData = localStorage.getItem('user');
    if (!userData) return alert('Không tìm thấy người dùng');
  
    const user = JSON.parse(userData);
    const adminId = user?.user_id;
  
    const { name_task, assignee_id, assigned_time, deadline, description } = newTask;
    if (!name_task || !assignee_id || !assigned_time || !deadline || !description) {
      return alert('Vui lòng điền đầy đủ thông tin');
    }
  
    setSubmitting(true);
  
    fetch(`http://127.0.0.1:8000/admin/tasks/managers?employee_id=${adminId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        task_data: {
          name_task,
          assignee_id,
          assigned_time,
          deadline,
          description
        },
        admin_id_request: {
          employee_id: adminId
        }
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Thêm nhiệm vụ thất bại');
        return res.json();
      })
      .then(() => {
        setShowAddModal(false);
        setNewTask({
          name_task: '',
          assignee_id: '',
          assigned_time: '',
          deadline: '',
          description: ''
        });
        // Tải lại danh sách
        const reloadUser = JSON.parse(localStorage.getItem('user'));
        fetch(`http://127.0.0.1:8000/admin/tasks/managers?employee_id=${reloadUser.user_id}`)
          .then(res => res.json())
          .then(data => setTasks(data.tasks));
      })
      .catch(err => alert(err.message))
      .finally(() => setSubmitting(false));
  };
  

  const handleBackToList = () => {
    setSelectedTaskId(null);
    setSelectedTask(null);
  };

  if (loading) return <p className="loading">Đang tải danh sách công việc...</p>;

  return (
    <div className="manager-tasks-container">
      {selectedTaskId ? (
        detailLoading ? (
          <p className="loading">Đang tải chi tiết công việc...</p>
        ) : (
          <TaskDetail task={selectedTask} onBack={handleBackToList} />
        )
      ) : (
        <>
          <h2 className="task-title">Danh sách công việc của Quản lý</h2>

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

          <div className="add-task-button-wrapper">
            <button className="add-task-button" onClick={() => setShowAddModal(true)}>
              + Thêm nhiệm vụ
            </button>
          </div>



          <TaskList tasks={filteredTasks} onTaskClick={handleSelectTask} />


          {showAddModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Thêm nhiệm vụ mới</h3>
              <input
                type="text"
                placeholder="Tên nhiệm vụ"
                value={newTask.name_task}
                onChange={(e) => setNewTask({ ...newTask, name_task: e.target.value })}
              />
              <select
                value={newTask.assignee_id}
                onChange={(e) => setNewTask({ ...newTask, assignee_id: e.target.value })}
              >
                <option value="">Chọn người được giao</option>
                {accounts.map((account) => (
                  <option key={account.employee_id} value={account.employee_id}>
                    {account.employee_name} ({account.employee_id})
                  </option>
                ))}
              </select>


              <input
                type="datetime-local"
                placeholder="Thời gian giao"
                value={newTask.assigned_time}
                onChange={(e) => setNewTask({ ...newTask, assigned_time: e.target.value })}
              />
              <input
                type="datetime-local"
                placeholder="Deadline"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
              />
              <textarea
                placeholder="Mô tả nhiệm vụ"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              <div className="modal-actions">
                <button onClick={handleSubmitNewTask} disabled={submitting}>
                  {submitting ? 'Đang gửi...' : 'Gửi'}
                </button>
                <button onClick={() => setShowAddModal(false)}>Hủy</button>
              </div>
            </div>
          </div>
        )}

        </>
      )}
    </div>
  );
};

export default ManagerTasks;
