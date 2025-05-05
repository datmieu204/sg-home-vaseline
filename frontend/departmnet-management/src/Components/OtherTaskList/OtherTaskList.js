import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../TaskList/TaskList.css'; // Sử dụng cùng file CSS với TaskList

const OtherTaskList = ({ tasks }) => {
  const [isCollapsed, setIsCollapsed] = useState(false); // State để theo dõi trạng thái toggle

  const defaultTasks = [
    { id: 1, period: 'Tuần 28/04/2025 - 04/05/2025', status: 'Đang mở', deadline: '04/05/2025 lúc 23:59' },
    { id: 2, period: 'Tuần 21/04/2025 - 27/04/2025', status: 'Đã đóng', deadline: '27/04/2025 lúc 23:59' },
    { id: 3, period: 'Tuần 14/04/2025 - 20/04/2025', status: 'Đã đóng', deadline: '20/04/2025 lúc 23:59' },
    { id: 4, period: 'Tuần 07/04/2025 - 13/04/2025', status: 'Đã đóng', deadline: '13/04/2025 lúc 23:59' },
    { id: 5, period: 'Tuần 31/03/2025 - 06/04/2025', status: 'Đã đóng', deadline: '06/04/2025 lúc 23:59' },
  ];

  const taskList = tasks || defaultTasks;

  return (
    <div className="task-list">
      <div className="task-list-header" onClick={() => setIsCollapsed(!isCollapsed)}>
        {/* Toggle icon */}
        <span className={`toggle-icon ${isCollapsed ? 'collapsed' : ''}`}>
          ▼
        </span>
        <h2>Tất cả Nhiệm vụ</h2>
      </div>

      {/* Nút Thêm Nhiệm vụ Mới */}
      <div className="add-task-container">
        <button className="add-task-button">
          Thêm nhiệm vụ mới
        </button>
      </div>

      {/* Hiển thị hoặc ẩn danh sách nhiệm vụ dựa trên trạng thái */}
      {!isCollapsed && (
        <div className="task-list-content">
          {taskList.map((task) => (
            <div key={task.id} className="task-item">
              <Link to={`/task/${task.id}`} className="task-period" style={{ cursor: 'pointer', color: '#ff6200' }}>
                Nhiệm vụ {task.period}
              </Link>
              <p className="task-status">{task.status} | Hết hạn {task.deadline}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OtherTaskList;