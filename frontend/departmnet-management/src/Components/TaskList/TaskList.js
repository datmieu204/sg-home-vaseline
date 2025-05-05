import React from 'react';
import './TaskList.css';

const TaskList = () => {
  const tasks = [
    { period: 'Tuần 28/04/2025 - 04/05/2025', status: 'Đang mở', deadline: '04/05/2025 lúc 23:59' },
    { period: 'Tuần 21/04/2025 - 27/04/2025', status: 'Đã đóng', deadline: '27/04/2025 lúc 23:59' },
    { period: 'Tuần 14/04/2025 - 20/04/2025', status: 'Đã đóng', deadline: '20/04/2025 lúc 23:59' },
    { period: 'Tuần 07/04/2025 - 13/04/2025', status: 'Đã đóng', deadline: '13/04/2025 lúc 23:59' },
    { period: 'Tuần 31/03/2025 - 06/04/2025', status: 'Đã đóng', deadline: '06/04/2025 lúc 23:59' },
  ];

  return (
    <div className="task-list">
      <h2>Tất cả Nhiệm vụ</h2>
      {tasks.map((task, index) => (
        <div key={index} className="task-item">
          <p className="task-period">Nhiệm vụ tuần {task.period}</p>
          <p className="task-status">{task.status} | Hết hạn {task.deadline}</p>
        </div>
      ))}
    </div>
  );
};

export default TaskList;