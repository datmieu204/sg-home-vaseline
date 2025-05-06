// src/components/TaskDetail.jsx
import React from 'react';
import './TaskDetail.css';

const TaskDetail = ({ task, onBack }) => {
  if (!task) return null;

  return (
    <div className="task-detail-container">
      <button className="back-btn" onClick={onBack}>← Quay lại</button>
      <h2 className="task-name">{task.name_task}</h2>

      <div className="task-info">
        <p><strong>Mô tả:</strong> {task.description}</p>
        <p><strong>Người giao:</strong> {task.assigner_id}</p>
        <p><strong>Người nhận:</strong> {task.assignee_id}</p>
        <p><strong>Thời gian giao:</strong> {new Date(task.assigned_time).toLocaleString()}</p>
        <p><strong>Hạn chót:</strong> {new Date(task.deadline).toLocaleString()}</p>
        <p><strong>Trạng thái:</strong> {task.status}</p>
      </div>
    </div>
  );
};

export default TaskDetail;
