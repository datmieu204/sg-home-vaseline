import React, { useEffect, useState } from 'react';
import ListContainer from '../../../components/ListContainer/ListContainer';
import TaskDetail from '../../../components/TaskDetail';

const ManagerOtherTasks = () => {
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    name_task: '',
    assignee_id: '',
    deadline: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [staffs, setStaffs] = useState([]);

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

    fetch(`http://127.0.0.1:8000/manager/tasks_staffs?employee_id=${employeeId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải danh sách công việc');
        return res.json();
      })
      .then((data) => {
        const sortedTasks = sortTasksByDate(data || []);
        setTasks(sortedTasks);
        setFilteredTasks(sortedTasks);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi tải dữ liệu:', err);
        setLoading(false);
      });
  }, []);

  // Load staffs for assignee selection
  useEffect(() => {
    const managerId = getEmployeeId();
    if (!managerId) {
      return;
    }

    fetch(`http://127.0.0.1:8000/manager/accounts/staffs?employee_id=${managerId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải danh sách nhân viên');
        return res.json();
      })
      .then((data) => {
        setStaffs(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Lỗi khi tải danh sách nhân viên:', err);
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
      fetch(`http://127.0.0.1:8000/manager/tasks_staffs/${selectedTaskId}?employee_id=${employeeId}`)
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

  // Add new task functionality
  const handleSubmitNewTask = () => {
    const employeeId = getEmployeeId();
    if (!employeeId) return alert('Không tìm thấy người dùng');
  
    const { name_task, assignee_id, deadline, description } = newTask;
    if (!name_task || !assignee_id || !deadline || !description) {
      return alert('Vui lòng điền đầy đủ thông tin');
    }
  
    setSubmitting(true);
  
    fetch(`http://127.0.0.1:8000/manager/tasks_staffs?employee_id=${employeeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name_task,
        assignee_id,
        deadline,
        description
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
          deadline: '',
          description: ''
        });
        
        // Reload tasks after adding a new one
        const reloadUser = getEmployeeId();
        fetch(`http://127.0.0.1:8000/manager/tasks_staffs?employee_id=${reloadUser}`)
          .then(res => res.json())
          .then(data => {
            const sortedTasks = sortTasksByDate(data || []);
            setTasks(sortedTasks);
            setFilteredTasks(sortedTasks);
          });
      })
      .catch(err => alert(err.message))
      .finally(() => setSubmitting(false));
  };

  // Filter configuration
  const filterConfig = {
    initialFilters: filters,
    showStatusFilter: true,
    showMonthFilter: true,
    showYearFilter: true
  };

  if (loading) return <p className="loading">Đang tải danh sách công việc...</p>;

  return (
    <div className="manager-other-tasks-container">
      {selectedTaskId ? (
        detailLoading ? (
          <p className="loading">Đang tải chi tiết công việc...</p>
        ) : (
          <TaskDetail task={selectedTask} onBack={handleBackToList} />
        )
      ) : (
        <>
          <ListContainer 
            title="Danh sách nhiệm vụ giao cho nhân viên" 
            items={formatTasksForListItems()} 
            rawTasks={tasks} // Pass the original tasks for filter generation
            searchPlaceholder="Tìm kiếm công việc..." 
            filterConfig={filterConfig}
            onSearch={handleSearch}
            onFilter={handleFilter}
            onItemClick={handleItemClick}
          />
          
          <div className="add-task-button-wrapper">
            <button className="add-task-button" onClick={() => setShowAddModal(true)}>
              + Thêm nhiệm vụ
            </button>
          </div>

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
                  <option value="">Chọn nhân viên</option>
                  {staffs.map((staff) => (
                    <option key={staff.employee_id} value={staff.employee_id}>
                      {staff.employee_name} ({staff.employee_id})
                    </option>
                  ))}
                </select>
                
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
                  <button onClick={handleSubmitNewTask} disabled={submitting} style={{ backgroundColor:'#f89236', color:'white', fontSize:'16px'}}>
                    {submitting ? 'Đang gửi...' : 'Gửi'}
                  </button>
                  <button onClick={() => setShowAddModal(false) } style={{ backgroundColor:'white', color:'black', fontSize:'16px'}}>Hủy</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManagerOtherTasks;