import React from 'react';
import './TaskList.css';

const TaskList = ({ tasks, onTaskClick }) => {
  if (tasks.length === 0) {
    return <p className="no-tasks">Không có công việc nào.</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <div
          key={task.task_id || index}
          className={`task-card ${task.status}`}
          onClick={() => onTaskClick(task.task_id)}
          style={{ cursor: 'pointer' }}
        >
          <h3>{task.name_task}</h3>
          <p><strong>Hạn:</strong> {new Date(task.deadline).toLocaleString()}</p>
          <p><strong>Người thực hiện:</strong> {task.assignee_id}</p>
          <p><strong>Trạng thái:</strong> {task.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}</p>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
