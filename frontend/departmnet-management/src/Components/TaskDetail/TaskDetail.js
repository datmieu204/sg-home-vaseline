import React from 'react';
import './TaskDetail.css';

const TaskDetail = ({ task }) => {
  // Dữ liệu mẫu cho chi tiết nhiệm vụ, trong thực tế có thể lấy từ API hoặc props
  const taskDetails = {
    period: task?.period || 'Tuần 28/04/2025 - 04/05/2025',
    startTime: '28/04/2025 lúc 00:00',
    endTime: '04/05/2025 lúc 23:59',
    content: [
      'Tuần tra khu vực được phân công',
      'Kiểm tra an ninh cửa ra vào',
      'Giám sát camera',
      'Ghi chép sự cố',
      'Hỗ trợ khách khi cần',
      'Báo cáo tình hình an ninh hàng ngày',
    ],
    assignees: ['Nguyễn Tuấn Hưng', 'Nguyễn Tuấn Hưng', 'Nguyễn Tuấn Hưng'],
    note: 'Đảm bảo thực hiện nghiệm túc, đúng quy trình.',
    status: 'Chưa hoàn thành',
  };

  return (
    <div className="task-detail">
      <h2>Nhiệm vụ {taskDetails.period}</h2>
      <p className="task-time">Hết hạn {taskDetails.endTime}</p>
      <p className="task-time">Mở vào {taskDetails.startTime} - {taskDetails.endTime}</p>

      <div className="task-pane">
        <div className="task-group">
            <div className="task-content">
            <h3>Nội dung nhiệm vụ</h3>
            <div className="task-content-box">
                <p>
                Nhiệm vụ của nhân viên bảo vệ trong tuần bao gồm:
                <ul>
                    <li>Tuần tra khu vực được phân công</li>
                    <li>Kiểm tra an ninh cửa ra vào</li>
                    <li>Giám sát camera</li>
                    <li>Ghi chép sự cố</li>
                    <li>Hỗ trợ khách khi cần</li>
                    <li>Báo cáo tình hình an ninh hàng ngày</li>
                </ul>
                Đảm bảo thực hiện nghiệm túc, đúng quy trình.
                </p>
            </div>
            <div className="task-checkbox">
              <input type="checkbox" id="complete-task" />
              <label htmlFor="complete-task"> Đánh dấu hoàn thành</label>
            </div>
            </div>
            <div className="task-right-pane">
            <div className="task-assignees">
                <h3>Người nhận</h3>
                <div className="assignees-list">
                <p className="assignee">Nguyễn Tuấn Hưng</p>
                <p className="assignee">Nguyễn Tuấn Hưng</p>
                <p className="assignee">Nguyễn Tuấn Hưng</p>
                </div>
            </div>
            <div className="task-status">
                <h3>Trạng thái</h3>
                <p className="status">Chưa hoàn thành</p>
            </div>
            </div>
        </div>
        </div>
    </div>
  );
};

export default TaskDetail;